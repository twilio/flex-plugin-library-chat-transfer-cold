import * as Flex from '@twilio/flex-ui';
import React from 'react';
import TransferButton from '../../components/TransferButton';
import { ErrorManager, FlexPluginErrorType } from "../../utils/ErrorManager";
//import { isFeatureEnabled } from '../../index';

export function addTransferButtonToChatTaskView(flex: typeof Flex, manager: Flex.Manager) {

  //if(!isFeatureEnabled()) return;
  try{
    Flex.TaskCanvasHeader.Content.add(<TransferButton key="chat-transfer-button" />, {
      sortOrder: 1,
      if: (props) => Flex.TaskHelper.isChatBasedTask(props.task) && !Flex.TaskHelper.isCBMTask(props.task) && props.task.taskStatus === 'assigned',
    });
  } catch (e) {
    ErrorManager.createAndProcessError("Could not add content for Flex component", {
      type: FlexPluginErrorType.programabelComponents,
      description: e instanceof Error ? `${e.message}` : "Could not add content for Flex component",
      context: "Plugin.Component.TaskCanvasHeader",
      wrappedError: e
  });
  }
  
}
