import ChatNotification from '../ChatTransfer';
import * as Flex from "@twilio/flex-ui"
jest.mock('@twilio/flex-ui', () => {
    return {
        Flex: {
            Notifications: { registerNotification: jest.fn() }
        }
    }
});
describe('Chat Transfer Notification', () => {
    let flex, manager;
    beforeEach(() => {
        flex = {
            Notifications:{
                registerNotification:jest.fn()
            },
            NotificationType: {
                warning: 'warn'
            },
        }
        manager = {};
    });
    it('sends chat transfer notification', () => {
        //const registerNotificationSpy = jest.spyOn(Flex.Notifications, 'registerNotification');
        ChatNotification(flex, manager);
        expect(flex.Notifications.registerNotification).toHaveBeenCalledTimes(2);
    })
})