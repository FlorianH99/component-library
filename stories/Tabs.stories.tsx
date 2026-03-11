import type { Meta, StoryObj } from '@storybook/react';
import { Badge, Tabs } from '../src';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  tags: ['autodocs']
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WorkspaceSections: Story = {
  render: () => (
    <div style={{ minWidth: 'min(44rem, 92vw)' }}>
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Workspace sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
          <Tabs.Trigger value="quality">Quality</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="overview">
          <p>Use tabs for sibling sections with equal importance, not as a substitute for page routing.</p>
        </Tabs.Panel>
        <Tabs.Panel value="activity">
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            Draft review queue <Badge tone="accent">12 open</Badge>
          </p>
        </Tabs.Panel>
        <Tabs.Panel value="quality">
          <p>Manual activation mode is available when content panels are heavy or trigger costly async work.</p>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
};