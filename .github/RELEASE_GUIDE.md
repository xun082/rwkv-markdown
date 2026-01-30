# 📦 发布指南

## 🚀 快速发布流程

### 第一步：创建 release 分支

```bash
# 创建版本分支（例如：0.0.2）
git checkout -b release/0.0.2
git push -u origin release/0.0.2
```

**重要**：版本号必须是 `x.y.z` 格式（如 `0.0.2`、`1.0.0`）

### 第二步：创建 Pull Request

在 GitHub 上创建 PR，目标分支为 `main`

### 第三步：自动化处理 ✨

GitHub Actions 会自动：
- ✅ 从分支名提取版本号
- ✅ 更新 `package.json`
- ✅ 创建 changeset
- ✅ 提交并推送更改
- ✅ 在 PR 中添加评论

### 第四步：合并 PR

审查通过后合并到 `main`

### 第五步：自动发布 🎉

合并后自动发布到 npm

## 📝 完整示例

```bash
# 1. 创建并切换到 release 分支
git checkout -b release/0.0.2

# 2. 推送分支
git push -u origin release/0.0.2

# 3. 在 GitHub 创建 PR → main

# 4. 自动更新版本（无需手动操作）

# 5. 审查并合并 PR

# 6. 自动发布到 npm ✨
```

## ⚙️ 工作流说明

单个工作流文件处理两个场景：

1. **PR 阶段**：`release/*` 分支 PR 时自动更新版本
2. **发布阶段**：合并到 `main` 后自动发布到 npm

## 🔧 配置要求

需要在 GitHub 仓库设置中配置：
- `NPM_TOKEN`：npm 发布令牌

## ✅ 分支命名规范

- ✅ 正确：`release/0.0.1`、`release/1.0.0`
- ❌ 错误：`release-0.0.1`、`release/v0.0.1`
