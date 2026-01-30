# 更新日志

## 0.0.4

### Patch Changes

- 3824b9b: Release version 0.0.3

## 0.0.2

### Patch Changes

- 815cb4d: Release version 0.0.3

## [1.0.0] - 2026-01-29

### ✨ 新增功能

#### 智能换行处理

- ✅ 精确的表格识别（使用正则表达式匹配表格分隔符和表格行）
- ✅ 自动识别列表并保持正确的行间距
- ✅ 智能段落分隔（双行间距）
- ✅ 空行处理优化

#### 安全特性

- ✅ 默认 URL 安全转换（只允许 https、http、mailto、xmpp 等安全协议）
- ✅ 可自定义 URL 转换函数
- ✅ XSS 防护

#### 三种渲染模式

- ✅ **同步模式** (`RWKVMarkdown`)：适用于客户端组件，一次性渲染
- ✅ **异步模式** (`RWKVMarkdownAsync`)：适用于服务端组件或异步插件
- ✅ **Hooks 模式** (`RWKVMarkdownHooks`)：适用于需要响应式更新的客户端组件

#### 自定义能力

- ✅ 自定义组件映射
- ✅ 元素白名单/黑名单过滤
- ✅ 自定义元素过滤函数
- ✅ 完整的 remark/rehype 插件支持

### 🔧 优化改进

#### 代码质量

- ✅ 完整的 JSDoc 注释
- ✅ 完整的 TypeScript 类型定义
- ✅ 优化的 AST 遍历性能
- ✅ 类型守卫避免不必要的类型检查

#### 构建优化

- ✅ CommonJS 和 ES Module 双格式输出
- ✅ Source Map 支持
- ✅ Terser 压缩优化
- ✅ Tree-shaking 支持

#### 文档完善

- ✅ 详细的 README.md（中文）
- ✅ 完整的 API 参考
- ✅ 使用示例和最佳实践
- ✅ 特殊内容测试用例

### 📦 依赖更新

所有核心依赖升级到最新版本：

| 依赖包                   | 版本    |
| ------------------------ | ------- |
| hast-util-to-jsx-runtime | ^2.3.6  |
| html-url-attributes      | ^3.0.1  |
| remark-parse             | ^11.0.0 |
| remark-rehype            | ^11.1.2 |
| unified                  | ^11.0.5 |
| unist-util-visit         | ^5.1.0  |
| vfile                    | ^6.0.3  |

### 🐛 修复问题

- ✅ 修复 `Object.hasOwn` TypeScript 编译错误（添加 ES2022.Object 库支持）
- ✅ 修复类型错误（null 值传递给非 null 参数）
- ✅ 改进表格识别逻辑（避免误判普通文本中的 `|` 字符）
- ✅ 优化 URL 转换逻辑（只在值有效时更新属性）
- ✅ 改进 allowElement 返回值处理（正确处理 null 和 false）

### 📝 文档

- ✅ `README.md` - 完整的功能介绍和 API 文档
- ✅ `USAGE-GUIDE.md` - 详细的使用指南
- ✅ `CHANGELOG.md` - 更新日志
- ✅ `example.md` - 使用示例
- ✅ `test-special-content.md` - 特殊内容测试

### 🎯 测试通过

- ✅ 复杂 Markdown 表格渲染
- ✅ 多段落文本处理
- ✅ 列表渲染
- ✅ 混合内容渲染
- ✅ TypeScript 类型检查通过
- ✅ 构建成功（CommonJS + ESM）
- ✅ 全局链接成功

---

## 下一步计划

- [ ] 添加单元测试
- [ ] 添加 E2E 测试
- [ ] 性能基准测试
- [ ] 添加更多示例
- [ ] 发布到 npm

---

**Made with ❤️ for RWKV Project**
