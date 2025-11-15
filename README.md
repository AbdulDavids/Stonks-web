# Stonks - Stock Market Dashboard

A modern, real-time stock market dashboard built with React, TypeScript, and Shadcn UI components. Features live stock data, interactive charts, and AI-powered stock recommendations.

## Features

- 📊 **Real-time Stock Data** - View current prices, changes, and market data
- 📈 **Interactive Charts** - Historical price charts with multiple time periods (1D, 5D, 1M, 3M, 6M, 1Y, 5Y)
- 🔍 **Stock Search** - Search for any stock by symbol or company name
- 📱 **Market Movers** - Track trending stocks, top gainers, losers, and most active stocks
- 🤖 **AI Insights** - Get AI-powered stock recommendations with price targets and risk analysis
- 📰 **Latest News** - Stay updated with recent company news
- 💹 **Detailed Stats** - View comprehensive stock statistics including market cap, P/E ratio, volume, and more

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling
- **Stockly API** - Stock market data

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Stonks
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Viewing Stocks

- **Sidebar Navigation**: Browse stocks by category (Trending, Gainers, Losers, Most Active)
- **Search**: Use the search bar to find specific stocks by symbol or company name
- **Select Stock**: Click on any stock to view detailed information

### Stock Details

- **Price Chart**: View historical price data with customizable time periods
- **Time Period Selector**: Choose from 1D, 5D, 1M, 3M, 6M, 1Y, or 5Y views
- **Key Metrics**: View important statistics like market cap, volume, P/E ratio, and dividend yield
- **Price Ranges**: See daily and 52-week high/low prices

### AI Recommendations

1. Click the **"Generate"** button in the AI Insights section
2. Wait for the AI to analyze the stock
3. View the recommendation (BUY/SELL/HOLD), price target, confidence level, and risk score
4. Read the detailed justification for the recommendation

## API

This application uses the [Stockly Market API](https://stockly-api.vercel.app) for all stock market data.

Key endpoints used:
- `/v1/finance/trending` - Trending stocks
- `/v1/finance/gainers` - Top gaining stocks
- `/v1/finance/losers` - Top losing stocks
- `/v1/finance/most-active` - Most active stocks
- `/v7/finance/quote` - Stock quotes
- `/v8/finance/chart/{symbol}` - Historical chart data
- `/v1/finance/search` - Stock search
- `/v1/finance/news/{symbol}` - Company news
- `/generate-stock-insights` - AI-powered recommendations

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── ui/              # Shadcn UI components
│   ├── StockList.tsx    # Stock list sidebar
│   ├── StockDetails.tsx # Main stock details view
│   └── StockChart.tsx   # Price chart component
├── lib/
│   ├── api.ts          # API service functions
│   └── utils.ts        # Utility functions
├── App.tsx             # Main application component
└── main.tsx            # Application entry point
```

## License

MIT
