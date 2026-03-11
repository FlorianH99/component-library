import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button, Dialog } from '../../index';

describe('Dialog', () => {
  it('opens from the trigger, closes on escape, and restores focus', async () => {
    const user = userEvent.setup();

    render(
      <Dialog>
        <Dialog.Trigger asChild>
          <Button>Open dialog</Button>
        </Dialog.Trigger>
        <Dialog.Content>
          <Dialog.Title>Archive project</Dialog.Title>
          <Dialog.Description>This action is reversible from settings.</Dialog.Description>
          <Dialog.Close asChild>
            <Button data-autofocus>Close</Button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog>
    );

    const trigger = screen.getByRole('button', { name: 'Open dialog' });

    await user.click(trigger);

    expect(screen.getByRole('dialog', { name: 'Archive project' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Close' })).toHaveFocus();

    await user.keyboard('{Escape}');

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });
});