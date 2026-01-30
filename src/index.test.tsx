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

  it('should preserve single line breaks for lists', () => {
    const content = '- Item 1\n- Item 2\n- Item 3';
    const result = processLineBreaks(content);
    expect(result).toContain('- Item 1\n- Item 2');
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
});
