import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Gotcha, Note, Warning } from '@/entry/Callout';

describe('the callouts', () => {
  it('labels a note', () => {
    render(<Note>Nothing alarming.</Note>);
    const callout = screen.getByRole('note');
    expect(callout).toHaveAttribute('data-callout', 'note');
    expect(callout).toHaveTextContent('Note');
    expect(callout).toHaveTextContent('Nothing alarming.');
  });

  it('labels a warning', () => {
    render(<Warning>Undefined behaviour.</Warning>);
    expect(screen.getByRole('note')).toHaveAttribute('data-callout', 'warning');
    expect(screen.getByRole('note')).toHaveTextContent('Warning');
  });

  it('gives a gotcha its own kind and its own title', () => {
    render(<Gotcha title="Integers vs floats">Since 5.3, %d needs an integer.</Gotcha>);
    const callout = screen.getByRole('note');
    expect(callout).toHaveAttribute('data-callout', 'gotcha');
    expect(callout).toHaveTextContent('Gotcha: Integers vs floats');
  });
});
