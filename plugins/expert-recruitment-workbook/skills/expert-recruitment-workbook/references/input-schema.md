# 输入 JSON 规范

生成脚本接收一个 UTF-8 JSON 文件。所有字段均为纯文本；除 `experts` 外均可省略。

```json
{
  "title": "市场活动ROI与线下IP｜专家招募表",
  "subtitle": "访谈方向：活动立项、预算分配、ROI门槛与效果评估",
  "sheetName": "市场活动与线下IP",
  "questions": [
    "1. 活动的长期目标和短期目标分别是什么？",
    "2. Test：预算规模、ROI门槛和效果评估口径。"
  ],
  "experts": [
    {
      "company": "示例公司",
      "position": "示例职位",
      "rate": "2倍（含税 5500 RMB/H）",
      "source": "推荐方",
      "availability": "待定",
      "background": "专家任职经历与职责。",
      "feedback": "专家确认话题可以分享，并反馈相关业务口径。",
      "notes": "需确认数据年份和统计口径。"
    }
  ]
}
```

## 字段映射

| JSON 字段 | Excel 展示 | 处理规则 |
|---|---|---|
| `title` | 主标题 | 缺省为“专家招募表” |
| `subtitle` | 副标题 | 概括研究对象和访谈方向 |
| `sheetName` | 工作表名 | 自动移除 `\\ / ? * [ ] :`，最长 31 字符 |
| `questions` | 招募问题区 | 每个数组元素占一行；Test 放在末尾 |
| `company` | 公司 | 匿名公司名可原样保留 |
| `position` | 职位 | “前任/现任”可保留在职位中 |
| `rate` | 费率 | 保留倍率、金额及含税状态，不推算缺失数据 |
| `source` | 推荐方 | 填写渠道名称，如“渠道A”“咨询机构B” |
| `availability` | 可访谈时间 | 缺失时填“待定” |
| `background` | 专家背景 | 合并任职经历和职责，去除寒暄和@信息 |
| `feedback` | 话题反馈 | 合并评价、Comments、TQ/Test反馈 |
| `notes` | 备注 | 疑似重复、报价差异、口径冲突、岗位匹配度 |

## 去重提示模板

- `与<推荐方>推荐的第<序号>位背景、任职时间及反馈高度一致，疑似同一专家；本渠道报价低/高 <金额> RMB/H。`
- `与多位候选人的反馈数字完全一致，疑似共享口径；需确认是否为一手数据。`
- `<指标A>为<数值1>，另一专家反馈为<数值2>；需确认年份、地域、产品范围及去重口径。`

脚本调用：

```powershell
node build_expert_workbook.mjs --input experts.json --output expert-recruitment.xlsx --preview expert-recruitment.png
```
