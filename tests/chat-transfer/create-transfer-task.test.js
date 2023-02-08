import helpers from '../test-utils/test-helper';

jest.mock(
    '../../functions/helpers/prepare-function.private.js',
    () => ({
        __esModule: true,
        prepareFlexFunction: (_, fn) => fn,
    }),
);

describe('create transfer task', () => {
    const getQueuesTwilioClient = function (createTask) {
        const getWorkspace = (workspaceSid) => ({
            sid: workspaceSid,
            tasks:{
                create:createTask
            }
        });

        const mockTaskRouterService = {
            workspaces: getWorkspace,
            taskQueues: (_channelSid) => ({
                list: getQueues,
            }),
        };
        return {
            taskrouter: mockTaskRouterService,
        };
    };

    const createTask = jest.fn(() =>
        Promise.resolve({
            sid:'Sixxx',
            attributes:{}
        }
        )
    );
    beforeAll(() => {
        helpers.setup();
        global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
        global.Runtime._addFunction(
            'twilio-wrappers/taskrouter',
            './functions/twilio-wrappers/taskrouter.private.js',
        );
        global.Runtime._addFunction(
            'chat-transfer/common/chat-operations',
            './functions/chat-transfer/common/chat-operations.private.js',
        );
        global.Runtime._addFunction(
            'twilio-wrappers/retry-handler',
            './functions/twilio-wrappers/retry-handler.private.js',
          );
    });

    it('createTransferTask is called successfully ', async () => {
        const CreateTransferTask = require('../../functions/chat-transfer/flex/create-transfer-task');
        const handlerFn = CreateTransferTask.handler;
        JSON.parse = (obj) => obj;
        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => getQueuesTwilioClient(createTask),
        };
        const mockEvent = {
            conversationId:'CHxxx',
            jsonAttributes:{
                conversations:{}
            },
            transferTargetSid:'WKxxxx',
            transferQueueName:'test queue',
            ignoreWorkerContactUri:'http:tst0uri.io',
            // workflowSid: {
            //     overriddenWorkflowSid:'WFxxx'
            // },
            workflowSid:'WFxxx',
            timeout: {
                overriddenTimeout:86400
            },
            priority: {
                overriddenPriority:1
            },
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
    it('createTransferTask gives error due to invalid context ', async () => {
        const CreateTransferTask = require('../../functions/chat-transfer/flex/create-transfer-task');
        const handlerFn = CreateTransferTask.handler;
        JSON.parse = (obj) => obj;
        const mockContext = 'test context';
        const mockEvent = {
            conversationId:'CHxxx',
            jsonAttributes:{
                conversations:{}
            },
            transferTargetSid:'WKxxxx',
            transferQueueName:'test queue',
            ignoreWorkerContactUri:'http:tst0uri.io',
            // workflowSid: {
            //     overriddenWorkflowSid:'WFxxx'
            // },
            workflowSid:'WFxxx',
            timeout: {
                overriddenTimeout:86400
            },
            priority: {
                overriddenPriority:1
            },
        };
        const mockResponse = new Twilio.Response();
        const mockErrorObject = jest.fn(() => Promise.resolve());
        const mockCallbackObject = jest.fn();
        await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
        expect(mockErrorObject.mock.calls.length).toBe(1);
    });
    it('createTransferTask gives error due to invalid workflow sid ', async () => {
        const CreateTransferTask = require('../../functions/chat-transfer/flex/create-transfer-task');
        const handlerFn = CreateTransferTask.handler;
        JSON.parse = (obj) => obj;
        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => getQueuesTwilioClient(createTask),
        };
        const mockEvent = {
            conversationId:'CHxxx',
            jsonAttributes:{
                conversations:{}
            },
            transferTargetSid:'WKxxxx',
            transferQueueName:'test queue',
            ignoreWorkerContactUri:'http:tst0uri.io',
            // workflowSid: {
            //     overriddenWorkflowSid:'WFxxx'
            // },
            workflowSid:123,
            timeout: {
                overriddenTimeout:86400
            },
            priority: {
                overriddenPriority:1
            },
        };
        const mockResponse = new Twilio.Response();
        const mockErrorObject = jest.fn(() => Promise.resolve());
        const mockCallbackObject = jest.fn();
        await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
        expect(mockErrorObject.mock.calls.length).toBe(1);
    });
})