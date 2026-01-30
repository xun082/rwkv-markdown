# 🚀 Release Guide

## Quick Release (Automated) ✨

Our project uses an **automated release workflow** that makes releasing new versions incredibly simple!

### Method 1: Manual Release Branch (Recommended)

```bash
# 1. Create release branch (format: release/x.y.z)
git checkout -b release/0.0.2

# 2. Push to GitHub
git push -u origin release/0.0.2

# 3. Create PR to 'main' branch
# ✨ Automation will automatically:
#    - Extract version from branch name
#    - Update package.json
#    - Create changeset
#    - Commit changes back to your PR

# 4. Review and merge PR
# 🎉 Package is automatically published to npm!
```

### Method 2: Use Helper Script

We provide a helper script for local testing:

```bash
# Run the helper script
.github/scripts/test-release-branch.sh 0.0.2

# Follow the prompts, then:
git push -u origin release/0.0.2
# Create PR on GitHub
```

## 📋 What Happens Automatically?

### When you create a `release/x.y.z` PR:

1. **Version Extraction** - Parses `x.y.z` from branch name
2. **Validation** - Ensures version follows semver format
3. **Update package.json** - Sets the new version
4. **Create Changeset** - Generates changeset for release notes
5. **Commit & Push** - Automatically commits changes to your PR
6. **PR Comment** - Adds a summary comment to your PR

### When you merge to `main`:

1. **Build Package** - Compiles TypeScript and bundles files
2. **Publish to npm** - Releases to npm registry (if configured)
3. **Create GitHub Release** - Tags and creates release notes
4. **Update CHANGELOG** - Generates changelog from changesets

## 🎯 Branch Naming Rules

✅ **Valid formats:**
- `release/0.0.2`
- `release/1.0.0`
- `release/2.3.4`

❌ **Invalid formats:**
- `release-0.0.2` (must use `/`)
- `release/v0.0.2` (no `v` prefix)
- `release/0.0.2-beta` (no pre-release tags)
- `releases/0.0.2` (must be singular `release`)

## 🔧 First-time Setup

### Configure npm Token (For Publishing)

1. Get your npm token from https://www.npmjs.com/settings/YOUR_USERNAME/tokens
2. Add to GitHub repository secrets as `NPM_TOKEN`:
   - Go to: Settings → Secrets and variables → Actions
   - Click "New repository secret"
   - Name: `NPM_TOKEN`
   - Value: Your npm token

### Enable GitHub Actions Permissions

1. Go to: Settings → Actions → General
2. Under "Workflow permissions", select:
   - ✅ "Read and write permissions"
   - ✅ "Allow GitHub Actions to create and approve pull requests"
3. Click "Save"

## 📦 Release Checklist

Before creating a release PR:

- [ ] All tests passing (`pnpm test`)
- [ ] Linting clean (`pnpm lint`)
- [ ] Build successful (`pnpm build`)
- [ ] README updated (if needed)
- [ ] Breaking changes documented (if any)

## 🔍 Monitoring Releases

### Check Workflow Status

1. Go to the "Actions" tab in GitHub
2. Look for:
   - **"Auto Version on Release PR"** - Runs on PR creation
   - **"Release to NPM"** - Runs after merge to main

### View Release History

```bash
# See all releases
git tag

# See changes in a release
git show v0.0.2
```

## 🐛 Troubleshooting

### "Version format invalid" error

Make sure your branch name is exactly: `release/x.y.z`

Example: `release/0.0.2` ✅ not `release/v0.0.2` ❌

### Workflow didn't run

Check:
1. Branch name starts with `release/`
2. PR is targeting `main` branch
3. GitHub Actions are enabled in your repo

### Version not updated

The workflow checks if the version is already correct and skips update if so. This is normal!

### Permission denied errors

Ensure "Read and write permissions" are enabled for GitHub Actions (see Setup above).

## 📚 Additional Resources

- [Changesets Documentation](https://github.com/changesets/changesets)
- [Semantic Versioning](https://semver.org/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## 💡 Tips

- **Small releases often**: Better than large, infrequent releases
- **Test locally first**: Use `pnpm build` and `pnpm test` before creating PR
- **Meaningful versions**: Follow semver conventions (major.minor.patch)
- **Document breaking changes**: Add notes in PR description for major versions

## 🎉 Example Workflow

```bash
# Starting from main branch
git checkout main
git pull origin main

# Create feature/fix
git checkout -b feature/add-emoji-support
# ... make changes ...
git commit -m "feat: add emoji support"
git push -u origin feature/add-emoji-support
# Create and merge PR

# After feature is merged, create release
git checkout main
git pull origin main
git checkout -b release/0.0.2

# Push and create PR
git push -u origin release/0.0.2
# Go to GitHub, create PR
# ✨ Watch automation do its magic!
# Review, approve, merge
# 🎉 Your package is published!
```

---

**Happy Releasing! 🚀**

For detailed workflow information, see [.github/RELEASE_WORKFLOW.md](.github/RELEASE_WORKFLOW.md)
