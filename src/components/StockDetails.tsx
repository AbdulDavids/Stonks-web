import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Sparkles, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { StockChart } from './StockChart';
import { ShineBorder } from '@/components/ui/shine-border';
import { ThemeSwitcher } from './theme-switcher';
import { AnimatedGradientText } from '@/components/ui/animated-gradient-text';
import { NumberTicker } from '@/components/ui/number-ticker';
import { TickerIcon } from '@/components/ui/shadcn-io/ticker';
import { TextEffect } from '@/components/ui/text-effect';
import {
  getStockQuote,
  getChartData,
  getAIInsights,
  type StockDetails as StockDetailsType,
  type ChartData,
  type AIRecommendation,
} from '@/lib/api';
import { cache } from '@/lib/cache';

interface StockDetailsProps {
  symbol: string;
}

const TIME_RANGES = [
  { value: '1d', label: '1D', interval: '5m' },
  { value: '5d', label: '5D', interval: '15m' },
  { value: '1mo', label: '1M', interval: '1d' },
  { value: '3mo', label: '3M', interval: '1d' },
  { value: '6mo', label: '6M', interval: '1d' },
  { value: '1y', label: '1Y', interval: '1wk' },
  { value: '5y', label: '5Y', interval: '1mo' },
];

export function StockDetails({ symbol }: StockDetailsProps) {
  const [details, setDetails] = useState<StockDetailsType | null>(null);
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [aiInsights, setAiInsights] = useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiLoading, setAiLoading] = useState(false);
  const [selectedRange, setSelectedRange] = useState('1mo');
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    // Reset AI insights when symbol changes
    setAiInsights(null);
    
    loadStockData();
    loadChartData();
    
    // Load cached AI insights if available for this specific symbol
    const cachedAI = cache.get<AIRecommendation>(`ai_insights_${symbol}`);
    if (cachedAI) {
      setAiInsights(cachedAI);
    }
  }, [symbol]);

  useEffect(() => {
    loadChartData();
  }, [selectedRange]);

  const loadStockData = async () => {
    try {
      setLoading(true);
      const quoteData = await getStockQuote(symbol);
      setDetails(quoteData);
    } catch (error) {
      console.error('Failed to load stock data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadChartData = async () => {
    try {
      const range = TIME_RANGES.find((r) => r.value === selectedRange);
      if (!range) return;
      const data = await getChartData(symbol, range.value, range.interval);
      setChartData(data);
    } catch (error) {
      console.error('Failed to load chart data:', error);
    }
  };

  const handleGenerateAI = async () => {
    try {
      setAiLoading(true);
      const insights = await getAIInsights(symbol);
      setAiInsights(insights);
    } catch (error) {
      console.error('Failed to generate AI insights:', error);
    } finally {
      setAiLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([loadStockData(), loadChartData()]);
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="h-full p-6 space-y-6">
        <Skeleton className="h-12 w-64" />
        <Skeleton className="h-96 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
    );
  }

  if (!details) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-muted-foreground">Failed to load stock details</p>
      </div>
    );
  }

  const isPositive = (details.regularMarketChange ?? 0) >= 0;

  return (
    <div className="h-full overflow-auto pb-16 md:pb-0">
      <div className="p-4 md:p-6 space-y-4 md:space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <TickerIcon 
                src={`https://raw.githubusercontent.com/nvstly/icons/refs/heads/main/ticker_icons/${symbol.toUpperCase()}.png`}
                symbol={symbol}
                className="size-10"
              />
              <h1 className="text-2xl md:text-3xl font-bold">{symbol}</h1>
              {aiInsights && (
                <div className="relative group">
                  <div className="relative overflow-hidden rounded-xl">
                    <ShineBorder
                      shineColor={["#a855f7", "#3b82f6", "#ec4899"]}
                      duration={6}
                      borderWidth={2}
                    />
                    <div className={`px-4 py-1.5 rounded-xl font-bold text-sm bg-background cursor-help ${
                      aiInsights.recommendation === 'BUY'
                        ? 'text-green-600'
                        : aiInsights.recommendation === 'SELL'
                        ? 'text-red-600'
                        : 'text-yellow-600'
                    }`}>
                      {aiInsights.recommendation}
                    </div>
                  </div>
                  {/* Hover Tooltip */}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none">
                    <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg border w-64">
                      <div className="space-y-2">
                        <div className="font-semibold">AI Recommendation</div>
                        <p className="text-sm text-muted-foreground">
                          {aiInsights.recommendation === 'BUY' && 'AI suggests buying this stock based on analysis'}
                          {aiInsights.recommendation === 'SELL' && 'AI suggests selling this stock based on analysis'}
                          {aiInsights.recommendation === 'HOLD' && 'AI suggests holding this stock based on analysis'}
                        </p>
                        <div className="pt-2 border-t text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Confidence:</span>
                            <span className="font-semibold">{aiInsights.confidence}%</span>
                          </div>
                          <div className="flex justify-between mt-1">
                            <span className="text-muted-foreground">Risk Score:</span>
                            <span className="font-semibold">{aiInsights.riskScore}/10</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRefresh}
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
              </Button>
              <div className="md:hidden ml-auto">
                <ThemeSwitcher />
              </div>
            </div>
            <p className="text-sm md:text-base text-muted-foreground mt-1">{details.longName}</p>
          </div>
          <div className="text-left md:text-right">
            <div className="text-2xl md:text-3xl font-bold">
              $<NumberTicker value={details.regularMarketPrice ?? 0} decimalPlaces={2} />
            </div>
            <div className="flex items-center md:justify-end gap-2 mt-2">
              <div className={`text-sm md:text-lg font-bold px-2 md:px-3 py-1 rounded-lg text-white ${
                isPositive
                  ? 'bg-green-600'
                  : 'bg-red-600'
              }`}>
                {isPositive ? (
                  <TrendingUp className="h-3 md:h-4 w-3 md:w-4 inline mr-1" />
                ) : (
                  <TrendingDown className="h-3 md:h-4 w-3 md:w-4 inline mr-1" />
                )}
                {isPositive ? '+' : '-'}$<NumberTicker value={Math.abs(details.regularMarketChange ?? 0)} decimalPlaces={2} /> (
                {isPositive ? '+' : ''}<NumberTicker value={details.regularMarketChangePercent ?? 0} decimalPlaces={2} />%)
              </div>
            </div>
          </div>
        </div>

        {/* Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Price History</CardTitle>
              <Select value={selectedRange} onValueChange={setSelectedRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIME_RANGES.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-64 md:h-80">
              {chartData && <StockChart data={chartData} symbol={symbol} />}
            </div>
          </CardContent>
        </Card>

        {/* AI Insights */}
        <Card className="relative overflow-hidden">
          {!aiInsights && (
            <ShineBorder
              shineColor={["#a855f7", "#3b82f6", "#ec4899"]}
              duration={8}
              borderWidth={2}
            />
          )}
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  <AnimatedGradientText>
                    AI Insights
                  </AnimatedGradientText>
                </CardTitle>
                <CardDescription>
                  Get AI-powered analysis and recommendations
                </CardDescription>
              </div>
              <Button onClick={handleGenerateAI} disabled={aiLoading}>
                {aiLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Generate
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
          {aiInsights && (
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-lg font-bold px-6 py-2 rounded-lg bg-muted">
                  {aiInsights.recommendation}
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Price Target</div>
                  <div className="text-xl font-bold">
                    $<NumberTicker value={aiInsights.priceTarget} decimalPlaces={2} />
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Confidence</div>
                  <div className="text-xl font-bold">
                    <NumberTicker value={aiInsights.confidence} />%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                  <div className="text-xl font-bold">
                    <NumberTicker value={aiInsights.riskScore} />/10
                  </div>
                </div>
              </div>
              <Separator />
              <div>
                <h4 className="font-semibold mb-2">Analysis</h4>
                <TextEffect per='char' preset='fade' className="text-sm text-muted-foreground">
                  {aiInsights.justification}
                </TextEffect>
              </div>
            </CardContent>
          )}
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Market Cap</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {details.marketCap ? (
                  details.marketCap >= 1e12 ? (
                    <>${(details.marketCap / 1e12).toFixed(2).replace(/\.?0+$/, '')}T</>
                  ) : details.marketCap >= 1e9 ? (
                    <>${(details.marketCap / 1e9).toFixed(2).replace(/\.?0+$/, '')}B</>
                  ) : details.marketCap >= 1e6 ? (
                    <>${(details.marketCap / 1e6).toFixed(2).replace(/\.?0+$/, '')}M</>
                  ) : (
                    <>${(details.marketCap / 1e3).toFixed(2).replace(/\.?0+$/, '')}K</>
                  )
                ) : 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Volume</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                <NumberTicker value={details.regularMarketVolume ?? 0} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>P/E Ratio</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {details.trailingPE ? <NumberTicker value={details.trailingPE} decimalPlaces={2} /> : 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Dividend Yield</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {details.dividendYield ? (
                  <><NumberTicker value={details.dividendYield * 100} decimalPlaces={2} />%</>
                ) : 'N/A'}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Open</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $<NumberTicker value={details.regularMarketOpen ?? 0} decimalPlaces={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Previous Close</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                $<NumberTicker value={details.regularMarketPreviousClose ?? 0} decimalPlaces={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Day Range</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                $<NumberTicker value={details.regularMarketDayLow ?? 0} decimalPlaces={2} /> -{' '}
                $<NumberTicker value={details.regularMarketDayHigh ?? 0} decimalPlaces={2} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>52 Week Range</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm font-bold">
                $<NumberTicker value={details.fiftyTwoWeekLow ?? 0} decimalPlaces={2} /> -{' '}
                $<NumberTicker value={details.fiftyTwoWeekHigh ?? 0} decimalPlaces={2} />
              </div>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}
