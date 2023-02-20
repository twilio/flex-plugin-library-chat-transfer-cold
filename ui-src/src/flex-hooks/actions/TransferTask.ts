import * as Flex from '@twilio/flex-ui';
import ChatTransferService from '../../service/ChatTransferService';
import { ErrorManager, FlexErrorSeverity, FlexPluginErrorType } from "../../utils/ErrorManager";
//import { isFeatureEnabled } from '../../index';

export interface TransferOptions {
  attributes: string;
  mode: string;
  priority: string;
}

export interface EventPayload {
  task: Flex.ITask;
  sid?: string; // taskSid or task is required
  targetSid: string; // target of worker or queue sid
  options?: TransferOptions;
}

// if the task channel is not chat, function defers to existing process
// otherwise the function creates a new task for transfering the chat
// and deals with the chat orchestration
export function interceptTransferOverrideForChatTasks(flex: typeof Flex, manager: Flex.Manager) {
  //if (!isFeatureEnabled()) return;
  try{
    Flex.Actions.addListener('beforeTransferTask', async (payload: EventPayload, abortFunction: any) => {
      if (Flex.TaskHelper.isChatBasedTask(payload.task) && !Flex.TaskHelper.isCBMTask(payload.task)) {
        abortFunction(payload);
        // Execute Chat Transfer Task
        await ChatTransferService.executeChatTransfer(payload.task, payload.targetSid, payload.options);
      }
    });
  } catch (e) {
    ErrorManager.createAndProcessError("Could not add 'beforeTransferTask' listener", {
      type: FlexPluginErrorType.action,
      description: e instanceof Error ? `${e.message}` : "Could not add 'beforeTransferTask' listener",
      context: "Plugin.Action.beforeTransferTask",
      wrappedError: e
    });
  }
}
