import type { Meta, StoryObj } from '@storybook/react';
import { Card, Checkbox, Field, FieldDescription, FieldError, FieldLabel, Input, Switch, Textarea } from '../src';

const meta = {
  title: 'Forms/Controls',
  component: Input,
  tags: ['autodocs']
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EditorialForm: Story = {
  render: () => (
    <Card style={{ display: 'grid', gap: '1rem', minWidth: 'min(42rem, 92vw)' }}>
      <Field>
        <FieldLabel>Article title</FieldLabel>
        <Input placeholder="A strong heading that still works on mobile" />
        <FieldDescription>Keep it specific. Two lines should still read cleanly.</FieldDescription>
      </Field>
      <Field invalid>
        <FieldLabel>Summary</FieldLabel>
        <Textarea defaultValue="" placeholder="Explain the release note in one short paragraph." />
        <FieldError>A summary is required before publishing.</FieldError>
      </Field>
      <div style={{ display: 'grid', gap: '0.875rem' }}>
        <Checkbox
          defaultChecked
          description="Readers will see the update immediately on the public changelog."
          label="Notify subscribers"
        />
        <Switch
          defaultChecked
          description="Keeps the piece in the editorial review queue until sign-off."
          label="Require final approval"
        />
      </div>
    </Card>
  )
};