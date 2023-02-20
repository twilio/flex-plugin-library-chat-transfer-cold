
import ApiService from '../ApiService';
import * as Flex from '@twilio/flex-ui';
import { EncodedParams } from '../../types/Params';
import fetch from 'jest-fetch-mock';

// NOTE: Make dummy class to extend ApiService because it's abstract
class Test extends ApiService {
  // NOTE: Make helper function to provide access to protected class members
  testHasManagerClassMember(): boolean {
    return this.manager !== undefined;
  }

  // NOTE: Make helper function to provide access to protected class members
  testBuildBody(encodedParams: EncodedParams): string {
    return this.buildBody(encodedParams);
  }

  testFetchJsonWithReject<T>(url: string, config: RequestInit, attempts: number): Promise<T> {
    return this.fetchJsonWithReject(url, config, attempts);
  }
}

describe('utils/common/ApiService', () => {
  const TestService = new Test();

  it('should provide access to the Flex Manager instance', () => {
    expect(TestService.testHasManagerClassMember()).toBe(true);
  });

  // it('should provide access to the configured serverless domain', () => {
  //   const { serviceConfiguration: { ui_attributes } } = Flex.Manager.getInstance();
  //   const { serverless_functions_domain } = ui_attributes as UIAttributes;
  //   expect(TestService.serverlessDomain).toBe(serverless_functions_domain);
  // });

  it('should build encoded params into a string to use as the body for serverless reqeusts', () => {
    const encodedParams: EncodedParams = {
      testParam1: encodeURIComponent('testParam1ToBeEncoded'),
      testParam2: encodeURIComponent('testParam2ToBeEncoded'),
      testParamToDrop: undefined,
    };

    const body = TestService.testBuildBody(encodedParams);

    expect(body).toBe('testParam1=testParam1ToBeEncoded&testParam2=testParam2ToBeEncoded');
  });

  describe('fetchJsonWithReject', () => {
    beforeAll(() => {
      fetch.enableMocks();
    });
    beforeEach(() => {
      fetch.resetMocks();
    });
    it('should return json response', async () => {
      fetch.mockResponseOnce(JSON.stringify({ data: 'Mock data' }));
      const res = await TestService.testFetchJsonWithReject('mockURL', {}, 0);
      expect(res).toEqual({ data: 'Mock data' });
      fetch.resetMocks();
    });

    it('should throw error', async () => {
      fetch.mockReject(new Error('mock error'));
      TestService.testFetchJsonWithReject('mockURL', {}, 0).catch((err) => {
        expect(err.message).toEqual('mock error');
      });
      fetch.resetMocks();
    });

    // it('should retry on error', async () => {
    //   fetch.mockReject({ status: 429 });
    //   const fetchSpy = jest.spyOn(ApiService.prototype, 'fetchJsonWithReject');
    //   try {
    //     await TestService.testFetchJsonWithReject('mockURL', {}, 0);
    //   } catch (e) {
    //     expect(fetchSpy).toHaveBeenCalledTimes(11);
    //   }
    // });
  });
});
