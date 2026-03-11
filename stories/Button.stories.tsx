import type { Meta, StoryObj } from '@storybook/react';
import { Button, Card, IconButton } from '../src';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    children: 'Publish changes'
  }
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {
  render: (args) => (
    <Card style={{ display: 'grid', gap: '1rem', minWidth: '22rem' }}>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <Button {...args} />
        <Button variant="soft">Save draft</Button>
        <Button variant="outline">Assign reviewer</Button>
        <Button tone="danger" variant="ghost">
          Archive
        </Button>
      </div>
      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
        <IconButton aria-label="Refresh activity">
          <svg aria-hidden="true" fill="none" height="18" viewBox="0 0 24 24" width="18">
            <path d="M20 5v5h-5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            <path d="M4 19v-5h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
            <path d="M7.4 9A7 7 0 0 1 19 10M16.6 15A7 7 0 0 1 5 14" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" />
          </svg>
        </IconButton>
        <Button loading loadingLabel="Publishing article">
          Publish changes
        </Button>
      </div>
    </Card>
  )
};