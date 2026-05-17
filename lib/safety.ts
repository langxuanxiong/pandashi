const blockedPatterns = [
  /建议(买入|卖出|清仓|加仓|减仓)/,
  /(可以买|可以买入|可以卖|可以抄底|赶紧卖|马上清仓)/,
  /(必涨|必跌|稳赚|一定有机会|低风险高收益)/,
  /(明天|下周|短线).*(大概率|肯定|必然).*(涨|跌)/,
  /(推荐|荐股).*(股票|个股)/
];

const adviceQuestionPatterns = [
  /(该不该|要不要|能不能|可不可以).*(买|卖|抄底|满仓|清仓|加仓|减仓)/,
  /(明天|后天|下周).*(会不会|能不能|是不是).*(涨|跌)/,
  /(推荐|荐股).*(股票|个股)/,
  /现在.*(能不能|可以).*(买|卖|抄底)/
];

export function asksForInvestmentAdvice(input: string) {
  return adviceQuestionPatterns.some((pattern) => pattern.test(input));
}

export function containsUnsafeInvestmentAdvice(input: string) {
  return blockedPatterns.some((pattern) => pattern.test(input));
}

export function safeAlternative(stockName = "这只股票") {
  return `我不能替你做买卖决定，也不能提供投资建议。但我可以帮你把${stockName}最近的消息、风险和市场情绪整理出来，方便你自己判断。`;
}

export function sanitizeInvestmentLanguage(input: string) {
  let output = input;
  output = output.replace(/建议买入|可以买入|可以买/g, "可以重点理解相关信息");
  output = output.replace(/建议卖出|赶紧卖出|马上清仓|建议清仓/g, "需要重新梳理风险");
  output = output.replace(/抄底/g, "低位参与");
  output = output.replace(/必涨|稳赚|一定有机会/g, "存在不确定性");
  output = output.replace(/明天大概率/g, "后续可能");
  return output;
}

