// Shared number formatting so price/volume look consistent everywhere
// on the market page (table, grid, movers strip, top cards).

// Crypto prices range from < $0.0001 to tens of thousands — a fixed
// decimal count either truncates small-cap coins to "$0.00" or pads
// BTC with noise. Scale precision to magnitude instead.
export function formatPrice(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '$0';
  const abs = Math.abs(n);
  let maxDecimals;
  if (abs === 0) maxDecimals = 2;
  else if (abs < 0.001) maxDecimals = 8;
  else if (abs < 1) maxDecimals = 6;
  else if (abs < 100) maxDecimals = 4;
  else maxDecimals = 2;

  // Always show at least 2 decimals, but drop trailing zeros beyond that
  // so "$72.2100" reads as "$72.21" while small-cap coins keep precision.
  return '$' + n.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: maxDecimals,
  });
}

// Volume figures are large — compact them to K/M/B so the table and
// cards don't blow out with 12-digit numbers.
export function formatVolume(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '$0';
  const abs = Math.abs(n);
  const sign = n < 0 ? '-' : '';

  if (abs >= 1e9) return `${sign}$${(abs / 1e9).toFixed(2)}B`;
  if (abs >= 1e6) return `${sign}$${(abs / 1e6).toFixed(2)}M`;
  if (abs >= 1e3) return `${sign}$${(abs / 1e3).toFixed(2)}K`;
  return `${sign}$${abs.toFixed(2)}`;
}

export function formatPercent(value) {
  const n = Number(value);
  if (!Number.isFinite(n)) return '0%';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(2)}%`;
}