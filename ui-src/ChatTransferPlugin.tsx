import * as Flex from '@twilio/flex-ui';
import React from 'react';
import { FlexPlugin } from '@twilio/flex-plugin';

import CustomizePasteElements from './utils/PasteThemeProvider';
import { interceptTransferOverrideForChatTasks } from './flex-hooks/actions/TransferTask';
import ChatTransferNotifications from './flex-hooks/notifications/ChatTransfer';
import ChatTransferStrings from './flex-hooks/strings/ChatTransfer'

import ChatNotificationMessage from './components/ChatNotificationMessage';
import { interceptTransferredChatTasks } from './flex-hooks/actions/CompleteTask';
import { announceOnChannelWhenLeaving } from './flex-hooks/actions/WrapupTask';
import chatOrchestrator from './flex-hooks/chat-orchestrator';
import { replaceMessageForNotifications } from './flex-hooks/components/MessageListItem';
import { addTransferButtonToChatTaskView } from './flex-hooks/components/TaskCanvasHeader';

const PLUGIN_NAME = 'ChatTransferPlugin';

export default class ChatTransferPlugin extends FlexPlugin {
  constructor() {
    super(PLUGIN_NAME);
  }

  /**
   * This code is run when your plugin is being started
   * Use this to modify any UI components or attach to the actions framework
   *
   * @param flex { typeof Flex }
   * @param manager { Flex.Manager }
   */
  init(flex: typeof Flex, manager: Flex.Manager) {
    const initializers = [
      interceptTransferredChatTasks,
      interceptTransferOverrideForChatTasks,
      announceOnChannelWhenLeaving,
      chatOrchestrator,
      replaceMessageForNotifications,
      addTransferButtonToChatTaskView,
      CustomizePasteElements,
      ChatTransferNotifications,
    ];

    initializers.forEach((initializer) => initializer(flex, manager));
  }
}
