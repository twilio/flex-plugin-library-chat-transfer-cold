import React from 'react';
import { fireEvent, render } from '@testing-library/react'
import { replaceMessageForNotifications } from '../MessageListItem'
import '@testing-library/jest-dom'
import {MessageListItem}  from '@twilio/flex-ui';

jest.mock('@twilio/flex-ui', () => {
    return {
      __esModule: true,
      MessageListItem:{
        Content:{
            replace: jest.fn()
        }
      },
      withTaskContext: (WrappedComponent) => {
        return () => ({
          render() {
            return <WrappedComponent />;
          }
        });
      },
    };
});

describe('message list item',()=>{
    let flex,manager;
    beforeEach(() => {
      flex={ MessageListItem :{
        Content:{
          replace:jest.fn()
        }
      }}
      manager = {};
    });
    it('message list item',async()=>{
        replaceMessageForNotifications(flex, manager);
        await expect(flex.MessageListItem.Content.replace).toHaveBeenCalledTimes(1);
    })
})