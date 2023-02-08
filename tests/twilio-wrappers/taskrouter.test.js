import helpers from '../test-utils/test-helper';

describe('taskrouter', () => {
    const taskRouterTwilioClient = function (updateFunc) {
        const getWorkspace = (workspaceSid) => ({
            sid: workspaceSid,
            tasks: (_taskSid) => ({
                sid: _taskSid,
                update: updateFunc
            })
        });

        const mockTaskRouterService = {
            workspaces: getWorkspace
        };
        return {
            taskrouter: mockTaskRouterService,
        };
    };
    const taskRouterTwilioClientWithError = function (errorFunc) {
        const getWorkspace = (workspaceSid) => ({
            sid: workspaceSid,
            tasks: (_taskSid) => ({
                sid: _taskSid,
                update: errorFunc
            })
        });

        const mockTaskRouterService = {
            workspaces: getWorkspace
        };
        return {
            taskrouter: mockTaskRouterService,
        };
    };
    const updateFunc = jest.fn(() => Promise.resolve({attributes:{}}))

    const errorFunc = jest.fn(() =>
        Promise.reject({ code: 20001, message: "test error" })
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
    it('taskRouter is called successfully ', async () => {
        const { completeTask } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            reason: 'test reason',
            taskSid: 'WKxx',
            attempts: 0
        }

        await completeTask({ ...payload });
    });
    it('taskRouter should throw error', async () => {
        const { completeTask } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClientWithError(errorFunc),
        };
        const payload = {
            context: mockContext,
            reason: 'test reason',
            taskSid: 'WKxx',
            attempts: 0
        }

        await completeTask({ ...payload });
    });
    it('completeTask gives error due to invalid context ', async () => {
        const { completeTask } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = '';
        const payload = {
            context: mockContext,
            reason: 'test reason',
            taskSid: 'WKxx',
            attempts: 0
        }
        await completeTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain context object')
        });
    });
    it('completeTask gives error due to invalid reason ', async () => {
        const { completeTask } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            reason: 123,
            taskSid: 'WKxx',
            attempts: 0
        }
        await completeTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain reason string')
        });
    });
    it('completeTask gives error due to invalid attempts ', async () => {
        const { completeTask } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            reason: '123',
            taskSid: 'WKxx',
            attempts: 'test'
        }
        await completeTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
        });
    });
    it('completeTask gives error due to invalid taskSid ', async () => {
        const { completeTask } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            reason: '123',
            taskSid: 123,
            attempts: 0
        }
        await completeTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the taskSid string')
        });
    });
    it('createTask gives error due to invalid attempts ', async () => {
        const { createTask } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            workflowSid: '123',
            taskChannel: 'test task channel',
            priority: {
                overriddenPriority: 1
            },
            timeOut: { overriddenTimeout: 898 },
            attributes: {},
            attempts: 'invalid attempt'
        }
        await createTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
        });
    });
    it('createTask gives error due to invalid taskChannel', async () => {
        const { createTask } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            workflowSid: '123',
            taskChannel: 87678,
            priority: {
                overriddenPriority: 1
            },
            timeOut: { overriddenTimeout: 898 },
            attributes: {},
            attempts: 0
        }
        await createTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
        });
    });
    it('createTask gives error due to invalid attributes', async () => {
        const { createTask } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            workflowSid: '123',
            taskChannel: '87678',
            priority: {
                overriddenPriority: 1
            },
            timeOut: { overriddenTimeout: 898 },
            attributes: '',
            attempts: 0
        }
        await createTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
        });
    });
    it('updateTaskAttributes gives error due to invalid attempts', async () => {
        const { updateTaskAttributes } = require('../../functions/twilio-wrappers/taskrouter.private');
        const payload = {
            taskSid: 'TAxxx',
            attributesUpdate: 'test',
            attempts: 'test attempt'
        }
        await updateTaskAttributes({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
        });
    });
    it('updateTaskAttributes gives error due to invalid attributesUpdate', async () => {
        const { updateTaskAttributes } = require('../../functions/twilio-wrappers/taskrouter.private');
        const payload = {
            taskSid: 'TAxxx',
            attributesUpdate: 123,
            attempts: 0
        }
        await updateTaskAttributes({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain attributesUpdate JSON string')
        });
    });
    it('getQueues gives error due to invalid attempts', async () => {
        const { getQueues } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            attempts: 'test attempts'
        }
        await getQueues({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
        });
    });
    it('getWorkerChannels gives error due to invalid attempts', async () => {
        const { getWorkerChannels } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            attempts: 'test attempts',
            workerSid: 'WKxxx'
        }
        await getWorkerChannels({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
        });
    });
    it('updateWorkerChannel gives error due to invalid attempts', async () => {
        const { updateWorkerChannel } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            attempts: 'test attempts',
            workerSid: 'WKxxx',
            workerChannelSid: 'WCxx',
            capacity: 1,
            available: true
        }
        await updateWorkerChannel({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
        });
    });
    it('updateWorkerChannel gives error due to invalid capacity', async () => {
        const { updateWorkerChannel } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            attempts: 0,
            workerSid: 'WKxxx',
            workerChannelSid: 'WCxx',
            capacity: '1',
            available: true
        }
        await updateWorkerChannel({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain capacity number')
        });
    });
    it('updateWorkerChannel gives error due to invalid available', async () => {
        const { updateWorkerChannel } = require('../../functions/twilio-wrappers/taskrouter.private');

        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            attempts: 0,
            workerSid: 'WKxxx',
            workerChannelSid: 'WCxx',
            capacity: 1,
            available: 'true'
        }
        await updateWorkerChannel({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain available boolean')
        });
    });
    it('updateTask success', async () => {
        const { updateTask } = require('../../functions/twilio-wrappers/taskrouter.private');
        JSON.parse=(obj)=>obj
        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClient(updateFunc),
        };
        const payload = {
            context: mockContext,
            attempts: 0,
            taskSid:'TAxxx',
            updateParams:{}
        }
        await updateTask({ ...payload })
    });
    it('updateTask gives error due to invalid attempts', async () => {
        const { updateTask } = require('../../functions/twilio-wrappers/taskrouter.private');
        JSON.parse=(obj)=>obj
        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClientWithError(errorFunc),
        };
        const payload = {
            context: mockContext,
            attempts: '0',
            taskSid:'TAxxx',
            updateParams:{}
        }
        await updateTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the number of attempts')
        });
    });
    it('updateTask gives error due to invalid context', async () => {
        const { updateTask } = require('../../functions/twilio-wrappers/taskrouter.private');
        const payload = {
            context: '',
            attempts: 0,
            taskSid:'TAxxx',
            updateParams:{}
        }
        await updateTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain reason context object')
        });
    });
    it('updateTask gives error due to invalid taskSid', async () => {
        const { updateTask } = require('../../functions/twilio-wrappers/taskrouter.private');
        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClientWithError(errorFunc),
        };
        const payload = {
            context: mockContext,
            attempts: 0,
            taskSid:123,
            updateParams:{}
        }
        await updateTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain the taskSid string')
        });
    });
    it('updateTask gives error due to invalid taskSid', async () => {
        const { updateTask } = require('../../functions/twilio-wrappers/taskrouter.private');
        const mockContext = {
            PATH: 'mockPath',
            getTwilioClient: () => taskRouterTwilioClientWithError(errorFunc),
        };
        const payload = {
            context: mockContext,
            attempts: 0,
            taskSid:123,
            updateParams:''
        }
        await updateTask({ ...payload }).catch(err => {
            expect(err).toMatch('Invalid parameters object passed. Parameters must contain updateParams object')
        });
    });
})