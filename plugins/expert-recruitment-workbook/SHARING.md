# 分享与安装

这个目录既是标准 Codex 插件，也是可独立复制的 Skill。

## 最简单：分享压缩包

1. 把整个 `expert-recruitment-workbook-plugin` 目录压缩后发给对方。
2. 对方解压后，将 `skills/expert-recruitment-workbook` 复制到个人 Skill 目录：
   - Windows：`%USERPROFILE%\\.codex\\skills\\expert-recruitment-workbook`
   - macOS/Linux：`~/.codex/skills/expert-recruitment-workbook`
3. 重启 Codex，在对话中输入 `$expert-recruitment-workbook`，或直接说“把下面的招募文案和专家资料整理成 Excel”。

## 团队推荐：GitHub 插件市场

1. 新建一个市场仓库，把本插件目录放到仓库的 `plugins/expert-recruitment-workbook/`。
2. 在仓库根目录创建 `.agents/plugins/marketplace.json`，让其中的 `source.path` 指向 `./plugins/expert-recruitment-workbook`。
3. 对方添加该仓库作为插件市场：

```text
codex plugin marketplace add <owner>/<repo>
```

4. 再从该市场安装 `expert-recruitment-workbook` 插件。私有仓库按组织现有 GitHub 权限访问即可。

本次交付同时提供了已经配好的 `expert-recruitment-workbook-marketplace` 目录和压缩包，直接把该目录推到 GitHub 即可。

## 更新

- 修改 `skills/expert-recruitment-workbook/` 内的规则或脚本。
- 更新 `.codex-plugin/plugin.json` 中的 `version`。
- 重新发布压缩包，或向 GitHub 仓库推送新版本。
