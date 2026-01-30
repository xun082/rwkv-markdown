import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { urlAttributes } from 'html-url-attributes';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { useEffect, useState, ReactElement, ReactNode, ComponentType } from 'react';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import { unified, PluggableList, Processor } from 'unified';
import { visit } from 'unist-util-visit';
import { VFile } from 'vfile';
import type { Element, Nodes, Parents, Root, Properties } from 'hast';
import type { Root as MdastRoot } from 'mdast';
import type { Options as RemarkRehypeOptions } from 'remark-rehype';

const SAFE_PROTOCOL = /^(https?|ircs?|mailto|xmpp)$/i;
const UNORDERED_LIST_PATTERN = /^[-*+]\s/;
const ORDERED_LIST_PATTERN = /^\d+[.)]\s/;
const TABLE_SEPARATOR_PATTERN = /^\|?[\s:]*-+[\s:]*(\|[\s:]*-+[\s:]*)+\|?$/;
const TABLE_ROW_PATTERN = /^\|(.+\|)+\s*$/;
const EMPTY_PLUGINS: PluggableList = [];
const DEFAULT_REMARK_REHYPE_OPTIONS: Readonly<RemarkRehypeOptions> = { allowDangerousHtml: true };

type UrlAttributeTest = null | ReadonlyArray<string>;

export type UrlTransform = (
  url: string,
  key: string,
  node: Readonly<Element>,
) => string | null | undefined;
export type AllowElement = (
  element: Readonly<Element>,
  index: number,
  parent: Readonly<Parents> | undefined,
) => boolean | null | undefined;
export type ComponentMap = Record<string, ComponentType<Record<string, unknown>>>;

export interface RWKVMarkdownProps {
  children?: string;
  allowElement?: AllowElement | null;
  allowedElements?: ReadonlyArray<string> | null;
  components?: ComponentMap | null;
  disallowedElements?: ReadonlyArray<string> | null;
  rehypePlugins?: PluggableList | null;
  remarkPlugins?: PluggableList | null;
  remarkRehypeOptions?: Readonly<RemarkRehypeOptions> | null;
  skipHtml?: boolean | null;
  unwrapDisallowed?: boolean | null;
  urlTransform?: UrlTransform | null;
}

export interface RWKVMarkdownHooksProps extends RWKVMarkdownProps {
  fallback?: ReactNode | null;
}

interface LineBreakContext {
  isTable: boolean;
  isList: boolean;
  isEmpty: boolean;
}

/**
 * Analyzes a line to determine its type (table, list, empty)
 * @param line - The line to analyze
 * @returns Context object with line type flags
 */
function analyzeLineType(line: string): LineBreakContext {
  const trimmed = line.trim();

  if (!trimmed) {
    return { isTable: false, isList: false, isEmpty: true };
  }

  // More accurate table detection: must have pipes and look like a table row or separator
  const isTable = TABLE_ROW_PATTERN.test(trimmed) || TABLE_SEPARATOR_PATTERN.test(trimmed);
  const isList = UNORDERED_LIST_PATTERN.test(trimmed) || ORDERED_LIST_PATTERN.test(trimmed);

  return {
    isTable,
    isList,
    isEmpty: false,
  };
}

/**
 * Determines if a single line break should be used between two lines
 * @param current - Context of the current line
 * @param next - Context of the next line
 * @returns True if single line break should be used
 */
function shouldUseSingleLineBreak(current: LineBreakContext, next: LineBreakContext): boolean {
  return (current.isTable && next.isTable) || (current.isList && next.isList);
}

/**
 * Processes line breaks in markdown content for optimal rendering
 * - Preserves single line breaks for tables and lists
 * - Adds double line breaks between paragraphs
 * - Handles empty lines appropriately
 * @param content - The markdown content to process
 * @returns Processed content with appropriate line breaks
 */
export function processLineBreaks(content: string): string {
  if (!content) return '';

  const lines = content.split('\n');
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    result.push(lines[i]);

    // Don't add line breaks after the last line
    if (i >= lines.length - 1) {
      break;
    }

    const currentTrimmed = lines[i].trim();
    const nextTrimmed = lines[i + 1].trim();

    // If either line is empty, preserve single line break
    if (!currentTrimmed || !nextTrimmed) {
      result.push('\n');
      continue;
    }

    const currentContext = analyzeLineType(lines[i]);
    const nextContext = analyzeLineType(lines[i + 1]);

    // Use single line break for tables and lists, double for everything else
    result.push(shouldUseSingleLineBreak(currentContext, nextContext) ? '\n' : '\n\n');
  }

  return result.join('');
}

/**
 * Creates a unified processor with the specified plugins and options
 * @param options - Configuration options for the processor
 * @returns Configured unified processor
 */
function createProcessor(
  options: RWKVMarkdownProps,
): Processor<MdastRoot, MdastRoot, Root, undefined, undefined> {
  const rehypePlugins = options.rehypePlugins ?? EMPTY_PLUGINS;
  const remarkPlugins = options.remarkPlugins ?? EMPTY_PLUGINS;
  const remarkRehypeOptions = options.remarkRehypeOptions
    ? { ...DEFAULT_REMARK_REHYPE_OPTIONS, ...options.remarkRehypeOptions }
    : DEFAULT_REMARK_REHYPE_OPTIONS;

  return unified()
    .use(remarkParse)
    .use(remarkPlugins)
    .use(remarkRehype, remarkRehypeOptions)
    .use(rehypePlugins);
}

/**
 * Creates a VFile with processed content
 * @param content - The markdown content
 * @returns VFile instance with processed content
 */
function createFile(content: string): VFile {
  const file = new VFile();
  file.value = processLineBreaks(content);
  return file;
}

/**
 * Default URL transformation function that sanitizes URLs
 * Only allows safe protocols (https, http, mailto, etc.)
 * @param value - The URL to transform
 * @returns Sanitized URL or empty string if unsafe
 */
export function defaultUrlTransform(value: string): string {
  const colon = value.indexOf(':');
  const questionMark = value.indexOf('?');
  const numberSign = value.indexOf('#');
  const slash = value.indexOf('/');

  const hasNoProtocol = colon === -1;
  const protocolAfterSpecialChar =
    (slash !== -1 && colon > slash) ||
    (questionMark !== -1 && colon > questionMark) ||
    (numberSign !== -1 && colon > numberSign);
  const hasAllowedProtocol = SAFE_PROTOCOL.test(value.slice(0, colon));

  return hasNoProtocol || protocolAfterSpecialChar || hasAllowedProtocol ? value : '';
}

/**
 * Type guard to check if a node is an element
 */
function isElement(node: Nodes): node is Element {
  return node.type === 'element';
}

/**
 * Type guard to check if a node is a raw HTML node
 */
function isRawNode(node: Nodes): node is { type: 'raw'; value: string } {
  return node.type === 'raw';
}

/**
 * Type guard to check if an element has children
 */
function hasChildren(node: Element): node is Element & { children: Nodes[] } {
  return Array.isArray(node.children) && node.children.length > 0;
}

/**
 * Transforms URL attributes in an element using the provided transform function
 * @param element - The element to transform
 * @param urlTransform - The URL transformation function
 */
function transformUrlAttributes(element: Element, urlTransform: UrlTransform): void {
  const attrs = urlAttributes as Record<string, UrlAttributeTest>;

  for (const key in attrs) {
    if (!Object.hasOwn(attrs, key) || !Object.hasOwn(element.properties, key)) {
      continue;
    }

    const value = element.properties[key];
    const test = attrs[key];

    if (test === null || test.includes(element.tagName)) {
      const transformedValue = urlTransform(String(value ?? ''), key, element);
      if (transformedValue !== undefined) {
        element.properties[key] = transformedValue;
      }
    }
  }
}

/**
 * Determines if an element should be removed based on filtering options
 * @param element - The element to check
 * @param index - The index of the element in its parent
 * @param parent - The parent element
 * @param options - Filtering options
 * @returns True if the element should be removed
 */
function shouldRemoveElement(
  element: Element,
  index: number,
  parent: Parents | undefined,
  options: {
    allowedElements?: ReadonlyArray<string> | null;
    disallowedElements?: ReadonlyArray<string> | null;
    allowElement?: AllowElement | null;
  },
): boolean {
  const { allowedElements, disallowedElements, allowElement } = options;

  let remove = allowedElements
    ? !allowedElements.includes(element.tagName)
    : disallowedElements
      ? disallowedElements.includes(element.tagName)
      : false;

  if (!remove && allowElement) {
    const result = allowElement(element, index, parent);
    remove = result === false || result === null;
  }

  return remove;
}

/**
 * Handles raw HTML nodes based on skipHtml option
 * @param parent - The parent element
 * @param index - The index of the node
 * @param value - The raw HTML value
 * @param skipHtml - Whether to skip HTML or convert to text
 * @returns The index for the visitor to continue from
 */
function handleRawNode(parent: Parents, index: number, value: string, skipHtml: boolean): number {
  if (skipHtml) {
    parent.children.splice(index, 1);
  } else {
    parent.children[index] = { type: 'text', value };
  }
  return index;
}

/**
 * Handles element removal with optional unwrapping
 * @param element - The element to remove
 * @param parent - The parent element
 * @param index - The index of the element
 * @param unwrapDisallowed - Whether to unwrap children instead of removing
 * @returns The index for the visitor to continue from
 */
function handleElementRemoval(
  element: Element,
  parent: Parents,
  index: number,
  unwrapDisallowed: boolean,
): number {
  if (unwrapDisallowed && hasChildren(element)) {
    parent.children.splice(index, 1, ...element.children);
  } else {
    parent.children.splice(index, 1);
  }
  return index;
}

/**
 * Post-processes the syntax tree, applying filters and transformations
 * @param tree - The syntax tree to process
 * @param options - Processing options
 * @returns React element tree
 */
function postProcess(tree: Nodes, options: RWKVMarkdownProps): ReactElement {
  const {
    allowedElements,
    allowElement,
    components,
    disallowedElements,
    skipHtml = false,
    unwrapDisallowed = false,
    urlTransform = defaultUrlTransform,
  } = options;

  if (allowedElements && disallowedElements) {
    throw new Error('Cannot use both allowedElements and disallowedElements');
  }

  visit(tree, (node: Nodes, index: number | undefined, parent: Parents | undefined) => {
    // Handle raw HTML nodes (convert <br> and </br> to proper br elements)
    if (isRawNode(node) && parent && typeof index === 'number') {
      const value = node.value;
      // Check if it's a br tag (with or without closing slash)
      if (value === '<br>' || value === '<br/>' || value === '</br>' || value === '<br />') {
        // Replace with proper br element
        parent.children[index] = {
          type: 'element',
          tagName: 'br',
          properties: {},
          children: [],
        };
        return index;
      }
      return handleRawNode(parent, index, value, skipHtml ?? false);
    }

    // Handle element nodes
    if (isElement(node)) {
      // Transform URL attributes for security
      if (urlTransform) {
        transformUrlAttributes(node, urlTransform);
      }

      // Check if element should be removed
      if (parent && typeof index === 'number') {
        const remove = shouldRemoveElement(node, index, parent, {
          allowedElements,
          disallowedElements,
          allowElement,
        });

        if (remove) {
          return handleElementRemoval(node, parent, index, unwrapDisallowed ?? false);
        }
      }
    }
  });

  // Create enhanced components with br handler
  const enhancedComponents: ComponentMap = {
    ...components,
    // Handle br tags properly (ensure they render as line breaks)
    br: components?.br || ((() => jsx('br', {})) as ComponentType<Record<string, unknown>>),
  };

  return toJsxRuntime(tree, {
    Fragment,
    components: enhancedComponents,
    ignoreInvalidStyle: true,
    jsx,
    jsxs,
    passKeys: true,
    passNode: true,
  }) as ReactElement;
}

/**
 * Main synchronous markdown renderer component
 * Parses and renders markdown content in a single pass
 * @param options - Rendering options including content and plugins
 * @returns React element tree
 * @example
 * ```tsx
 * <RWKVMarkdown remarkPlugins={[remarkGfm]}>
 *   # Hello World
 * </RWKVMarkdown>
 * ```
 */
export default function RWKVMarkdown(options: RWKVMarkdownProps): ReactElement {
  const processor = createProcessor(options);
  const file = createFile(options.children ?? '');
  const tree = processor.runSync(processor.parse(file), file);
  return postProcess(tree, options);
}

/**
 * Async markdown renderer for server components
 * Allows plugins to perform async operations
 * @param options - Rendering options including content and plugins
 * @returns Promise resolving to React element tree
 * @example
 * ```tsx
 * const element = await RWKVMarkdownAsync({
 *   children: '# Hello World',
 *   remarkPlugins: [remarkGfm]
 * });
 * ```
 */
export async function RWKVMarkdownAsync(options: RWKVMarkdownProps): Promise<ReactElement> {
  const processor = createProcessor(options);
  const file = createFile(options.children ?? '');
  const tree = await processor.run(processor.parse(file), file);
  return postProcess(tree, options);
}

/**
 * React hooks-based markdown renderer for client components
 * Re-processes content when dependencies change
 * @param options - Rendering options including content, plugins, and fallback
 * @returns React node (rendered markdown or fallback)
 * @example
 * ```tsx
 * <RWKVMarkdownHooks
 *   remarkPlugins={[remarkGfm]}
 *   fallback={<div>Loading...</div>}
 * >
 *   {content}
 * </RWKVMarkdownHooks>
 * ```
 */
export function RWKVMarkdownHooks(options: RWKVMarkdownHooksProps): ReactNode {
  const [error, setError] = useState<Error | undefined>();
  const [tree, setTree] = useState<Root | undefined>();

  useEffect(() => {
    let cancelled = false;
    const processor = createProcessor(options);
    const file = createFile(options.children ?? '');

    processor.run(processor.parse(file), file, (err, result) => {
      if (!cancelled) {
        setError(err ?? undefined);
        setTree(result as Root | undefined);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [options.children, options.rehypePlugins, options.remarkPlugins, options.remarkRehypeOptions]);

  if (error) throw error;

  return tree ? postProcess(tree, options) : options.fallback;
}

export { RWKVMarkdown };
