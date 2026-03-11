import type { Meta, StoryObj } from '@storybook/react';
import { Button, Dialog } from '../src';

const meta = {
  title: 'Overlays/Dialog',
  component: Dialog,
  tags: ['autodocs'],
  args: {
    children: null,
    defaultOpen: false
  }
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const ConfirmArchive: Story = {
  render: () => (
    <Dialog defaultOpen={false}>
      <Dialog.Trigger asChild>
        <Button tone="danger" variant="outline">
          Archive campaign
        </Button>
      </Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Archive campaign?</Dialog.Title>
        <Dialog.Description>
          This keeps the audit trail intact, but removes the campaign from active dashboards and scheduled sends.
        </Dialog.Description>
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
          <Dialog.Close asChild>
            <Button variant="ghost">Cancel</Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button data-autofocus tone="danger">
              Archive
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog>
  )
};