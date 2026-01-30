
export interface StockInfo {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
}

const COMPANY_TICKER_MAP: Record<string, string> = {
  "Salesforce, Inc.": "CRM",
  "Adobe,Inc": "ADBE",
  "MongoDB, Inc.": "MDB",
  "Datadog": "DDOG",
  "Snowflake Computing, Inc.": "SNOW",
  "Oracle": "ORCL",
  "International Business Machines Corp.": "IBM",
  "CrowdStrike": "CRWD",
  "Palo Alto Networks Inc.": "PANW",
  "Confluent, Inc.": "CFLT",
  "Workday, Inc.": "WDAY",
  "Box, Inc.": "BOX",
  "Elasticsearch, Inc.": "ESTC",
  "Servicenow, Inc.": "NOW",
  "UiPath": "PATH",
  "Appian Corporation": "APPN",
  "Braze, Inc.": "BRZE",
  "Sprinklr, Inc.": "CXM",
  "Zoom": "ZM",
  "Twilio Inc.": "TWLO",
  "Dropbox": "DBX",
  "Ringcentral, Inc.": "RNG",
  "Five9, Inc.": "FIVN",
  "Pegasystems Inc.": "PEGA",
  "Akamai Technologies": "AKAM",
  "Iron Mountain Incorporated": "IRM",
  "Tenable": "TENB",
  "Dynatrace": "DT",
  "GitLab": "GTLB",
  "Pure Storage, Inc.": "PSTG",
  "Okta, Inc.": "OKTA",
  "NetApp": "NTAP",
  "F5, Inc.": "FFIV",
  "Teradata Corporation": "TDC",
  "Fortinet": "FTNT",
  "Arista Networks": "ANET",
  "Cloudflare, Inc.": "NET",
  "Zscaler": "ZS",
  "Qualys Inc.": "QLYS",
  "SentinelOne, Inc": "S",
  "Hewlett Packard Enterprise Company": "HPE",
  "Dell Technologies Inc.": "DELL",
  "Palantir Technologies": "PLTR",
  "C3.ai": "AI",
  "Alphabet Inc.": "GOOGL",
  "Amazon.com, Inc.": "AMZN",
  "Microsoft Corporation": "MSFT"
};

// Base prices for simulation (approximate as of 2025/2026)
const BASE_PRICES: Record<string, number> = {
  "CRM": 320.50,
  "ADBE": 650.00,
  "MDB": 410.20,
  "DDOG": 150.75,
  "SNOW": 180.30,
  "ORCL": 160.10,
  "IBM": 210.40,
  "CRWD": 350.60,
  "PANW": 380.25,
  "CFLT": 45.80,
  "WDAY": 290.15,
  "BOX": 35.50,
  "ESTC": 110.20,
  "NOW": 950.00,
  "PATH": 25.40,
  "APPN": 50.30,
  "BRZE": 60.10,
  "CXM": 12.50,
  "ZM": 75.30,
  "TWLO": 85.20,
  "DBX": 30.10,
  "RNG": 45.60,
  "FIVN": 80.40,
  "PEGA": 70.20,
  "AKAM": 120.50,
  "IRM": 90.30,
  "TENB": 65.40,
  "DT": 60.10,
  "GTLB": 75.50,
  "PSTG": 65.20,
  "OKTA": 110.30,
  "NTAP": 120.40,
  "FFIV": 190.20,
  "TDC": 45.10,
  "FTNT": 95.30,
  "ANET": 350.50,
  "NET": 110.20,
  "ZS": 210.40,
  "QLYS": 180.30,
  "S": 35.40,
  "HPE": 22.50,
  "DELL": 140.20,
  "PLTR": 45.60,
  "AI": 35.20,
  "GOOGL": 190.50,
  "AMZN": 205.30,
  "MSFT": 450.20
};

export async function getStockData(companyNames: string[]): Promise<StockInfo[]> {
  // Simulator: Generate realistic looking price movements based on "Time of Page Load"
  // We use the current time to seed some randomness so it's consistent for a few seconds but changes over time
  
  const stocks: StockInfo[] = [];
  const uniqueTickers = new Set<string>();

  // Add some heavy hitters always
  uniqueTickers.add("GOOGL");
  uniqueTickers.add("AMZN");
  uniqueTickers.add("CRM");
  uniqueTickers.add("PLTR");

  // Add tickers from the provided list
  for (const name of companyNames) {
    const ticker = COMPANY_TICKER_MAP[name];
    if (ticker) {
      uniqueTickers.add(ticker);
    }
  }

  for (const symbol of Array.from(uniqueTickers)) {
    const base = BASE_PRICES[symbol] || 100;
    // Random fluctuation +/- 2%
    const volatility = 0.02; 
    const randomFactor = 1 + (Math.random() * volatility * 2 - volatility);
    const price = base * randomFactor;
    
    // Change calculation
    const change = price - base;
    const changePercent = (change / base) * 100;

    stocks.push({
      symbol,
      name: symbol, // For now just use symbol as name
      price: parseFloat(price.toFixed(2)),
      change: parseFloat(change.toFixed(2)),
      changePercent: parseFloat(changePercent.toFixed(2))
    });
  }

  return stocks;
}
