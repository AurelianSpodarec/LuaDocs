import { describe, expect, it, beforeEach } from 'vitest';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { AnnouncementBar } from '@/announcement/AnnouncementBar';
import { ANNOUNCEMENT, type Announcement as AnnouncementData } from '@/announcement/announcement';

const sample: AnnouncementData = {
  id: 'test-announcement',
  badge: 'Beta',
  message: 'Something happened — and here is the long half of it',
  shortMessage: 'Something happened',
  linkText: 'Read more',
  href: 'https://example.com/discussions/1',
};

function bar() {
  return screen.queryByText(sample.message);
}

beforeEach(() => {
  localStorage.clear();
});

describe('AnnouncementBar', () => {
  it('shows the badge, the message and the link', () => {
    render(<AnnouncementBar announcement={sample} />);

    expect(screen.getByText(sample.badge)).toBeInTheDocument();
    expect(bar()).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /read more/i });
    expect(link).toHaveAttribute('href', sample.href);
  });

  it('opens the link in a new tab, without handing over the referrer window', () => {
    render(<AnnouncementBar announcement={sample} />);
    const link = screen.getByRole('link', { name: /read more/i });

    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });

  it('carries a short form of the message for viewports with one line to spare', () => {
    render(<AnnouncementBar announcement={sample} />);

    expect(screen.getByText(sample.shortMessage)).toBeInTheDocument();
  });

  it('renders nothing when there is nothing to announce', () => {
    const { container } = render(<AnnouncementBar announcement={null} />);

    expect(container).toBeEmptyDOMElement();
  });

  it('goes away when dismissed, and stays away on the next page', () => {
    render(<AnnouncementBar announcement={sample} />);

    fireEvent.click(screen.getByRole('button'));
    expect(bar()).not.toBeInTheDocument();

    cleanup();
    render(<AnnouncementBar announcement={sample} />);
    expect(bar()).not.toBeInTheDocument();
  });

  it('does not treat a dismissal as a verdict on the next announcement', () => {
    render(<AnnouncementBar announcement={sample} />);
    fireEvent.click(screen.getByRole('button'));
    cleanup();

    const next = { ...sample, id: 'a-later-announcement' };
    render(<AnnouncementBar announcement={next} />);

    // The whole point of scoping the dismissal by id: closing one bar says nothing
    // about the one that replaces it.
    expect(bar()).toBeInTheDocument();
  });
});

describe('ANNOUNCEMENT', () => {
  it('points at a discussion on the project repo', () => {
    if (!ANNOUNCEMENT) return;

    expect(ANNOUNCEMENT.href).toMatch(
      /^https:\/\/github\.com\/AurelianSpodarec\/LuaDocs\/discussions\/\d+$/,
    );
  });

  it('keeps the short message short enough for a phone', () => {
    if (!ANNOUNCEMENT) return;

    // The bar is one fixed-height line. Anything that wraps is clipped, not shown.
    expect(ANNOUNCEMENT.shortMessage.length).toBeLessThanOrEqual(28);
  });
});
