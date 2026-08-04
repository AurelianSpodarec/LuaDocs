import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { VersionSwitcher } from '@/version/VersionSwitcher';
import { SelectedVersionProvider, useSelectedVersion } from '@/version/SelectedVersionProvider';
import { LUA_VERSIONS } from '@/compat/schema';

function ReportedVersion() {
  const { version } = useSelectedVersion();
  return <span data-testid="reported-version">{version}</span>;
}

describe('VersionSwitcher', () => {
  it('lists exactly the five versions', () => {
    render(
      <SelectedVersionProvider>
        <VersionSwitcher />
      </SelectedVersionProvider>,
    );
    const options = screen.getAllByRole('option');
    // Displayed as `v5.4`; the value stays bare so compat data keys still match.
    expect(options.map((o) => o.textContent)).toEqual(LUA_VERSIONS.map((v) => `v${v}`));
    expect(options.map((o) => (o as HTMLOptionElement).value)).toEqual([...LUA_VERSIONS]);
    expect(options).toHaveLength(5);
  });

  it('updates the value the context reports when the select changes', () => {
    render(
      <SelectedVersionProvider>
        <VersionSwitcher />
        <ReportedVersion />
      </SelectedVersionProvider>,
    );

    expect(screen.getByTestId('reported-version')).toHaveTextContent('5.5');

    fireEvent.change(screen.getByRole('combobox'), { target: { value: '5.2' } });

    expect(screen.getByTestId('reported-version')).toHaveTextContent('5.2');
    expect(screen.getByRole('combobox')).toHaveValue('5.2');
  });
});
