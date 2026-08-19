# 专家招募表 Skill：分享与安装

本目录是可直接放到 GitHub 的 Codex 插件市场仓库，包含一个插件：`expert-recruitment-workbook`。

## 用 GitHub 分享

1. 将本目录的全部内容推送到 GitHub 仓库根目录。
2. 对方在 Codex CLI 中添加市场：

```text
codex plugin marketplace add Zubulon-ai/expert-recruitment-workbook
```

3. 重启 ChatGPT/Codex 桌面应用，在 Plugins Directory 中选择“专家招募工具”，安装 `expert-recruitment-workbook`。
4. 在新任务中输入 `$expert-recruitment-workbook`，或直接粘贴招募文案并要求生成专家招募 Excel。

如需固定分支：

```text
codex plugin marketplace add Zubulon-ai/expert-recruitment-workbook --ref main
```

## 不用 GitHub：直接复制 Skill

把 `plugins/expert-recruitment-workbook/skills/expert-recruitment-workbook` 复制到：

- Windows：`%USERPROFILE%\\.codex\\skills\\expert-recruitment-workbook`
- macOS/Linux：`~/.codex/skills/expert-recruitment-workbook`

然后重启 Codex。

## 本地测试市场

在本目录的上一级运行：

```text
codex plugin marketplace add ./expert-recruitment-workbook-marketplace
```

修改 Skill 后，更新插件清单中的版本号，再运行：

```text
codex plugin marketplace upgrade expert-recruitment-tools
```

