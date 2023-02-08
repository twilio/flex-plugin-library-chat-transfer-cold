import { announceOnChannelWhenJoined } from '../conversationJoined';
import { Conversation } from '@twilio/conversations';
import { Actions } from '@twilio/flex-ui';

jest.mock('@twilio/flex-ui', () => {
    return {
        __esModule: true,
        Actions: {
            addListener: jest.fn(),
            removeListener: jest.fn(),
            invokeAction: jest.fn(),
        },
        TaskHelper: {
            getTaskFromConversationSid: (id) => {
                return {
                    sid: "136278"
                }
            },
            isChatBasedTask: (prop) => {
                return true;
            },
            isCBMTask: (props) => {
                return false;
            }
        }
    };
});

jest.mock('../../../../service/ChatTransferService', () => {
    return {
        getWorkerFriendlyName: jest.fn()
    };
});
describe('conversation Joined', () => {
    const conversation = { sid: "76522" } as unknown as Conversation
    let flex, manager;
    beforeEach(() => {
        manager = {};
    });
    it('conversation Joined', async () => {
        const invokeActionSpy = jest.spyOn(Actions, 'invokeAction');
        announceOnChannelWhenJoined(flex, manager, conversation);
        await expect(invokeActionSpy).toHaveBeenCalledTimes(1);
    })
})