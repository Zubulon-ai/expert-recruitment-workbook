# Expert Recruitment Workbook

将招募文案和多家专家渠道的候选资料，整理为统一、可读、经过校验的 Excel 专家招募表。

## 能力

- 统一公司、职位、费率、推荐方、时间、背景、反馈和备注字段
- 标记疑似重复专家和渠道报价差异
- 提醒 DAU、预算、转化率等指标的数据口径冲突
- 生成带筛选、冻结窗格、动态行高和风险备注的专业 Excel
- 自动渲染预览，并检查工作簿结构和公式错误

## 安装

```text
codex plugin marketplace add Zubulon-ai/expert-recruitment-workbook
```

重启 ChatGPT/Codex 桌面应用，在 Plugins Directory 的“专家招募工具”市场中安装 `expert-recruitment-workbook`。

安装后可直接输入：

```text
$expert-recruitment-workbook 把下面的招募文案和专家资料整理成新的 Excel，并检查重复专家和数据口径冲突。
```

也可以不显式写 Skill 名称，直接提出“生成专家招募表”“把新增专家加到 Excel”等需求。

## 文档

- [完整使用说明](docs/USAGE.md)
- [AI Mario 内部部署说明](docs/MARIO_DEPLOYMENT.md)
- [Mario 兼容封装包](mario/expert-recruitment-workbook/)
- [GitHub 分享与安装](SHARING.md)
