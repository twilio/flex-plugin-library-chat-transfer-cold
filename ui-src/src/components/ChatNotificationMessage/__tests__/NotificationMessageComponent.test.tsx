import React from "react";
import NotificationMessage from "../NotificationMessageComponent";
import { fireEvent, render } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Notification message',()=>{
    const props = {
        message:{
            index:1,
            source:{
                body:"xyz"
            }
        }
    };
    it('should render correct snapshot',()=>{
        const wrapper = render(
            <NotificationMessage {...props} />
          )
          expect(wrapper).toMatchSnapshot();
    })
})