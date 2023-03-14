import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { TransferButton } from '../TransferButton';
import '@testing-library/jest-dom';
import { ITask, Actions } from '@twilio/flex-ui';

jest.mock('@twilio/flex-ui', () => {
  return {
    __esModule: true,
    Actions: {
      addListener: jest.fn(),
      removeListener: jest.fn(),
      invokeAction: jest.fn(),
    },
    IconButton: (props) => (<button {...props} />),
  };
});

describe('Transfer Button', () => {
  const t = { sid: "1672673" } as unknown as ITask;
  it('should render correct snapshot', () => {
    const wrapper = render(
      <TransferButton task={t} />
    )
    expect(wrapper).toMatchSnapshot();
  });

  it('should invoke an action when the icon button is clicked', async () => {
    const invokeAction = jest.spyOn(Actions, 'invokeAction');
    const { getByTitle } = render(
      <TransferButton task={t} />
    )
    const transferButton = getByTitle('Transfer Chat').closest('button');
    if (transferButton) {
      fireEvent.click(transferButton)
    }
    expect(invokeAction).toHaveBeenCalledWith('ShowDirectory');
  });
  it('should add a listener for beforeTransferTask event on mount', async () => {
    const addListener = jest.spyOn(Actions, 'addListener');
    const w = render(
      <TransferButton task={t} />
    )
    expect(addListener).toHaveBeenCalledWith('beforeTransferTask', expect.any(Function));
  });
  it('should remove the listener for beforeTransferTask event on unmount', async () => {
    const removeListener = jest.spyOn(Actions, 'removeListener');
    const w = render(
      <TransferButton task={t} />
    )
    w.unmount();
    expect(removeListener).toHaveBeenCalledWith('beforeTransferTask', expect.any(Function));
  });

});