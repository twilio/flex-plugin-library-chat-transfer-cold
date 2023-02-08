// import { CallbackNotification } from "../../flex-hooks/notifications/Callback";
import * as Flex from '@twilio/flex-ui';
import TaskRouterService from '../TaskRouterService'
import { setServiceConfiguration } from '../../../ui-src/test-utils/flex-service-configuration';
// import { Actions } from "../../flex-hooks/states/";
import fetch from 'jest-fetch-mock';


describe('taskrouter service',()=>{
    beforeAll(() => {
        fetch.enableMocks();
      });
      beforeEach(() => {
        fetch.resetMocks();
        //jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
      });
    it('updateTaskAttributes called successfully',async()=>{
        fetch.mockResponseOnce(JSON.stringify({ success:true }));
        const response = await TaskRouterService.updateTaskAttributes('TAxxx',{test:'value'});
        expect(response).toBe(true);
    })
    it('updateTaskAssignmentStatus called successfully',async()=>{
        fetch.mockResponseOnce(JSON.stringify({ success:true }));
        const response = await TaskRouterService.updateTaskAssignmentStatus('TAxxx','completed');
        expect(response).toBe(true);
    })
    it('getQueues called successfully',async()=>{
        fetch.mockResponseOnce(JSON.stringify({ success:true, queues:[] }));
        const response = await TaskRouterService.getQueues(true);
        expect(response).toEqual([]);
    })
    it('getWorkerChannels called successfully',async()=>{
        fetch.mockResponseOnce(JSON.stringify({ success:true, workerChannels:'test' }));
        const response = await TaskRouterService.getWorkerChannels('WKxxxxx');
        expect(response).toBe('test');
    })
    it('updateWorkerChannel called successfully',async()=>{
        fetch.mockResponseOnce(JSON.stringify({ success:true }));
        const response = await TaskRouterService.updateWorkerChannel('WKxxxxx','WCxxxx',1,true);
        expect(response).toBe(true);
    })
})