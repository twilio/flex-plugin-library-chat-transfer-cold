import React from 'react';
import {} from './components/TransferButton'
import ChatTransferPlugin from './ChatTransferPlugin';
jest.mock('@twilio/flex-ui', () => {
    return {
        Flex: {
            Notifications: { registerNotification: jest.fn() }
        }
    }
});

//updateChannelAttributes
jest.mock('./service/ChatTransferService', () => {
    return {
        completeTransferredTask: jest.fn(),
        executeChatTransfer: jest.fn()
    }
});
jest.mock('./service/ProgrammableChatService', () => {
    return {
        updateChannelAttributes: jest.fn()
    }
});
//../src/custom-components/TransferButton
jest.mock('./components/TransferButton', () => {
    const TransferButton = () => <div />;
  return TransferButton;
});
jest.mock('./service/TaskRouterService', () => {
    return {
        updateTaskAssignmentStatus: jest.fn(),
        updateTaskAttributes: jest.fn(),
        getQueues: jest.fn(),
        getWorkerChannels: jest.fn(),
        updateWorkerChannel: jest.fn(),
    }
});
// class Test extends ChatTransferPlugin{
//     constructor(PLUGIN_NAME="ChatTransferPlugin"){
//         super(PLUGIN_NAME)
//     }
// }
describe('test the ChatTransferPlugin initializer', () => {
    const ctp = new ChatTransferPlugin();
    let flex, manager;
    beforeEach(() => {
        flex = {
            Notifications: {
                registerNotification: jest.fn()
            },
            NotificationType: {
                warning: 'warn'
            },
        }
        manager = {};
    });
    it('initializes all action', () => {
        ctp.init(flex, manager)
    })
})