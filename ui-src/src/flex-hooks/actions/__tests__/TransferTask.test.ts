import { interceptTransferOverrideForChatTasks } from '../TransferTask'
import '@testing-library/jest-dom';
import * as Flex  from '@twilio/flex-ui';
import ChatTransferService from '../../../service/ChatTransferService'

  jest.mock('../../../service/ChatTransferService', () => {
    return {
      executeChatTransfer: jest.fn()
    };
  });

  describe('interceptTransferOverrideForChatTasks', () => {
    const actionSpy = jest.spyOn(ChatTransferService, 'executeChatTransfer');
    let flex: typeof Flex = Flex;
    let manager: Flex.Manager = Flex.Manager.getInstance();
    it('adds beforeCompleteTask listener', async () => {
      const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
      await interceptTransferOverrideForChatTasks(flex, manager);
      expect(listenerSpy).toHaveBeenCalled();
    });
  
    it('should call completeTransferredTask with correct parameters', async () => {
    const payload = {
      task:{
        attributes:{
          chatTransferData:{test:"test"}
        }
      },
      sid:"SIxxx",
      targetSid:"testtargetsid",
      options:{}
    }
    const addListenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await interceptTransferOverrideForChatTasks(flex, manager);
    flex.Actions.invokeAction('TransferTask', payload);
    expect(addListenerSpy).toHaveBeenCalledTimes(1);
    expect(actionSpy).toHaveBeenCalled();
    });
    it('should call completeTransferredTask with correct parameters', async () => {
      const payload = {
        task:{
          attributes:{
          }
        },
        sid:"SIxxx",
        targetSid:"testtargetsid",
        options:{}
      }
      const addListenerSpy = jest.spyOn(Flex.Actions, 'addListener');
      await interceptTransferOverrideForChatTasks(flex, manager);
      flex.Actions.invokeAction('TransferTask', payload);
      expect(addListenerSpy).toHaveBeenCalledTimes(1);
      });
}) 