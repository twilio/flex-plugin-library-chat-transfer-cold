import { interceptTransferredChatTasks } from '../CompleteTask'
import '@testing-library/jest-dom';
import * as Flex  from '@twilio/flex-ui';
import ChatTransferService from '../../../service/ChatTransferService';

  jest.mock('../../../service/ChatTransferService', () => {
    return {
            completeTransferredTask: jest.fn()
    };
  });

  describe('interceptTransferOverrideForChatTasks', () => {
    const actionSpy = jest.spyOn(ChatTransferService, 'completeTransferredTask');
    let flex: typeof Flex = Flex;
    let manager: Flex.Manager = Flex.Manager.getInstance();
    it('adds beforeCompleteTask listener', async () => {
      const listenerSpy = jest.spyOn(Flex.Actions, 'addListener');
      await interceptTransferredChatTasks(flex, manager);
      expect(listenerSpy).toHaveBeenCalled();
    });
  
    it('should call completeTransferredTask with correct parameters', async () => {
    const payload = {
      task:{
        attributes:{
          chatTransferData:{test:"test"}
        }
      },
      sid:"SIxxx"
    }
    const addListenerSpy = jest.spyOn(Flex.Actions, 'addListener');
    await interceptTransferredChatTasks(flex, manager);
    flex.Actions.invokeAction('CompleteTask', payload);
    expect(addListenerSpy).toHaveBeenCalledTimes(1);
    expect(actionSpy).toHaveBeenCalled();
    });
    it('should call completeTransferredTask with correct parameters', async () => {
      const payload = {
        task:{
          attributes:{
          }
        },
        sid:"SIxxx"
      }
      const addListenerSpy = jest.spyOn(Flex.Actions, 'addListener');
      await interceptTransferredChatTasks(flex, manager);
      flex.Actions.invokeAction('CompleteTask', payload);
      expect(addListenerSpy).toHaveBeenCalledTimes(1);
      });
}) 