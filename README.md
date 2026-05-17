# 盘大师 V0.1 Web Demo

一个面向普通 A 股投资者的 AI 市场小编 Web Demo。首版验证自选股、收盘日报、历史日报和小编追问闭环，不提供交易、荐股或买卖建议。

## 本地启动

```bash
npm install
npm run dev
```

打开 `http://localhost:3000`。

没有配置 Supabase / DashScope 时，应用会使用内存数据和本地 mock 生成日报，便于先验证产品体验。配置 `.env.local` 后会自动使用 Supabase 和 Qwen。

## 生成日报

```bash
npm run generate:daily
```

或请求：

```bash
curl -X POST http://localhost:3000/api/jobs/generate-daily-report \
  -H "x-cron-secret: change-me"
```

## ECS Cron 示例

```cron
40 15 * * 1-5 cd /srv/pandashi && /usr/bin/npm run generate:daily >> /var/log/pandashi-daily.log 2>&1
```

## Supabase

执行 `supabase/migrations/001_initial_schema.sql` 创建数据表。V0.1 默认使用单用户或轻量多用户模式，后续可接入正式登录。

## 安全边界

所有日报和聊天回答都经过安全检查，禁止荐股、收益预测、买卖建议和刺激交易表达。产品只做信息整理、风险提示和情绪陪伴。
