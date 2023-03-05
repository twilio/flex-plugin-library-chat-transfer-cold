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
  const getUpdateChannelAttributesTwilioClient = function (updateAttributes) {
    const chatService = (channelSid) => ({
        sid: channelSid,
        channels: (_channelSid) => ({
          update: updateAttributes,
          fetch:jest.fn(() =>
          Promise.resolve({
            channel: "",
          }),
        )
        }),
      });
    const mockChatService = {
        services:chatService,
    };
    return {
      chat: mockChatService,
    };
  };

  const updateChannelAttributes = jest.fn(() =>
    Promise.resolve({
      channelSid: mockChannelSid,
    }),
  );

  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
    global.Runtime._addFunction('helpers/parameter-validator', './functions/helpers/parameter-validator.private.js');
    global.Runtime._addFunction(
      'twilio-wrappers/programmable-chat',
      './functions/twilio-wrappers/programmable-chat.private.js',
    );
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  it('updateChannelAttributes is called successfully ', async () => {
    const UpdateChannelAttributes = require('../../functions/common/flex/programmable-chat/update-channel-attributes');
    const handlerFn = UpdateChannelAttributes.handler;

    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => getUpdateChannelAttributesTwilioClient(updateChannelAttributes),
    };
    const mockEvent = {
        channelSid: 'CHxxxxx',
        attributes: 'test attributes'
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

  it('updateChannelAttributes error handler is called', async () => {
    const UpdateChannelAttributes = require('../../functions/common/flex/programmable-chat/update-channel-attributes');
    const handlerFn = UpdateChannelAttributes.handler;
    const mockEvent = {
        channelSid: 'CHxxxxx',
        attributes: 'test'
    };

    const mockResponse = new Twilio.Response();
    const mockCallbackObject = jest.fn();
    const mockErrorObject = jest.fn();
    await handlerFn({}, {}, mockCallbackObject, mockResponse, mockErrorObject);
    expect(mockErrorObject.mock.calls.length).toBe(1);
  });
});
