import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Switch } from '../../index';

describe('Switch', () => {
  it('toggles through the native checkbox API with switch semantics', async () => {
    const user = userEvent.setup();

    render(<Switch label="Enable review mode" />);

    const control = screen.getByRole('switch', { name: 'Enable review mode' });

    expect(control).not.toBeChecked();
    await user.click(control);
    expect(control).toBeChecked();
  });
});