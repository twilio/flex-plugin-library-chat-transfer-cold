import PasteThemeProvider from '../PasteThemeProvider';

describe('paste theme provider',()=>{
    let flex, manager;
    manager={}

    it('paste theme provider test',()=>{
        
        flex = {
            setProviders:jest.fn()
        }
        const setProviderSpy = flex.setProviders;
        PasteThemeProvider(flex, manager)
        expect(setProviderSpy).toHaveBeenCalled();
    })
})