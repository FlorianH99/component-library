import { render, screen } from '@testing-library/react';
import { Checkbox } from '../../index';

describe('Checkbox', () => {
  it('supports the indeterminate visual state through the native input element', () => {
    render(<Checkbox indeterminate label="Partial selection" />);

    const checkbox = screen.getByRole('checkbox', { name: 'Partial selection' }) as HTMLInputElement;

    expect(checkbox.indeterminate).toBe(true);
  });
});