import helpers from '../test-utils/test-helper';

jest.mock(
  '../../functions/helpers/prepare-function.private.js',
  () => ({
    __esModule: true,
    prepareFlexFunction: (_, fn) => fn,
  }),
);

describe('Update channel attributes', () => {
    const getQueuesTwilioClient = function (taskUpdate) {
      const getWorkspace = (workspaceSid) => ({
          sid: workspaceSid,
          tasks:()=>({
            update:taskUpdate
          })
        });
  
      const mockTaskRouterService = {
          workspaces:getWorkspace
      };
      return {
          taskrouter: mockTaskRouterService,
      };
    };
  
    const taskUpdate = jest.fn(() =>
     Promise.resolve({
         attributes:{}
        })
    );
  
    beforeAll(() => {
      helpers.setup();
      global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
      global.Runtime._addFunction('helpers/parameter-validator', './functions/helpers/parameter-validator.private.js');
      global.Runtime._addFunction(
        'twilio-wrappers/programmable-voice',
        './functions/twilio-wrappers/programmable-chat.private.js',
      );
      global.Runtime._addFunction(
        'twilio-wrappers/retry-handler',
        './functions/twilio-wrappers/retry-handler.private.js',
      );
      global.Runtime._addFunction(
        'twilio-wrappers/taskrouter',
        './functions/twilio-wrappers/taskrouter.private.js',
      );
    });
  
    it('getQueues is called successfully ', async () => {
        
      const GetQueues = require('../../functions/flex/taskrouter/update-task-assignment-status');
      console.log(GetQueues)
      const handlerFn = GetQueues.handler;
  
      const mockContext = {
        PATH: 'mockPath',
        getTwilioClient: () => getQueuesTwilioClient(taskUpdate),
      };
      const mockEvent = {
        taskSid: 'TAxxxxx',
          assignmentStatus: 'test status'
      };
  
      const mockResponse = new Twilio.Response();
      const mockErrorObject = jest.fn(() => Promise.resolve());
  
      const mockCallbackObject = (_err, response) => {
        expect(response).toBeInstanceOf(Twilio.Response);
        expect(response._statusCode).toEqual(200);
        expect(response._body.callSid).toBe(mockCallSid);
      };
      await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
    });
  
    it('getQueues error handler is called', async () => {
      const GetQueues = require('../../functions/flex/taskrouter/update-task-assignment-status');
      const handlerFn = GetQueues.handler;
      const mockEvent = {
        taskSid: 'TAxxxxx',
        assignmentStatus: 'test status'
      };
  
      const mockResponse = new Twilio.Response();
      const mockCallbackObject = jest.fn();
      console.log(handlerFn)
      const mockErrorObject = jest.fn();
      await handlerFn({}, {}, mockCallbackObject, mockResponse, mockErrorObject);
      expect(mockErrorObject.mock.calls.length).toBe(1);
    });
  });