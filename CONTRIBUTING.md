# Contributing to RWKV Markdown

Thank you for your interest in contributing to RWKV Markdown! This document provides guidelines and instructions for contributing.

## Development Setup

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0 (recommended) or npm >= 9.0.0

### Getting Started

1. **Clone and install dependencies**

```bash
cd rwkv-markdown
pnpm install
```

2. **Start development mode**

```bash
pnpm dev
```

This starts Rollup in watch mode, automatically rebuilding when you make changes.

3. **Run type checking**

```bash
pnpm type-check
```

## Project Structure

```
rwkv-markdown/
├── src/
│   └── index.tsx          # Main source file
├── dist/                   # Build output (generated)
├── rollup.config.ts       # Rollup configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Package metadata
├── README.md              # User documentation
├── BUILD.md               # Build system documentation
└── CONTRIBUTING.md        # This file
```

## Development Workflow

### Making Changes

1. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** in `src/index.tsx`

3. **Test your changes**
   ```bash
   # Build and check types
   pnpm build
   
   # Link locally for testing
   pnpm link
   
   # In your test project
   pnpm link rwkv-markdown
   ```

4. **Verify types**
   ```bash
   pnpm type-check
   ```

### Code Style

- Use **TypeScript** for all code
- Follow **functional programming** patterns where possible
- Add **JSDoc comments** for public APIs
- Use **descriptive variable names**
- Keep functions **small and focused**

Example:

```typescript
/**
 * Process line breaks intelligently for better markdown rendering
 * 
 * @param content - Raw markdown content
 * @returns Processed content with smart line breaks
 */
function processLineBreaks(content: string): string {
  // Implementation
}
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add support for nested lists
fix: correct table row detection regex
docs: update README with new examples
```

## Testing

### Manual Testing

1. **Build the package**
   ```bash
   pnpm build
   ```

2. **Link locally**
   ```bash
   pnpm link
   ```

3. **Test in a sample project**
   ```bash
   cd /path/to/test-project
   pnpm link rwkv-markdown
   ```

4. **Create a test file**
   ```tsx
   import RWKVMarkdown from 'rwkv-markdown';
   import remarkGfm from 'remark-gfm';
   
   function Test() {
     const content = `Test content\nWith line breaks\n- List item`;
     return <RWKVMarkdown remarkPlugins={[remarkGfm]}>{content}</RWKVMarkdown>;
   }
   ```

### Test Cases to Verify

- [ ] Paragraph separation with `\n`
- [ ] Unordered lists (`-`, `*`, `+`)
- [ ] Ordered lists (`1.`, `2.`, etc.)
- [ ] Tables with proper formatting
- [ ] Mixed content (paragraphs + lists + tables)
- [ ] Empty lines preservation
- [ ] Special characters in content
- [ ] Very long content
- [ ] Unicode and emoji support

## Pull Request Process

1. **Update documentation** if needed
   - README.md for user-facing changes
   - BUILD.md for build system changes
   - CHANGELOG.md with your changes

2. **Ensure builds pass**
   ```bash
   pnpm clean && pnpm build
   ```

3. **Update version** in package.json if applicable
   - Patch: Bug fixes (1.0.x)
   - Minor: New features (1.x.0)
   - Major: Breaking changes (x.0.0)

4. **Create pull request**
   - Provide clear description
   - Reference any related issues
   - Include test results

5. **Wait for review**
   - Address feedback
   - Update as needed

## Release Process

For maintainers:

1. **Update version**
   ```bash
   npm version patch|minor|major
   ```

2. **Update CHANGELOG.md**
   ```markdown
   ## [x.y.z] - YYYY-MM-DD
   ### Added/Changed/Fixed
   - Description of changes
   ```

3. **Build and test**
   ```bash
   pnpm clean && pnpm build
   pnpm type-check
   ```

4. **Publish**
   ```bash
   npm publish
   ```

5. **Create GitHub release**
   - Tag: vx.y.z
   - Title: Version x.y.z
   - Description: Copy from CHANGELOG

## Getting Help

- 📖 Read the [README](./README.md)
- 🔧 Check [BUILD.md](./BUILD.md) for build issues
- 🐛 [Open an issue](https://github.com/yourusername/rwkv-markdown/issues)
- 💬 [Start a discussion](https://github.com/yourusername/rwkv-markdown/discussions)

## Code of Conduct

- Be respectful and inclusive
- Focus on constructive feedback
- Help others learn and grow
- Assume good intentions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
