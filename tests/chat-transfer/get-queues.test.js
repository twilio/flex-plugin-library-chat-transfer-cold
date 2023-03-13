import helpers from '../test-utils/test-helper';

jest.mock(
  '../../functions/helpers/prepare-function.private.js',
  () => ({
    __esModule: true,
    prepareFlexFunction: (_, fn) => fn,
  }),
);

const mockChannelSid = 'CSxxxxx';
describe('Update channel attributes', () => {
  const getQueuesTwilioClient = function (getQueues) {
    const getWorkspace = (workspaceSid) => ({
        sid: workspaceSid,
        taskQueues:{
          list: getQueues
        }
      });

    const mockTaskRouterService = {
        workspaces:getWorkspace
    };
    return {
        taskrouter: mockTaskRouterService,
    };
  };

  const getQueues = jest.fn(() =>
   Promise.resolve([{
        targetWorkers:"Wkxxx",
        friendlyName:"Test-name",
        sid:"SIxxx"
      }]
   )
  );

  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
    global.Runtime._addFunction('helpers/parameter-validator', './functions/helpers/parameter-validator.private.js');
    global.Runtime._addFunction(
      'twilio-wrappers/programmable-voice',
      './functions/twilio-wrappers/programmable-chat.private.js',
    );
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
    global.Runtime._addFunction(
      'twilio-wrappers/taskrouter',
      './functions/twilio-wrappers/taskrouter.private.js',
    );
  });

  it('getQueues is called successfully ', async () => {
    const GetQueues = require('../../functions/common/flex/taskrouter/get-queues');
    const handlerFn = GetQueues.handler;

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => getQueuesTwilioClient(getQueues),
    };
    const mockEvent = {
        channelSid: 'CHxxxxx',
        attributes: {}
    };

    const mockResponse = new Twilio.Response();
    const mockErrorObject = jest.fn(() => Promise.resolve());

    const mockCallbackObject = (_err, response) => {
      expect(response).toBeInstanceOf(Twilio.Response);
      expect(response._statusCode).toEqual(200);
      expect(response._body.callSid).toBe(mockCallSid);
    };
    await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
  });

  it('getQueues error handler is called', async () => {
    const GetQueues = require('../../functions/common/flex/taskrouter/get-queues');
    const handlerFn = GetQueues.handler;
    const mockEvent = {
        channelSid: 'CHxxxxx',
        attributes: {}
    };

    const mockResponse = new Twilio.Response();
    const mockCallbackObject = jest.fn();
    const mockErrorObject = jest.fn();
    await handlerFn({}, {}, mockCallbackObject, mockResponse, mockErrorObject);
    expect(mockErrorObject.mock.calls.length).toBe(1);
  });
  it('getQueues error handler is called because of invalid context', async () => {
    const GetQueues = require('../../functions/common/flex/taskrouter/get-queues');
    const handlerFn = GetQueues.handler;
    const mockContext = 'test context';
    const mockEvent = {
        channelSid: 'CHxxxxx',
        attributes: {}
    };

    const mockResponse = new Twilio.Response();
    const mockCallbackObject = jest.fn();
    const mockErrorObject = jest.fn();
    await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
    expect(mockErrorObject.mock.calls.length).toBe(1);
  });
});
