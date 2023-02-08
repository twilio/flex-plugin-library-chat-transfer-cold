import helpers from '../test-utils/test-helper';
import axios from "axios";

jest.mock(
    '../../functions/helpers/prepare-function.private.js',
    () => ({
        __esModule: true,
        prepareFlexFunction: (_, fn) => fn,
    }),
);

const mockChannelSid = 'CSxxxxx';
jest.mock("axios");
describe('Complete Task for Transfer', () => {
    const completeTaskForTransferTwilioClient = function (getQueues) {
        const getWorkspace = (workspaceSid) => ({
            sid: workspaceSid,
            taskQueues: {
                list: getQueues
            }
        });

        const mockTaskRouterService = {
            workspaces: getWorkspace
        };
        return {
            taskrouter: mockTaskRouterService,
        };
    };

    const getQueues = jest.fn(() =>
        Promise.resolve([{
            targetWorkers: "Wkxxx",
            friendlyName: "Test-name",
            sid: "SIxxx"
        }]
        )
    );

    beforeAll(() => {
        helpers.setup();
        global.Runtime._addFunction('helpers/prepare-function', './functions/helpers/prepare-function.private.js');
        global.Runtime._addFunction('helpers/parameter-validator', './functions/helpers/parameter-validator.private.js');
        global.Runtime._addFunction(
            'twilio-wrappers/retry-handler',
            './functions/twilio-wrappers/retry-handler.private.js',
        );
        global.Runtime._addFunction(
            'twilio-wrappers/taskrouter',
            './functions/twilio-wrappers/taskrouter.private.js',
        );
        global.Runtime._addFunction(
            'chat-transfer/common/chat-operations',
            './functions/chat-transfer/common/chat-operations.private.js',
        );
    });

    it('Complete Task for Transfer', async () => {
        const CompleteTaskForTransfer = require('../../functions/chat-transfer/flex/complete-task-for-transfer');
        axios.get.mockResolvedValueOnce(Promise.resolve(
            {
                data: {
                    attributes: {
                        channelSid:'CHxxx'
                    }
                },
                headers:{
                    etag:{}
                }
            }
        )
            )
        const handlerFn = CompleteTaskForTransfer.handler;

        const mockContext = {
            PATH: 'mockPath',
            ACCOUNT_SID: 'ACxxxx',
            AUTH_TOKEN: 'BAxxxx'
        };
        const mockEvent = {
            taskSid: 'TAxxxxx',
            transferType: {},
            channelSid: 'CHxxxx'
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

    it('Complete Task for Transfer error handler is called', async () => {
        const CompleteTaskForTransfer = require('../../functions/chat-transfer/flex/complete-task-for-transfer');
        const handlerFn = CompleteTaskForTransfer.handler;
        const mockEvent = {
            taskSid: 'TAxxxxx',
            transferType: {},
            channelSid: 'CHxxxx'
        };

        const mockResponse = new Twilio.Response();
        const mockCallbackObject = jest.fn();
        const mockErrorObject = jest.fn();
        await handlerFn({}, {}, mockCallbackObject, mockResponse, mockErrorObject);
        expect(mockErrorObject.mock.calls.length).toBe(1);
    });
});
