// import PrepareFunction from '../../../serverless/src/functions/helpers/prepare-function.private';
import helpers from '../test-utils/test-helper';

describe('Prepare Flex Function', () => {
  const mockFucntionValidatorObject = jest.fn();
  
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction('helpers/parameter-validator', './functions/helpers/parameter-validator.private.js');
    jest.mock('twilio-flex-token-validator', () => {
      return {
        functionValidator: mockFucntionValidatorObject,
      };
    });
  });

  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  it('prepareFlexFunction is called successfully ', () => {
    const PrepareFunction = require('../../functions/helpers/prepare-function.private');
    const spyMethod = jest.spyOn(PrepareFunction, 'prepareFlexFunction');
    const mockHandlerFn = jest.fn();
    const requiredParameters = [
      { key: 'taskSid', purpose: 'unique ID of task to update' },
      { key: 'to', purpose: 'number to add to the conference' },
      { key: 'from', purpose: 'caller ID to use when adding to the conference' },
    ];

    PrepareFunction.prepareFlexFunction(requiredParameters, mockHandlerFn);
    expect(spyMethod).toHaveBeenCalledTimes(1);
    expect(mockFucntionValidatorObject.mock.calls.length).toBe(1);
  });
});

describe('Prepare Function', () => {
  beforeAll(() => {
    helpers.setup();
    global.Runtime._addFunction('helpers/parameter-validator', './functions/helpers/parameter-validator.private.js');
  });
  beforeEach(() => {
    jest.spyOn(console, 'log').mockImplementation(() => {});
    jest.spyOn(console, 'warn').mockImplementation(() => {});
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });
  const mockContext = {
    PATH: 'mockPath',
  };
  const mockEvent = {
    taskSid: 'TSxxxxx',
    to: '+91xxxxxx',
    from: '+1xxxxxx',
  };

  it('prepareFlexFunction is called successfully ', () => {
    const PrepareFunction = require('../../functions/helpers/prepare-function.private');
    const requiredParameters = [
      { key: 'taskSid', purpose: 'unique ID of task to update' },
      { key: 'to', purpose: 'number to add to the conference' },
      { key: 'from', purpose: 'caller ID to use when adding to the conference' },
    ];
    const mockCallbackObject = jest.fn();
    const mockHandlerFn = (context, event, callback, response, handleError) => {
      expect(response).toBeInstanceOf(Twilio.Response);
      expect(context).toEqual(mockContext);
      expect(event).toEqual(mockEvent);
    };
    PrepareFunction.prepareFunction(mockContext, mockEvent, mockCallbackObject, requiredParameters, mockHandlerFn);
  });

  it('prepareFlexFunction returns error 400', () => {
    const PrepareFunction = require('../../functions/helpers/prepare-function.private');
    const requiredParameters = [
      { key: 'taskSid', purpose: 'unique ID of task to update' },
      { key: 'to', purpose: 'number to add to the conference' },
      { key: 'from', purpose: 'caller ID to use when adding to the conference' },
      { key: 'mockKey', purpose: 'mock' },
    ];
    const mockCallbackObject = jest.fn();
    const mockHandlerFn = (context, event, callback, response, handleError) => {
      expect(response).toBeInstanceOf(Twilio.Response);
      expect(response._statusCode).toEqual(400);
      expect(result._body.message).toBe('(mockPath) Missing mockKey: mock');
    };
    PrepareFunction.prepareFunction(mockContext, mockEvent, mockCallbackObject, requiredParameters, mockHandlerFn);
  });

  it('prepareFlexFunction error handler', () => {
    const PrepareFunction = require('../../functions/helpers/prepare-function.private');
    const requiredParameters = [
      { key: 'taskSid', purpose: 'unique ID of task to update' },
      { key: 'to', purpose: 'number to add to the conference' },
      { key: 'from', purpose: 'caller ID to use when adding to the conference' },
    ];
    const mockCallbackObject = (_err, response) => {
      expect(response).toBeInstanceOf(Twilio.Response);
      expect(response._statusCode).toEqual(500);
      expect(response._body.message).toBe('mockError');
    };
    const mockHandlerFn = (context, event, callback, response, handleError) => {
      handleError('mockError');
    };
    PrepareFunction.prepareFunction(mockContext, mockEvent, mockCallbackObject, requiredParameters, mockHandlerFn);
  });
});
