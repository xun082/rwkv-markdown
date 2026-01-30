# 📦 发布指南

## 🚀 超简单发布流程

### 只需两步！

#### 第一步：创建并推送 release 分支

```bash
# 创建版本分支（例如：0.0.2）
git checkout -b release/0.0.2
git push -u origin release/0.0.2
```

**重要**：版本号必须是 `x.y.z` 格式（如 `0.0.2`、`1.0.0`）

#### 第二步：合并 PR

推送后会**自动发生**：
- ✅ 自动创建 PR 到 `main`
- ✅ 自动更新 `package.json` 版本号
- ✅ 自动创建 changeset
- ✅ 自动提交更改

你只需要：
1. 在 GitHub 上查看自动创建的 PR
2. 审查并合并 PR

#### 第三步：自动发布 🎉

合并后自动发布到 npm，无需任何操作！

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
