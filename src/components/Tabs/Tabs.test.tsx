import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Tabs } from '../../index';

describe('Tabs', () => {
  it('moves selection with arrow keys in automatic activation mode', async () => {
    const user = userEvent.setup();

    render(
      <Tabs defaultValue="overview">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="details">Details</Tabs.Trigger>
          <Tabs.Trigger value="activity">Activity</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="details">Details panel</Tabs.Panel>
        <Tabs.Panel value="activity">Activity panel</Tabs.Panel>
      </Tabs>
    );

    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();

    await user.keyboard('{ArrowRight}');

    expect(screen.getByRole('tab', { name: 'Details' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Details panel');
  });

  it('requires enter to commit in manual activation mode', async () => {
    const user = userEvent.setup();

    render(
      <Tabs activationMode="manual" defaultValue="overview">
        <Tabs.List aria-label="Sections">
          <Tabs.Trigger value="overview">Overview</Tabs.Trigger>
          <Tabs.Trigger value="details">Details</Tabs.Trigger>
        </Tabs.List>
        <Tabs.Panel value="overview">Overview panel</Tabs.Panel>
        <Tabs.Panel value="details">Details panel</Tabs.Panel>
      </Tabs>
    );

    const overview = screen.getByRole('tab', { name: 'Overview' });
    overview.focus();

    await user.keyboard('{ArrowRight}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Overview panel');

    await user.keyboard('{Enter}');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Details panel');
  });
});