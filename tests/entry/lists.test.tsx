import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Param, Parameters } from '@/entry/Parameters';
import { Return, Returns } from '@/entry/Returns';
import { Errors, Since } from '@/entry/Errors';

describe('Parameters', () => {
  it('heads the list and pairs each name with its description', () => {
    render(
      <Parameters>
        <Param name="formatstring">a template.</Param>
        <Param name="···">one value per directive.</Param>
      </Parameters>,
    );

    expect(screen.getByRole('heading', { name: 'Parameters' })).toBeInTheDocument();
    expect(screen.getByText('formatstring').tagName).toBe('DT');
    expect(screen.getByText('a template.').tagName).toBe('DD');
    expect(screen.getByText('···')).toBeInTheDocument();
  });
});

describe('Returns', () => {
  it('heads the list "Return values", because Lua returns more than one', () => {
    render(
      <Returns>
        <Return type="string">the formatted copy.</Return>
      </Returns>,
    );

    expect(screen.getByRole('heading', { name: 'Return values' })).toBeInTheDocument();
    expect(screen.getByText('string').tagName).toBe('DT');
    expect(screen.getByText('the formatted copy.').tagName).toBe('DD');
  });

  it('keeps two returns in the order they were written', () => {
    render(
      <Returns>
        <Return type="string">the modified copy.</Return>
        <Return type="integer">the number of matches.</Return>
      </Returns>,
    );

    const terms = screen.getAllByRole('term').map((node) => node.textContent);
    expect(terms).toEqual(['string', 'integer']);
  });
});

describe('Errors', () => {
  it('heads the list and keeps its items as a list', () => {
    render(
      <Errors>
        <ul>
          <li>Raises if a directive is invalid.</li>
        </ul>
      </Errors>,
    );

    expect(screen.getByRole('heading', { name: 'Errors' })).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toHaveTextContent('Raises if a directive is invalid.');
  });
});

describe('Since', () => {
  it('marks the version an error starts happening in', () => {
    render(<Since v="5.3" />);
    const chip = screen.getByText('5.3+');
    expect(chip).toHaveAttribute('data-state', 'since');
  });
});
