import RetryHandler from '../../functions/twilio-wrappers/retry-handler.private';
describe('Retry Handler', () => {
  const OLD_ENV = process.env;
  beforeEach(() => {
    jest.resetModules(); // Most important - it clears the cache
    process.env = { ...OLD_ENV }; // Make a copy
  });

  afterAll(() => {
    process.env = OLD_ENV; // Restore old environment
  });
  it('throws invalid parameter error', async () => {
    let err = null;
    try {
      await RetryHandler.retryHandler({}, {}, jest.fn());
    } catch (error) {
      err = error;
    }
    expect(err).toBe('Invalid parameters object passed. Parameters must contain the number of attempts');
  });

  it('returns failed status', async () => {
    const errorMock = {
      response: {
        status: 400,
      },
      message: 'mockMessage',
    };
    const mockParameters = {
      attempts: 4,
      context: {},
    };
    process.env.TWILIO_SERVICE_RETRY_LIMIT = 3;

    const reponse = await RetryHandler.retryHandler(errorMock, mockParameters, jest.fn());
    expect(reponse).toEqual({ success: false, message: 'mockMessage', status: 400 });
  });

  it('retry callback is called', async () => {
    const errorMock = {
      response: {
        status: 429,
      },
      message: 'mockMessage',
    };
    const mockParameters = {
      attempts: 0,
      context: {},
    };
    const mockCallback = (params) => {
      expect(params).toEqual({ ...mockParameters, attempts: 1 });
    };
    process.env.TWILIO_SERVICE_RETRY_LIMIT = 3;

    await RetryHandler.retryHandler(errorMock, mockParameters, mockCallback);
    // expect(reponse).toEqual({ success: false, message: 'mockMessage', status: 400 });
  });
});
