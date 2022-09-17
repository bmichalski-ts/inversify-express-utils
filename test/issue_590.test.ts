import { Container } from 'inversify';
import { Application, application } from 'express';
import { InversifyExpressServer, cleanUpMetadata } from '../src/index';
import { NO_CONTROLLERS_FOUND } from '../src/constants';

describe('Issue 590', () => {
  beforeEach(() => {
    cleanUpMetadata();
  });

  it('should throw if no bindings for controllers are declared', async () => {
    const container = new Container();
    const server = new InversifyExpressServer(container);
    const throws = async () => await server.build();
    await expect(throws)
      .rejects
      .toThrowError(NO_CONTROLLERS_FOUND);
  });

  it('should not throw if forceControllers is false and no bindings for controllers are declared', async () => {
    const container = new Container();
    const server = new InversifyExpressServer(
      container,
      null,
      null,
      null,
      null,
      false
    );

    await server.build();
    // Not throwing exception
  });
});
