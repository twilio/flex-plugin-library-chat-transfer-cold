import React from 'react';
import { fireEvent, render } from '@testing-library/react'
import { addTransferButtonToChatTaskView } from '../TaskCanvasHeader'
import '@testing-library/jest-dom'
import {TaskCanvasHeader}  from '@twilio/flex-ui';

jest.mock('@twilio/flex-ui', () => {
    return {
      __esModule: true,
      TaskCanvasHeader:{
        Content:{
            add: jest.fn()
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

describe('add transfer button',()=>{
    let flex,manager;
    beforeEach(() => {
      manager = {};
    });
    it('add transfer button to taskcanvasheader',async()=>{
        const addContentSpy = jest.spyOn(TaskCanvasHeader.Content, 'add');
        addTransferButtonToChatTaskView(flex, manager);
        await expect(addContentSpy).toHaveBeenCalledTimes(1);
    })
})