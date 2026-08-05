import defaultMdxComponents from 'fumadocs-ui/mdx';
import type { MDXComponents } from 'mdx/types';
import { RunnableExample } from '@/runner/RunnableExample';
import { Param, Parameters } from '@/entry/Parameters';
import { Return, Returns } from '@/entry/Returns';
import { Errors, Since } from '@/entry/Errors';
import { Gotcha, Note, Warning } from '@/entry/Callout';

export function getMDXComponents(components?: MDXComponents) {
  return {
    ...defaultMdxComponents,
    RunnableExample,
    Parameters,
    Param,
    Returns,
    Return,
    Errors,
    Since,
    Note,
    Warning,
    Gotcha,
    ...components,
  } satisfies MDXComponents;
}

export const useMDXComponents = getMDXComponents;

declare global {
  type MDXProvidedComponents = ReturnType<typeof getMDXComponents>;
}
