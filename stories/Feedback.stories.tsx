import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Card } from '../src';

const meta = {
  title: 'Content/BadgeCard',
  component: Card,
  tags: ['autodocs']
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ReviewCard: Story = {
  render: () => (
    <Card padding="lg" surface="raised" style={{ minWidth: '20rem' }}>
      <Badge tone="warning">Needs review</Badge>
      <h3 style={{ font: '600 1.25rem/1.2 var(--ui-font-body)' }}>Billing settings audit</h3>
      <p style={{ color: 'var(--ui-color-text-muted)' }}>
        Long labels, edge states, and admin-only copy should all stay readable without blowing up the layout.
      </p>
    </Card>
  )
};