import { render, screen } from '@testing-library/react';
import { Field, FieldDescription, FieldError, FieldLabel, Input } from '../../index';

describe('Input + Field', () => {
  it('associates label, description, and error messaging', () => {
    render(
      <Field invalid>
        <FieldLabel>Email address</FieldLabel>
        <Input defaultValue="team@example.com" />
        <FieldDescription>Use the shared team inbox.</FieldDescription>
        <FieldError>That address is already in use.</FieldError>
      </Field>
    );

    const input = screen.getByLabelText('Email address');
    const description = screen.getByText('Use the shared team inbox.');
    const error = screen.getByText('That address is already in use.');

    expect(input).toHaveAttribute('aria-describedby', `${description.id} ${error.id}`);
    expect(input).toHaveAttribute('aria-errormessage', error.id);
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});