import helpers from '../test-utils/test-helper';

jest.mock(
    '../../functions/helpers/prepare-function.private.js',
    () => ({
        __esModule: true,
        prepareFlexFunction: (_, fn) => fn,
    }),
);

const mockChannelSid = 'CSxxxxx';
describe('Update worker channel', () => {
    const updateWorkerChannelTwilioClient = function (updateWorkerChannels) {
        const getWorkspace = (workspaceSid) => ({
            sid: workspaceSid,
            workers: (_workerSid) => ({
                sid: _workerSid,
                workerChannels: (_workerChannelSid) => ({
                    sid: _workerChannelSid,
                    update: updateWorkerChannels
                })
            })
        });

        const mockTaskRouterService = {
            workspaces: getWorkspace,
        };
        return {
            taskrouter: mockTaskRouterService,
        };
    };

    const updateWorkerChannels = jest.fn(() =>
        Promise.resolve({
            workerChannelCapacity: {}
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
        const UpdateTaskAttributes = require('../../functions/flex/taskrouter/update-worker-channel');
        const handlerFn = UpdateTaskAttributes.handler;

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => updateWorkerChannelTwilioClient(updateWorkerChannels),
        };
        const mockEvent = {
            TokenResult: {
                roles: ['supervisor']
            },
            workerSid: 'CHxxxxx',
            workerChannelSid: 'WCxxx',
            capacity:'1',
            available:'true'
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
    it('updateworkerchannel is called successfully roles include admin', async () => {
        const UpdateTaskAttributes = require('../../functions/flex/taskrouter/update-worker-channel');
        const handlerFn = UpdateTaskAttributes.handler;

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => updateWorkerChannelTwilioClient(updateWorkerChannels),
        };
        const mockEvent = {
            TokenResult: {
                roles: ['test']
            },
            workerSid: 'CHxxxxx',
            workerChannelSid: 'WCxxx',
            capacity:'1',
            available:'true'
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

    it('get-worker-channel error handler is called', async () => {
        const UpdateTaskAttributes = require('../../functions/flex/taskrouter/update-worker-channel');
        const handlerFn = UpdateTaskAttributes.handler;
        const mockResponse = new Twilio.Response();
        const mockCallbackObject = jest.fn();

        const mockErrorObject = jest.fn();
        await handlerFn({}, {}, mockCallbackObject, mockResponse, mockErrorObject);
        expect(mockErrorObject.mock.calls.length).toBe(1);
    });
    it('get-worker-channel error handler is called due to invalid context ', async () => {
        const UpdateTaskAttributes = require('../../functions/flex/taskrouter/update-worker-channel');
        const handlerFn = UpdateTaskAttributes.handler;
        const mockResponse = new Twilio.Response();
        const mockCallbackObject = jest.fn();
        const mockContext = 'invalid context';
        const mockEvent = {
            TokenResult: {
                roles: ['supervisor']
            },
            workerSid: 'CHxxxxx',
            workerChannelSid: 'WCxxx',
            capacity: '1',
            available: 'true'
        };
        const mockErrorObject = jest.fn();
        await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
        expect(mockErrorObject.mock.calls.length).toBe(1);
    });
    it('get-worker-channel error handler is called due to invalid workerSid ', async () => {
        const UpdateTaskAttributes = require('../../functions/flex/taskrouter/update-worker-channel');
        const handlerFn = UpdateTaskAttributes.handler;
        const mockResponse = new Twilio.Response();
        const mockCallbackObject = jest.fn();
        const mockContext = {};
        const mockEvent = {
            TokenResult: {
                roles: ['supervisor']
            },
            workerSid: 123,
            workerChannelSid: 'WCxxx',
            capacity: '1',
            available: 'true'
        };
        const mockErrorObject = jest.fn();
        await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
        expect(mockErrorObject.mock.calls.length).toBe(1);
    });
    it('get-worker-channel error handler is called due to invalid workerChannelSid ', async () => {
        const UpdateTaskAttributes = require('../../functions/flex/taskrouter/update-worker-channel');
        const handlerFn = UpdateTaskAttributes.handler;
        const mockResponse = new Twilio.Response();
        const mockCallbackObject = jest.fn();
        const mockContext = {};
        const mockEvent = {
            TokenResult: {
                roles: ['supervisor']
            },
            workerSid: 'WKxxx',
            workerChannelSid: 123,
            capacity: '1',
            available: 'true'
        };
        const mockErrorObject = jest.fn();
        await handlerFn(mockContext, mockEvent, mockCallbackObject, mockResponse, mockErrorObject);
        expect(mockErrorObject.mock.calls.length).toBe(1);
    });
});
