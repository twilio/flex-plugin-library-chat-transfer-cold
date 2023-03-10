import React from 'react';
import * as Flex from '@twilio/flex-ui';
import ChatNotificationMessage from '../../components/ChatNotificationMessage';
import { ErrorManager, FlexPluginErrorType } from "../../utils/ErrorManager";
//import { isFeatureEnabled } from '../../index';

export function replaceMessageForNotifications(flex: typeof Flex, manager: Flex.Manager) {

  //if(!isFeatureEnabled()) return;
  try{
    flex.MessageListItem.Content.replace(<ChatNotificationMessage
      key='Notification-Message'
    />, {
      if: (props) => props.message.source.attributes.notification === true,
    });
  } catch (e) {
    ErrorManager.createAndProcessError("Could not replace content for Flex component", {
      type: FlexPluginErrorType.programabelComponents,
      description: e instanceof Error ? `${e.message}` : "Could not replace content for Flex component",
      context: "Plugin.Component.MessageListItem",
      wrappedError: e
  });
  }
  
}
