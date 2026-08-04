import { describe, it, expect, beforeEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { SelectedVersionProvider, useSelectedVersion } from '@/version/SelectedVersionProvider';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <SelectedVersionProvider>{children}</SelectedVersionProvider>
);

function setUrl(search: string) {
  window.history.replaceState({}, '', `/${search}`);
}

describe('useSelectedVersion', () => {
  beforeEach(() => {
    localStorage.clear();
    setUrl('');
  });

  it('defaults to 5.5', () => {
    const { result } = renderHook(() => useSelectedVersion(), { wrapper });
    expect(result.current.version).toBe('5.5');
  });

  it('persists a set version to localStorage', () => {
    const { result } = renderHook(() => useSelectedVersion(), { wrapper });
    act(() => result.current.setVersion('5.1'));
    expect(result.current.version).toBe('5.1');
    expect(localStorage.getItem('luadocs.version')).toBe('5.1');
  });

  it('prefers the ?v= URL param over localStorage on init', () => {
    localStorage.setItem('luadocs.version', '5.2');
    setUrl('?v=5.3');
    const { result } = renderHook(() => useSelectedVersion(), { wrapper });
    expect(result.current.version).toBe('5.3');
  });

  it('falls back to 5.5 for an invalid ?v= param', () => {
    setUrl('?v=9.9');
    const { result } = renderHook(() => useSelectedVersion(), { wrapper });
    expect(result.current.version).toBe('5.5');
  });

  it('falls back to 5.5 for an invalid stored version', () => {
    localStorage.setItem('luadocs.version', 'nope');
    const { result } = renderHook(() => useSelectedVersion(), { wrapper });
    expect(result.current.version).toBe('5.5');
  });

  it('removes the ?v= param when setting the default version', () => {
    setUrl('?v=5.1');
    const { result } = renderHook(() => useSelectedVersion(), { wrapper });
    expect(result.current.version).toBe('5.1');
    act(() => result.current.setVersion('5.5'));
    expect(result.current.version).toBe('5.5');
    expect(new URLSearchParams(window.location.search).has('v')).toBe(false);
  });

  it('sets the ?v= param when setting a non-default version', () => {
    const { result } = renderHook(() => useSelectedVersion(), { wrapper });
    act(() => result.current.setVersion('5.2'));
    expect(new URLSearchParams(window.location.search).get('v')).toBe('5.2');
  });

  it('falls back to the default version instead of throwing when localStorage.getItem throws', () => {
    const getItemSpy = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => {
      throw new DOMException('storage blocked', 'SecurityError');
    });
    try {
      expect(() => renderHook(() => useSelectedVersion(), { wrapper })).not.toThrow();
      const { result } = renderHook(() => useSelectedVersion(), { wrapper });
      expect(result.current.version).toBe('5.5');
    } finally {
      getItemSpy.mockRestore();
    }
  });

  it('keeps the in-memory version set even when localStorage.setItem throws', () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('storage blocked', 'SecurityError');
    });
    try {
      const { result } = renderHook(() => useSelectedVersion(), { wrapper });
      expect(() => act(() => result.current.setVersion('5.1'))).not.toThrow();
      expect(result.current.version).toBe('5.1');
    } finally {
      setItemSpy.mockRestore();
    }
  });

  it('renders the default version 5.5 on the server render pass, even when ?v= requests another version', () => {
    setUrl('?v=5.1');
    function Probe() {
      const { version } = useSelectedVersion();
      return <span>{version}</span>;
    }
    const html = renderToString(
      <SelectedVersionProvider>
        <Probe />
      </SelectedVersionProvider>,
    );
    expect(html).toContain('5.5');
    expect(html).not.toContain('5.1');
  });
});
