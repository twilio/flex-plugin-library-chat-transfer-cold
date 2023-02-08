import ChatNotificationMessage from '..'
import React from 'react';
import { render } from '@testing-library/react';

describe('Notification message container',()=>{
    it('should render correct snapshot',()=>{
        const wrapper = render(
            <ChatNotificationMessage  />
          )
          expect(wrapper).toMatchSnapshot();
    })
})