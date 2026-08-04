import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
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
});
