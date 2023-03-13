import ChatTransferService from '../ChatTransferService';
import * as Flex from '@twilio/flex-ui';
import fetch from 'jest-fetch-mock';
import { TransferOptions } from '../../flex-hooks/actions/TransferTask';

describe('completeTransferredTask', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  it('ends the conference successfully', async () => {
    fetch.mockResponseOnce(JSON.stringify({ success:true }));
    const task = {
        attributes:{
            channelSid:"CHxxx",
            chatTransferData:{
                transferType:"COLD"
            }
        },
        taskSid:"TAxxx"
    } as unknown as Flex.ITask
    const response = await ChatTransferService.completeTransferredTask(task);
    expect(response).toBe(true);
  });

//   it('throws error when trying to end conference', async () => {
//     fetch.mockRejectOnce('Mock Error string');
//     let err = null;
//     try {
//       await ConferenceService.setEndConferenceOnExit('CFxxxxxx', 'PSxxxxxx', true);
//     } catch (error) {
//       err = error;
//     }
//     expect(err).toEqual('Mock Error string');
//   });
});

describe('execute chat transfer', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  const task = {
    attributes:{
        channelSid:"CHxxx",
        chatTransferData:{
            transferType:"COLD"
        }
    },
    taskSid:"TAxxx"
} as unknown as Flex.ITask
const options = {
    mode:"COLD"
} as unknown as TransferOptions
  // it('execute chat transfer successfully', async () => {
  //   ChatTransferService
  //   fetch.mockResponseOnce(JSON.stringify({ callSid: 'CSxxxxxx' }));
  //   const once = jest.fn();
  //   const response = await ChatTransferService.executeChatTransfer(task, 'WKxxxx', options);
  //   expect(response).toBe('CSxxxxxx');
  // });
});

describe('createTransferTask', () => {
  beforeAll(() => {
    fetch.enableMocks();
  });
  beforeEach(() => {
    fetch.resetMocks();
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  const task = {
    attributes:{
        channelSid:"CHxxx",
        chatTransferData:{
            transferType:"COLD"
        }
    },
    taskSid:"TAxxx"
} as unknown as Flex.ITask
  it('createTransferTask called successfully', async () => {
    const res = { callSid: 'CSxxxxxx' }
    fetch.mockResponseOnce(JSON.stringify(res));
    const response = await ChatTransferService.createTransferTask(task, 'WKxxx','WQxxx');
    expect(response).toEqual(res)
  });

//   it('throws error when trying to add a participant to the conference', async () => {
//     fetch.mockRejectOnce('Mock Error string');
//     let err = null;
//     try {
//       await ConferenceService.holdParticipant('CFxxxxxx', 'PSxxxxxx');
//     } catch (error) {
//       err = error;
//     }
//     expect(err).toEqual('Mock Error string');
//   });
});

// describe('unholdParticipant', () => {
//   beforeAll(() => {
//     fetch.enableMocks();
//   });
//   beforeEach(() => {
//     fetch.resetMocks();
//     jest.spyOn(console, 'log').mockImplementation(() => {});
//     jest.spyOn(console, 'warn').mockImplementation(() => {});
//     jest.spyOn(console, 'error').mockImplementation(() => {});
//   });
//   it('adds participant to the conference successfully', async () => {
//     fetch.mockResponseOnce(JSON.stringify({ callSid: 'CSxxxxxx' }));
//     const response = await ConferenceService.unholdParticipant('CFxxxxxx', 'PSxxxxxx');
//     expect(response).toBe('CSxxxxxx');
//   });

//   it('throws error when trying to add a participant to the conference', async () => {
//     fetch.mockRejectOnce('Mock Error string');
//     let err = null;
//     try {
//       await ConferenceService.unholdParticipant('CFxxxxxx', 'PSxxxxxx');
//     } catch (error) {
//       err = error;
//     }
//     expect(err).toEqual('Mock Error string');
//   });
// });

// describe('removeParticipant', () => {
//   beforeAll(() => {
//     fetch.enableMocks();
//   });
//   beforeEach(() => {
//     fetch.resetMocks();
//     jest.spyOn(console, 'log').mockImplementation(() => {});
//     jest.spyOn(console, 'warn').mockImplementation(() => {});
//     jest.spyOn(console, 'error').mockImplementation(() => {});
//   });
//   it('adds participant to the conference successfully', async () => {
//     fetch.mockResponseOnce(JSON.stringify({ participantSid: 'PSxxxxxx' }));
//     const response = await ConferenceService.removeParticipant('CFxxxxxx', 'PSxxxxxx');
//     expect(response).toBe('PSxxxxxx');
//   });

//   it('throws error when trying to add a participant to the conference', async () => {
//     fetch.mockRejectOnce('Mock Error string');
//     let err = null;
//     try {
//       await ConferenceService.removeParticipant('CFxxxxxx', 'PSxxxxxx');
//     } catch (error) {
//       err = error;
//     }
//     expect(err).toEqual('Mock Error string');
//   });
// });

// describe('getCallProperties', () => {
//   beforeAll(() => {
//     fetch.enableMocks();
//   });
//   beforeEach(() => {
//     fetch.resetMocks();
//     jest.spyOn(console, 'log').mockImplementation(() => {});
//     jest.spyOn(console, 'warn').mockImplementation(() => {});
//     jest.spyOn(console, 'error').mockImplementation(() => {});
//   });
//   it('gives call properties successfully', async () => {
//     fetch.mockResponseOnce(JSON.stringify({ callProperties: { callSid: 'CSxxxxxx' } }));
//     const response = await ConferenceService.getCallProperties('CFxxxxxx');
//     expect(response).toEqual({ callSid: 'CSxxxxxx' });
//   });

//   it('throws error when trying to get properties', async () => {
//     fetch.mockRejectOnce('Mock Error string');
//     let err = null;
//     try {
//       await ConferenceService.getCallProperties('CFxxxxxx');
//     } catch (error) {
//       err = error;
//     }
//     expect(err).toEqual('Mock Error string');
//   });
// });
