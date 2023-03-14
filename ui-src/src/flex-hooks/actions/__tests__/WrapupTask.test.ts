import {
    announceOnChannelWhenLeaving,
    removeChannelSidAndLeaveChatForChatTransfer
} from '../WrapupTask';
import '@testing-library/jest-dom';
import * as Flex from '@twilio/flex-ui';
import * as ChatTransferService from '../../../service/ChatTransferService';

jest.mock('../../../service/ChatTransferService', () => {
    return {
        getWorkerFriendlyName: jest.fn()
    };
});
jest.mock('../../../service/TaskRouterService', () => {
    return {
        updateTaskAttributes: jest.fn()
    };
});
jest.mock('../../../service/ProgrammableChatService', () => {
    return {
        updateChannelAttributes: jest.fn()
    };
});

describe('wrap up task tests', () => {
    const actionSpyChatTransferService = jest.spyOn(ChatTransferService, 'getWorkerFriendlyName');
    let flex: typeof Flex = Flex;
    let manager: Flex.Manager = Flex.Manager.getInstance();
    it('adds beforeWrapupTask listener in announceOnChannelWhenLeaving', async () => {
        const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
        await announceOnChannelWhenLeaving(flex, manager);
        expect(listenerSpy).toHaveBeenCalled();
    });
    it('adds beforeWrapupTask listener in removeChannelSidAndLeaveChatForChatTransfer', async () => {
        const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
        await removeChannelSidAndLeaveChatForChatTransfer(flex, manager);
        expect(listenerSpy).toHaveBeenCalled();
    })

    it('announce on channel is called successfully', async () => {
        const payload = {
            task: {
                taskChannelUniqueName: 'chat',
                attributes: {
                    channelSid: "CHxxxxx",
                    chatTransferData: { test: "test" }
                }
            },
            sid: "SIxxx",
            targetSid: "testtargetsid",
            options: {}
        }
        const addListenerSpy = jest.spyOn(Flex.Actions, 'addListener');
        await announceOnChannelWhenLeaving(flex, manager);
        flex.Actions.invokeAction('WrapupTask', payload);
        expect(addListenerSpy).toHaveBeenCalledTimes(1);
        expect(actionSpyChatTransferService).toHaveBeenCalled();
    });
    it('removeChannelSidAndLeaveChatForChatTransfer is called successfully', async () => {
        const payload = {
            task: {
                taskSid: "TAxxx",
                taskChannelUniqueName: 'chat',
                attributes: {
                    channelSid: "CHxxxxx",
                    chatTransferData: { test: "test" }
                }
            },
            sid: "SIxxx",
            targetSid: "testtargetsid",
            options: {}
        }
        const addListenerSpy = jest.spyOn(Flex.Actions, 'addListener');
        await removeChannelSidAndLeaveChatForChatTransfer(flex, manager);
        flex.Actions.invokeAction('WrapupTask', payload);
        expect(addListenerSpy).toHaveBeenCalledTimes(1);
        expect(actionSpyChatTransferService).toHaveBeenCalled();
    });

}) 