import type { WatchlistItem } from "@/lib/types";

export type StockCatalogItem = {
  code: string;
  name: string;
  market: WatchlistItem["market"];
  sector: string;
};

export const STOCK_CATALOG: StockCatalogItem[] = [
  { code: "000001.SZ", name: "平安银行", market: "SZ", sector: "银行 / 金融 / 深市主板" },
  { code: "000002.SZ", name: "万科A", market: "SZ", sector: "房地产 / 深市主板" },
  { code: "000063.SZ", name: "中兴通讯", market: "SZ", sector: "通信设备 / 科技 / 深市主板" },
  { code: "000333.SZ", name: "美的集团", market: "SZ", sector: "家电 / 消费 / 深市主板" },
  { code: "000651.SZ", name: "格力电器", market: "SZ", sector: "家电 / 消费 / 深市主板" },
  { code: "000858.SZ", name: "五粮液", market: "SZ", sector: "白酒 / 消费 / 深市主板" },
  { code: "002415.SZ", name: "海康威视", market: "SZ", sector: "安防 / 计算机 / 深市主板" },
  { code: "002475.SZ", name: "立讯精密", market: "SZ", sector: "消费电子 / 制造 / 深市主板" },
  { code: "002594.SZ", name: "比亚迪", market: "SZ", sector: "新能源车 / 汽车 / 制造" },
  { code: "002714.SZ", name: "牧原股份", market: "SZ", sector: "养殖 / 农业 / 深市主板" },
  { code: "300014.SZ", name: "亿纬锂能", market: "SZ", sector: "新能源 / 锂电池 / 创业板" },
  { code: "300015.SZ", name: "爱尔眼科", market: "SZ", sector: "医疗服务 / 创业板" },
  { code: "300059.SZ", name: "东方财富", market: "SZ", sector: "证券 / 金融科技 / 创业板" },
  { code: "300122.SZ", name: "智飞生物", market: "SZ", sector: "生物医药 / 创业板" },
  { code: "300124.SZ", name: "汇川技术", market: "SZ", sector: "工业自动化 / 制造 / 创业板" },
  { code: "300274.SZ", name: "阳光电源", market: "SZ", sector: "光伏 / 新能源 / 创业板" },
  { code: "300308.SZ", name: "中际旭创", market: "SZ", sector: "光模块 / 通信 / 创业板" },
  { code: "300750.SZ", name: "宁德时代", market: "SZ", sector: "新能源 / 动力电池 / 创业板" },
  { code: "300760.SZ", name: "迈瑞医疗", market: "SZ", sector: "医疗器械 / 创业板" },
  { code: "600000.SH", name: "浦发银行", market: "SH", sector: "银行 / 金融 / 沪市主板" },
  { code: "600009.SH", name: "上海机场", market: "SH", sector: "机场 / 交通运输 / 沪市主板" },
  { code: "600030.SH", name: "中信证券", market: "SH", sector: "证券 / 金融 / 沪市主板" },
  { code: "600031.SH", name: "三一重工", market: "SH", sector: "工程机械 / 制造 / 沪市主板" },
  { code: "600036.SH", name: "招商银行", market: "SH", sector: "银行 / 金融 / 沪市主板" },
  { code: "600048.SH", name: "保利发展", market: "SH", sector: "房地产 / 沪市主板" },
  { code: "600050.SH", name: "中国联通", market: "SH", sector: "通信运营 / 沪市主板" },
  { code: "600104.SH", name: "上汽集团", market: "SH", sector: "汽车 / 制造 / 沪市主板" },
  { code: "600276.SH", name: "恒瑞医药", market: "SH", sector: "创新药 / 医药 / 沪市主板" },
  { code: "600309.SH", name: "万华化学", market: "SH", sector: "化工 / 新材料 / 沪市主板" },
  { code: "600438.SH", name: "通威股份", market: "SH", sector: "光伏 / 新能源 / 沪市主板" },
  { code: "600519.SH", name: "贵州茅台", market: "SH", sector: "白酒 / 消费 / 大盘蓝筹" },
  { code: "600690.SH", name: "海尔智家", market: "SH", sector: "家电 / 消费 / 沪市主板" },
  { code: "600887.SH", name: "伊利股份", market: "SH", sector: "乳制品 / 消费 / 沪市主板" },
  { code: "601012.SH", name: "隆基绿能", market: "SH", sector: "光伏 / 新能源 / 沪市主板" },
  { code: "601088.SH", name: "中国神华", market: "SH", sector: "煤炭 / 能源 / 沪市主板" },
  { code: "601166.SH", name: "兴业银行", market: "SH", sector: "银行 / 金融 / 沪市主板" },
  { code: "601318.SH", name: "中国平安", market: "SH", sector: "保险 / 金融 / 大盘蓝筹" },
  { code: "601398.SH", name: "工商银行", market: "SH", sector: "银行 / 金融 / 沪市主板" },
  { code: "601668.SH", name: "中国建筑", market: "SH", sector: "建筑工程 / 央企 / 沪市主板" },
  { code: "601899.SH", name: "紫金矿业", market: "SH", sector: "有色金属 / 黄金铜矿 / 沪市主板" },
  { code: "601919.SH", name: "中远海控", market: "SH", sector: "航运 / 交通运输 / 沪市主板" },
  { code: "603259.SH", name: "药明康德", market: "SH", sector: "医药外包 / 医药 / 沪市主板" },
  { code: "603501.SH", name: "韦尔股份", market: "SH", sector: "半导体 / 电子 / 沪市主板" },
  { code: "688012.SH", name: "中微公司", market: "SH", sector: "半导体设备 / 科创板" },
  { code: "688111.SH", name: "金山办公", market: "SH", sector: "软件 / 办公协同 / 科创板" },
  { code: "688981.SH", name: "中芯国际", market: "SH", sector: "半导体制造 / 科创板" }
];

export function findCatalogStock(input: string) {
  const normalized = input.trim().toUpperCase();
  const code = normalized.match(/(\d{6})(?:\.(SH|SZ|BJ))?/)?.[1];
  return STOCK_CATALOG.find((stock) => stock.code.slice(0, 6) === code || stock.name === input.trim()) ?? null;
}

export function searchCatalogStocks(query: string, limit = 8) {
  const normalized = query.trim().toUpperCase();
  if (!normalized) return [];

  return STOCK_CATALOG.filter(
    (stock) =>
      stock.code.includes(normalized) ||
      stock.code.slice(0, 6).includes(normalized) ||
      stock.name.includes(query.trim())
  ).slice(0, limit);
}
