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
  const addTaskToChannelTwilioClient = function (addTaskToChannel) {
    const getServices = (_serviceSid) => ({
        sid: _serviceSid,
        channels:(_channelSid)=>({
            sid:_channelSid,
            fetch:addTaskToChannel,
            update:(params)=>({

            })
        })
      });

    const mockChatService = {
        services:getServices
    };
    return {
        chat: mockChatService,
    };
  };

  const addTaskToChannel = jest.fn(() =>
   Promise.resolve({
    attributes:{
        associatedTasks:{
            'TAxxxx':'inflight'
        }
    }
   }
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
    global.Runtime._addFunction(
        'chat-transfer/common/chat-operations',
        './functions/chat-transfer/common/chat-operations.private.js',
      );
    
  });

  it('getQueues is called successfully ', async () => {
    const GetQueues = require('../../functions/chat-transfer/studio/add-task-to-chat-channel-data.protected');
    console.log(GetQueues)
    const handlerFn = GetQueues.handler;

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => addTaskToChannelTwilioClient(addTaskToChannel),
    };
    const mockEvent = {
        channelSid: 'CHxxxxx',
        taskSid: 'TAxxxx'
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
    const GetQueues = require('../../functions/chat-transfer/studio/add-task-to-chat-channel-data.protected');
    const handlerFn = GetQueues.handler;
    const mockEvent = {
        channelSid: 'CHxxxxx',
        taskSid: 'TAxxxx'
    };

    const mockResponse = new Twilio.Response();
    const mockCallbackObject = jest.fn();
    console.log(handlerFn)
    const mockErrorObject = jest.fn();
    await handlerFn({}, {}, mockCallbackObject, mockResponse, mockErrorObject);
    expect(mockErrorObject.mock.calls.length).toBe(1);
  });
});
