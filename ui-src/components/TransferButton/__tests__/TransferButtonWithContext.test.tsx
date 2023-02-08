import React from 'react';
import {} from "jest"
import { fireEvent, render } from '@testing-library/react'
import  TransferButton  from '..';


jest.mock('@twilio/flex-ui', () => {
    return {
      __esModule: true,
      withTaskContext: (WrappedComponent) => {
        return () => ({
          render() {
            return <WrappedComponent />;
          }
        });
      },
    };
  });

  describe('TransferButton with task context',()=>{
    it('should render correct snapshot', () => {
        const wrapper = render(
          <TransferButton />
        )
        expect(wrapper).toMatchSnapshot();
      });
  })