# 盘小编 V0.1 Web Demo

一个面向普通 A 股投资者的 AI 市场小编 Web Demo。首版验证自选股、收盘日报、历史日报和小编追问闭环，不提供交易、荐股或买卖建议。

## 本地启动

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

没有配置 Supabase / DeepSeek 时，应用会使用内存数据和本地 fallback 生成日报，便于先低成本验证产品体验。配置 `.env.local` 的 `DEEPSEEK_API_KEY` 后，日报生成和小编追问会优先使用 DeepSeek；金融数据层默认使用低成本公开来源，并会把可追溯事件缓存到 Supabase 的 `market_events`。

## 生成日报

```bash
npm run generate:daily
```

当前阶段先用本地手动生成，不依赖 ECS Cron。也可以请求：

```bash
curl -X POST http://localhost:3000/api/jobs/generate-daily-report \
  -H "x-cron-secret: change-me"
```

## ECS Cron 示例

```cron
40 15 * * 1-5 cd /srv/pandashi && /usr/bin/npm run generate:daily >> /var/log/pandashi-daily.log 2>&1
```

## Supabase

Supabase 暂时后置。需要真实落库或多端同步时，再执行 `supabase/migrations/001_initial_schema.sql` 创建数据表。V0.1 默认使用单用户或内存数据验证闭环，后续可接入正式登录。

## 模型配置

```bash
LLM_PROVIDER=deepseek
DEEPSEEK_API_KEY=your-key
DEEPSEEK_MODEL=deepseek-v4-flash
MARKET_DATA_PROVIDER=official
```

如果没有配置 DeepSeek，系统会回退到 deterministic mock 文案，不影响本地体验验证。

`MARKET_DATA_PROVIDER=official` 会优先检查交易所/指数公司等公开来源，并将市场概览和自选股观察事件写入 `market_events`。本地离线测试可改为 `MARKET_DATA_PROVIDER=mock`。

## 安全边界

所有日报和聊天回答都经过安全检查，禁止荐股、收益预测、买卖建议和刺激交易表达。产品只做信息整理、风险提示和情绪陪伴。
