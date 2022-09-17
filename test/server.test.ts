import supertest from 'supertest';
import { interfaces } from 'inversify';
import { Request, Response, Router, NextFunction, RequestHandler, json, CookieOptions } from 'express';
import cookieParser from 'cookie-parser';
import { injectable, Container } from 'inversify';
import {AuthProvider, getRouteInfo, InversifyExpressServer, Principal} from '../src';
import { controller, httpMethod, all, httpGet, httpPost, httpPut, httpPatch, httpHead, httpDelete, request, response, requestParam, requestBody, queryParam, requestHeaders, cookies, next, principal } from '../src/decorators';
import { cleanUpMetadata } from '../src/utils';

describe('Integration Tests:', () => {
  let server: InversifyExpressServer;
  let container: interfaces.Container;

  beforeEach(() => {
    cleanUpMetadata();
    container = new Container();
  });

  describe('Routing & Request Handling:', () => {
    it('should work for async controller methods', async () => {
      @controller('/')
      class TestController {
        @httpGet('/') public getTest(req: Request, res: Response) {
          return new Promise((resolve => {
            setTimeout(resolve, 100, 'GET');
          }));
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');
    });

    it('should work for async controller methods that fails', async () => {
      @controller('/')
      class TestController {
        @httpGet('/') public getTest(req: Request, res: Response) {
          return new Promise(((resolve, reject) => {
            setTimeout(reject, 100, 'GET');
          }));
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(500);
    });

    it('should work for methods which call nextFunc()', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getTest(req: Request, res: Response, nextFunc: NextFunction) {
          nextFunc();
        }

        @httpGet('/') public getTest2(req: Request, res: Response) {
          return 'GET';
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');
    });

    it('should work for async methods which call nextFunc()', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getTest(req: Request, res: Response, nextFunc: NextFunction) {
          return new Promise((resolve => {
            setTimeout(() => {
              nextFunc();
              resolve(null);
            }, 100, 'GET');
          }));
        }

        @httpGet('/') public getTest2(req: Request, res: Response) {
          return 'GET';
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');
    });

    it('should work for async methods called by nextFunc()', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getTest(req: Request, res: Response, nextFunc: NextFunction) {
          return nextFunc;
        }

        @httpGet('/') public getTest2(req: Request, res: Response) {
          return new Promise((resolve => {
            setTimeout(resolve, 100, 'GET');
          }));
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');
    });

    it('should work for each shortcut decorator', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getTest(req: Request, res: Response) { res.send('GET'); }

        @httpPost('/')
        public postTest(req: Request, res: Response) { res.send('POST'); }

        @httpPut('/')
        public putTest(req: Request, res: Response) { res.send('PUT'); }

        @httpPatch('/')
        public patchTest(req: Request, res: Response) { res.send('PATCH'); }

        @httpHead('/')
        public headTest(req: Request, res: Response) { res.send('HEAD'); }

        @httpDelete('/')
        public deleteTest(req: Request, res: Response) { res.send('DELETE'); }
      }

      server = new InversifyExpressServer(container);

      const agent = supertest(await server.build());

      const deleteFn = () => {
        void agent.delete('/').expect(200, 'DELETE');
      };
      const head = () => {
        void agent.head('/').expect(200, 'HEAD', deleteFn);
      };
      const patch = () => { void agent.patch('/').expect(200, 'PATCH', head); };

      await agent.get('/').expect(200, 'GET');
      await agent.post('/').expect(200, 'POST');
      await agent.put('/').expect(200, 'PUT');
      await agent.patch('/').expect(200, 'PATCH');
    });

    it('should work for more obscure HTTP methods using the httpMethod decorator', async () => {
      @controller('/')
      class TestController {
        @httpMethod('propfind', '/')
        public getTest(req: Request, res: Response) {
          res.send('PROPFIND');
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .propfind('/')
        .expect(200, 'PROPFIND');
    });

    it('should use returned values as response', async () => {
      const result = { hello: 'world' };

      @controller('/')
      class TestController {
        @httpGet('/')
        public getTest(req: Request, res: Response) {
          return result;
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, JSON.stringify(result));
    });

    it('should use custom router passed from configuration', async () => {
      @controller('/CaseSensitive')
      class TestController {
        @httpGet('/Endpoint') public get() {
          return 'Such Text';
        }
      }

      const customRouter = Router({
        caseSensitive: true,
      });

      server = new InversifyExpressServer(container, customRouter);

      const app = await server.build();

      const expectedSuccess = supertest(app)
        .get('/CaseSensitive/Endpoint')
        .expect(200, 'Such Text');

      const expectedNotFound1 = supertest(app)
        .get('/casesensitive/endpoint')
        .expect(404);

      const expectedNotFound2 = supertest(app)
        .get('/CaseSensitive/endpoint')
        .expect(404);

      await Promise.all([
        expectedSuccess,
        expectedNotFound1,
        expectedNotFound2,
      ]);
    });

    it('should use custom routing configuration', async () => {
      @controller('/ping')
      class TestController {
        @httpGet('/endpoint') public get() {
          return 'pong';
        }
      }

      server = new InversifyExpressServer(
        container,
        null,
        { rootPath: '/api/v1' }
      );

      await supertest(await server.build())
        .get('/api/v1/ping/endpoint')
        .expect(200, 'pong');
    });

    it('should work for controller methods who\'s return value is falsey', async () => {
      @controller('/user')
      class TestController {
        @httpDelete('/') public async delete(): Promise<void> {
          //
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .delete('/user')
        .expect(204, '');
    });
  });

  describe('Middleware:', () => {
    let result: string;
    type Middleware = {
      a: (req: Request, res: Response, nextFunc: NextFunction) => void;
      b: (req: Request, res: Response, nextFunc: NextFunction) => void;
      c: (req: Request, res: Response, nextFunc: NextFunction) => void;
    };
    const middleware: Middleware = {
      a(req: Request, res: Response, nextFunc: NextFunction) {
        result += 'a';
        nextFunc();
      },
      b(req: Request, res: Response, nextFunc: NextFunction) {
        result += 'b';
        nextFunc();
      },
      c(req: Request, res: Response, nextFunc: NextFunction) {
        result += 'c';
        nextFunc();
      },
    };

    const spyA = jest.fn().mockImplementation(middleware.a);
    const spyB = jest.fn().mockImplementation(middleware.b);
    const spyC = jest.fn().mockImplementation(middleware.c);

    beforeEach(() => {
      spyA.mockClear();
      spyB.mockClear();
      spyC.mockClear();
      result = '';
    });

    it('should call method-level middleware correctly (GET)', async () => {
      @controller('/')
      class TestController {
        @httpGet('/', spyA, spyB, spyC)
        public getTest(req: Request, res: Response) {
          res.send('GET');
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledTimes(1);
      expect(result).toBe('abc');
    });

    it('should call method-level middleware correctly (POST)', async () => {
      @controller('/')
      class TestController {
        @httpPost('/', spyA, spyB, spyC)
        public postTest(req: Request, res: Response) {
          res.send('POST');
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .post('/')
        .expect(200, 'POST');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledTimes(1);
      expect(result).toBe('abc');
    });

    it('should call method-level middleware correctly (PUT)', async () => {
      @controller('/')
      class TestController {
        @httpPut('/', spyA, spyB, spyC)
        public postTest(req: Request, res: Response) {
          res.send('PUT');
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .put('/')
        .expect(200, 'PUT');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledTimes(1);
      expect(result).toBe('abc');
    });

    it('should call method-level middleware correctly (PATCH)', async () => {
      @controller('/')
      class TestController {
        @httpPatch('/', spyA, spyB, spyC)
        public postTest(req: Request, res: Response) {
          res.send('PATCH');
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .patch('/')
        .expect(200, 'PATCH');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledTimes(1);
      expect(result).toBe('abc');
    });

    it('should call method-level middleware correctly (HEAD)', async () => {
      @controller('/')
      class TestController {
        @httpHead('/', spyA, spyB, spyC)
        public postTest(req: Request, res: Response) {
          res.send('HEAD');
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .head('/')
        .expect(200, undefined);

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledTimes(1);
      expect(result).toBe('abc');
    });

    it('should call method-level middleware correctly (DELETE)', async () => {
      @controller('/')
      class TestController {
        @httpDelete('/', spyA, spyB, spyC)
        public postTest(req: Request, res: Response) {
          res.send('DELETE');
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .delete('/')
        .expect(200, 'DELETE');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledTimes(1);
      expect(result).toBe('abc');
    });

    it('should call method-level middleware correctly (ALL)', async () => {
      @controller('/')
      class TestController {
        @all('/', spyA, spyB, spyC)
        public postTest(req: Request, res: Response) {
          res.send('ALL');
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'ALL');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledTimes(1);
      expect(result).toBe('abc');
    });

    it('should call controller-level middleware correctly', async () => {
      @controller('/', spyA, spyB, spyC)
      class TestController {
        @httpGet('/')
        public getTest(req: Request, res: Response) {
          res.send('GET');
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledTimes(1);
      expect(result).toBe('abc');
    });

    it('should call server-level middleware correctly', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getTest(req: Request, res: Response) {
          res.send('GET');
        }
      }

      server = new InversifyExpressServer(container);

      server.setConfig(app => {
        app.use(spyA);
        app.use(spyB);
        app.use(spyC);
      });

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledTimes(1);
      expect(result).toBe('abc');
    });

    it('should call all middleware in correct order', async () => {
      @controller('/', spyB)
      class TestController {
        @httpGet('/', spyC)
        public getTest(req: Request, res: Response) {
          res.send('GET');
        }
      }

      server = new InversifyExpressServer(container);

      server.setConfig(app => {
        app.use(spyA);
      });

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(spyC).toHaveBeenCalledTimes(1);
      expect(result).toBe('abc');
    });

    it('should resolve controller-level middleware', async () => {
      const symbolId = Symbol.for('spyA');
      const strId = 'spyB';

      @controller('/', symbolId, strId)
      class TestController {
        @httpGet('/')
        public getTest(req: Request, res: Response) {
          res.send('GET');
        }
      }

      container.bind<RequestHandler>(symbolId).toConstantValue(spyA);
      container.bind<RequestHandler>(strId).toConstantValue(spyB);

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(result).toBe('ab');
    });

    it('should resolve method-level middleware', async () => {
      const symbolId = Symbol.for('spyA');
      const strId = 'spyB';

      @controller('/')
      class TestController {
        @httpGet('/', symbolId, strId)
        public getTest(req: Request, res: Response) {
          res.send('GET');
        }
      }

      container.bind<RequestHandler>(symbolId).toConstantValue(spyA);
      container.bind<RequestHandler>(strId).toConstantValue(spyB);

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(result).toBe('ab');
    });

    it('should compose controller- and method-level middleware', async () => {
      const symbolId = Symbol.for('spyA');
      const strId = 'spyB';

      @controller('/', symbolId)
      class TestController {
        @httpGet('/', strId)
        public getTest(req: Request, res: Response) { res.send('GET'); }
      }

      container.bind<RequestHandler>(symbolId).toConstantValue(spyA);
      container.bind<RequestHandler>(strId).toConstantValue(spyB);

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'GET');

      expect(spyA).toHaveBeenCalledTimes(1);
      expect(spyB).toHaveBeenCalledTimes(1);
      expect(result).toBe('ab');
    });
  });

  describe('Parameters:', () => {
    it('should bind a method parameter to the url parameter of the web request', async () => {
      @controller('/')
      class TestController {
        @httpGet(':id')
        public getTest(
          @requestParam('id') id: string,
          req: Request,
          res: Response
        ) {
          return id;
        }
      }

      server = new InversifyExpressServer(container);
      await supertest(await server.build())
        .get('/foo')
        .expect(200, 'foo');
    });

    it('should bind a method parameter to the request object', async () => {
      @controller('/')
      class TestController {
        @httpGet(':id')
        public getTest(
          @request() req: Request
        ) {
          return req.params['id'];
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/GET')
        .expect(200, 'GET');
    });

    it('should bind a method parameter to the response object', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getTest(
          @response() res: Response
        ) {
          return res.send('foo');
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'foo');
    });

    it('should bind a method parameter to a query parameter', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getTest(
          @queryParam('id') id: string
        ) {
          return id;
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .query('id=foo')
        .expect(200, 'foo');
    });

    it('should bind a method parameter to the request body', async () => {
      @controller('/')
      class TestController {
        @httpPost('/') public getTest(@requestBody() reqBody: string) {
          return reqBody;
        }
      }

      server = new InversifyExpressServer(container);
      const body = { foo: 'bar' };
      server.setConfig(app => {
        app.use(json());
      });

      await supertest(await server.build())
        .post('/')
        .send(body)
        .expect(200, body);
    });

    it('should bind a method parameter to the request headers', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getTest(
          @requestHeaders('testhead') headers: Record<string, unknown>) {
          return headers;
        }
      }

      server = new InversifyExpressServer(container);
      await supertest(await server.build())
        .get('/')
        .set('TestHead', 'foo')
        .expect(200, 'foo');
    });

    it('should be case insensitive to request headers', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getTest(
          @requestHeaders('TestHead') headers: Record<string, unknown>) {
          return headers;
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .set('TestHead', 'foo')
        .expect(200, 'foo');
    });

    it('should bind a method parameter to a cookie', async () => {
      @controller('/')
      class TestController {
        @httpGet('/') public getCookie(
          @cookies('Cookie') cookie: CookieOptions,
          req: Request,
          res: Response
        ) {
          return cookie;
        }
      }

      server = new InversifyExpressServer(container);
      server.setConfig(app => {
        app.use(cookieParser());
      });

      await supertest(await server.build())
        .get('/')
        .set('Cookie', 'Cookie=hey')
        .expect(200, 'hey');
    });

    it('should bind a method parameter to the next function', async () => {
      @controller('/')
      class TestController {
        @httpGet('/') public getTest(@next() nextFunc: NextFunction) {
          return nextFunc();
        }

        @httpGet('/') public getResult() {
          return 'foo';
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, 'foo');
    });

    it('should bind a method parameter to a principal with null (empty) details when no AuthProvider is set.', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getPrincipalTest(
          @principal() userPrincipal: Principal
        ) {
          return userPrincipal.details;
        }
      }

      server = new InversifyExpressServer(container);

      await supertest(await server.build())
        .get('/')
        .expect(200, '');
    });

    it('should bind a method parameter to a principal with valid details when an AuthProvider is set.', async () => {
      @controller('/')
      class TestController {
        @httpGet('/')
        public getPrincipalTest(
          @principal() userPrincipal: Principal
        ) {
          return userPrincipal.details;
        }
      }

      @injectable()
      class CustomAuthProvider implements AuthProvider {
        public async getUser(
          req: Request,
          res: Response,
          nextFunc: NextFunction,
        ): Promise<Principal> {
          return Promise.resolve({
            details: 'something',
            isAuthenticated: () => Promise.resolve(true),
            isInRole: () => Promise.resolve(true),
            isResourceOwner: () => Promise.resolve(true)
          } as Principal);
        }
      }

      server = new InversifyExpressServer(
        container,
        null,
        null,
        null,
        CustomAuthProvider
      );

      await supertest(await server.build())
        .get('/')
        .expect(200, 'something');
    });
  });
});