import { cache } from './cache';

const API_BASE_URL = import.meta.env.DEV ? '/api' : 'https://stockly-api.vercel.app';

export interface Stock {
  symbol: string;
  name?: string;
  price?: number;
  change?: number;
  changePercent?: number;
  volume?: number;
}

export interface ChartData {
  timestamp: number[];
  close: number[];
  open: number[];
  high: number[];
  low: number[];
  volume: number[];
}

export interface StockDetails {
  symbol: string;
  longName?: string;
  regularMarketPrice?: number;
  regularMarketChange?: number;
  regularMarketChangePercent?: number;
  regularMarketVolume?: number;
  marketCap?: number;
  fiftyTwoWeekHigh?: number;
  fiftyTwoWeekLow?: number;
  trailingPE?: number;
  dividendYield?: number;
  averageVolume?: number;
  regularMarketOpen?: number;
  regularMarketDayHigh?: number;
  regularMarketDayLow?: number;
  regularMarketPreviousClose?: number;
}

export interface AIRecommendation {
  recommendation: string;
  priceTarget: number;
  riskScore: number;
  confidence: number;
  justification: string;
}

export interface NewsArticle {
  title: string;
  publisher?: string;
  link?: string;
  publishedAt?: string;
  thumbnail?: string;
}

// Get trending stocks
export async function getTrendingStocks(count: number = 10): Promise<Stock[]> {
  const cacheKey = `trending_${count}`;
  const cached = cache.get<Stock[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/v1/finance/trending?count=${count}`);
  if (!response.ok) throw new Error('Failed to fetch trending stocks');
  const data = await response.json();
  const result = data.trending || [];
  
  cache.set(cacheKey, result, 10 * 60 * 1000); // Cache for 10 minutes
  return result;
}

// Get top gainers
export async function getGainers(count: number = 10): Promise<Stock[]> {
  const cacheKey = `gainers_${count}`;
  const cached = cache.get<Stock[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/v1/finance/gainers?count=${count}`);
  if (!response.ok) throw new Error('Failed to fetch gainers');
  const data = await response.json();
  const result = data.stocks || [];
  
  cache.set(cacheKey, result, 10 * 60 * 1000); // Cache for 10 minutes
  return result;
}

// Get top losers
export async function getLosers(count: number = 10): Promise<Stock[]> {
  const cacheKey = `losers_${count}`;
  const cached = cache.get<Stock[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/v1/finance/losers?count=${count}`);
  if (!response.ok) throw new Error('Failed to fetch losers');
  const data = await response.json();
  const result = data.stocks || [];
  
  cache.set(cacheKey, result, 10 * 60 * 1000); // Cache for 10 minutes
  return result;
}

// Get most active stocks
export async function getMostActive(count: number = 10): Promise<Stock[]> {
  const response = await fetch(`${API_BASE_URL}/v1/finance/most-active?count=${count}`);
  if (!response.ok) throw new Error('Failed to fetch most active stocks');
  const data = await response.json();
  return data.stocks || [];
}

// Search stocks
export async function searchStocks(query: string): Promise<Stock[]> {
  const cacheKey = `search_${query}`;
  const cached = cache.get<Stock[]>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/v1/finance/search?q=${encodeURIComponent(query)}&quotesCount=10`);
  if (!response.ok) throw new Error('Failed to search stocks');
  const data = await response.json();
  const result = data.quotes || [];
  
  cache.set(cacheKey, result, 15 * 60 * 1000); // Cache for 15 minutes
  return result;
}

// Get stock quote
export async function getStockQuote(symbol: string): Promise<StockDetails> {
  const cacheKey = `quote_${symbol}`;
  const cached = cache.get<StockDetails>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/v7/finance/quote?symbols=${symbol}`);
  if (!response.ok) throw new Error('Failed to fetch stock quote');
  const data = await response.json();
  const result = data.quoteResponse?.result?.[0];
  if (!result) throw new Error('Stock not found');
  
  cache.set(cacheKey, result, 5 * 60 * 1000); // Cache for 5 minutes
  return result;
}

// Get historical chart data
export async function getChartData(
  symbol: string,
  range: string = '1mo',
  interval: string = '1d'
): Promise<ChartData> {
  const cacheKey = `chart_${symbol}_${range}_${interval}`;
  const cached = cache.get<ChartData>(cacheKey);
  if (cached) return cached;

  const response = await fetch(
    `${API_BASE_URL}/v8/finance/chart/${symbol}?range=${range}&interval=${interval}`
  );
  if (!response.ok) throw new Error('Failed to fetch chart data');
  const data = await response.json();
  
  const result = data.chart?.result?.[0];
  if (!result) throw new Error('Chart data not found');
  
  const chartData: ChartData = {
    timestamp: result.timestamp || [],
    close: result.indicators?.quote?.[0]?.close || [],
    open: result.indicators?.quote?.[0]?.open || [],
    high: result.indicators?.quote?.[0]?.high || [],
    low: result.indicators?.quote?.[0]?.low || [],
    volume: result.indicators?.quote?.[0]?.volume || [],
  };
  
  cache.set(cacheKey, chartData, 15 * 60 * 1000); // Cache for 15 minutes
  return chartData;
}

// Get AI stock insights
export async function getAIInsights(symbol: string): Promise<AIRecommendation> {
  const cacheKey = `ai_insights_${symbol}`;
  const cached = cache.get<AIRecommendation>(cacheKey);
  if (cached) return cached;

  const response = await fetch(`${API_BASE_URL}/generate-stock-insights?symbol=${symbol}`);
  if (!response.ok) throw new Error('Failed to fetch AI insights');
  const result = await response.json();
  
  cache.set(cacheKey, result, 24 * 60 * 60 * 1000); // Cache for 24 hours
  return result;
}

// Get company news
export async function getCompanyNews(symbol: string, count: number = 5): Promise<NewsArticle[]> {
  const response = await fetch(`${API_BASE_URL}/v1/finance/news/${symbol}?count=${count}`);
  if (!response.ok) throw new Error('Failed to fetch company news');
  const data = await response.json();
  return data.news || [];
}

// Format currency
export function formatCurrency(value: number | undefined): string {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

// Format number
export function formatNumber(value: number | undefined): string {
  if (value === undefined || value === null) return 'N/A';
  return new Intl.NumberFormat('en-US').format(value);
}

// Format percentage
export function formatPercent(value: number | undefined): string {
  if (value === undefined || value === null) return 'N/A';
  return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
}

// Format large numbers (for market cap, volume)
export function formatLargeNumber(value: number | undefined): string {
  if (value === undefined || value === null) return 'N/A';
  
  if (value >= 1e12) {
    return `$${(value / 1e12).toFixed(2)}T`;
  } else if (value >= 1e9) {
    return `$${(value / 1e9).toFixed(2)}B`;
  } else if (value >= 1e6) {
    return `$${(value / 1e6).toFixed(2)}M`;
  } else if (value >= 1e3) {
    return `$${(value / 1e3).toFixed(2)}K`;
  }
  return formatCurrency(value);
}
