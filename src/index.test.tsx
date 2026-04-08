import { describe, it, expect } from 'vitest';
import { processLineBreaks, defaultUrlTransform } from './index';

describe('processLineBreaks', () => {
  it('should handle empty content', () => {
    expect(processLineBreaks('')).toBe('');
  });

  it('should preserve single line breaks for tables', () => {
    const content = '| Name | Age |\n|------|-----|\n| John | 30  |';
    const result = processLineBreaks(content);
    expect(result).toContain('| Name | Age |\n|');
  });

  it('should preserve single line breaks for tables without boundary pipes', () => {
    const content = 'Name | Age\n--- | ---\nJohn | 30';
    const result = processLineBreaks(content);
    expect(result).toBe(content);
  });

  it('should preserve single line breaks for mixed table row formats', () => {
    const content = '| Name | Age |\n--- | ---\n| John | 30 |';
    const result = processLineBreaks(content);
    expect(result).toBe(content);
  });

  it('should preserve single line breaks for lists', () => {
    const content = '- Item 1\n- Item 2\n- Item 3';
    const result = processLineBreaks(content);
    expect(result).toContain('- Item 1\n- Item 2');
  });

  it('should preserve single line breaks for ordered lists', () => {
    const content = '1. Step one\n2. Step two\n3. Step three';
    const result = processLineBreaks(content);
    expect(result).toBe(content);
  });

  it('should add double line breaks between paragraphs', () => {
    const content = 'Paragraph 1\nParagraph 2';
    const result = processLineBreaks(content);
    expect(result).toBe('Paragraph 1\n\nParagraph 2');
  });

  it('should handle empty lines', () => {
    const content = 'Line 1\n\nLine 2';
    const result = processLineBreaks(content);
    expect(result).toContain('\n\n');
  });

  it('should keep table rows compact but separate from surrounding paragraphs', () => {
    const content = 'Intro\n| Name | Age |\n| --- | --- |\n| Bob | 42 |\nOutro';
    const result = processLineBreaks(content);
    expect(result).toBe('Intro\n\n| Name | Age |\n| --- | --- |\n| Bob | 42 |\n\nOutro');
  });

  it('should not treat malformed table-like text as a table block', () => {
    const content = 'A | B\n---\nC | D';
    const result = processLineBreaks(content);
    expect(result).toBe('A | B\n\n---\n\nC | D');
  });

  it('should keep normal prose with pipes as paragraph content', () => {
    const content = 'Use a | b expression in text\nThen continue explanation';
    const result = processLineBreaks(content);
    expect(result).toBe('Use a | b expression in text\n\nThen continue explanation');
  });
});

describe('defaultUrlTransform', () => {
  it('should allow safe protocols', () => {
    expect(defaultUrlTransform('https://example.com')).toBe('https://example.com');
    expect(defaultUrlTransform('http://example.com')).toBe('http://example.com');
    expect(defaultUrlTransform('mailto:test@example.com')).toBe('mailto:test@example.com');
  });

  it('should allow relative URLs', () => {
    expect(defaultUrlTransform('/path/to/page')).toBe('/path/to/page');
    expect(defaultUrlTransform('../path/to/page')).toBe('../path/to/page');
    expect(defaultUrlTransform('#anchor')).toBe('#anchor');
  });

  it('should block unsafe protocols', () => {
    expect(defaultUrlTransform('javascript:alert(1)')).toBe('');
    expect(defaultUrlTransform('data:text/html,<script>alert(1)</script>')).toBe('');
  });

  it('should allow protocol-like text after slash/question/hash', () => {
    expect(defaultUrlTransform('/docs/http:guide')).toBe('/docs/http:guide');
    expect(defaultUrlTransform('?next=mailto:test@example.com')).toBe(
      '?next=mailto:test@example.com',
    );
    expect(defaultUrlTransform('#section:xmpp')).toBe('#section:xmpp');
  });

  it('should allow protocol case-insensitively', () => {
    expect(defaultUrlTransform('HTTPS://example.com')).toBe('HTTPS://example.com');
    expect(defaultUrlTransform('MailTo:test@example.com')).toBe('MailTo:test@example.com');
  });
});
