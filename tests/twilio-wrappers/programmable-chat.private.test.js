import helpers from '../test-utils/test-helper';

describe('programmable chat error scenarios', () => {
  const programmableChatTwilioClient = function (getQueues) {
    const getServices = (_chatServiceSid) => ({
      sid: _chatServiceSid,
      channels: (_channelSid) => (
        {
          sid: _channelSid,
          fetch: getQueues,
          update: (arg) => (Promise.resolve({

          }
          ))
        }
      )
    });
    const mockService = {
      services: getServices
    };
    return {
      chat: mockService,
    };
  };
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });
  it('updateChannelAttributes gives error due to invalid context', async () => {
    const { updateChannelAttributes } = require('../../functions/twilio-wrappers/programmable-chat.private');

    const payload = {
      attempts: 1,
      context: '',
      attributes: 'test',
      channelSid:'CHxxx'
    }
    await updateChannelAttributes({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain context object')
    });
  })
  it('updateChannelAttributes gives error due to invalid attempts', async () => {
    const { updateChannelAttributes } = require('../../functions/twilio-wrappers/programmable-chat.private');
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: '1',
      context: mockContext,
      attributes: 'test',
      channelSid:'CHxxx'
    }
    await updateChannelAttributes({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
    });
  })
  it('updateChannelAttributes gives error due to invalid attributes', async () => {
    const { updateChannelAttributes } = require('../../functions/twilio-wrappers/programmable-chat.private');
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: 1,
      context: mockContext,
      attributes: {},
      channelSid:'CHxxx'
    }
    await updateChannelAttributes({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain attributes string')
    });
  })
})
