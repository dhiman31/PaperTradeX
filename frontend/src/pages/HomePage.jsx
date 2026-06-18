import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTickerWs } from '../hooks/useTickerWs';
import {fetchPortfolio,initiateVerification,verifyViaOTP,} from '../services/api';
import PriceCard from '../components/PriceCard';
import PortfolioChart from '../components/PortfolioChart';
import '../styles/home.css';

export default function HomePage() {
  const { isAuthenticated } = useAuth();

  // /home WS — 3 coins only
  const { tickers, connected } = useTickerWs('/home');

  const [holdings, setHoldings] = useState(null);
  const [portfolio, setPortfolio] = useState(null);
  const [portfolioError, setPortfolioError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [otp, setOtp] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');

  const loadPortfolio = async () => {
    try {
      const data = await fetchPortfolio();
      setPortfolio(data);
      setHoldings(data.holdings ?? []);
      setNeedsVerification(false);
      setPortfolioError('');
    } catch (err) {
      const message = err.message ?? '';
      if (message.includes('Please verify account first')) {
        setNeedsVerification(true);
        setPortfolio(null);
        setHoldings(null);
        setPortfolioError('');
      } else {
        setPortfolioError(message);
      }
    }
  };

  const sendOTP = async () => {
    try {
      setPortfolioError('');
      setVerificationMessage('');
      await initiateVerification();
      setVerificationMessage('OTP sent to your email.');
    } catch (err) {
      setPortfolioError(err.message);
    }
  };

  const verifyOTP = async (e) => {
    e.preventDefault();
    setVerifying(true);
    setPortfolioError('');
    try {
      await verifyViaOTP(Number(otp));
      window.location.reload();
      setVerificationMessage('Email verified successfully.');
      setOtp('');
      await loadPortfolio();
    } catch (err) {
      setPortfolioError(err.message);
    } finally {
      setVerifying(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    loadPortfolio();
  }, [isAuthenticated]);

  const enrichedHoldings = useMemo(() => {
    if (!holdings) return [];
    return holdings.map((h) => {
      const qty = Number(h.quantity ?? 0);
      const avgBuyPrice = Number(h.avgBuyPrice ?? 0);
      const live = tickers[h.symbol];
      const currentPrice = Number(live?.currentPrice) || avgBuyPrice;
      const invested = qty * avgBuyPrice;
      const currentValue = qty * currentPrice;
      const unrealizedPnl = currentValue - invested;
      const unrealizedPnlPct = invested ? (unrealizedPnl / invested) * 100 : 0;
      return {
        ...h,
        qty,
        currentPrice,
        invested,
        currentValue,
        unrealizedPnl,
        unrealizedPnlPct,
      };
    });
  }, [holdings, tickers]);

  const totals = useMemo(() => {
    return enrichedHoldings.reduce(
      (acc, h) => ({
        invested: acc.invested + h.invested,
        currentValue: acc.currentValue + h.currentValue,
        unrealizedPnl: acc.unrealizedPnl + h.unrealizedPnl,
      }),
      { invested: 0, currentValue: 0, unrealizedPnl: 0 }
    );
  }, [enrichedHoldings]);

  const totalPnlPct = totals.invested
    ? (totals.unrealizedPnl / totals.invested) * 100
    : 0;

  const pnlPositive = totals.unrealizedPnl >= 0;

  return (
    <div className="hp-root">

      {/* ── SECTION 1: Market Prices ─────────────────────── */}
      <section className="hp-section">
        <div className="hp-section-header">
          <div className="hp-section-title-row">
            <h1 className="hp-section-title">Most Popular</h1>
            <span className={`hp-live-badge ${connected ? 'hp-live-badge--on' : 'hp-live-badge--off'}`}>
              <span className="hp-live-dot" />
              {connected ? 'Live' : 'Connecting…'}
            </span>
          </div>
          <p className="hp-section-sub">Real-time prices from Binance</p>
        </div>

        {Object.keys(tickers).length === 0 ? (
          <div className="hp-empty">
            <div className="hp-empty__spinner" />
            <span>Waiting for market data…</span>
          </div>
        ) : (
          <div className="hp-price-grid">
            {Object.values(tickers).map((t) => (
              <PriceCard key={t.symbol} ticker={t} />
            ))}
          </div>
        )}
      </section>

      {/* ── SECTION 2: Portfolio ─────────────────────────── */}
      <section className="hp-section">
        <div className="hp-section-header">
          <h2 className="hp-section-title">Your Portfolio</h2>
          <p className="hp-section-sub">Your holdings and real-time P&amp;L</p>
        </div>

        {/* Guest prompt */}
        {!isAuthenticated && (
          <div className="hp-guest-card">
            <div className="hp-guest-card__icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </div>
            <div>
              <p className="hp-guest-card__heading">Log in to view your portfolio</p>
              <p className="hp-guest-card__sub">
                <Link to="/login" className="hp-accent-link">Log in</Link>
                {' '}or{' '}
                <Link to="/signup" className="hp-accent-link">sign up</Link>
                {' '}to track holdings and P&amp;L.
              </p>
            </div>
          </div>
        )}

        {/* Email verification */}
        {isAuthenticated && needsVerification && (
          <div className="hp-verify-card">
            <p className="hp-verify-card__eyebrow">Action required</p>
            <h3 className="hp-verify-card__heading">Verify your email to unlock trading</h3>
            <p className="hp-verify-card__sub">
              Confirm the one-time code we send to your email to activate your account.
            </p>
            <button className="hp-btn hp-btn--outline" onClick={sendOTP}>
              Send OTP
            </button>
            <form onSubmit={verifyOTP} className="hp-otp-form">
              <input
                type="number"
                placeholder="Enter OTP"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="hp-otp-input"
              />
              <button type="submit" className="hp-btn hp-btn--primary" disabled={verifying}>
                {verifying ? 'Verifying…' : 'Verify'}
              </button>
            </form>
            {verificationMessage && (
              <div className="hp-alert hp-alert--success">{verificationMessage}</div>
            )}
            {portfolioError && (
              <div className="hp-alert hp-alert--error">{portfolioError}</div>
            )}
          </div>
        )}

        {/* Portfolio loaded */}
        {isAuthenticated && !needsVerification && portfolio && (
          <>
            {/* P&L stat bar */}
            <div className="hp-stat-bar">
              <div className="hp-stat">
                <span className="hp-stat__label">Cash balance</span>
                <span className="hp-stat__value">
                  ${portfolio.cashBalance?.toFixed(2)}
                </span>
              </div>
              <div className="hp-stat">
                <span className="hp-stat__label">Total invested</span>
                <span className="hp-stat__value">
                  ${totals.invested.toFixed(2)}
                </span>
              </div>
              <div className="hp-stat">
                <span className="hp-stat__label">Current value</span>
                <span className="hp-stat__value">
                  ${totals.currentValue.toFixed(2)}
                </span>
              </div>
              <div className="hp-stat">
                <span className="hp-stat__label">Unrealized P&amp;L</span>
                <span className={`hp-stat__value ${pnlPositive ? 'hp-pos' : 'hp-neg'}`}>
                  {pnlPositive ? '+' : ''}${totals.unrealizedPnl.toFixed(2)}
                  <span className="hp-stat__pct">
                    ({pnlPositive ? '+' : ''}{totalPnlPct.toFixed(2)}%)
                  </span>
                </span>
              </div>
              <div className="hp-stat">
                <span className="hp-stat__label">Initial balance</span>
                <span className="hp-stat__value">
                  ${portfolio.initialBalance?.toFixed(2)}
                </span>
              </div>
            </div>

            {/* Chart visualization */}
            {enrichedHoldings.length > 0 && (
              <PortfolioChart holdings={enrichedHoldings} totals={totals} />
            )}

            {/* Holdings table */}
            <div className="hp-table-wrap">
              <table className="hp-table">
                <thead>
                  <tr>
                    <th>Symbol</th>
                    <th>Qty</th>
                    <th>Avg buy</th>
                    <th>Current</th>
                    <th>Value</th>
                    <th>P&amp;L</th>
                  </tr>
                </thead>
                <tbody>
                  {enrichedHoldings.map((h) => {
                    const pos = h.unrealizedPnl >= 0;
                    return (
                      <tr key={h.symbol}>
                        <td className="hp-table__symbol">{h.symbol}</td>
                        <td>{h.qty}</td>
                        <td>${Number(h.avgBuyPrice).toFixed(2)}</td>
                        <td>${h.currentPrice.toFixed(2)}</td>
                        <td>${h.currentValue.toFixed(2)}</td>
                        <td className={pos ? 'hp-pos' : 'hp-neg'}>
                          {pos ? '+' : ''}${h.unrealizedPnl.toFixed(2)}
                          <span className="hp-table__pct">
                            {' '}({pos ? '+' : ''}{h.unrealizedPnlPct.toFixed(2)}%)
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {portfolioError && (
              <div className="hp-alert hp-alert--error">{portfolioError}</div>
            )}
          </>
        )}
      </section>

    </div>
  );
}