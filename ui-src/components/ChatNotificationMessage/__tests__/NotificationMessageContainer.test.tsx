import React from 'react';
import { render } from '@testing-library/react';
import NotificationMessageComponent from "../NotificationMessageContainer"

describe('Notification message container',()=>{
    it('should render correct snapshot',()=>{
        const wrapper = render(
            <NotificationMessageComponent  />
          )
          expect(wrapper).toMatchSnapshot();
    })
})