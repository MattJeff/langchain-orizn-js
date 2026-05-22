# @orizn/langchain

LangChain.js tools for the [Orizn Visa API](https://visa.orizn.app) — check visa requirements for 39,585 passport-destination pairs in 15 languages.

## Install

```bash
npm install @orizn/langchain
```

## Quick start

```typescript
import { OriznQuickVisaCheckTool, OriznVisaCheckTool } from "@orizn/langchain";

// No API key needed for quick checks
const quick = new OriznQuickVisaCheckTool();
const result = await quick.invoke(
  { passport: "FRA", destination: "JPN" }
);
console.log(result);

// Full details (needs API key)
const full = new OriznVisaCheckTool("your-api-key");
const details = await full.invoke(
  { passport: "FRA", destination: "JPN", lang: "fr" }
);
console.log(details);
```

## Use with a LangChain agent

```typescript
import { ChatOpenAI } from "@langchain/openai";
import { AgentExecutor, createOpenAIFunctionsAgent } from "langchain/agents";
import { OriznQuickVisaCheckTool, OriznVisaCheckTool } from "@orizn/langchain";

const tools = [
  new OriznQuickVisaCheckTool(),
  new OriznVisaCheckTool("your-api-key"),
];

// Use with your preferred LangChain agent setup
```

## Available tools

| Tool | Description | API Key |
|------|-------------|---------|
| `OriznVisaCheckTool` | Full visa details with documents, process & tips | Required |
| `OriznQuickVisaCheckTool` | Quick yes/no visa check | Not needed |

## Links

- [API](https://visa.orizn.app)
- [Docs](https://visa.orizn.app/visa-api/dashboard/docs)
- [MCP Server](https://github.com/MattJeff/orizn-mcp-server)
- [Python package](https://pypi.org/project/langchain-orizn/)

## License

MIT
