import ProgrammableChatService from '../ProgrammableChatService';
import fetch from 'jest-fetch-mock';

const originalEnv = process.env;
  process.env = {
    ...originalEnv,
    FLEX_APP_SERVERLESS_FUNCTONS_DOMAIN :'https://test-serverless-domain.io',
  };
describe('programmable chat service', () => {
    beforeAll(() => {
        fetch.enableMocks();
      });
      beforeEach(() => {
        fetch.resetMocks();
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
      });
    it('programmable chat service', async () => {
        fetch.mockResponseOnce(JSON.stringify({ success:true }));
        const channelSid = "CHxxxx";
        const attributes = {
            a: "test",
            b: "test"
        }
        const r = await ProgrammableChatService.updateChannelAttributes(channelSid, attributes)
    })
})