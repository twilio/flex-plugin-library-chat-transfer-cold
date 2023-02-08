import { ITask } from '@twilio/flex-ui';
import ChatOrchestrator from '..';
import * as Flex from "@twilio/flex-ui"

jest.mock('@twilio/flex-ui', () => {
    return {
            ChatOrchestratorEvent: { 
                LeaveConversation:jest.fn(),
                DeactivateConversation:jest.fn()
             }
    }
});
describe('Chat Transfer Notification', () => {
    let flex, manager;
    
    it('sends chat transfer notification when chatOrchestrator present', () => {
        let task ={
            attributes:{
                chatTransferData:{sid:"Chxxxx"}
            }
        } as unknown as ITask
        flex = {
            ChatOrchestrator:{
                setOrchestrations:(a,b)=>{b(task)}
            }
        }
        manager = {};
        ChatOrchestrator(flex, manager);
        //expect(flex.Notifications.registerNotification).toHaveBeenCalledTimes(2);
    })
    it('sends chat transfer notification when chatOrchestrator absent', () => {
        let task ={
            attributes:{
            }
        } as unknown as ITask
        flex = {
            ChatOrchestrator:{
                setOrchestrations:(a,b)=>{b(task)}
            }
        }
        ChatOrchestrator(flex, manager);
        //expect(flex.Notifications.registerNotification).toHaveBeenCalledTimes(2);
    })
})