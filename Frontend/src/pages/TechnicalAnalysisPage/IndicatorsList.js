const IndicatorsList = {
  RSI: { name: "Relative Strength Index", kwargs: { timeperiod: 14 } },
  SMA: { name: "Simple Moving Average", kwargs: { timeperiod: 2 } },
  EMA: { name: "Exponential Moving Average", kwargs: { timeperiod: 50 } },
  MACD: {
    name: "Moving Average Convergence Divergence",
    kwargs: { fastperiod: 12, slowperiod: 26, signalperiod: 9 },
  },
  ATR: { name: "Average True Range", kwargs: { timeperiod: 14 } },
  ADX: {
    name: "Average Directional Movement Index",
    kwargs: { timeperiod: 14 },
  },
  BBANDS: {
    name: "Bollinger Bands",
    kwargs: { timeperiod: 20, nbdevup: 2, nbdevdn: 2 },
  },
  CCI: { name: "Commodity Channel Index", kwargs: { timeperiod: 20 } },
  STOCH: {
    name: "Stochastic Oscillator",
    kwargs: { fastk_period: 14, slowk_period: 3, slowd_period: 3 },
  },
  MFI: { name: "Money Flow Index", kwargs: { timeperiod: 14 } },
  ROC: { name: "Rate of Change", kwargs: { timeperiod: 12 } },
  WILLR: { name: "Williams %R", kwargs: { timeperiod: 14 } },
  ULTOSC: {
    name: "Ultimate Oscillator",
    kwargs: { timeperiod1: 7, timeperiod2: 14, timeperiod3: 28 },
  },
  CMO: { name: "Chande Momentum Oscillator", kwargs: { timeperiod: 14 } },
  TRIX: { name: "Triple Exponential Average", kwargs: { timeperiod: 20 } },
  PPO: {
    name: "Percentage Price Oscillator",
    kwargs: { fastperiod: 12, slowperiod: 26, matype: 0 },
  },
  NATR: { name: "Normalized Average True Range", kwargs: { timeperiod: 14 } },
  MOM: { name: "Momentum", kwargs: { timeperiod: 10 } },
  AROON: { name: "Aroon", kwargs: { timeperiod: 25 } },
  ADX: { name: "Average Directional Index", kwargs: { timeperiod: 6 } },
  TRIMA: { name: "Triangular Moving Average", kwargs: { timeperiod: 30 } },
  TEMA: {
    name: "Triple Exponential Moving Average",
    kwargs: { timeperiod: 15 },
  },
  KAMA: { name: "Kaufman Adaptive Moving Average", kwargs: { timeperiod: 10 } },
  SAR: { name: "Parabolic SAR", kwargs: { acceleration: 0.02, maximum: 0.2 } },
  BOP: { name: "Balance of Power", kwargs: {} },
  HT_TRENDLINE: {
    name: "Hilbert Transform - Instantaneous Trendline",
    kwargs: {},
  },
  HT_TRENDMODE: { name: "Hilbert Transform - Trend vs Cycle Mode", kwargs: {} },
  HT_DCPERIOD: {
    name: "Hilbert Transform - Dominant Cycle Period",
    kwargs: {},
  },
  HT_DCPHASE: { name: "Hilbert Transform - Dominant Cycle Phase", kwargs: {} },
  HT_PHASOR: { name: "Hilbert Transform - Phasor Components", kwargs: {} },
  HT_SINE: { name: "Hilbert Transform - SineWave", kwargs: {} },
  HT_TRENDCOMP: {
    name: "Hilbert Transform - Trendline by - Trend vs Cycle Mode",
    kwargs: {},
  },
  // Add more indicators and their kwargs as needed
};

export default IndicatorsList;
