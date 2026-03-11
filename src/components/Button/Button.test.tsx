import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '../../index';

describe('Button', () => {
  it('defaults to button type and disables itself while loading', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button loading onClick={onClick}>
        Publish
      </Button>
    );

    const button = screen.getByRole('button', { name: /publish/i });

    expect(button).toHaveAttribute('type', 'button');
    expect(button).toBeDisabled();

    await user.click(button);

    expect(onClick).not.toHaveBeenCalled();
  });
});