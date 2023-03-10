import * as Flex from '@twilio/flex-ui';
import ChatTransferService from '../../service/ChatTransferService';
import { ErrorManager, FlexErrorSeverity, FlexPluginErrorType } from "../../utils/ErrorManager";
//import { isFeatureEnabled } from '../../index';

export interface EventPayload {
  task?: Flex.ITask;
  sid?: string;
}

// when a chat task has been transferred, performs custom complete actions
// otherwise performs default behaviors
export const interceptTransferredChatTasks = async (flex: typeof Flex, manager: Flex.Manager) => {

  //if(!isFeatureEnabled()) return;
  try {
    Flex.Actions.addListener('beforeCompleteTask', async (payload, abortFunction) => {

      const task = payload.task ? payload.task : Flex.TaskHelper.getTaskByTaskSid(payload.sid as string);

      // for any tasks that are not chat transfer tasks, complete as normal
      if (!task.attributes.chatTransferData) {
        return;
      }

      // perform custom complete activities for chat tasks that have been transferred.
      // then abort performing any other OOTB actions for completing this task
      const success = await ChatTransferService.completeTransferredTask(task);
      if (success) abortFunction();
    });
  } catch (e) {
    ErrorManager.createAndProcessError("Could not add 'beforeCompleteTask' listener", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeCompleteTask' listener",
      context: "Plugin.Action.beforeCompleteTask",
      wrappedError: e
    });
  }
}
