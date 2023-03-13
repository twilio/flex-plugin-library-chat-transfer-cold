import helpers from '../test-utils/test-helper';
import mockAxios from "axios"
const resp = {
  data: {
    attributes: {}
  },
  headers: {
    etag: {}
  }

}
const originalEnv = process.env;
  process.env = {
    ...originalEnv,
    TWILIO_FLEX_WORKSPACE_SID :'WSxxxxx',
  };
describe('chat operations', () => {
  const chatOperationsTwilioClient = function (getQueues) {
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
  const getQueues = jest.fn(() =>
    Promise.resolve({
      attributes: {
        associatedTasks: {}
      }
    }
    )
  );
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction(
      'twilio-wrappers/retry-handler',
      './functions/twilio-wrappers/retry-handler.private.js',
    );
  });

  it('add task to channel', async () => {
    const { addTaskToChannel } = require('../../functions/chat-transfer/common/chat-operations.private');
    JSON.parse = (obj) => obj
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: 1,
      context: mockContext,
      channelSid: "CHXXxxxx",
      taskSid: "TKxxx"
    }
    const p = await addTaskToChannel({ ...payload });
    expect(p.status).toEqual(200);
  })
  it('set task to complete channel', async () => {
    const { setTaskToCompleteOnChannel } = require('../../functions/chat-transfer/common/chat-operations.private');
    JSON.parse = (obj) => obj
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: 1,
      context: mockContext,
      channelSid: "CHXXxxxx",
      taskSid: "TKxxx"
    }
    const p = await setTaskToCompleteOnChannel({ ...payload })
    expect(p.status).toEqual(200);
  })
  // it('remove channel sid from task', async () => {
  //   const { removeChannelSidFromTask } = require('../../functions/chat-transfer/common/chat-operations.private');
  //   mockAxios.get.mockImplementationOnce(() => Promise.resolve({data:'restly'}))
  //   const mockContext = {
  //     PATH: 'mockPath',
  //     getTwilioClient: () => chatOperationsTwilioClient(getQueues),
  //     TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx",
  //     ACCOUNT_SID:"ACxxxx",
  //     AUTH_TOKEN:"ATxxxx"
  //   };

  //   const payload = {
  //     attempts: 1,
  //     context: mockContext,
  //     channelSid: "CHXXxxxx",
  //     taskSid: "TKxxx"
  //   }
  //   const p = await removeChannelSidFromTask({ ...payload })
  //   process.env = originalEnv
  // })
  it('addTaskToChannel gives error due to invalid context', async () => {
    const { addTaskToChannel } = require('../../functions/chat-transfer/common/chat-operations.private');
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: 1,
      context: '',
      channelSid: "CHXXxxxx",
      taskSid: "TKxxx"
    }
    await addTaskToChannel({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain context object')
    });
  })
  it('addTaskToChannel gives error due to invalid attempts', async () => {
    const { addTaskToChannel } = require('../../functions/chat-transfer/common/chat-operations.private');
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: '1',
      context: mockContext,
      channelSid: "CHXXxxxx",
      taskSid: "TKxxx"
    }
    await addTaskToChannel({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
    });
  })
  it('addTaskToChannel gives error due to invalid taskSid', async () => {
    const { addTaskToChannel } = require('../../functions/chat-transfer/common/chat-operations.private');
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: 1,
      context: mockContext,
      channelSid: "CHXXxxxx",
      taskSid: 123
    }
    await addTaskToChannel({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain taskSid string')
    });
  })
  it('setTaskToCompleteOnChannel gives error due to invalid context', async () => {
    const { setTaskToCompleteOnChannel } = require('../../functions/chat-transfer/common/chat-operations.private');

    const payload = {
      attempts: 1,
      context: '',
      channelSid: "CHXXxxxx",
      taskSid: "TKxxx"
    }
    await setTaskToCompleteOnChannel({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain context object')
    });
  })
  it('setTaskToCompleteOnChannel gives error due to invalid attempts', async () => {
    const { setTaskToCompleteOnChannel } = require('../../functions/chat-transfer/common/chat-operations.private');
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: '1',
      context: mockContext,
      channelSid: "CHXXxxxx",
      taskSid: "TKxxx"
    }
    await setTaskToCompleteOnChannel({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
    });
  })
  it('setTaskToCompleteOnChannel gives error due to invalid taskSid', async () => {
    const { setTaskToCompleteOnChannel } = require('../../functions/chat-transfer/common/chat-operations.private');
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: 1,
      context: mockContext,
      channelSid: "CHXXxxxx",
      taskSid: 123
    }
    await setTaskToCompleteOnChannel({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain taskSid string')
    });
  })
  it('setTaskToCompleteOnChannel gives error due to invalid channelSid', async () => {
    const { setTaskToCompleteOnChannel } = require('../../functions/chat-transfer/common/chat-operations.private');
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: 1,
      context: mockContext,
      channelSid: 123,
      taskSid: '123'
    }
    await setTaskToCompleteOnChannel({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain channelSid string')
    });
  })
  it('removeChannelSidFromTask gives error due to invalid taskSid', async () => {
    const { removeChannelSidFromTask } = require('../../functions/chat-transfer/common/chat-operations.private');
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: 1,
      context: mockContext,
      taskSid: 123
    }
    await removeChannelSidFromTask({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain taskSid string')
    });
  })
  it('removeChannelSidFromTask gives error due to invalid attempts', async () => {
    const { removeChannelSidFromTask } = require('../../functions/chat-transfer/common/chat-operations.private');
    const mockContext = {
      PATH: 'mockPath',
      getTwilioClient: () => chatOperationsTwilioClient(getQueues),
      TWILIO_FLEX_CHAT_SERVICE_SID: "FCSxxx"
    };

    const payload = {
      attempts: '1',
      context: mockContext,
      taskSid: 'TAxxx'
    }
    await removeChannelSidFromTask({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
    });
  })
  it('removeChannelSidFromTask gives error due to invalid context', async () => {
    const { removeChannelSidFromTask } = require('../../functions/chat-transfer/common/chat-operations.private');

    const payload = {
      attempts: 1,
      context: '',
      taskSid: 'TAxxx'
    }
    await removeChannelSidFromTask({ ...payload }).catch(err => {
      expect(err).toMatch('Invalid parameters object passed. Parameters must contain context object')
    });
  })
})