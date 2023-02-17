import React from 'react';
import styled from '@emotion/styled';
import { EventEmitter } from 'events';
import { getMockedServiceConfiguration } from '../../test-utils/flex-service-configuration'
// We need to mock anything our plugin uses from @twilio/flex-ui here

class WorkerClient extends EventEmitter {
  constructor() {
    super();
    this.sid = 'mockWorkerSid';
    this.attributes = {};
    this.reservations = new Map();
  }
}

class Manager {
  get serviceConfiguration() {
    return getMockedServiceConfiguration();
  }

  constructor() {
    this.events = new EventEmitter();
    this.insightsClient = {
      instantQuery: () => Promise.resolve({
        once: jest.fn(),
        search: jest.fn()
      })
    }
    this.workerClient = new WorkerClient();
    this.conversationsClient = {
      getConversationBySid:()=>Promise.resolve({
        attributes:{
          associatedTasks:{"TAxxx":""}
        }
      })
    }
    this.store = {
      addReducer: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(),
    };
    this.user = {
      token: 'mockedToken',
    };
  }
  getInstance() {
    return this;
  }
}

class ConferenceParticipant {
  constructor(source, callSid) {
    this.source = source;
    this.callSid = callSid;
    this.participantType = source.participant_type;
  }
}

class Actions {
  eventListeners = {};

  constructor() {
    this.invokeAction = jest.fn(async (name, payload) => {
      const lifecycle = [
        this.eventListeners[`before${name}`] || [],
        this.eventListeners[name] || [],
        this.eventListeners[`after${name}`] || [],
      ];
      try {
        await Promise.all(
          lifecycle[0].map((listener) => {
            return new Promise(async (resolve, reject) => {
              await listener(payload, () => {
                // reject(`Action ${name} cancelled by before event`);
              });
              resolve();
            });
          }),
        );
      } catch (e) {
        throw new Error(e);
      }
      await Promise.all(lifecycle[1].map(async (listener) => await listener(payload)));
      await Promise.all(lifecycle[2].map(async (listener) => await listener(payload)));
    });

    this.addListener = jest.fn((event, listener) => {
      if (this.eventListeners[event]) {
        this.eventListeners[event].push(listener);
      } else {
        this.eventListeners[event] = [listener];
      }
    });

    this.removeAllListeners = jest.fn((event) => {
      if (event) {
        delete this.eventListeners[event];
      } else {
        this.eventListeners = {};
      }
    });
  }
}

class Notifications {
  registeredNotifications = new Map();

  constructor() { }

  registerNotification(notification) {
    this.registeredNotifications.set(notification.id, notification);
  }

  showNotification = jest.fn();
  dismissNotificationById = jest.fn();
}

module.exports = {
  CRMContainer: {
    Content: {
      replace: jest.fn(),
    },
  },
  CallCanvas: {
    Content: {
      add: jest.fn(),
      remove: jest.fn(),
    },
  },
  CallCanvasActions: {
    Content: {
      add: jest.fn(),
      remove: jest.fn(),
    },
  },
  ParticipantsCanvas: {
    Content: {
      add: jest.fn(),
      remove: jest.fn(),
    },
  },
  ParticipantCanvas: {
    Content: {
      add: jest.fn(),
      remove: jest.fn(),
    },
    ListItem: {
      Content: {
        add: jest.fn(),
        remove: jest.fn(),
      },
    },
  },
  AgentDesktopView: {
    defaultProps: {
      splitterOptions: {},
    },
  },
  Actions: new Actions(),
  Manager: new Manager(),
  Notifications: new Notifications(),
  NotificationType: {
    warning: 'warning',
    error: 'error',
  },
  templates: {
    WorkerDirectorySearchPlaceholder: () => '',
    WarmTransferTooltip: () => '',
    ColdTransferTooltip: () => '',
    CallParticipantStatusLive: () => 'CallParticipantStatusLive',
    CallParticipantStatusOnHold: () => 'CallParticipantStatusOnHold',
    CallParticipantStatusLeft: () => 'CallParticipantStatusLeft',
    CallParticipantStatusConnecting: () => 'CallParticipantStatusConnecting',
    CallParticipantStatusKickConfirmation: () => 'CallParticipantStatusKickConfirmation',
  },
  useFlexSelector: jest.fn(() => {
    return [
      { status: 'recently_left', callSid: 'CSxxxxxx', participantType: 'worker' },
      { status: 'recently_left', callSid: 'CSxxxxxx1', participantType: 'worker' },
    ];
  }),
  NotificationBar: {
    Action: () => <React.Fragment></React.Fragment>,
  },
  TaskHelper: {
    canHold: () => {
      return true;
    },
    isChatBasedTask: () => {
      return true;
    },
    isCBMTask: () => {
      return false;
    }
  },
  ChatOrchestrator: {
    orchestrateCompleteTask: jest.fn()
  },
  StateHelper: {
    getTaskByTaskrouterTaskSid: (props) => jest.fn(),
  },
  styled: styled,
  Template: ({ source }) => ({
    render() {
      const content = source();
      return (
        <React.Fragment>
          <span>{content}</span>
        </React.Fragment>
      );
    },
  }),
  SideLink: () => ({
    render() {
      return <React.Fragment />;
    },
  }),
  Icon: () => ({
    render() {
      return <React.Fragment />;
    },
  }),
  IconButton: (props) => <button {...props} />,
  FlexBox: () => ({
    render() {
      return <React.Fragment />;
    },
  }),
  FlexBoxColumn: () => ({
    render() {
      return <React.Fragment />;
    },
  }),
  ConferenceParticipant: ConferenceParticipant,
  withTaskContext: (WrappedComponent) => {
    return () => ({
      render() {
        return <WrappedComponent />;
      },
    });
  },
  withTheme: (WrappedComponent) => {
    return () => ({
      render() {
        return <WrappedComponent theme={{}} />;
      },
    });
  },
};
