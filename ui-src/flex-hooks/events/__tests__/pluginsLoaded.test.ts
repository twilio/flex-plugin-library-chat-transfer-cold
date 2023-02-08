import { FlexEvent } from '../../../types/manager/FlexEvent'
import pluginsLoadedHandler from '../pluginsLoaded'

describe('plugins loaded',()=>{
    it('check plugins loaded',()=>{
        const consoleLogSpy = jest.spyOn(console, 'log');
        pluginsLoadedHandler({} as unknown as FlexEvent)
        expect(consoleLogSpy).toHaveBeenCalledWith('Feature enabled: chat-transfer');
    })
})