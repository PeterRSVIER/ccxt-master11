// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

import { implicitReturnType } from '../base/types.js';
import { Exchange as _Exchange } from '../base/Exchange.js';

interface Exchange {
    publicGetTime (params?: {}): Promise<implicitReturnType>;
    publicGetMarkets (params?: {}): Promise<implicitReturnType>;
    publicGetAssets (params?: {}): Promise<implicitReturnType>;
    publicGetMarketBook (params?: {}): Promise<implicitReturnType>;
    publicGetMarketTrades (params?: {}): Promise<implicitReturnType>;
    publicGetMarketCandles (params?: {}): Promise<implicitReturnType>;
    publicGetTickerPrice (params?: {}): Promise<implicitReturnType>;
    publicGetTickerBook (params?: {}): Promise<implicitReturnType>;
    publicGetTicker24h (params?: {}): Promise<implicitReturnType>;
    privateGetAccount (params?: {}): Promise<implicitReturnType>;
    privateGetOrder (params?: {}): Promise<implicitReturnType>;
    privateGetOrders (params?: {}): Promise<implicitReturnType>;
    privateGetOrdersOpen (params?: {}): Promise<implicitReturnType>;
    privateGetTrades (params?: {}): Promise<implicitReturnType>;
    privateGetBalance (params?: {}): Promise<implicitReturnType>;
    privateGetDeposit (params?: {}): Promise<implicitReturnType>;
    privateGetDepositHistory (params?: {}): Promise<implicitReturnType>;
    privateGetWithdrawalHistory (params?: {}): Promise<implicitReturnType>;
    privatePostOrder (params?: {}): Promise<implicitReturnType>;
    privatePostWithdrawal (params?: {}): Promise<implicitReturnType>;
    privatePutOrder (params?: {}): Promise<implicitReturnType>;
    privateDeleteOrder (params?: {}): Promise<implicitReturnType>;
    privateDeleteOrders (params?: {}): Promise<implicitReturnType>;
}
abstract class Exchange extends _Exchange {}

export default Exchange