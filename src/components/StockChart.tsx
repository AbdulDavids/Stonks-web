import { useEffect, useRef } from 'react';
import type { ChartData } from '@/lib/api';

interface StockChartProps {
  data: ChartData;
  symbol: string;
}

export function StockChart({ data, symbol }: StockChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current || !data.timestamp.length) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Get computed color from a temporary element
    // This ensures we get the actual RGB color that Canvas can understand
    const tempDiv = document.createElement('div');
    tempDiv.style.color = 'hsl(var(--primary))';
    document.body.appendChild(tempDiv);
    const computedColor = getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);
    
    // Use the computed RGB color or fallback
    const primaryColor = computedColor || 'rgb(9, 9, 11)';
    
    // Convert RGB to RGBA with different alpha values
    const rgbMatch = primaryColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    const primaryColorLight = rgbMatch 
      ? `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0.2)` 
      : 'rgba(9, 9, 11, 0.2)';
    const primaryColorTransparent = rgbMatch 
      ? `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, 0)` 
      : 'rgba(9, 9, 11, 0)';

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const width = rect.width;
    const height = rect.height;
    const padding = { top: 20, right: 60, bottom: 40, left: 10 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    // Filter out null values
    const validData = data.close
      .map((price, i) => ({ price, timestamp: data.timestamp[i] }))
      .filter((d) => d.price !== null && !isNaN(d.price));

    if (validData.length === 0) return;

    const prices = validData.map((d) => d.price);
    const minPrice = Math.min(...prices);
    const maxPrice = Math.max(...prices);
    const priceRange = maxPrice - minPrice;
    const pricePadding = priceRange * 0.1;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = 'rgba(128, 128, 128, 0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 5; i++) {
      const y = padding.top + (chartHeight / 5) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
    }

    // Draw price labels
    ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'left';
    for (let i = 0; i <= 5; i++) {
      const price = maxPrice + pricePadding - ((priceRange + pricePadding * 2) / 5) * i;
      const y = padding.top + (chartHeight / 5) * i;
      ctx.fillText(`$${price.toFixed(2)}`, width - padding.right + 5, y + 4);
    }

    // Draw line chart
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    ctx.beginPath();
    validData.forEach((d, i) => {
      const x = padding.left + (chartWidth / (validData.length - 1)) * i;
      const y =
        padding.top +
        chartHeight -
        ((d.price - (minPrice - pricePadding)) / (priceRange + pricePadding * 2)) * chartHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.stroke();

    // Draw gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
    gradient.addColorStop(0, primaryColorLight);
    gradient.addColorStop(1, primaryColorTransparent);
    ctx.fillStyle = gradient;

    ctx.beginPath();
    validData.forEach((d, i) => {
      const x = padding.left + (chartWidth / (validData.length - 1)) * i;
      const y =
        padding.top +
        chartHeight -
        ((d.price - (minPrice - pricePadding)) / (priceRange + pricePadding * 2)) * chartHeight;

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });
    ctx.lineTo(width - padding.right, height - padding.bottom);
    ctx.lineTo(padding.left, height - padding.bottom);
    ctx.closePath();
    ctx.fill();

    // Draw date labels
    ctx.fillStyle = 'rgba(128, 128, 128, 0.8)';
    ctx.font = '10px sans-serif';
    ctx.textAlign = 'center';
    const labelCount = Math.min(5, validData.length);
    for (let i = 0; i < labelCount; i++) {
      const dataIndex = Math.floor((validData.length - 1) * (i / (labelCount - 1)));
      const d = validData[dataIndex];
      const x = padding.left + (chartWidth / (validData.length - 1)) * dataIndex;
      const date = new Date(d.timestamp * 1000);
      const label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      ctx.fillText(label, x, height - padding.bottom + 20);
    }
  }, [data, symbol]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ width: '100%', height: '100%' }}
    />
  );
}
