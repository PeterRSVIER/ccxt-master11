
//  ---------------------------------------------------------------------------

import Exchange from './abstract/binance.js';
import { ExchangeError, ArgumentsRequired, OperationFailed, OperationRejected, InsufficientFunds, OrderNotFound, InvalidOrder, DDoSProtection, InvalidNonce, AuthenticationError, RateLimitExceeded, PermissionDenied, NotSupported, BadRequest, BadSymbol, AccountSuspended, OrderImmediatelyFillable, OnMaintenance, BadResponse, RequestTimeout, OrderNotFillable, MarginModeAlreadySet, MarketClosed } from './base/errors.js';
import { Precise } from './base/Precise.js';
import type { TransferEntry, Int, OrderSide, Balances, OrderType, Trade, OHLCV, Order, FundingRateHistory, OpenInterest, Liquidation, OrderRequest, Str, Transaction, Ticker, OrderBook, Tickers, Market, Greeks, Strings, Currency, MarketInterface, MarginMode, MarginModes, Leverage, Leverages, Num, Option, MarginModification, TradingFeeInterface, Currencies, TradingFees, Conversion, CrossBorrowRate, IsolatedBorrowRates, IsolatedBorrowRate, Dict, LeverageTier, LeverageTiers, int, LedgerEntry, FundingRate, FundingRates, DepositAddress, LongShortRatio, BorrowInterest } from './base/types.js';
import { TRUNCATE, TICK_SIZE } from './base/functions/number.js';
import { sha256 } from './static_dependencies/noble-hashes/sha256.js';
import { rsa } from './base/functions/rsa.js';
import { eddsa } from './base/functions/crypto.js';
import { ed25519 } from './static_dependencies/noble-curves/ed25519.js';

//  ---------------------------------------------------------------------------

/**
 * @class binance
 * @augments Exchange
 */
export default class binance extends Exchange {
    describe () {
        return this.deepExtend (super.describe (), {
            'id': 'binance',
            'name': 'Binance',
            'countries': [ 'JP', 'MT' ], // Japan, Malta
            'rateLimit': 50,
            'certified': true,
            'pro': true,
            // new metainfo2 interface
            'has': {
                'CORS': undefined,
                'spot': true,
                'margin': true,
                'swap': true,
                'future': true,
                'option': true,
                'addMargin': true,
                'borrowCrossMargin': true,
                'borrowIsolatedMargin': true,
                'cancelAllOrders': true,
                'cancelOrder': true,
                'cancelOrders': true,  // contract only
                'closeAllPositions': false,
                'closePosition': false,  // exchange specific closePosition parameter for binance createOrder is not synonymous with how CCXT uses closePositions
                'createConvertTrade': true,
                'createDepositAddress': false,
                'createLimitBuyOrder': true,
                'createLimitSellOrder': true,
                'createMarketBuyOrder': true,
                'createMarketBuyOrderWithCost': true,
                'createMarketOrderWithCost': true,
                'createMarketSellOrder': true,
                'createMarketSellOrderWithCost': true,
                'createOrder': true,
                'createOrders': true,
                'createOrderWithTakeProfitAndStopLoss': false,
                'createPostOnlyOrder': true,
                'createReduceOnlyOrder': true,
                'createStopLimitOrder': true,
                'createStopLossOrder': true,
                'createStopMarketOrder': false,
                'createStopOrder': true,
                'createTakeProfitOrder': true,
                'createTrailingPercentOrder': true,
                'createTriggerOrder': true,
                'editOrder': true,
                'fetchAccounts': undefined,
                'fetchBalance': true,
                'fetchBidsAsks': true,
                'fetchBorrowInterest': true,
                'fetchBorrowRateHistories': false,
                'fetchBorrowRateHistory': true,
                'fetchCanceledAndClosedOrders': 'emulated',
                'fetchCanceledOrders': 'emulated',
                'fetchClosedOrder': false,
                'fetchClosedOrders': 'emulated',
                'fetchConvertCurrencies': true,
                'fetchConvertQuote': true,
                'fetchConvertTrade': true,
                'fetchConvertTradeHistory': true,
                'fetchCrossBorrowRate': true,
                'fetchCrossBorrowRates': false,
                'fetchCurrencies': true,
                'fetchDeposit': false,
                'fetchDepositAddress': true,
                'fetchDepositAddresses': false,
                'fetchDepositAddressesByNetwork': false,
                'fetchDeposits': true,
                'fetchDepositsWithdrawals': false,
                'fetchDepositWithdrawFee': 'emulated',
                'fetchDepositWithdrawFees': true,
                'fetchFundingHistory': true,
                'fetchFundingInterval': 'emulated',
                'fetchFundingIntervals': true,
                'fetchFundingRate': true,
                'fetchFundingRateHistory': true,
                'fetchFundingRates': true,
                'fetchGreeks': true,
                'fetchIndexOHLCV': true,
                'fetchIsolatedBorrowRate': 'emulated',
                'fetchIsolatedBorrowRates': true,
                'fetchL3OrderBook': false,
                'fetchLastPrices': true,
                'fetchLedger': true,
                'fetchLedgerEntry': true,
                'fetchLeverage': 'emulated',
                'fetchLeverages': true,
                'fetchLeverageTiers': true,
                'fetchLiquidations': false,
                'fetchLongShortRatio': false,
                'fetchLongShortRatioHistory': true,
                'fetchMarginAdjustmentHistory': true,
                'fetchMarginMode': true,
                'fetchMarginModes': true,
                'fetchMarketLeverageTiers': 'emulated',
                'fetchMarkets': true,
                'fetchMarkOHLCV': true,
                'fetchMarkPrice': true,
                'fetchMarkPrices': true,
                'fetchMyLiquidations': true,
                'fetchMySettlementHistory': true,
                'fetchMyTrades': true,
                'fetchOHLCV': true,
                'fetchOpenInterest': true,
                'fetchOpenInterestHistory': true,
                'fetchOpenOrder': true,
                'fetchOpenOrders': true,
                'fetchOption': true,
                'fetchOptionChain': false,
                'fetchOrder': true,
                'fetchOrderBook': true,
                'fetchOrderBooks': false,
                'fetchOrders': true,
                'fetchOrderTrades': true,
                'fetchPosition': true,
                'fetchPositionHistory': false,
                'fetchPositionMode': true,
                'fetchPositions': true,
                'fetchPositionsHistory': false,
                'fetchPositionsRisk': true,
                'fetchPremiumIndexOHLCV': true,
                'fetchSettlementHistory': true,
                'fetchStatus': true,
                'fetchTicker': true,
                'fetchTickers': true,
                'fetchTime': true,
                'fetchTrades': true,
                'fetchTradingFee': true,
                'fetchTradingFees': true,
                'fetchTradingLimits': 'emulated',
                'fetchTransactionFee': 'emulated',
                'fetchTransactionFees': true,
                'fetchTransactions': false,
                'fetchTransfer': false,
                'fetchTransfers': true,
                'fetchUnderlyingAssets': false,
                'fetchVolatilityHistory': false,
                'fetchWithdrawAddresses': false,
                'fetchWithdrawal': false,
                'fetchWithdrawals': true,
                'fetchWithdrawalWhitelist': false,
                'reduceMargin': true,
                'repayCrossMargin': true,
                'repayIsolatedMargin': true,
                'sandbox': true,
                'setLeverage': true,
                'setMargin': false,
                'setMarginMode': true,
                'setPositionMode': true,
                'signIn': false,
                'transfer': true,
                'withdraw': true,
            },
            'timeframes': {
                '1s': '1s', // spot only for now
                '1m': '1m',
                '3m': '3m',
                '5m': '5m',
                '15m': '15m',
                '30m': '30m',
                '1h': '1h',
                '2h': '2h',
                '4h': '4h',
                '6h': '6h',
                '8h': '8h',
                '12h': '12h',
                '1d': '1d',
                '3d': '3d',
                '1w': '1w',
                '1M': '1M',
            },
            'urls': {
                'logo': 'https://github.com/user-attachments/assets/e9419b93-ccb0-46aa-9bff-c883f096274b',
                'test': {
                    'dapiPublic': 'https://testnet.binancefuture.com/dapi/v1',
                    'dapiPrivate': 'https://testnet.binancefuture.com/dapi/v1',
                    'dapiPrivateV2': 'https://testnet.binancefuture.com/dapi/v2',
                    'fapiPublic': 'https://testnet.binancefuture.com/fapi/v1',
                    'fapiPublicV2': 'https://testnet.binancefuture.com/fapi/v2',
                    'fapiPublicV3': 'https://testnet.binancefuture.com/fapi/v3',
                    'fapiPrivate': 'https://testnet.binancefuture.com/fapi/v1',
                    'fapiPrivateV2': 'https://testnet.binancefuture.com/fapi/v2',
                    'fapiPrivateV3': 'https://testnet.binancefuture.com/fapi/v3',
                    'public': 'https://testnet.binance.vision/api/v3',
                    'private': 'https://testnet.binance.vision/api/v3',
                    'v1': 'https://testnet.binance.vision/api/v1',
                },
                'api': {
                    'sapi': 'https://api.binance.com/sapi/v1',
                    'sapiV2': 'https://api.binance.com/sapi/v2',
                    'sapiV3': 'https://api.binance.com/sapi/v3',
                    'sapiV4': 'https://api.binance.com/sapi/v4',
                    'dapiPublic': 'https://dapi.binance.com/dapi/v1',
                    'dapiPrivate': 'https://dapi.binance.com/dapi/v1',
                    'eapiPublic': 'https://eapi.binance.com/eapi/v1',
                    'eapiPrivate': 'https://eapi.binance.com/eapi/v1',
                    'dapiPrivateV2': 'https://dapi.binance.com/dapi/v2',
                    'dapiData': 'https://dapi.binance.com/futures/data',
                    'fapiPublic': 'https://fapi.binance.com/fapi/v1',
                    'fapiPublicV2': 'https://fapi.binance.com/fapi/v2',
                    'fapiPublicV3': 'https://fapi.binance.com/fapi/v3',
                    'fapiPrivate': 'https://fapi.binance.com/fapi/v1',
                    'fapiPrivateV2': 'https://fapi.binance.com/fapi/v2',
                    'fapiPrivateV3': 'https://fapi.binance.com/fapi/v3',
                    'fapiData': 'https://fapi.binance.com/futures/data',
                    'public': 'https://api.binance.com/api/v3',
                    'private': 'https://api.binance.com/api/v3',
                    'v1': 'https://api.binance.com/api/v1',
                    'papi': 'https://papi.binance.com/papi/v1',
                },
                'www': 'https://www.binance.com',
                'referral': {
                    'url': 'https://accounts.binance.com/en/register?ref=D7YA7CLY',
                    'discount': 0.1,
                },
                'doc': [
                    'https://developers.binance.com/en',
                ],
                'api_management': 'https://www.binance.com/en/usercenter/settings/api-management',
                'fees': 'https://www.binance.com/en/fee/schedule',
            },
            'api': {
                // the API structure below will need 3-layer apidefs
                'sapi': {
                    // IP (sapi) request rate limit of 12 000 per minute
                    // 1 IP (sapi) => cost = 0.1 => (1000 / (50 * 0.1)) * 60 = 12000
                    // 10 IP (sapi) => cost = 1
                    // UID (sapi) request rate limit of 180 000 per minute
                    // 1 UID (sapi) => cost = 0.006667 => (1000 / (50 * 0.006667)) * 60 = 180000
                    'get': {
                        // copy trading
                        'copyTrading/futures/userStatus': 2,
                        'copyTrading/futures/leadSymbol': 2,
                        'system/status': 0.1,
                        // these endpoints require this.apiKey
                        'accountSnapshot': 240, // Weight(IP): 2400 => cost = 0.1 * 2400 = 240
                        'account/info': 0.1,
                        'margin/asset': 1, // Weight(IP): 10 => cost = 0.1 * 10 = 1
                        'margin/pair': 1,
                        'margin/allAssets': 0.1,
                        'margin/allPairs': 0.1,
                        'margin/priceIndex': 1,
                        // these endpoints require this.apiKey + this.secret
                        'spot/delist-schedule': 10,
                        'asset/assetDividend': 1,
                        'asset/dribblet': 0.1,
                        'asset/transfer': 0.1,
                        'asset/assetDetail': 0.1,
                        'asset/tradeFee': 0.1,
                        'asset/ledger-transfer/cloud-mining/queryByPage': 4.0002, // Weight(UID): 600 => cost = 0.006667 * 600 = 4.0002
                        'asset/convert-transfer/queryByPage': 0.033335,
                        'asset/wallet/balance': 6, // Weight(IP): 60 => cost = 0.1 * 60 = 6
                        'asset/custody/transfer-history': 6, // Weight(IP): 60 => cost = 0.1 * 60 = 6
                        'margin/borrow-repay': 1,
                        'margin/loan': 1,
                        'margin/repay': 1,
                        'margin/account': 1,
                        'margin/transfer': 0.1,
                        'margin/interestHistory': 0.1,
                        'margin/forceLiquidationRec': 0.1,
                        'margin/order': 1,
                        'margin/openOrders': 1,
                        'margin/allOrders': 20, // Weight(IP): 200 => cost = 0.1 * 200 = 20
                        'margin/myTrades': 1,
                        'margin/maxBorrowable': 5, // Weight(IP): 50 => cost = 0.1 * 50 = 5
                        'margin/maxTransferable': 5,
                        'margin/tradeCoeff': 1,
                        'margin/isolated/transfer': 0.1,
                        'margin/isolated/account': 1,
                        'margin/isolated/pair': 1,
                        'margin/isolated/allPairs': 1,
                        'margin/isolated/accountLimit': 0.1,
                        'margin/interestRateHistory': 0.1,
                        'margin/orderList': 1,
                        'margin/allOrderList': 20, // Weight(IP): 200 => cost = 0.1 * 200 = 20
                        'margin/openOrderList': 1,
                        'margin/crossMarginData': { 'cost': 0.1, 'noCoin': 0.5 },
                        'margin/isolatedMarginData': { 'cost': 0.1, 'noCoin': 1 },
                        'margin/isolatedMarginTier': 0.1,
                        'margin/rateLimit/order': 2,
                        'margin/dribblet': 0.1,
                        'margin/dust': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20
                        'margin/crossMarginCollateralRatio': 10,
                        'margin/exchange-small-liability': 0.6667,
                        'margin/exchange-small-liability-history': 0.6667,
                        'margin/next-hourly-interest-rate': 0.6667,
                        'margin/capital-flow': 10, // Weight(IP): 100 => cost = 0.1 * 100 = 10
                        'margin/delist-schedule': 10, // Weight(IP): 100 => cost = 0.1 * 100 = 10
                        'margin/available-inventory': 0.3334, // Weight(UID): 50 => cost = 0.006667 * 50 = 0.3334
                        'margin/leverageBracket': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'loan/vip/loanable/data': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/vip/collateral/data': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/vip/request/data': 2.6668, // Weight(UID): 400 => cost = 0.006667 * 400 = 2.6668
                        'loan/vip/request/interestRate': 2.6668, // Weight(UID): 400 => cost = 0.006667 * 400 = 2.6668
                        'loan/income': 40.002, // Weight(UID): 6000 => cost = 0.006667 * 6000 = 40.002
                        'loan/ongoing/orders': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/ltv/adjustment/history': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/borrow/history': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/repay/history': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/loanable/data': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/collateral/data': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/repay/collateral/rate': 600, // Weight(IP): 6000 => cost = 0.1 * 6000 = 600
                        'loan/flexible/ongoing/orders': 30, // TODO: Deprecating at 2024-04-24 03:00 (UTC)
                        'loan/flexible/borrow/history': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40, check flexible rate loans order history before 2024-02-27 08:00 (UTC)
                        'loan/flexible/repay/history': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40, check flexible rate loans order history before 2024-02-27 08:00 (UTC)
                        'loan/flexible/ltv/adjustment/history': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40, check flexible rate loans order history before 2024-02-27 08:00 (UTC)
                        'loan/vip/ongoing/orders': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/vip/repay/history': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/vip/collateral/account': 600, // Weight(IP): 6000 => cost = 0.1 * 6000 = 600
                        'fiat/orders': 600.03, // Weight(UID): 90000 => cost = 0.006667 * 90000 = 600.03
                        'fiat/payments': 0.1,
                        'futures/transfer': 1,
                        'futures/histDataLink': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'rebate/taxQuery': 80.004, // Weight(UID): 12000 => cost = 0.006667 * 12000 = 80.004
                        'capital/config/getall': 1, // get networks for withdrawing USDT ERC20 vs USDT Omni
                        'capital/deposit/address': 1,
                        'capital/deposit/address/list': 1,
                        'capital/deposit/hisrec': 0.1,
                        'capital/deposit/subAddress': 0.1,
                        'capital/deposit/subHisrec': 0.1,
                        'capital/withdraw/history': 2, // Weight(UID): 18000 + (Additional: 10 requests per second => cost = ( 1000 / rateLimit ) / 10 = 2
                        'capital/withdraw/address/list': 10,
                        'capital/contract/convertible-coins': 4.0002, // Weight(UID): 600 => cost = 0.006667 * 600 = 4.0002
                        'convert/tradeFlow': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20.001
                        'convert/exchangeInfo': 50,
                        'convert/assetInfo': 10,
                        'convert/orderStatus': 0.6667,
                        'convert/limit/queryOpenOrders': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20.001
                        'account/status': 0.1,
                        'account/apiTradingStatus': 0.1,
                        'account/apiRestrictions/ipRestriction': 0.1,
                        'bnbBurn': 0.1,
                        'sub-account/futures/account': 1,
                        'sub-account/futures/accountSummary': 0.1,
                        'sub-account/futures/positionRisk': 1,
                        'sub-account/futures/internalTransfer': 0.1,
                        'sub-account/list': 0.1,
                        'sub-account/margin/account': 1,
                        'sub-account/margin/accountSummary': 1,
                        'sub-account/spotSummary': 0.1,
                        'sub-account/status': 1,
                        'sub-account/sub/transfer/history': 0.1,
                        'sub-account/transfer/subUserHistory': 0.1,
                        'sub-account/universalTransfer': 0.1,
                        'sub-account/apiRestrictions/ipRestriction/thirdPartyList': 1,
                        'sub-account/transaction-statistics': 0.40002, // Weight(UID): 60 => cost = 0.006667 * 60 = 0.40002
                        'sub-account/subAccountApi/ipRestriction': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20.001
                        'managed-subaccount/asset': 0.1,
                        'managed-subaccount/accountSnapshot': 240,
                        'managed-subaccount/queryTransLogForInvestor': 0.1,
                        'managed-subaccount/queryTransLogForTradeParent': 0.40002, // Weight(UID): 60 => cost = 0.006667 * 60 = 0.40002
                        'managed-subaccount/fetch-future-asset': 0.40002, // Weight(UID): 60 => cost = 0.006667 * 60 = 0.40002
                        'managed-subaccount/marginAsset': 0.1,
                        'managed-subaccount/info': 0.40002, // Weight(UID): 60 => cost = 0.006667 * 60 = 0.40002
                        'managed-subaccount/deposit/address': 0.006667, // Weight(UID): 1 => cost = 0.006667 * 1 = 0.006667
                        'managed-subaccount/query-trans-log': 0.40002,
                        // lending endpoints
                        'lending/daily/product/list': 0.1,
                        'lending/daily/userLeftQuota': 0.1,
                        'lending/daily/userRedemptionQuota': 0.1,
                        'lending/daily/token/position': 0.1,
                        'lending/union/account': 0.1,
                        'lending/union/purchaseRecord': 0.1,
                        'lending/union/redemptionRecord': 0.1,
                        'lending/union/interestHistory': 0.1,
                        'lending/project/list': 0.1,
                        'lending/project/position/list': 0.1,
                        // eth-staking
                        'eth-staking/eth/history/stakingHistory': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'eth-staking/eth/history/redemptionHistory': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'eth-staking/eth/history/rewardsHistory': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'eth-staking/eth/quota': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'eth-staking/eth/history/rateHistory': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'eth-staking/account': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'eth-staking/wbeth/history/wrapHistory': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'eth-staking/wbeth/history/unwrapHistory': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'eth-staking/eth/history/wbethRewardsHistory': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'sol-staking/sol/history/stakingHistory': 15,
                        'sol-staking/sol/history/redemptionHistory': 15,
                        'sol-staking/sol/history/bnsolRewardsHistory': 15,
                        'sol-staking/sol/history/rateHistory': 15,
                        'sol-staking/account': 15,
                        'sol-staking/sol/quota': 15,
                        // mining endpoints
                        'mining/pub/algoList': 0.1,
                        'mining/pub/coinList': 0.1,
                        'mining/worker/detail': 0.5, // Weight(IP): 5 => cost = 0.1 * 5 = 0.5
                        'mining/worker/list': 0.5,
                        'mining/payment/list': 0.5,
                        'mining/statistics/user/status': 0.5,
                        'mining/statistics/user/list': 0.5,
                        'mining/payment/uid': 0.5,
                        // liquid swap endpoints
                        'bswap/pools': 0.1,
                        'bswap/liquidity': { 'cost': 0.1, 'noPoolId': 1 },
                        'bswap/liquidityOps': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20.001
                        'bswap/quote': 1.00005, // Weight(UID): 150 => cost = 0.006667 * 150 = 1.00005
                        'bswap/swap': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20.001
                        'bswap/poolConfigure': 1.00005, // Weight(UID): 150 => cost = 0.006667 * 150 = 1.00005
                        'bswap/addLiquidityPreview': 1.00005, // Weight(UID): 150 => cost = 0.006667 * 150 = 1.00005
                        'bswap/removeLiquidityPreview': 1.00005, // Weight(UID): 150 => cost = 0.006667 * 150 = 1.00005
                        'bswap/unclaimedRewards': 6.667, // Weight(UID): 1000 => cost = 0.006667 * 1000 = 6.667
                        'bswap/claimedHistory': 6.667, // Weight(UID): 1000 => cost = 0.006667 * 1000 = 6.667
                        // leveraged token endpoints
                        'blvt/tokenInfo': 0.1,
                        'blvt/subscribe/record': 0.1,
                        'blvt/redeem/record': 0.1,
                        'blvt/userLimit': 0.1,
                        // broker api TODO (NOT IN DOCS)
                        'apiReferral/ifNewUser': 1,
                        'apiReferral/customization': 1,
                        'apiReferral/userCustomization': 1,
                        'apiReferral/rebate/recentRecord': 1,
                        'apiReferral/rebate/historicalRecord': 1,
                        'apiReferral/kickback/recentRecord': 1,
                        'apiReferral/kickback/historicalRecord': 1,
                        // brokerage API TODO https://binance-docs.github.io/Brokerage-API/General/ does not state ratelimits
                        'broker/subAccountApi': 1,
                        'broker/subAccount': 1,
                        'broker/subAccountApi/commission/futures': 1,
                        'broker/subAccountApi/commission/coinFutures': 1,
                        'broker/info': 1,
                        'broker/transfer': 1,
                        'broker/transfer/futures': 1,
                        'broker/rebate/recentRecord': 1,
                        'broker/rebate/historicalRecord': 1,
                        'broker/subAccount/bnbBurn/status': 1,
                        'broker/subAccount/depositHist': 1,
                        'broker/subAccount/spotSummary': 1,
                        'broker/subAccount/marginSummary': 1,
                        'broker/subAccount/futuresSummary': 1,
                        'broker/rebate/futures/recentRecord': 1,
                        'broker/subAccountApi/ipRestriction': 1,
                        'broker/universalTransfer': 1,
                        // v2 not supported yet
                        // GET /sapi/v2/broker/subAccount/futuresSummary
                        'account/apiRestrictions': 0.1,
                        // c2c / p2p
                        'c2c/orderMatch/listUserOrderHistory': 0.1,
                        // nft endpoints
                        'nft/history/transactions': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20.001
                        'nft/history/deposit': 20.001,
                        'nft/history/withdraw': 20.001,
                        'nft/user/getAsset': 20.001,
                        'pay/transactions': 20.001,
                        'giftcard/verify': 0.1,
                        'giftcard/cryptography/rsa-public-key': 0.1,
                        'giftcard/buyCode/token-limit': 0.1,
                        'algo/spot/openOrders': 0.1,
                        'algo/spot/historicalOrders': 0.1,
                        'algo/spot/subOrders': 0.1,
                        'algo/futures/openOrders': 0.1,
                        'algo/futures/historicalOrders': 0.1,
                        'algo/futures/subOrders': 0.1,
                        'portfolio/account': 0.1,
                        'portfolio/collateralRate': 5,
                        'portfolio/pmLoan': 3.3335,
                        'portfolio/interest-history': 0.6667,
                        'portfolio/asset-index-price': 0.1,
                        'portfolio/repay-futures-switch': 3, // Weight(IP): 30 => cost = 0.1 * 30 = 3
                        'portfolio/margin-asset-leverage': 5, // Weight(IP): 50 => cost = 0.1 * 50 = 5
                        'portfolio/balance': 2,
                        // staking
                        'staking/productList': 0.1,
                        'staking/position': 0.1,
                        'staking/stakingRecord': 0.1,
                        'staking/personalLeftQuota': 0.1,
                        'lending/auto-invest/target-asset/list': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'lending/auto-invest/target-asset/roi/list': 0.1,
                        'lending/auto-invest/all/asset': 0.1,
                        'lending/auto-invest/source-asset/list': 0.1,
                        'lending/auto-invest/plan/list': 0.1,
                        'lending/auto-invest/plan/id': 0.1,
                        'lending/auto-invest/history/list': 0.1,
                        'lending/auto-invest/index/info': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'lending/auto-invest/index/user-summary': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'lending/auto-invest/one-off/status': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'lending/auto-invest/redeem/history': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'lending/auto-invest/rebalance/history': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        // simple earn
                        'simple-earn/flexible/list': 15,
                        'simple-earn/locked/list': 15,
                        'simple-earn/flexible/personalLeftQuota': 15,
                        'simple-earn/locked/personalLeftQuota': 15,
                        'simple-earn/flexible/subscriptionPreview': 15,
                        'simple-earn/locked/subscriptionPreview': 15,
                        'simple-earn/flexible/history/rateHistory': 15,
                        'simple-earn/flexible/position': 15,
                        'simple-earn/locked/position': 15,
                        'simple-earn/account': 15,
                        'simple-earn/flexible/history/subscriptionRecord': 15,
                        'simple-earn/locked/history/subscriptionRecord': 15,
                        'simple-earn/flexible/history/redemptionRecord': 15,
                        'simple-earn/locked/history/redemptionRecord': 15,
                        'simple-earn/flexible/history/rewardsRecord': 15,
                        'simple-earn/locked/history/rewardsRecord': 15,
                        'simple-earn/flexible/history/collateralRecord': 0.1,
                        // Convert
                        'dci/product/list': 0.1,
                        'dci/product/positions': 0.1,
                        'dci/product/accounts': 0.1,
                    },
                    'post': {
                        'asset/dust': 0.06667, // Weight(UID): 10 => cost = 0.006667 * 10 = 0.06667
                        'asset/dust-btc': 0.1,
                        'asset/transfer': 6.0003, // Weight(UID): 900 => cost = 0.006667 * 900 = 6.0003
                        'asset/get-funding-asset': 0.1,
                        'asset/convert-transfer': 0.033335,
                        'account/disableFastWithdrawSwitch': 0.1,
                        'account/enableFastWithdrawSwitch': 0.1,
                        // 'account/apiRestrictions/ipRestriction': 1, discontinued
                        // 'account/apiRestrictions/ipRestriction/ipList': 1, discontinued
                        'capital/withdraw/apply': 4.0002, // Weight(UID): 600 => cost = 0.006667 * 600 = 4.0002
                        'capital/contract/convertible-coins': 4.0002,
                        'capital/deposit/credit-apply': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'margin/borrow-repay': 20.001,
                        'margin/transfer': 4.0002,
                        'margin/loan': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20.001
                        'margin/repay': 20.001,
                        'margin/order': 0.040002, // Weight(UID): 6 => cost = 0.006667 * 6 = 0.040002
                        'margin/order/oco': 0.040002,
                        'margin/dust': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20.001
                        'margin/exchange-small-liability': 20.001,
                        // 'margin/isolated/create': 1, discontinued
                        'margin/isolated/transfer': 4.0002, // Weight(UID): 600 => cost = 0.006667 * 600 = 4.0002
                        'margin/isolated/account': 2.0001, // Weight(UID): 300 => cost = 0.006667 * 300 = 2.0001
                        'margin/max-leverage': 300, // Weight(IP): 3000 => cost = 0.1 * 3000 = 300
                        'bnbBurn': 0.1,
                        'sub-account/virtualSubAccount': 0.1,
                        'sub-account/margin/transfer': 4.0002, // Weight(UID): 600 => cost =  0.006667 * 600 = 4.0002
                        'sub-account/margin/enable': 0.1,
                        'sub-account/futures/enable': 0.1,
                        'sub-account/futures/transfer': 0.1,
                        'sub-account/futures/internalTransfer': 0.1,
                        'sub-account/transfer/subToSub': 0.1,
                        'sub-account/transfer/subToMaster': 0.1,
                        'sub-account/universalTransfer': 0.1,
                        'sub-account/options/enable': 0.1,
                        'managed-subaccount/deposit': 0.1,
                        'managed-subaccount/withdraw': 0.1,
                        'userDataStream': 0.1,
                        'userDataStream/isolated': 0.1,
                        'futures/transfer': 0.1,
                        // lending
                        'lending/customizedFixed/purchase': 0.1,
                        'lending/daily/purchase': 0.1,
                        'lending/daily/redeem': 0.1,
                        // liquid swap endpoints
                        'bswap/liquidityAdd': 60, // Weight(UID): 1000 + (Additional: 1 request every 3 seconds =  0.333 requests per second) => cost = ( 1000 / rateLimit ) / 0.333 = 60.0000006
                        'bswap/liquidityRemove': 60, // Weight(UID): 1000 + (Additional: 1 request every three seconds)
                        'bswap/swap': 60, // Weight(UID): 1000 + (Additional: 1 request every three seconds)
                        'bswap/claimRewards': 6.667, // Weight(UID): 1000 => cost = 0.006667 * 1000 = 6.667
                        // leveraged token endpoints
                        'blvt/subscribe': 0.1,
                        'blvt/redeem': 0.1,
                        // brokerage API TODO: NO MENTION OF RATELIMITS IN BROKERAGE DOCS
                        'apiReferral/customization': 1,
                        'apiReferral/userCustomization': 1,
                        'apiReferral/rebate/historicalRecord': 1,
                        'apiReferral/kickback/historicalRecord': 1,
                        'broker/subAccount': 1,
                        'broker/subAccount/margin': 1,
                        'broker/subAccount/futures': 1,
                        'broker/subAccountApi': 1,
                        'broker/subAccountApi/permission': 1,
                        'broker/subAccountApi/commission': 1,
                        'broker/subAccountApi/commission/futures': 1,
                        'broker/subAccountApi/commission/coinFutures': 1,
                        'broker/transfer': 1,
                        'broker/transfer/futures': 1,
                        'broker/rebate/historicalRecord': 1,
                        'broker/subAccount/bnbBurn/spot': 1,
                        'broker/subAccount/bnbBurn/marginInterest': 1,
                        'broker/subAccount/blvt': 1,
                        'broker/subAccountApi/ipRestriction': 1,
                        'broker/subAccountApi/ipRestriction/ipList': 1,
                        'broker/universalTransfer': 1,
                        'broker/subAccountApi/permission/universalTransfer': 1,
                        'broker/subAccountApi/permission/vanillaOptions': 1,
                        //
                        'giftcard/createCode': 0.1,
                        'giftcard/redeemCode': 0.1,
                        'giftcard/buyCode': 0.1,
                        'algo/spot/newOrderTwap': 20.001,
                        'algo/futures/newOrderVp': 20.001,
                        'algo/futures/newOrderTwap': 20.001,
                        // staking
                        'staking/purchase': 0.1,
                        'staking/redeem': 0.1,
                        'staking/setAutoStaking': 0.1,
                        // eth-staking
                        'eth-staking/eth/stake': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'eth-staking/eth/redeem': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'eth-staking/wbeth/wrap': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'sol-staking/sol/stake': 15,
                        'sol-staking/sol/redeem': 15,
                        // mining endpoints
                        'mining/hash-transfer/config': 0.5, // Weight(IP): 5 => cost = 0.1 * 5 = 0.5
                        'mining/hash-transfer/config/cancel': 0.5, // Weight(IP): 5 => cost = 0.1 * 5 = 0.5
                        'portfolio/repay': 20.001,
                        'loan/vip/renew': 40.002, // Weight(UID): 6000 => cost = 0.006667 * 6000 = 40.002
                        'loan/vip/borrow': 40.002,
                        'loan/borrow': 40.002,
                        'loan/repay': 40.002,
                        'loan/adjust/ltv': 40.002,
                        'loan/customize/margin_call': 40.002,
                        'loan/flexible/repay': 40.002, // TODO: Deprecating at 2024-04-24 03:00 (UTC)
                        'loan/flexible/adjust/ltv': 40.002, // TODO: Deprecating at 2024-04-24 03:00 (UTC)
                        'loan/vip/repay': 40.002,
                        'convert/getQuote': 1.3334, // Weight(UID): 200 => cost = 0.006667 * 200 = 1.3334
                        'convert/acceptQuote': 3.3335, // Weight(UID): 500 => cost = 0.006667 * 500 = 3.3335
                        'convert/limit/placeOrder': 3.3335, // Weight(UID): 500 => cost = 0.006667 * 500 = 3.3335
                        'convert/limit/cancelOrder': 1.3334, // Weight(UID): 200 => cost = 0.006667 * 200 = 1.3334
                        'portfolio/auto-collection': 150, // Weight(IP): 1500 => cost = 0.1 * 1500 = 150
                        'portfolio/asset-collection': 6, // Weight(IP): 60 => cost = 0.1 * 60 = 6
                        'portfolio/bnb-transfer': 150, // Weight(IP): 1500 => cost = 0.1 * 1500 = 150
                        'portfolio/repay-futures-switch': 150, // Weight(IP): 1500 => cost = 0.1 * 1500 = 150
                        'portfolio/repay-futures-negative-balance': 150, // Weight(IP): 1500 => cost = 0.1 * 1500 = 150
                        'lending/auto-invest/plan/add': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'lending/auto-invest/plan/edit': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'lending/auto-invest/plan/edit-status': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'lending/auto-invest/one-off': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        'lending/auto-invest/redeem': 0.1, // Weight(IP): 1 => cost = 0.1 * 1 = 0.1
                        // simple earn
                        'simple-earn/flexible/subscribe': 0.1,
                        'simple-earn/locked/subscribe': 0.1,
                        'simple-earn/flexible/redeem': 0.1,
                        'simple-earn/locked/redeem': 0.1,
                        'simple-earn/flexible/setAutoSubscribe': 15,
                        'simple-earn/locked/setAutoSubscribe': 15,
                        'simple-earn/locked/setRedeemOption': 5,
                        // convert
                        'dci/product/subscribe': 0.1,
                        'dci/product/auto_compound/edit': 0.1,
                    },
                    'put': {
                        'userDataStream': 0.1,
                        'userDataStream/isolated': 0.1,
                    },
                    'delete': {
                        // 'account/apiRestrictions/ipRestriction/ipList': 1, discontinued
                        'margin/openOrders': 0.1,
                        'margin/order': 0.006667, // Weight(UID): 1 => cost = 0.006667
                        'margin/orderList': 0.006667,
                        'margin/isolated/account': 2.0001, // Weight(UID): 300 => cost =  0.006667 * 300 = 2.0001
                        'userDataStream': 0.1,
                        'userDataStream/isolated': 0.1,
                        // brokerage API TODO NO MENTION OF RATELIMIT IN BROKERAGE DOCS
                        'broker/subAccountApi': 1,
                        'broker/subAccountApi/ipRestriction/ipList': 1,
                        'algo/spot/order': 0.1,
                        'algo/futures/order': 0.1,
                        'sub-account/subAccountApi/ipRestriction/ipList': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20.001
                    },
                },
                'sapiV2': {
                    'get': {
                        'eth-staking/account': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'sub-account/futures/account': 0.1,
                        'sub-account/futures/accountSummary': 1,
                        'sub-account/futures/positionRisk': 0.1,
                        'loan/flexible/ongoing/orders': 30, // Weight(IP): 300 => cost = 0.1 * 300 = 30
                        'loan/flexible/borrow/history': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/flexible/repay/history': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/flexible/ltv/adjustment/history': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/flexible/loanable/data': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'loan/flexible/collateral/data': 40, // Weight(IP): 400 => cost = 0.1 * 400 = 40
                        'portfolio/account': 2,
                    },
                    'post': {
                        'eth-staking/eth/stake': 15, // Weight(IP): 150 => cost = 0.1 * 150 = 15
                        'sub-account/subAccountApi/ipRestriction': 20.001, // Weight(UID): 3000 => cost = 0.006667 * 3000 = 20.001
                        'loan/flexible/borrow': 40.002, // Weight(UID): 6000 => cost = 0.006667 * 6000 = 40.002
                        'loan/flexible/repay': 40.002, // Weight(UID): 6000 => cost = 0.006667 * 6000 = 40.002
                        'loan/flexible/adjust/ltv': 40.002, // Weight(UID): 6000 => cost = 0.006667 * 6000 = 40.002
                    },
                },
                'sapiV3': {
                    'get': {
                        'sub-account/assets': 0.40002, // Weight(UID): 60 => cost =  0.006667 * 60 = 0.40002
                    },
                    'post': {
                        'asset/getUserAsset': 0.5,
                    },
                },
                'sapiV4': {
                    'get': {
                        'sub-account/assets': 0.40002, // Weight(UID): 60 => cost = 0.006667 * 60 = 0.40002
                    },
                },
                'dapiPublic': {
                    'get': {
                        'ping': 1,
                        'time': 1,
                        'exchangeInfo': 1,
                        'depth': { 'cost': 2, 'byLimit': [ [ 50, 2 ], [ 100, 5 ], [ 500, 10 ], [ 1000, 20 ] ] },
                        'trades': 5,
                        'historicalTrades': 20,
                        'aggTrades': 20,
                        'premiumIndex': 10,
                        'fundingRate': 1,
                        'klines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'continuousKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'indexPriceKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'markPriceKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'premiumIndexKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'ticker/24hr': { 'cost': 1, 'noSymbol': 40 },
                        'ticker/price': { 'cost': 1, 'noSymbol': 2 },
                        'ticker/bookTicker': { 'cost': 2, 'noSymbol': 5 },
                        'constituents': 2,
                        'openInterest': 1,
                        'fundingInfo': 1,
                    },
                },
                'dapiData': {
                    'get': {
                        'delivery-price': 1,
                        'openInterestHist': 1,
                        'topLongShortAccountRatio': 1,
                        'topLongShortPositionRatio': 1,
                        'globalLongShortAccountRatio': 1,
                        'takerBuySellVol': 1,
                        'basis': 1,
                    },
                },
                'dapiPrivate': {
                    'get': {
                        'positionSide/dual': 30,
                        'orderAmendment': 1,
                        'order': 1,
                        'openOrder': 1,
                        'openOrders': { 'cost': 1, 'noSymbol': 5 },
                        'allOrders': { 'cost': 20, 'noSymbol': 40 },
                        'balance': 1,
                        'account': 5,
                        'positionMargin/history': 1,
                        'positionRisk': 1,
                        'userTrades': { 'cost': 20, 'noSymbol': 40 },
                        'income': 20,
                        'leverageBracket': 1,
                        'forceOrders': { 'cost': 20, 'noSymbol': 50 },
                        'adlQuantile': 5,
                        'commissionRate': 20,
                        'income/asyn': 5,
                        'income/asyn/id': 5,
                        'trade/asyn': 0.5,
                        'trade/asyn/id': 0.5,
                        'order/asyn': 0.5,
                        'order/asyn/id': 0.5,
                        'pmExchangeInfo': 0.5, // Weight(IP): 5 => cost = 0.1 * 5 = 0.5
                        'pmAccountInfo': 0.5, // Weight(IP): 5 => cost = 0.1 * 5 = 0.5
                    },
                    'post': {
                        'positionSide/dual': 1,
                        'order': 4,
                        'batchOrders': 5,
                        'countdownCancelAll': 10,
                        'leverage': 1,
                        'marginType': 1,
                        'positionMargin': 1,
                        'listenKey': 1,
                    },
                    'put': {
                        'listenKey': 1,
                        'order': 1,
                        'batchOrders': 5,
                    },
                    'delete': {
                        'order': 1,
                        'allOpenOrders': 1,
                        'batchOrders': 5,
                        'listenKey': 1,
                    },
                },
                'dapiPrivateV2': {
                    'get': {
                        'leverageBracket': 1,
                    },
                },
                'fapiPublic': {
                    'get': {
                        'ping': 1,
                        'time': 1,
                        'exchangeInfo': 1,
                        'depth': { 'cost': 2, 'byLimit': [ [ 50, 2 ], [ 100, 5 ], [ 500, 10 ], [ 1000, 20 ] ] },
                        'trades': 5,
                        'historicalTrades': 20,
                        'aggTrades': 20,
                        'klines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'continuousKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'markPriceKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'indexPriceKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'premiumIndexKlines': { 'cost': 1, 'byLimit': [ [ 99, 1 ], [ 499, 2 ], [ 1000, 5 ], [ 10000, 10 ] ] },
                        'fundingRate': 1,
                        'fundingInfo': 1,
                        'premiumIndex': 1,
                        'ticker/24hr': { 'cost': 1, 'noSymbol': 40 },
                        'ticker/price': { 'cost': 1, 'noSymbol': 2 },
                        'ticker/bookTicker': { 'cost': 1, 'noSymbol': 2 },
                        'openInterest': 1,
                        'indexInfo': 1,
                        'assetIndex': { 'cost': 1, 'noSymbol': 10 },
                        'constituents': 2,
                        'apiTradingStatus': { 'cost': 1, 'noSymbol': 10 },
                        'lvtKlines': 1,
                        'convert/exchangeInfo': 4,
                    },
                },
                'fapiData': {
                    'get': {
                        'delivery-price': 1,
                        'openInterestHist': 1,
                        'topLongShortAccountRatio': 1,
                        'topLongShortPositionRatio': 1,
                        'globalLongShortAccountRatio': 1,
                        'takerlongshortRatio': 1,
                        'basis': 1,
                    },
                },
                'fapiPrivate': {
                    'get': {
                        'forceOrders': { 'cost': 20, 'noSymbol': 50 },
                        'allOrders': 5,
                        'openOrder': 1,
                        'openOrders': { 'cost': 1, 'noSymbol': 40 },
                        'order': 1,
                        'account': 5,
                        'balance': 5,
                        'leverageBracket': 1,
                        'positionMargin/history': 1,
                        'positionRisk': 5,
                        'positionSide/dual': 30,
                        'userTrades': 5,
                        'income': 30,
                        'commissionRate': 20,
                        'rateLimit/order': 1,
                        'apiTradingStatus': 1,
                        'multiAssetsMargin': 30,
                        // broker endpoints
                        'apiReferral/ifNewUser': 1,
                        'apiReferral/customization': 1,
                        'apiReferral/userCustomization': 1,
                        'apiReferral/traderNum': 1,
                        'apiReferral/overview': 1,
                        'apiReferral/tradeVol': 1,
                        'apiReferral/rebateVol': 1,
                        'apiReferral/traderSummary': 1,
                        'adlQuantile': 5,
                        'pmAccountInfo': 5,
                        'orderAmendment': 1,
                        'income/asyn': 1000,
                        'income/asyn/id': 10,
                        'order/asyn': 1000,
                        'order/asyn/id': 10,
                        'trade/asyn': 1000,
                        'trade/asyn/id': 10,
                        'feeBurn': 1,
                        'symbolConfig': 5,
                        'accountConfig': 5,
                        'convert/orderStatus': 5,
                    },
                    'post': {
                        'batchOrders': 5,
                        'positionSide/dual': 1,
                        'positionMargin': 1,
                        'marginType': 1,
                        'order': 4,
                        'leverage': 1,
                        'listenKey': 1,
                        'countdownCancelAll': 10,
                        'multiAssetsMargin': 1,
                        // broker endpoints
                        'apiReferral/customization': 1,
                        'apiReferral/userCustomization': 1,
                        'feeBurn': 1,
                        'convert/getQuote': 200, // 360 requests per hour
                        'convert/acceptQuote': 20,
                    },
                    'put': {
                        'listenKey': 1,
                        'order': 1,
                        'batchOrders': 5,
                    },
                    'delete': {
                        'batchOrders': 1,
                        'order': 1,
                        'allOpenOrders': 1,
                        'listenKey': 1,
                    },
                },
                'fapiPublicV2': {
                    'get': {
                        'ticker/price': 0,
                    },
                },
                'fapiPrivateV2': {
                    'get': {
                        'account': 1,
                        'balance': 1,
                        'positionRisk': 1,
                    },
                },
                'fapiPublicV3': {
                    'get': {},
                },
                'fapiPrivateV3': {
                    'get': {
                        'account': 1,
                        'balance': 1,
                        'positionRisk': 1,
                    },
                },
                'eapiPublic': {
                    'get': {
                        'ping': 1,
                        'time': 1,
                        'exchangeInfo': 1,
                        'index': 1,
                        'ticker': 5,
                        'mark': 5,
                        'depth': 1,
                        'klines': 1,
                        'trades': 5,
                        'historicalTrades': 20,
                        'exerciseHistory': 3,
                        'openInterest': 3,
                    },
                },
                'eapiPrivate': {
                    'get': {
                        'account': 3,
                        'position': 5,
                        'openOrders': { 'cost': 1, 'noSymbol': 40 },
                        'historyOrders': 3,
                        'userTrades': 5,
                        'exerciseRecord': 5,
                        'bill': 1,
                        'income/asyn': 5,
                        'income/asyn/id': 5,
                        'marginAccount': 3,
                        'mmp': 1,
                        'countdownCancelAll': 1,
                        'order': 1,
                        'block/order/orders': 5,
                        'block/order/execute': 5,
                        'block/user-trades': 5,
                    },
                    'post': {
                        'order': 1,
                        'batchOrders': 5,
                        'listenKey': 1,
                        'mmpSet': 1,
                        'mmpReset': 1,
                        'countdownCancelAll': 1,
                        'countdownCancelAllHeartBeat': 10,
                        'block/order/create': 5,
                        'block/order/execute': 5,
                    },
                    'put': {
                        'listenKey': 1,
                        'block/order/create': 5,
                    },
                    'delete': {
                        'order': 1,
                        'batchOrders': 1,
                        'allOpenOrders': 1,
                        'allOpenOrdersByUnderlying': 1,
                        'listenKey': 1,
                        'block/order/create': 5,
                    },
                },
                'public': {
                    // IP (api) request rate limit of 6000 per minute
                    // 1 IP (api) => cost = 0.2 => (1000 / (50 * 0.2)) * 60 = 6000
                    'get': {
                        'ping': 0.2, // Weight(IP): 1 => cost = 0.2 * 1 = 0.2
                        'time': 0.2,
                        'depth': { 'cost': 1, 'byLimit': [ [ 100, 1 ], [ 500, 5 ], [ 1000, 10 ], [ 5000, 50 ] ] },
                        'trades': 2, // Weight(IP): 10 => cost = 0.2 * 10 = 2
                        'aggTrades': 0.4,
                        'historicalTrades': 2, // Weight(IP): 10 => cost = 0.2 * 10 = 2
                        'klines': 0.4,
                        'uiKlines': 0.4,
                        'ticker/24hr': { 'cost': 0.4, 'noSymbol': 16 },
                        'ticker': { 'cost': 0.4, 'noSymbol': 16 },
                        'ticker/tradingDay': 0.8,
                        'ticker/price': { 'cost': 0.4, 'noSymbol': 0.8 },
                        'ticker/bookTicker': { 'cost': 0.4, 'noSymbol': 0.8 },
                        'exchangeInfo': 4, // Weight(IP): 20 => cost = 0.2 * 20 = 4
                        'avgPrice': 0.4,
                    },
                    'put': {
                        'userDataStream': 0.4,
                    },
                    'post': {
                        'userDataStream': 0.4,
                    },
                    'delete': {
                        'userDataStream': 0.4,
                    },
                },
                'private': {
                    'get': {
                        'allOrderList': 4, // oco Weight(IP): 20 => cost = 0.2 * 20 = 4
                        'openOrderList': 1.2, // oco Weight(IP): 6 => cost = 0.2 * 6 = 1.2
                        'orderList': 0.8, // oco
                        'order': 0.8,
                        'openOrders': { 'cost': 1.2, 'noSymbol': 16 },
                        'allOrders': 4,
                        'account': 4,
                        'myTrades': 4,
                        'rateLimit/order': 8, // Weight(IP): 40 => cost = 0.2 * 40 = 8
                        'myPreventedMatches': 4, // Weight(IP): 20 => cost = 0.2 * 20 = 4
                        'myAllocations': 4,
                        'account/commission': 4,
                    },
                    'post': {
                        'order/oco': 0.2,
                        'orderList/oco': 0.2,
                        'orderList/oto': 0.2,
                        'orderList/otoco': 0.2,
                        'sor/order': 0.2,
                        'sor/order/test': 0.2,
                        'order': 0.2,
                        'order/cancelReplace': 0.2,
                        'order/test': 0.2,
                    },
                    'delete': {
                        'openOrders': 0.2,
                        'orderList': 0.2, // oco
                        'order': 0.2,
                    },
                },
                'papi': {
                    // IP (papi) request rate limit of 6000 per minute
                    // 1 IP (papi) => cost = 0.2 => (1000 / (50 * 0.2)) * 60 = 6000
                    // Order (papi) request rate limit of 1200 per minute
                    // 1 Order (papi) => cost = 1 => (1000 / (50 * 1)) * 60 = 1200
                    'get': {
                        'ping': 0.2,
                        'um/order': 1,
                        'um/openOrder': 1,
                        'um/openOrders': { 'cost': 1, 'noSymbol': 40 },
                        'um/allOrders': 5,
                        'cm/order': 1,
                        'cm/openOrder': 1,
                        'cm/openOrders': { 'cost': 1, 'noSymbol': 40 },
                        'cm/allOrders': 20,
                        'um/conditional/openOrder': 1,
                        'um/conditional/openOrders': { 'cost': 1, 'noSymbol': 40 },
                        'um/conditional/orderHistory': 1,
                        'um/conditional/allOrders': { 'cost': 1, 'noSymbol': 40 },
                        'cm/conditional/openOrder': 1,
                        'cm/conditional/openOrders': { 'cost': 1, 'noSymbol': 40 },
                        'cm/conditional/orderHistory': 1,
                        'cm/conditional/allOrders': 40,
                        'margin/order': 10,
                        'margin/openOrders': 5,
                        'margin/allOrders': 100,
                        'margin/orderList': 5,
                        'margin/allOrderList': 100,
                        'margin/openOrderList': 5,
                        'margin/myTrades': 5,
                        'balance': 4,
                        'account': 4,
                        'margin/maxBorrowable': 1,
                        'margin/maxWithdraw': 1,
                        'um/positionRisk': 1,
                        'cm/positionRisk': 0.2,
                        'um/positionSide/dual': 6,
                        'cm/positionSide/dual': 6,
                        'um/userTrades': 5,
                        'cm/userTrades': 20,
                        'um/leverageBracket': 0.2,
                        'cm/leverageBracket': 0.2,
                        'margin/forceOrders': 1,
                        'um/forceOrders': { 'cost': 20, 'noSymbol': 50 },
                        'cm/forceOrders': { 'cost': 20, 'noSymbol': 50 },
                        'um/apiTradingStatus': { 'cost': 0.2, 'noSymbol': 2 },
                        'um/commissionRate': 4,
                        'cm/commissionRate': 4,
                        'margin/marginLoan': 2,
                        'margin/repayLoan': 2,
                        'margin/marginInterestHistory': 0.2,
                        'portfolio/interest-history': 10,
                        'um/income': 6,
                        'cm/income': 6,
                        'um/account': 1,
                        'cm/account': 1,
                        'repay-futures-switch': 6,
                        'um/adlQuantile': 5,
                        'cm/adlQuantile': 5,
                        'um/trade/asyn': 300,
                        'um/trade/asyn/id': 2,
                        'um/order/asyn': 300,
                        'um/order/asyn/id': 2,
                        'um/income/asyn': 300,
                        'um/income/asyn/id': 2,
                        'um/orderAmendment': 1,
                        'cm/orderAmendment': 1,
                        'um/feeBurn': 30,
                        'um/accountConfig': 1,
                        'um/symbolConfig': 1,
                        'cm/accountConfig': 1,
                        'cm/symbolConfig': 1,
                    },
                    'post': {
                        'um/order': 1,
                        'um/conditional/order': 1,
                        'cm/order': 1,
                        'cm/conditional/order': 1,
                        'margin/order': 1,
                        'marginLoan': 100,
                        'repayLoan': 100,
                        'margin/order/oco': 1,
                        'um/leverage': 0.2,
                        'cm/leverage': 0.2,
                        'um/positionSide/dual': 0.2,
                        'cm/positionSide/dual': 0.2,
                        'auto-collection': 150,
                        'bnb-transfer': 150,
                        'repay-futures-switch': 150,
                        'repay-futures-negative-balance': 150,
                        'listenKey': 0.2,
                        'asset-collection': 6,
                        'margin/repay-debt': 3000,
                        'um/feeBurn': 1,
                    },
                    'put': {
                        'listenKey': 0.2,
                        'um/order': 1,
                        'cm/order': 1,
                    },
                    'delete': {
                        'um/order': 1,
                        'um/conditional/order': 1,
                        'um/allOpenOrders': 1,
                        'um/conditional/allOpenOrders': 1,
                        'cm/order': 1,
                        'cm/conditional/order': 1,
                        'cm/allOpenOrders': 1,
                        'cm/conditional/allOpenOrders': 1,
                        'margin/order': 2,
                        'margin/allOpenOrders': 5,
                        'margin/orderList': 2,
                        'listenKey': 0.2,
                    },
                },
            },
            'fees': {
                'trading': {
                    'feeSide': 'get',
                    'tierBased': false,
                    'percentage': true,
                    'taker': this.parseNumber ('0.001'),
                    'maker': this.parseNumber ('0.001'),
                },
                'linear': {
                    'trading': {
                        'feeSide': 'quote',
                        'tierBased': true,
                        'percentage': true,
                        'taker': this.parseNumber ('0.000500'),
                        'maker': this.parseNumber ('0.000200'),
                        'tiers': {
                            'taker': [
                                [ this.parseNumber ('0'), this.parseNumber ('0.000400') ],
                                [ this.parseNumber ('250'), this.parseNumber ('0.000400') ],
                                [ this.parseNumber ('2500'), this.parseNumber ('0.000350') ],
                                [ this.parseNumber ('7500'), this.parseNumber ('0.000320') ],
                                [ this.parseNumber ('22500'), this.parseNumber ('0.000300') ],
                                [ this.parseNumber ('50000'), this.parseNumber ('0.000270') ],
                                [ this.parseNumber ('100000'), this.parseNumber ('0.000250') ],
                                [ this.parseNumber ('200000'), this.parseNumber ('0.000220') ],
                                [ this.parseNumber ('400000'), this.parseNumber ('0.000200') ],
                                [ this.parseNumber ('750000'), this.parseNumber ('0.000170') ],
                            ],
                            'maker': [
                                [ this.parseNumber ('0'), this.parseNumber ('0.000200') ],
                                [ this.parseNumber ('250'), this.parseNumber ('0.000160') ],
                                [ this.parseNumber ('2500'), this.parseNumber ('0.000140') ],
                                [ this.parseNumber ('7500'), this.parseNumber ('0.000120') ],
                                [ this.parseNumber ('22500'), this.parseNumber ('0.000100') ],
                                [ this.parseNumber ('50000'), this.parseNumber ('0.000080') ],
                                [ this.parseNumber ('100000'), this.parseNumber ('0.000060') ],
                                [ this.parseNumber ('200000'), this.parseNumber ('0.000040') ],
                                [ this.parseNumber ('400000'), this.parseNumber ('0.000020') ],
                                [ this.parseNumber ('750000'), this.parseNumber ('0') ],
                            ],
                        },
                    },
                },
                'inverse': {
                    'trading': {
                        'feeSide': 'base',
                        'tierBased': true,
                        'percentage': true,
                        'taker': this.parseNumber ('0.000500'),
                        'maker': this.parseNumber ('0.000100'),
                        'tiers': {
                            'taker': [
                                [ this.parseNumber ('0'), this.parseNumber ('0.000500') ],
                                [ this.parseNumber ('250'), this.parseNumber ('0.000450') ],
                                [ this.parseNumber ('2500'), this.parseNumber ('0.000400') ],
                                [ this.parseNumber ('7500'), this.parseNumber ('0.000300') ],
                                [ this.parseNumber ('22500'), this.parseNumber ('0.000250') ],
                                [ this.parseNumber ('50000'), this.parseNumber ('0.000240') ],
                                [ this.parseNumber ('100000'), this.parseNumber ('0.000240') ],
                                [ this.parseNumber ('200000'), this.parseNumber ('0.000240') ],
                                [ this.parseNumber ('400000'), this.parseNumber ('0.000240') ],
                                [ this.parseNumber ('750000'), this.parseNumber ('0.000240') ],
                            ],
                            'maker': [
                                [ this.parseNumber ('0'), this.parseNumber ('0.000100') ],
                                [ this.parseNumber ('250'), this.parseNumber ('0.000080') ],
                                [ this.parseNumber ('2500'), this.parseNumber ('0.000050') ],
                                [ this.parseNumber ('7500'), this.parseNumber ('0.0000030') ],
                                [ this.parseNumber ('22500'), this.parseNumber ('0') ],
                                [ this.parseNumber ('50000'), this.parseNumber ('-0.000050') ],
                                [ this.parseNumber ('100000'), this.parseNumber ('-0.000060') ],
                                [ this.parseNumber ('200000'), this.parseNumber ('-0.000070') ],
                                [ this.parseNumber ('400000'), this.parseNumber ('-0.000080') ],
                                [ this.parseNumber ('750000'), this.parseNumber ('-0.000090') ],
                            ],
                        },
                    },
                },
                'option': {},
            },
            'currencies': {
                'BNFCR': this.safeCurrencyStructure ({ 'id': 'BNFCR', 'code': 'BNFCR', 'precision': this.parseNumber ('0.001') }),
            },
            'commonCurrencies': {
                'BCC': 'BCC', // kept for backward-compatibility https://github.com/ccxt/ccxt/issues/4848
                'YOYO': 'YOYOW',
            },
            'precisionMode': TICK_SIZE,
            // exchange-specific options
            'options': {
                'sandboxMode': false,
                'fetchMargins': true,
                'fetchMarkets': [
                    'spot', // allows CORS in browsers
                    'linear', // allows CORS in browsers
                    'inverse', // allows CORS in browsers
                    // 'option', // does not allow CORS, enable outside of the browser only
                ],
                'fetchCurrencies': true, // this is a private call and it requires API keys
                // 'fetchTradesMethod': 'publicGetAggTrades', // publicGetTrades, publicGetHistoricalTrades, eapiPublicGetTrades
                // 'repayCrossMarginMethod': 'papiPostRepayLoan', // papiPostMarginRepayDebt
                'defaultTimeInForce': 'GTC', // 'GTC' = Good To Cancel (default), 'IOC' = Immediate Or Cancel
                'defaultType': 'spot', // 'spot', 'future', 'margin', 'delivery', 'option'
                'defaultSubType': undefined, // 'linear', 'inverse'
                'hasAlreadyAuthenticatedSuccessfully': false,
                'warnOnFetchOpenOrdersWithoutSymbol': true,
                // not an error
                // https://github.com/ccxt/ccxt/issues/11268
                // https://github.com/ccxt/ccxt/pull/11624
                // POST https://fapi.binance.com/fapi/v1/marginType 400 Bad Request
                // binanceusdm
                'throwMarginModeAlreadySet': false,
                'fetchPositions': 'positionRisk', // or 'account' or 'option'
                'recvWindow': 10 * 1000, // 10 sec
                'timeDifference': 0, // the difference between system clock and Binance clock
                'adjustForTimeDifference': false, // controls the adjustment logic upon instantiation
                'newOrderRespType': {
                    'market': 'FULL', // 'ACK' for order id, 'RESULT' for full order or 'FULL' for order with fills
                    'limit': 'FULL', // we change it from 'ACK' by default to 'FULL' (returns immediately if limit is not hit)
                },
                'quoteOrderQty': true, // whether market orders support amounts in quote currency
                'broker': {
                    'spot': 'x-R4BD3S82',
                    'margin': 'x-R4BD3S82',
                    'future': 'x-xcKtGhcu',
                    'delivery': 'x-xcKtGhcu',
                    'swap': 'x-xcKtGhcu',
                    'option': 'x-xcKtGhcu',
                },
                'accountsByType': {
                    'main': 'MAIN',
                    'spot': 'MAIN',
                    'funding': 'FUNDING',
                    'margin': 'MARGIN',
                    'cross': 'MARGIN',
                    'future': 'UMFUTURE', // backwards compatibility
                    'delivery': 'CMFUTURE', // backwards compatbility
                    'linear': 'UMFUTURE',
                    'swap': 'UMFUTURE',
                    'inverse': 'CMFUTURE',
                    'option': 'OPTION',
                },
                'accountsById': {
                    'MAIN': 'spot',
                    'FUNDING': 'funding',
                    'MARGIN': 'margin',
                    'UMFUTURE': 'linear',
                    'CMFUTURE': 'inverse',
                    'OPTION': 'option',
                },
                'networks': {
                    'ERC20': 'ETH',
                    'TRC20': 'TRX',
                    'BEP2': 'BNB',
                    'BEP20': 'BSC',
                    'OMNI': 'OMNI',
                    'EOS': 'EOS',
                    'SPL': 'SOL',
                },
                // keeping this object for backward-compatibility
                'reverseNetworks': {
                    'tronscan.org': 'TRC20',
                    'etherscan.io': 'ERC20',
                    'bscscan.com': 'BSC',
                    'explorer.binance.org': 'BEP2',
                    'bithomp.com': 'XRP',
                    'bloks.io': 'EOS',
                    'stellar.expert': 'XLM',
                    'blockchair.com/bitcoin': 'BTC',
                    'blockchair.com/bitcoin-cash': 'BCH',
                    'blockchair.com/ecash': 'XEC',
                    'explorer.litecoin.net': 'LTC',
                    'explorer.avax.network': 'AVAX',
                    'solscan.io': 'SOL',
                    'polkadot.subscan.io': 'DOT',
                    'dashboard.internetcomputer.org': 'ICP',
                    'explorer.chiliz.com': 'CHZ',
                    'cardanoscan.io': 'ADA',
                    'mainnet.theoan.com': 'AION',
                    'algoexplorer.io': 'ALGO',
                    'explorer.ambrosus.com': 'AMB',
                    'viewblock.io/zilliqa': 'ZIL',
                    'viewblock.io/arweave': 'AR',
                    'explorer.ark.io': 'ARK',
                    'atomscan.com': 'ATOM',
                    'www.mintscan.io': 'CTK',
                    'explorer.bitcoindiamond.org': 'BCD',
                    'btgexplorer.com': 'BTG',
                    'bts.ai': 'BTS',
                    'explorer.celo.org': 'CELO',
                    'explorer.nervos.org': 'CKB',
                    'cerebro.cortexlabs.ai': 'CTXC',
                    'chainz.cryptoid.info': 'VIA',
                    'explorer.dcrdata.org': 'DCR',
                    'digiexplorer.info': 'DGB',
                    'dock.subscan.io': 'DOCK',
                    'dogechain.info': 'DOGE',
                    'explorer.elrond.com': 'EGLD',
                    'blockscout.com': 'ETC',
                    'explore-fetchhub.fetch.ai': 'FET',
                    'filfox.info': 'FIL',
                    'fio.bloks.io': 'FIO',
                    'explorer.firo.org': 'FIRO',
                    'neoscan.io': 'NEO',
                    'ftmscan.com': 'FTM',
                    'explorer.gochain.io': 'GO',
                    'block.gxb.io': 'GXS',
                    'hash-hash.info': 'HBAR',
                    'www.hiveblockexplorer.com': 'HIVE',
                    'explorer.helium.com': 'HNT',
                    'tracker.icon.foundation': 'ICX',
                    'www.iostabc.com': 'IOST',
                    'explorer.iota.org': 'IOTA',
                    'iotexscan.io': 'IOTX',
                    'irishub.iobscan.io': 'IRIS',
                    'kava.mintscan.io': 'KAVA',
                    'scope.klaytn.com': 'KLAY',
                    'kmdexplorer.io': 'KMD',
                    'kusama.subscan.io': 'KSM',
                    'explorer.lto.network': 'LTO',
                    'polygonscan.com': 'POLYGON',
                    'explorer.ont.io': 'ONT',
                    'minaexplorer.com': 'MINA',
                    'nanolooker.com': 'NANO',
                    'explorer.nebulas.io': 'NAS',
                    'explorer.nbs.plus': 'NBS',
                    'explorer.nebl.io': 'NEBL',
                    'nulscan.io': 'NULS',
                    'nxscan.com': 'NXS',
                    'explorer.harmony.one': 'ONE',
                    'explorer.poa.network': 'POA',
                    'qtum.info': 'QTUM',
                    'explorer.rsk.co': 'RSK',
                    'www.oasisscan.com': 'ROSE',
                    'ravencoin.network': 'RVN',
                    'sc.tokenview.com': 'SC',
                    'secretnodes.com': 'SCRT',
                    'explorer.skycoin.com': 'SKY',
                    'steemscan.com': 'STEEM',
                    'explorer.stacks.co': 'STX',
                    'www.thetascan.io': 'THETA',
                    'scan.tomochain.com': 'TOMO',
                    'explore.vechain.org': 'VET',
                    'explorer.vite.net': 'VITE',
                    'www.wanscan.org': 'WAN',
                    'wavesexplorer.com': 'WAVES',
                    'wax.eosx.io': 'WAXP',
                    'waltonchain.pro': 'WTC',
                    'chain.nem.ninja': 'XEM',
                    'verge-blockchain.info': 'XVG',
                    'explorer.yoyow.org': 'YOYOW',
                    'explorer.zcha.in': 'ZEC',
                    'explorer.zensystem.io': 'ZEN',
                },
                'networksById': {
                    'tronscan.org': 'TRC20',
                    'etherscan.io': 'ERC20',
                    'bscscan.com': 'BSC',
                    'explorer.binance.org': 'BEP2',
                    'bithomp.com': 'XRP',
                    'bloks.io': 'EOS',
                    'stellar.expert': 'XLM',
                    'blockchair.com/bitcoin': 'BTC',
                    'blockchair.com/bitcoin-cash': 'BCH',
                    'blockchair.com/ecash': 'XEC',
                    'explorer.litecoin.net': 'LTC',
                    'explorer.avax.network': 'AVAX',
                    'solscan.io': 'SOL',
                    'polkadot.subscan.io': 'DOT',
                    'dashboard.internetcomputer.org': 'ICP',
                    'explorer.chiliz.com': 'CHZ',
                    'cardanoscan.io': 'ADA',
                    'mainnet.theoan.com': 'AION',
                    'algoexplorer.io': 'ALGO',
                    'explorer.ambrosus.com': 'AMB',
                    'viewblock.io/zilliqa': 'ZIL',
                    'viewblock.io/arweave': 'AR',
                    'explorer.ark.io': 'ARK',
                    'atomscan.com': 'ATOM',
                    'www.mintscan.io': 'CTK',
                    'explorer.bitcoindiamond.org': 'BCD',
                    'btgexplorer.com': 'BTG',
                    'bts.ai': 'BTS',
                    'explorer.celo.org': 'CELO',
                    'explorer.nervos.org': 'CKB',
                    'cerebro.cortexlabs.ai': 'CTXC',
                    'chainz.cryptoid.info': 'VIA',
                    'explorer.dcrdata.org': 'DCR',
                    'digiexplorer.info': 'DGB',
                    'dock.subscan.io': 'DOCK',
                    'dogechain.info': 'DOGE',
                    'explorer.elrond.com': 'EGLD',
                    'blockscout.com': 'ETC',
                    'explore-fetchhub.fetch.ai': 'FET',
                    'filfox.info': 'FIL',
                    'fio.bloks.io': 'FIO',
                    'explorer.firo.org': 'FIRO',
                    'neoscan.io': 'NEO',
                    'ftmscan.com': 'FTM',
                    'explorer.gochain.io': 'GO',
                    'block.gxb.io': 'GXS',
                    'hash-hash.info': 'HBAR',
                    'www.hiveblockexplorer.com': 'HIVE',
                    'explorer.helium.com': 'HNT',
                    'tracker.icon.foundation': 'ICX',
                    'www.iostabc.com': 'IOST',
                    'explorer.iota.org': 'IOTA',
                    'iotexscan.io': 'IOTX',
                    'irishub.iobscan.io': 'IRIS',
                    'kava.mintscan.io': 'KAVA',
                    'scope.klaytn.com': 'KLAY',
                    'kmdexplorer.io': 'KMD',
                    'kusama.subscan.io': 'KSM',
                    'explorer.lto.network': 'LTO',
                    'polygonscan.com': 'POLYGON',
                    'explorer.ont.io': 'ONT',
                    'minaexplorer.com': 'MINA',
                    'nanolooker.com': 'NANO',
                    'explorer.nebulas.io': 'NAS',
                    'explorer.nbs.plus': 'NBS',
                    'explorer.nebl.io': 'NEBL',
                    'nulscan.io': 'NULS',
                    'nxscan.com': 'NXS',
                    'explorer.harmony.one': 'ONE',
                    'explorer.poa.network': 'POA',
                    'qtum.info': 'QTUM',
                    'explorer.rsk.co': 'RSK',
                    'www.oasisscan.com': 'ROSE',
                    'ravencoin.network': 'RVN',
                    'sc.tokenview.com': 'SC',
                    'secretnodes.com': 'SCRT',
                    'explorer.skycoin.com': 'SKY',
                    'steemscan.com': 'STEEM',
                    'explorer.stacks.co': 'STX',
                    'www.thetascan.io': 'THETA',
                    'scan.tomochain.com': 'TOMO',
                    'explore.vechain.org': 'VET',
                    'explorer.vite.net': 'VITE',
                    'www.wanscan.org': 'WAN',
                    'wavesexplorer.com': 'WAVES',
                    'wax.eosx.io': 'WAXP',
                    'waltonchain.pro': 'WTC',
                    'chain.nem.ninja': 'XEM',
                    'verge-blockchain.info': 'XVG',
                    'explorer.yoyow.org': 'YOYOW',
                    'explorer.zcha.in': 'ZEC',
                    'explorer.zensystem.io': 'ZEN',
                },
                'impliedNetworks': {
                    'ETH': { 'ERC20': 'ETH' },
                    'TRX': { 'TRC20': 'TRX' },
                },
                'legalMoney': {
                    'MXN': true,
                    'UGX': true,
                    'SEK': true,
                    'CHF': true,
                    'VND': true,
                    'AED': true,
                    'DKK': true,
                    'KZT': true,
                    'HUF': true,
                    'PEN': true,
                    'PHP': true,
                    'USD': true,
                    'TRY': true,
                    'EUR': true,
                    'NGN': true,
                    'PLN': true,
                    'BRL': true,
                    'ZAR': true,
                    'KES': true,
                    'ARS': true,
                    'RUB': true,
                    'AUD': true,
                    'NOK': true,
                    'CZK': true,
                    'GBP': true,
                    'UAH': true,
                    'GHS': true,
                    'HKD': true,
                    'CAD': true,
                    'INR': true,
                    'JPY': true,
                    'NZD': true,
                },
                'legalMoneyCurrenciesById': {
                    'BUSD': 'USD',
                },
            },
            'features': {
                // https://developers.binance.com/docs/binance-spot-api-docs/rest-api#:~:text=quoteOrderQty
                'spot': {
                    'sandbox': true,
                    'createOrder': {
                        'triggerPrice': true,
                        'triggerPriceType': undefined,
                        'triggerDirection': false,
                        'stopLossPrice': true,
                        'takeProfitPrice': true,
                        'attachedStopLossTakeProfit': undefined, // not supported
                        'marginMode': true,
                        'timeInForce': {
                            'GTC': true,
                            'IOC': true,
                            'FOK': true,
                            'PO': true,
                            'GTD': false,
                        },
                        'hedged': true,
                        // exchange-supported features
                        'selfTradePrevention': true,
                        'trailing': true,
                        'twap': false,
                        'iceberg': true,
                        'oco': false,
                    },
                    'createOrders': undefined,
                    'fetchMyTrades': {
                        'limit': 1000,
                        'daysBack': undefined,
                        'untilDays': 1, // days between start-end
                    },
                    'fetchOrder': {
                        'marginMode': true,
                        'trigger': false,
                        'trailing': false,
                    },
                    'fetchOpenOrders': {
                        'limit': undefined,
                        'marginMode': true,
                        'trigger': false,
                        'trailing': false,
                    },
                    'fetchOrders': {
                        'limit': 1000,
                        'daysBack': undefined,
                        'untilDays': 10000,
                        'marginMode': true,
                        'trigger': false,
                        'trailing': false,
                    },
                    'fetchClosedOrders': {
                        'limit': 1000,
                        'daysBackClosed': undefined,
                        'daysBackCanceled': undefined,
                        'untilDays': 10000,
                        'marginMode': true,
                        'trigger': false,
                        'trailing': false,
                    },
                    'fetchOHLCV': {
                        'limit': 1000,
                    },
                },
                'default': {
                    'sandbox': true,
                    'createOrder': {
                        'triggerPrice': true,
                        'triggerPriceType': {
                            'mark': true,
                            'last': true,
                            'index': false,
                        },
                        'stopLossPrice': true,
                        'takeProfitPrice': true,
                        'attachedStopLossTakeProfit': undefined, // not supported
                        'marginMode': false,
                        'timeInForce': {
                            'GTC': true,
                            'IOC': true,
                            'FOK': true,
                            'PO': true,
                            'GTD': true,
                            // 'GTX': true,
                        },
                        'hedged': true,
                        // exchange-supported features
                        'selfTradePrevention': true,
                        'trailing': true,
                        'twap': false,
                        'iceberg': false,
                        'oco': false,
                    },
                    'createOrders': {
                        'max': 5,
                    },
                    'fetchMyTrades': {
                        'daysBack': undefined,
                        'limit': 1000,
                        'untilDays': 7,
                    },
                    'fetchOrder': {
                        'marginMode': false,
                        'trigger': false,
                        'trailing': false,
                    },
                    'fetchOpenOrders': {
                        'limit': 500,
                        'marginMode': true,
                        'trigger': false,
                        'trailing': false,
                    },
                    'fetchOrders': {
                        'limit': 1000,
                        'daysBack': 90,
                        'untilDays': 7,
                        'marginMode': true,
                        'trigger': false,
                        'trailing': false,
                    },
                    'fetchClosedOrders': {
                        'limit': 1000,
                        'daysBackClosed': 90,
                        'daysBackCanceled': 3,
                        'untilDays': 7,
                        'marginMode': true,
                        'trigger': false,
                        'trailing': false,
                    },
                    'fetchOHLCV': {
                        'limit': 1500,
                    },
                },
                'swap': {
                    'linear': {
                        'extends': 'default',
                    },
                    'inverse': {
                        'extends': 'default',
                    },
                },
                'future': {
                    'linear': {
                        'extends': 'default',
                    },
                    'inverse': {
                        'extends': 'default',
                    },
                },
            },
            'exceptions': {
                'spot': {
                    'exact': {
                        //
                        //        1xxx
                        //
                        '-1004': OperationFailed, // {"code":-1004,"msg":"Server is busy, please wait and try again"}
                        '-1008': OperationFailed, // undocumented, but mentioned: This is sent whenever the servers are overloaded with requests.
                        '-1099': AuthenticationError, // {"code":-1099,"msg":"Not found, authenticated, or authorized"}
                        '-1108': BadRequest, // undocumented, but mentioned: This error will occur if a value to a parameter being sent was too large, potentially causing overflow
                        '-1131': BadRequest, // {"code":-1131,"msg":"recvWindow must be less than 60000"}
                        '-1134': BadRequest, // strategyType was less than 1000000.
                        '-1135': BadRequest, // undocumented, but mentioned: This error code will occur if a parameter requiring a JSON object is invalid.
                        '-1145': BadRequest, // cancelRestrictions has to be either ONLY_NEW or ONLY_PARTIALLY_FILLED.
                        '-1151': BadSymbol, // Symbol is present multiple times in the list.
                        //
                        //        2xxx
                        //
                        '-2008': AuthenticationError, // undocumented, Invalid Api-Key ID
                        '-2016': OperationRejected, // {"code":-2016,"msg":"No trading window could be found for the symbol. Try ticker/24hrs instead."}
                        '-2021': BadResponse, // This code is sent when either the cancellation of the order failed or the new order placement failed but not both.
                        '-2022': BadResponse, // This code is sent when both the cancellation of the order failed and the new order placement failed.
                        '-2026': InvalidOrder, // Order was canceled or expired with no executed qty over 90 days ago and has been archived.
                        //
                        //        3xxx (these errors are available only for spot atm)
                        //
                        '-3000': OperationFailed, // {"code":-3000,"msg":"Internal server error."}
                        '-3001': AuthenticationError, // {"code":-3001,"msg":"Please enable 2FA first."}
                        '-3002': BadSymbol, // {"code":-3002,"msg":"We don't have this asset."}
                        '-3003': BadRequest, // {"code":-3003,"msg":"Margin account does not exist."}
                        '-3004': OperationRejected, // {"code":-3004,"msg":"Trade not allowed."}
                        '-3005': BadRequest, // {"code":-3005,"msg":"Transferring out not allowed. Transfer out amount exceeds max amount."}
                        '-3006': BadRequest, // {"code":-3006,"msg":"Your borrow amount has exceed maximum borrow amount."}
                        '-3007': OperationFailed, // {"code":-3007,"msg":"You have pending transaction, please try again later.."}
                        '-3008': BadRequest, // {"code":-3008,"msg":"Borrow not allowed. Your borrow amount has exceed maximum borrow amount."}
                        '-3009': OperationRejected, // {"code":-3009,"msg":"This asset are not allowed to transfer into margin account currently."}
                        '-3010': BadRequest, // {"code":-3010,"msg":"Repay not allowed. Repay amount exceeds borrow amount."}
                        '-3011': BadRequest, // {"code":-3011,"msg":"Your input date is invalid."}
                        '-3012': OperationRejected, // {"code":-3012,"msg":"Borrow is banned for this asset."}
                        '-3013': BadRequest, // {"code":-3013,"msg":"Borrow amount less than minimum borrow amount."}
                        '-3014': AccountSuspended, // {"code":-3014,"msg":"Borrow is banned for this account."}
                        '-3015': BadRequest, // {"code":-3015,"msg":"Repay amount exceeds borrow amount."}
                        '-3016': BadRequest, // {"code":-3016,"msg":"Repay amount less than minimum repay amount."}
                        '-3017': OperationRejected, // {"code":-3017,"msg":"This asset are not allowed to transfer into margin account currently."}
                        '-3018': AccountSuspended, // {"code":-3018,"msg":"Transferring in has been banned for this account."}
                        '-3019': AccountSuspended, // {"code":-3019,"msg":"Transferring out has been banned for this account."}
                        '-3020': BadRequest, // {"code":-3020,"msg":"Transfer out amount exceeds max amount."}
                        '-3021': BadRequest, // {"code":-3021,"msg":"Margin account are not allowed to trade this trading pair."}
                        '-3022': AccountSuspended, // {"code":-3022,"msg":"You account's trading is banned."}
                        '-3023': OperationRejected, // {"code":-3023,"msg":"You can't transfer out/place order under current margin level."}
                        '-3024': OperationRejected, // {"code":-3024,"msg":"The unpaid debt is too small after this repayment."}
                        '-3025': BadRequest, // {"code":-3025,"msg":"Your input date is invalid."}
                        '-3026': BadRequest, // {"code":-3026,"msg":"Your input param is invalid."}
                        '-3027': BadSymbol, // {"code":-3027,"msg":"Not a valid margin asset."}
                        '-3028': BadSymbol, // {"code":-3028,"msg":"Not a valid margin pair."}
                        '-3029': OperationFailed, // {"code":-3029,"msg":"Transfer failed."}
                        '-3036': AccountSuspended, // {"code":-3036,"msg":"This account is not allowed to repay."}
                        '-3037': OperationFailed, // {"code":-3037,"msg":"PNL is clearing. Wait a second."}
                        '-3038': BadRequest, // {"code":-3038,"msg":"Listen key not found."}
                        '-3041': InsufficientFunds, // {"code":-3041,"msg":"Balance is not enough"}
                        '-3042': BadRequest, // {"code":-3042,"msg":"PriceIndex not available for this margin pair."}
                        '-3043': PermissionDenied, // {"code":-3043,"msg":"Transferring in not allowed."}
                        '-3044': OperationFailed, // {"code":-3044,"msg":"System busy."}
                        '-3045': OperationRejected, // {"code":-3045,"msg":"The system doesn't have enough asset now."}
                        '-3999': PermissionDenied, // {"code":-3999,"msg":"This function is only available for invited users."}
                        //
                        //        4xxx (different from contract markets)
                        //
                        '-4000': ExchangeError, // override commons
                        '-4001': BadRequest, // {"code":-4001 ,"msg":"Invalid operation."}
                        '-4002': BadRequest, // {"code":-4002 ,"msg":"Invalid get."}
                        '-4003': BadRequest, // {"code":-4003 ,"msg":"Your input email is invalid."}
                        '-4004': AuthenticationError, // {"code":-4004,"msg":"You don't login or auth."}
                        '-4005': RateLimitExceeded, // {"code":-4005 ,"msg":"Too many new requests."}
                        '-4006': BadRequest, // {"code":-4006 ,"msg":"Support main account only."}
                        '-4007': PermissionDenied, // {"code":-4007 ,"msg":"Address validation is not passed."}
                        '-4008': PermissionDenied, // {"code":-4008 ,"msg":"Address tag validation is not passed."}
                        '-4009': ExchangeError, // undocumented
                        '-4010': PermissionDenied, // {"code":-4010 ,"msg":"White list mail has been confirmed."} // [TODO] possible bug: it should probably be "has not been confirmed"
                        '-4011': BadRequest, // {"code":-4011 ,"msg":"White list mail is invalid."}
                        '-4012': PermissionDenied, // {"code":-4012 ,"msg":"White list is not opened."}
                        '-4013': AuthenticationError, // {"code":-4013 ,"msg":"2FA is not opened."}
                        '-4014': OperationRejected, // {"code":-4014 ,"msg":"Withdraw is not allowed within 2 min login."}
                        '-4015': PermissionDenied, // {"code":-4015 ,"msg":"Withdraw is limited."}
                        '-4016': PermissionDenied, // {"code":-4016 ,"msg":"Within 24 hours after password modification, withdrawal is prohibited."}
                        '-4017': PermissionDenied, // {"code":-4017 ,"msg":"Within 24 hours after the release of 2FA, withdrawal is prohibited."}
                        '-4018': BadSymbol, // {"code":-4018,"msg":"We don't have this asset."}
                        '-4019': BadRequest, // {"code":-4019,"msg":"Current asset is not open for withdrawal."}
                        '-4020': ExchangeError, // override commons
                        '-4021': BadRequest, // {"code":-4021,"msg":"Asset withdrawal must be an %s multiple of %s."}
                        '-4022': BadRequest, // {"code":-4022,"msg":"Not less than the minimum pick-up quantity %s."}
                        '-4023': OperationRejected, // {"code":-4023,"msg":"Within 24 hours, the withdrawal exceeds the maximum amount."}
                        '-4024': InsufficientFunds, // {"code":-4024,"msg":"You don't have this asset."}
                        '-4025': InsufficientFunds, // {"code":-4025,"msg":"The number of hold asset is less than zero."}
                        '-4026': InsufficientFunds, // {"code":-4026,"msg":"You have insufficient balance."}
                        '-4027': OperationFailed, // {"code":-4027,"msg":"Failed to obtain tranId."}
                        '-4028': BadRequest, // {"code":-4028,"msg":"The amount of withdrawal must be greater than the Commission."}
                        '-4029': BadRequest, // {"code":-4029,"msg":"The withdrawal record does not exist."}
                        '-4030': BadResponse, // {"code":-4030,"msg":"Confirmation of successful asset withdrawal. [TODO] possible bug in docs"}
                        '-4031': OperationFailed, // {"code":-4031,"msg":"Cancellation failed."}
                        '-4032': OperationRejected, // {"code":-4032,"msg":"Withdraw verification exception."}
                        '-4033': BadRequest, // {"code":-4033,"msg":"Illegal address."}
                        '-4034': OperationRejected, // {"code":-4034,"msg":"The address is suspected of fake."}
                        '-4035': PermissionDenied, // {"code":-4035,"msg":"This address is not on the whitelist. Please join and try again."}
                        '-4036': PermissionDenied, // {"code":-4036,"msg":"The new address needs to be withdrawn in {0} hours."}
                        '-4037': OperationFailed, // {"code":-4037,"msg":"Re-sending Mail failed."}
                        '-4038': OperationFailed, // {"code":-4038,"msg":"Please try again in 5 minutes."}
                        '-4039': PermissionDenied, // {"code":-4039,"msg":"The user does not exist."}
                        '-4040': OperationRejected, // {"code":-4040,"msg":"This address not charged."}
                        '-4041': OperationFailed, // {"code":-4041,"msg":"Please try again in one minute."}
                        '-4042': OperationRejected, // {"code":-4042,"msg":"This asset cannot get deposit address again."}
                        '-4043': OperationRejected, // {"code":-4043,"msg":"More than 100 recharge addresses were used in 24 hours."}
                        '-4044': PermissionDenied, // {"code":-4044,"msg":"This is a blacklist country."}
                        '-4045': OperationFailed, // {"code":-4045,"msg":"Failure to acquire assets."}
                        '-4046': AuthenticationError, // {"code":-4046,"msg":"Agreement not confirmed."}
                        '-4047': BadRequest, // {"code":-4047,"msg":"Time interval must be within 0-90 days"}
                        '-4048': ExchangeError, // override commons
                        '-4049': ExchangeError, // override commons
                        '-4050': ExchangeError, // override commons
                        '-4051': ExchangeError, // override commons
                        '-4052': ExchangeError, // override commons
                        '-4053': ExchangeError, // override commons
                        '-4054': ExchangeError, // override commons
                        '-4055': ExchangeError, // override commons
                        '-4056': ExchangeError, // override commons
                        '-4057': ExchangeError, // override commons
                        '-4058': ExchangeError, // override commons
                        '-4059': ExchangeError, // override commons
                        '-4060': OperationFailed, // As your deposit has not reached the required block confirmations, we have temporarily locked {0} asset
                        '-4061': ExchangeError, // override commons
                        '-4062': ExchangeError, // override commons
                        '-4063': ExchangeError, // override commons
                        '-4064': ExchangeError, // override commons
                        '-4065': ExchangeError, // override commons
                        '-4066': ExchangeError, // override commons
                        '-4067': ExchangeError, // override commons
                        '-4068': ExchangeError, // override commons
                        '-4069': ExchangeError, // override commons
                        '-4070': ExchangeError, // override commons
                        '-4071': ExchangeError, // override commons
                        '-4072': ExchangeError, // override commons
                        '-4073': ExchangeError, // override commons
                        '-4074': ExchangeError, // override commons
                        '-4075': ExchangeError, // override commons
                        '-4076': ExchangeError, // override commons
                        '-4077': ExchangeError, // override commons
                        '-4078': ExchangeError, // override commons
                        '-4079': ExchangeError, // override commons
                        '-4080': ExchangeError, // override commons
                        '-4081': ExchangeError, // override commons
                        '-4082': ExchangeError, // override commons
                        '-4083': ExchangeError, // override commons
                        '-4084': ExchangeError, // override commons
                        '-4085': ExchangeError, // override commons
                        '-4086': ExchangeError, // override commons
                        '-4087': ExchangeError, // override commons
                        '-4088': ExchangeError, // override commons
                        '-4089': ExchangeError, // override commons
                        '-4091': ExchangeError, // override commons
                        '-4092': ExchangeError, // override commons
                        '-4093': ExchangeError, // override commons
                        '-4094': ExchangeError, // override commons
                        '-4095': ExchangeError, // override commons
                        '-4096': ExchangeError, // override commons
                        '-4097': ExchangeError, // override commons
                        '-4098': ExchangeError, // override commons
                        '-4099': ExchangeError, // override commons
                        '-4101': ExchangeError, // override commons
                        '-4102': ExchangeError, // override commons
                        '-4103': ExchangeError, // override commons
                        '-4104': ExchangeError, // override commons
                        '-4105': ExchangeError, // override commons
                        '-4106': ExchangeError, // override commons
                        '-4107': ExchangeError, // override commons
                        '-4108': ExchangeError, // override commons
                        '-4109': ExchangeError, // override commons
                        '-4110': ExchangeError, // override commons
                        '-4112': ExchangeError, // override commons
                        '-4113': ExchangeError, // override commons
                        '-4114': ExchangeError, // override commons
                        '-4115': ExchangeError, // override commons
                        '-4116': ExchangeError, // override commons
                        '-4117': ExchangeError, // override commons
                        '-4118': ExchangeError, // override commons
                        '-4119': ExchangeError, // override commons
                        '-4120': ExchangeError, // override commons
                        '-4121': ExchangeError, // override commons
                        '-4122': ExchangeError, // override commons
                        '-4123': ExchangeError, // override commons
                        '-4124': ExchangeError, // override commons
                        '-4125': ExchangeError, // override commons
                        '-4126': ExchangeError, // override commons
                        '-4127': ExchangeError, // override commons
                        '-4128': ExchangeError, // override commons
                        '-4129': ExchangeError, // override commons
                        '-4130': ExchangeError, // override commons
                        '-4131': ExchangeError, // override commons
                        '-4132': ExchangeError, // override commons
                        '-4133': ExchangeError, // override commons
                        '-4134': ExchangeError, // override commons
                        '-4135': ExchangeError, // override commons
                        '-4136': ExchangeError, // override commons
                        '-4137': ExchangeError, // override commons
                        '-4138': ExchangeError, // override commons
                        '-4139': ExchangeError, // override commons
                        '-4141': ExchangeError, // override commons
                        '-4142': ExchangeError, // override commons
                        '-4143': ExchangeError, // override commons
                        '-4144': ExchangeError, // override commons
                        '-4145': ExchangeError, // override commons
                        '-4146': ExchangeError, // override commons
                        '-4147': ExchangeError, // override commons
                        '-4148': ExchangeError, // override commons
                        '-4149': ExchangeError, // override commons
                        '-4150': ExchangeError, // override commons
                        //
                        //        5xxx
                        //
                        '-5001': BadRequest, // Don't allow transfer to micro assets.
                        '-5002': InsufficientFunds, // You have insufficient balance.
                        '-5003': InsufficientFunds, // You don't have this asset.
                        '-5004': OperationRejected, // The residual balances of %s have exceeded 0.001BTC, Please re-choose.
                        '-5005': OperationRejected, // The residual balances of %s is too low, Please re-choose.
                        '-5006': OperationRejected, // Only transfer once in 24 hours.
                        '-5007': BadRequest, // Quantity must be greater than zero.
                        '-5008': OperationRejected, // Insufficient amount of returnable assets.
                        '-5009': BadSymbol, // Product does not exist.
                        '-5010': OperationFailed, // Asset transfer fail.
                        '-5011': BadRequest, // future account not exists.
                        '-5012': OperationFailed, // Asset transfer is in pending.
                        '-5013': InsufficientFunds, // {"code":-5013,"msg":"Asset transfer failed: insufficient balance""} // undocumented
                        '-5021': BadRequest, // This parent sub have no relation
                        '-5022': BadRequest, // future account or sub relation not exists.
                        //
                        //        6xxx
                        //
                        '-6001': BadSymbol, // Daily product not exists.
                        '-6003': PermissionDenied, // Product not exist or you don't have permission
                        '-6004': BadRequest, // Product not in purchase status
                        '-6005': BadRequest, // Smaller than min purchase limit
                        '-6006': BadRequest, // Redeem amount error
                        '-6007': OperationRejected, // Not in redeem time
                        '-6008': OperationRejected, // Product not in redeem status
                        '-6009': RateLimitExceeded, // Request frequency too high
                        '-6011': OperationRejected, // Exceeding the maximum num allowed to purchase per user
                        '-6012': InsufficientFunds, // Balance not enough
                        '-6013': BadResponse, // Purchasing failed
                        '-6014': OperationRejected, // Exceed up-limit allowed to purchased
                        '-6015': BadRequest, // Empty request body
                        '-6016': BadRequest, // Parameter err
                        '-6017': PermissionDenied, // Not in whitelist
                        '-6018': InsufficientFunds, // Asset not enough
                        '-6019': OperationRejected, // Need confirm
                        '-6020': BadRequest, // Project not exists
                        //
                        //        7xxx
                        //
                        '-7001': BadRequest, // Date range is not supported.
                        '-7002': BadRequest, // Data request type is not supported.
                        //
                        //        1xxxx
                        //
                        '-10001': OperationFailed, // The system is under maintenance, please try again later.
                        '-10002': BadRequest, // Invalid input parameters.
                        '-10005': BadResponse, // No records found.
                        '-10007': BadRequest, // This coin is not loanable
                        '-10008': BadRequest, // This coin is not loanable
                        '-10009': BadRequest, // This coin can not be used as collateral.
                        '-10010': BadRequest, // This coin can not be used as collateral.
                        '-10011': InsufficientFunds, // Insufficient spot assets.
                        '-10012': BadRequest, // Invalid repayment amount.
                        '-10013': InsufficientFunds, // Insufficient collateral amount.
                        '-10015': OperationFailed, // Collateral deduction failed.
                        '-10016': OperationFailed, // Failed to provide loan.
                        '-10017': OperationRejected, // {"code":-10017,"msg":"Repay amount should not be larger than liability."}
                        '-10018': BadRequest, // Invalid repayment amount.
                        '-10019': BadRequest, // Configuration does not exists.
                        '-10020': BadRequest, // User ID does not exist.
                        '-10021': InvalidOrder, // Order does not exist.
                        '-10022': BadRequest, // Invalid adjustment amount.
                        '-10023': OperationFailed, // Failed to adjust LTV.
                        '-10024': BadRequest, // LTV adjustment not supported.
                        '-10025': OperationFailed, // Repayment failed.
                        '-10026': BadRequest, // Invalid parameter.
                        '-10028': BadRequest, // Invalid parameter.
                        '-10029': OperationRejected, // Loan amount is too small.
                        '-10030': OperationRejected, // Loan amount is too much.
                        '-10031': OperationRejected, // Individual loan quota reached.
                        '-10032': OperationFailed, // Repayment is temporarily unavailable.
                        '-10034': OperationRejected, // Repay with collateral is not available currently, please try to repay with borrowed coin.
                        '-10039': OperationRejected, // Repayment amount is too small.
                        '-10040': OperationRejected, // Repayment amount is too large.
                        '-10041': OperationFailed, // Due to high demand, there are currently insufficient loanable assets for {0}. Please adjust your borrow amount or try again tomorrow.
                        '-10042': BadSymbol, // asset %s is not supported
                        '-10043': OperationRejected, // {0} borrowing is currently not supported.
                        '-10044': OperationRejected, // Collateral amount has reached the limit. Please reduce your collateral amount or try with other collaterals.
                        '-10045': OperationRejected, // The loan coin does not support collateral repayment. Please try again later.
                        '-10046': OperationRejected, // Collateral Adjustment exceeds the maximum limit. Please try again.
                        '-10047': PermissionDenied, // This coin is currently not supported in your location due to local regulations.
                        '-11008': OperationRejected, // undocumented: Exceeding the account’s maximum borrowable limit
                        '-12014': RateLimitExceeded, // More than 1 request in 2 seconds
                        // BLVT
                        '-13000': OperationRejected, // Redeption of the token is forbiden now
                        '-13001': OperationRejected, // Exceeds individual 24h redemption limit of the token
                        '-13002': OperationRejected, // Exceeds total 24h redemption limit of the token
                        '-13003': PermissionDenied, // Subscription of the token is forbiden now
                        '-13004': OperationRejected, // Exceeds individual 24h subscription limit of the token
                        '-13005': OperationRejected, // Exceeds total 24h subscription limit of the token
                        '-13006': OperationRejected, // Subscription amount is too small
                        '-13007': PermissionDenied, // The Agreement is not signed
                        // 18xxx - BINANCE CODE
                        '-18002': OperationRejected, // The total amount of codes you created has exceeded the 24-hour limit, please try again after UTC 0
                        '-18003': OperationRejected, // Too many codes created in 24 hours, please try again after UTC 0
                        '-18004': OperationRejected, // Too many invalid redeem attempts in 24 hours, please try again after UTC 0
                        '-18005': PermissionDenied, // Too many invalid verify attempts, please try later
                        '-18006': OperationRejected, // The amount is too small, please re-enter
                        '-18007': OperationRejected, // This token is not currently supported, please re-enter
                        //
                        //        2xxxx
                        //
                        //   21xxx - PORTFOLIO MARGIN (documented in spot docs)
                        '-21001': BadRequest, // Request ID is not a Portfolio Margin Account.
                        '-21002': BadRequest, // Portfolio Margin Account doesn't support transfer from margin to futures.
                        '-21003': BadResponse, // Fail to retrieve margin assets.
                        '-21004': OperationRejected, // User doesn’t have portfolio margin bankruptcy loan
                        '-21005': InsufficientFunds, // User’s spot wallet doesn’t have enough BUSD to repay portfolio margin bankruptcy loan
                        '-21006': OperationFailed, // User had portfolio margin bankruptcy loan repayment in process
                        '-21007': OperationFailed, // User failed to repay portfolio margin bankruptcy loan since liquidation was in process
                        //
                        //        misc
                        //
                        '-32603': BadRequest, // undocumented, Filter failure: LOT_SIZE & precision
                        '400002': BadRequest, // undocumented, { “status”: “FAIL”, “code”: “400002”, “errorMessage”: “Signature for this request is not valid.” }
                        '100001003': AuthenticationError, // undocumented, {"code":100001003,"msg":"Verification failed"}
                        '200003903': AuthenticationError, // undocumented, {"code":200003903,"msg":"Your identity verification has been rejected. Please complete identity verification again."}
                    },
                },
                'linear': {
                    'exact': {
                        //
                        //        1xxx
                        //
                        '-1005': PermissionDenied, // {"code":-1005,"msg":"No such IP has been white listed"}
                        '-1008': OperationFailed, // -1008 SERVER_BUSY: Server is currently overloaded with other requests. Please try again in a few minutes.
                        '-1011': PermissionDenied, // {"code":-1011,"msg":"This IP cannot access this route."}
                        '-1023': BadRequest, // {"code":-1023,"msg":"Start time is greater than end time."}
                        '-1099': AuthenticationError, // {"code":-1099,"msg":"Not found, authenticated, or authorized"}
                        '-1109': PermissionDenied, // {"code":-1109,"msg":"Invalid account."}
                        '-1110': BadRequest, // {"code":-1110,"msg":"Invalid symbolType."}
                        '-1113': BadRequest, // {"code":-1113,"msg":"Withdrawal amount must be negative."}
                        '-1122': BadRequest, // INVALID_SYMBOL_STATUS
                        '-1126': BadSymbol, // ASSET_NOT_SUPPORTED
                        '-1136': BadRequest, // {"code":-1136,"msg":"Invalid newOrderRespType"}
                        //
                        //        2xxx
                        //
                        '-2012': OperationFailed, // CANCEL_ALL_FAIL
                        '-2016': OperationRejected, // {"code":-2016,"msg":"No trading window could be found for the symbol. Try ticker/24hrs instead."}
                        '-2017': PermissionDenied, // API Keys are locked on this account.
                        '-2018': InsufficientFunds, // {"code":-2018,"msg":"Balance is insufficient"}
                        '-2019': InsufficientFunds, // {"code":-2019,"msg":"Margin is insufficient."}
                        '-2020': OperationFailed, // {"code":-2020,"msg":"Unable to fill."}
                        '-2021': OrderImmediatelyFillable, // {"code":-2021,"msg":"Order would immediately trigger."}
                        '-2022': InvalidOrder, // {"code":-2022,"msg":"ReduceOnly Order is rejected."}
                        '-2023': OperationFailed, // {"code":-2023,"msg":"User in liquidation mode now."}
                        '-2024': InsufficientFunds, // {"code":-2024,"msg":"Position is not sufficient."}
                        '-2025': OperationRejected, // {"code":-2025,"msg":"Reach max open order limit."}
                        '-2026': InvalidOrder, // {"code":-2026,"msg":"This OrderType is not supported when reduceOnly."}
                        '-2027': OperationRejected, // {"code":-2027,"msg":"Exceeded the maximum allowable position at current leverage."}
                        '-2028': OperationRejected, // {"code":-2028,"msg":"Leverage is smaller than permitted: insufficient margin balance"}
                        //
                        //        4xxx
                        //
                        '-4063': BadRequest, // INVALID_OPTIONS_REQUEST_TYPE
                        '-4064': BadRequest, // INVALID_OPTIONS_TIME_FRAME
                        '-4065': BadRequest, // INVALID_OPTIONS_AMOUNT
                        '-4066': BadRequest, // INVALID_OPTIONS_EVENT_TYPE
                        '-4069': BadRequest, // Position INVALID_OPTIONS_PREMIUM_FEE
                        '-4070': BadRequest, // Client options id is not valid.
                        '-4071': BadRequest, // Invalid options direction
                        '-4072': OperationRejected, // premium fee is not updated, reject order
                        '-4073': BadRequest, // OPTIONS_PREMIUM_INPUT_LESS_THAN_ZERO
                        '-4074': OperationRejected, // Order amount is bigger than upper boundary or less than 0, reject order
                        '-4075': BadRequest, // output premium fee is less than 0, reject order
                        '-4076': OperationRejected, // original fee is too much higher than last fee
                        '-4077': OperationRejected, // place order amount has reached to limit, reject order
                        '-4078': OperationFailed, // options internal error
                        '-4079': BadRequest, // invalid options id
                        '-4080': PermissionDenied, // user not found with id: %s
                        '-4081': BadRequest, // OPTIONS_NOT_FOUND
                        '-4085': BadRequest, // Invalid notional limit coefficient
                        '-4087': PermissionDenied, // User can only place reduce only order
                        '-4088': PermissionDenied, // User can not place order currently
                        '-4114': BadRequest, // INVALID_CLIENT_TRAN_ID_LEN
                        '-4115': BadRequest, // DUPLICATED_CLIENT_TRAN_ID
                        '-4116': InvalidOrder, // DUPLICATED_CLIENT_ORDER_ID
                        '-4117': OperationRejected, // STOP_ORDER_TRIGGERING
                        '-4118': OperationRejected, // REDUCE_ONLY_MARGIN_CHECK_FAILED
                        '-4131': OperationRejected, // The counterparty's best price does not meet the PERCENT_PRICE filter limit
                        '-4140': BadRequest, // Invalid symbol status for opening position
                        '-4141': OperationRejected, // Symbol is closed
                        '-4144': BadSymbol, // Invalid pair
                        '-4164': InvalidOrder, // {"code":-4164,"msg":"Order's notional must be no smaller than 20 (unless you choose reduce only)."}
                        '-4165': BadRequest, // Invalid time interval
                        '-4167': BadRequest, // Unable to adjust to Multi-Assets mode with symbols of USDⓈ-M Futures under isolated-margin mode.
                        '-4168': BadRequest, // Unable to adjust to isolated-margin mode under the Multi-Assets mode.
                        '-4169': OperationRejected, // Unable to adjust Multi-Assets Mode with insufficient margin balance in USDⓈ-M Futures
                        '-4170': OperationRejected, // Unable to adjust Multi-Assets Mode with open orders in USDⓈ-M Futures
                        '-4171': OperationRejected, // Adjusted asset mode is currently set and does not need to be adjusted repeatedly
                        '-4172': OperationRejected, // Unable to adjust Multi-Assets Mode with a negative wallet balance of margin available asset in USDⓈ-M Futures account.
                        '-4183': BadRequest, // Price is higher than stop price multiplier cap.
                        '-4184': BadRequest, // Price is lower than stop price multiplier floor.
                        '-4192': PermissionDenied, // Trade forbidden due to Cooling-off Period.
                        '-4202': PermissionDenied, // Intermediate Personal Verification is required for adjusting leverage over 20x
                        '-4203': PermissionDenied, // More than 20x leverage is available one month after account registration.
                        '-4205': PermissionDenied, // More than 20x leverage is available %s days after Futures account registration.
                        '-4206': PermissionDenied, // Users in this country has limited adjust leverage.
                        '-4208': OperationRejected, // Current symbol leverage cannot exceed 20 when using position limit adjustment service.
                        '-4209': OperationRejected, // Leverage adjustment failed. Current symbol max leverage limit is %sx
                        '-4210': BadRequest, // Stop price is higher than price multiplier cap
                        '-4211': BadRequest, // Stop price is lower than price multiplier floor
                        '-4400': PermissionDenied, // Futures Trading Quantitative Rules violated, only reduceOnly order is allowed, please try again later.
                        '-4401': PermissionDenied, // Compliance restricted account permission: can only place reduceOnly order.
                        '-4402': PermissionDenied, // Dear user, as per our Terms of Use and compliance with local regulations, this feature is currently not available in your region.
                        '-4403': PermissionDenied, // Dear user, as per our Terms of Use and compliance with local regulations, the leverage can only up to %sx in your region
                        //
                        //        5xxx
                        //
                        '-5021': OrderNotFillable, // Due to the order could not be filled immediately, the FOK order has been rejected.
                        '-5022': OrderNotFillable, // Due to the order could not be executed as maker, the Post Only order will be rejected.
                        '-5024': OperationRejected, // Symbol is not in trading status. Order amendment is not permitted.
                        '-5025': OperationRejected, // Only limit order is supported.
                        '-5026': OperationRejected, // Exceed maximum modify order limit.
                        '-5027': OperationRejected, // No need to modify the order.
                        '-5028': BadRequest, // Timestamp for this request is outside of the ME recvWindow.
                        '-5037': BadRequest, // Invalid price match
                        '-5038': BadRequest, // Price match only supports order type: LIMIT, STOP AND TAKE_PROFIT
                        '-5039': BadRequest, // Invalid self trade prevention mode
                        '-5040': BadRequest, // The goodTillDate timestamp must be greater than the current time plus 600 seconds and smaller than 253402300799000
                        '-5041': OperationFailed, // No depth matches this BBO order
                    },
                },
                'inverse': {
                    'exact': {
                        //
                        //        1xxx
                        //
                        '-1005': PermissionDenied, // {"code":-1005,"msg":"No such IP has been white listed"}
                        '-1011': PermissionDenied, // {"code":-1011,"msg":"This IP cannot access this route."}
                        '-1023': BadRequest, // {"code":-1023,"msg":"Start time is greater than end time."}
                        '-1109': AuthenticationError, // {"code":-1109,"msg":"Invalid account."}
                        '-1110': BadSymbol, // {"code":-1110,"msg":"Invalid symbolType."}
                        '-1113': BadRequest, // {"code":-1113,"msg":"Withdrawal amount must be negative."}
                        '-1128': BadRequest, // {"code":-1128,"msg":"Combination of optional parameters invalid."}
                        '-1136': BadRequest, // {"code":-1136,"msg":"Invalid newOrderRespType"}
                        //
                        //        2xxx
                        //
                        '-2016': OperationRejected, // {"code":-2016,"msg":"No trading window could be found for the symbol. Try ticker/24hrs instead."}
                        '-2018': InsufficientFunds, // {"code":-2018,"msg":"Balance is insufficient"}
                        '-2019': InsufficientFunds, // {"code":-2019,"msg":"Margin is insufficient."}
                        '-2020': OperationFailed, // {"code":-2020,"msg":"Unable to fill."}
                        '-2021': OrderImmediatelyFillable, // {"code":-2021,"msg":"Order would immediately trigger."}
                        '-2022': InvalidOrder, // {"code":-2022,"msg":"ReduceOnly Order is rejected."}
                        '-2023': OperationFailed, // {"code":-2023,"msg":"User in liquidation mode now."}
                        '-2024': BadRequest, // {"code":-2024,"msg":"Position is not sufficient."}
                        '-2025': OperationRejected, // {"code":-2025,"msg":"Reach max open order limit."}
                        '-2026': InvalidOrder, // {"code":-2026,"msg":"This OrderType is not supported when reduceOnly."}
                        '-2027': OperationRejected, // {"code":-2027,"msg":"Exceeded the maximum allowable position at current leverage."}
                        '-2028': OperationRejected, // {"code":-2028,"msg":"Leverage is smaller than permitted: insufficient margin balance"}
                        //
                        //        4xxx
                        //
                        '-4086': BadRequest, // Invalid price spread threshold.
                        '-4087': BadSymbol, // Invalid pair
                        '-4088': BadRequest, // Invalid time interval
                        '-4089': PermissionDenied, // User can only place reduce only order.
                        '-4090': PermissionDenied, // User can not place order currently.
                        '-4110': BadRequest, // clientTranId is not valid
                        '-4111': BadRequest, // clientTranId is duplicated.
                        '-4112': OperationRejected, // ReduceOnly Order Failed. Please check your existing position and open orders.
                        '-4113': OperationRejected, // The counterparty's best price does not meet the PERCENT_PRICE filter limit.
                        '-4150': OperationRejected, // Leverage reduction is not supported in Isolated Margin Mode with open positions.
                        '-4151': BadRequest, // Price is higher than stop price multiplier cap.
                        '-4152': BadRequest, // Price is lower than stop price multiplier floor.
                        '-4154': BadRequest, // Stop price is higher than price multiplier cap.
                        '-4155': BadRequest, // Stop price is lower than price multiplier floor
                        '-4178': BadRequest, // Order's notional must be no smaller than one (unless you choose reduce only)
                        '-4188': BadRequest, // Timestamp for this request is outside of the ME recvWindow.
                        '-4192': PermissionDenied, // Trade forbidden due to Cooling-off Period.
                        '-4194': PermissionDenied, // Intermediate Personal Verification is required for adjusting leverage over 20x.
                        '-4195': PermissionDenied, // More than 20x leverage is available one month after account registration.
                        '-4196': BadRequest, // Only limit order is supported.
                        '-4197': OperationRejected, // No need to modify the order.
                        '-4198': OperationRejected, // Exceed maximum modify order limit.
                        '-4199': BadRequest, // Symbol is not in trading status. Order amendment is not permitted.
                        '-4200': PermissionDenied, // More than 20x leverage is available %s days after Futures account registration.
                        '-4201': PermissionDenied, // Users in your location/country can only access a maximum leverage of %s
                        '-4202': OperationRejected, // Current symbol leverage cannot exceed 20 when using position limit adjustment service.
                    },
                },
                'option': {
                    'exact': {
                        //
                        //        1xxx
                        //
                        '-1003': ExchangeError, // override common
                        '-1004': ExchangeError, // override common
                        '-1006': ExchangeError, // override common
                        '-1007': ExchangeError, // override common
                        '-1008': RateLimitExceeded, // TOO_MANY_REQUEST
                        '-1010': ExchangeError, // override common
                        '-1013': ExchangeError, // override common
                        '-1108': ExchangeError, // override common
                        '-1112': ExchangeError, // override common
                        '-1114': ExchangeError, // override common
                        '-1128': BadSymbol, // BAD_CONTRACT
                        '-1129': BadSymbol, // BAD_CURRENCY
                        '-1131': BadRequest, // {"code":-1131,"msg":"recvWindow must be less than 60000"}
                        //
                        //        2xxx
                        //
                        '-2011': ExchangeError, // override common
                        '-2018': InsufficientFunds, // BALANCE_NOT_SUFFICIENT
                        '-2027': InsufficientFunds, // OPTION_MARGIN_NOT_SUFFICIENT
                        //
                        //        3xxx
                        //
                        '-3029': OperationFailed, // {"code":-3029,"msg":"Transfer failed."}
                        //
                        //        4xxx
                        //
                        // -4001 inherited
                        // -4002 inherited
                        // -4003 inherited
                        // -4004 inherited
                        // -4005 inherited
                        '-4006': ExchangeError, // override commons
                        '-4007': ExchangeError, // override commons
                        '-4008': ExchangeError, // override commons
                        '-4009': ExchangeError, // override commons
                        '-4010': ExchangeError, // override commons
                        '-4011': ExchangeError, // override commons
                        '-4012': ExchangeError, // override commons
                        // -4013 inherited
                        '-4014': ExchangeError, // override commons
                        '-4015': ExchangeError, // override commons
                        '-4016': ExchangeError, // override commons
                        '-4017': ExchangeError, // override commons
                        '-4018': ExchangeError, // override commons
                        '-4019': ExchangeError, // override commons
                        '-4020': ExchangeError, // override commons
                        '-4021': ExchangeError, // override commons
                        '-4022': ExchangeError, // override commons
                        '-4023': ExchangeError, // override commons
                        '-4024': ExchangeError, // override commons
                        '-4025': ExchangeError, // override commons
                        '-4026': ExchangeError, // override commons
                        '-4027': ExchangeError, // override commons
                        '-4028': ExchangeError, // override commons
                        // -4029 inherited
                        // -4030 inherited
                        '-4031': ExchangeError, // override commons
                        '-4032': ExchangeError, // override commons
                        '-4033': ExchangeError, // override commons
                        '-4034': ExchangeError, // override commons
                        '-4035': ExchangeError, // override commons
                        '-4036': ExchangeError, // override commons
                        '-4037': ExchangeError, // override commons
                        '-4038': ExchangeError, // override commons
                        '-4039': ExchangeError, // override commons
                        '-4040': ExchangeError, // override commons
                        '-4041': ExchangeError, // override commons
                        '-4042': ExchangeError, // override commons
                        '-4043': ExchangeError, // override commons
                        '-4044': ExchangeError, // override commons
                        '-4045': ExchangeError, // override commons
                        '-4046': ExchangeError, // override commons
                        '-4047': ExchangeError, // override commons
                        '-4048': ExchangeError, // override commons
                        '-4049': ExchangeError, // override commons
                        '-4050': ExchangeError, // override commons
                        '-4051': ExchangeError, // override commons
                        '-4052': ExchangeError, // override commons
                        '-4053': ExchangeError, // override commons
                        '-4054': ExchangeError, // override commons
                        // -4055 inherited
                        '-4056': ExchangeError, // override commons
                        '-4057': ExchangeError, // override commons
                        '-4058': ExchangeError, // override commons
                        '-4059': ExchangeError, // override commons
                        '-4060': ExchangeError, // override commons
                        '-4061': ExchangeError, // override commons
                        '-4062': ExchangeError, // override commons
                        '-4063': ExchangeError, // override commons
                        '-4064': ExchangeError, // override commons
                        '-4065': ExchangeError, // override commons
                        '-4066': ExchangeError, // override commons
                        '-4067': ExchangeError, // override commons
                        '-4068': ExchangeError, // override commons
                        '-4069': ExchangeError, // override commons
                        '-4070': ExchangeError, // override commons
                        '-4071': ExchangeError, // override commons
                        '-4072': ExchangeError, // override commons
                        '-4073': ExchangeError, // override commons
                        '-4074': ExchangeError, // override commons
                        '-4075': ExchangeError, // override commons
                        '-4076': ExchangeError, // override commons
                        '-4077': ExchangeError, // override commons
                        '-4078': ExchangeError, // override commons
                        '-4079': ExchangeError, // override commons
                        '-4080': ExchangeError, // override commons
                        '-4081': ExchangeError, // override commons
                        '-4082': ExchangeError, // override commons
                        '-4083': ExchangeError, // override commons
                        '-4084': ExchangeError, // override commons
                        '-4085': ExchangeError, // override commons
                        '-4086': ExchangeError, // override commons
                        '-4087': ExchangeError, // override commons
                        '-4088': ExchangeError, // override commons
                        '-4089': ExchangeError, // override commons
                        '-4091': ExchangeError, // override commons
                        '-4092': ExchangeError, // override commons
                        '-4093': ExchangeError, // override commons
                        '-4094': ExchangeError, // override commons
                        '-4095': ExchangeError, // override commons
                        '-4096': ExchangeError, // override commons
                        '-4097': ExchangeError, // override commons
                        '-4098': ExchangeError, // override commons
                        '-4099': ExchangeError, // override commons
                        '-4101': ExchangeError, // override commons
                        '-4102': ExchangeError, // override commons
                        '-4103': ExchangeError, // override commons
                        '-4104': ExchangeError, // override commons
                        '-4105': ExchangeError, // override commons
                        '-4106': ExchangeError, // override commons
                        '-4107': ExchangeError, // override commons
                        '-4108': ExchangeError, // override commons
                        '-4109': ExchangeError, // override commons
                        '-4110': ExchangeError, // override commons
                        '-4112': ExchangeError, // override commons
                        '-4113': ExchangeError, // override commons
                        '-4114': ExchangeError, // override commons
                        '-4115': ExchangeError, // override commons
                        '-4116': ExchangeError, // override commons
                        '-4117': ExchangeError, // override commons
                        '-4118': ExchangeError, // override commons
                        '-4119': ExchangeError, // override commons
                        '-4120': ExchangeError, // override commons
                        '-4121': ExchangeError, // override commons
                        '-4122': ExchangeError, // override commons
                        '-4123': ExchangeError, // override commons
                        '-4124': ExchangeError, // override commons
                        '-4125': ExchangeError, // override commons
                        '-4126': ExchangeError, // override commons
                        '-4127': ExchangeError, // override commons
                        '-4128': ExchangeError, // override commons
                        '-4129': ExchangeError, // override commons
                        '-4130': ExchangeError, // override commons
                        '-4131': ExchangeError, // override commons
                        '-4132': ExchangeError, // override commons
                        '-4133': ExchangeError, // override commons
                        '-4134': ExchangeError, // override commons
                        '-4135': ExchangeError, // override commons
                        '-4136': ExchangeError, // override commons
                        '-4137': ExchangeError, // override commons
                        '-4138': ExchangeError, // override commons
                        '-4139': ExchangeError, // override commons
                        '-4141': ExchangeError, // override commons
                        '-4142': ExchangeError, // override commons
                        '-4143': ExchangeError, // override commons
                        '-4144': ExchangeError, // override commons
                        '-4145': ExchangeError, // override commons
                        '-4146': ExchangeError, // override commons
                        '-4147': ExchangeError, // override commons
                        '-4148': ExchangeError, // override commons
                        '-4149': ExchangeError, // override commons
                        '-4150': ExchangeError, // override commons
                        //
                        //        2xxxx
                        //
                        '-20121': ExchangeError, // override commons
                        '-20124': ExchangeError, // override commons
                        '-20130': ExchangeError, // override commons
                        '-20132': ExchangeError, // override commons
                        '-20194': ExchangeError, // override commons
                        '-20195': ExchangeError, // override commons
                        '-20196': ExchangeError, // override commons
                        '-20198': ExchangeError, // override commons
                        '-20204': ExchangeError, // override commons
                    },
                },
                'portfolioMargin': {
                    'exact': {
                        //
                        //        1xxx
                        //
                        '-1005': PermissionDenied, // {"code":-1005,"msg":"No such IP has been white listed"}
                        '-1011': PermissionDenied, // {"code":-1011,"msg":"This IP cannot access this route."}
                        '-1023': BadRequest, // START_TIME_GREATER_THAN_END_TIME
                        '-1109': BadRequest, // BAD_ACCOUNT
                        '-1110': BadSymbol, // BAD_INSTRUMENT_TYPE
                        '-1113': BadRequest, // {"code":-1113,"msg":"Withdrawal amount must be negative."}
                        '-1128': BadRequest, // {"code":-1128,"msg":"Combination of optional parameters invalid."}
                        '-1136': BadRequest, // INVALID_NEW_ORDER_RESP_TYPE
                        //
                        //        2xxx
                        //
                        '-2016': OperationRejected, // {"code":-2016,"msg":"No trading window could be found for the symbol. Try ticker/24hrs instead."}
                        '-2018': InsufficientFunds, // {"code":-2018,"msg":"Balance is insufficient"}
                        '-2019': InsufficientFunds, // Margin is insufficient
                        '-2020': OrderNotFillable, // UNABLE_TO_FILL
                        '-2021': OrderImmediatelyFillable, // Order would immediately trigger.
                        '-2022': InvalidOrder, // ReduceOnly Order is rejected
                        '-2023': OperationFailed, // User in liquidation mode now
                        '-2024': OperationRejected, // Position is not sufficient
                        '-2025': OperationRejected, // Reach max open order limit.
                        '-2026': InvalidOrder, // This OrderType is not supported when reduceOnly.
                        '-2027': OperationRejected, // Exceeded the maximum allowable position at current leverage.
                        '-2028': OperationRejected, // Leverage is smaller than permitted: insufficient margin balance.
                        //
                        //        4xxx
                        //
                        '-4063': BadRequest, // INVALID_OPTIONS_REQUEST_TYPE
                        '-4064': BadRequest, // INVALID_OPTIONS_TIME_FRAME
                        '-4065': BadRequest, // INVALID_OPTIONS_AMOUNT
                        '-4066': BadRequest, // INVALID_OPTIONS_EVENT_TYPE
                        '-4069': BadRequest, // Position INVALID_OPTIONS_PREMIUM_FEE
                        '-4070': BadRequest, // Client options id is not valid.
                        '-4071': BadRequest, // Invalid options direction
                        '-4072': OperationRejected, // premium fee is not updated, reject order
                        '-4073': BadRequest, // OPTIONS_PREMIUM_INPUT_LESS_THAN_ZERO
                        '-4074': BadRequest, // Order amount is bigger than upper boundary or less than 0, reject order
                        '-4075': BadRequest, // output premium fee is less than 0, reject order
                        '-4076': OperationRejected, // original fee is too much higher than last fee
                        '-4077': OperationRejected, // place order amount has reached to limit, reject order
                        '-4078': OperationFailed, // options internal error
                        '-4079': BadRequest, // invalid options id
                        '-4080': PermissionDenied, // user not found with id: %s
                        '-4081': BadRequest, // OPTIONS_NOT_FOUND
                        '-4085': BadRequest, // Invalid notional limit coefficient
                        '-4086': BadRequest, // Invalid price spread threshold
                        '-4087': PermissionDenied, // User can only place reduce only order
                        '-4088': PermissionDenied, // User can not place order currently
                        '-4114': BadRequest, // INVALID_CLIENT_TRAN_ID_LEN
                        '-4115': BadRequest, // DUPLICATED_CLIENT_TRAN_ID
                        '-4118': OperationRejected, // REDUCE_ONLY_MARGIN_CHECK_FAILED
                        '-4131': OperationRejected, // The counterparty's best price does not meet the PERCENT_PRICE filter limit
                        '-4140': BadRequest, // Invalid symbol status for opening position
                        '-4141': BadRequest, // Symbol is closed
                        '-4144': BadSymbol, // Invalid pair
                        '-4161': OperationRejected, // Leverage reduction is not supported in Isolated Margin Mode with open positions
                        '-4164': OperationRejected, // Leverage reduction is not supported in Isolated Margin Mode with open positions
                        '-4165': BadRequest, // Invalid time interval
                        '-4183': BadRequest, // Price is higher than stop price multiplier cap.
                        '-4184': BadRequest, // Price is lower than stop price multiplier floor.
                        //
                        //        5xxx
                        //
                        '-5021': OrderNotFillable, // Due to the order could not be filled immediately, the FOK order has been rejected.
                        '-5022': OrderNotFillable, // Due to the order could not be executed as maker, the Post Only order will be rejected.
                        //
                        //        2xxxx
                        //
                        '-20121': ExchangeError, // override commons
                        '-20124': ExchangeError, // override commons
                        '-20130': ExchangeError, // override commons
                        '-20132': ExchangeError, // override commons
                        '-20194': ExchangeError, // override commons
                        '-20195': ExchangeError, // override commons
                        '-20196': ExchangeError, // override commons
                        '-20198': ExchangeError, // override commons
                        '-20204': ExchangeError, // override commons
                        //   21xxx - PORTFOLIO MARGIN (documented in spot docs)
                        '-21001': BadRequest, // Request ID is not a Portfolio Margin Account.
                        '-21002': BadRequest, // Portfolio Margin Account doesn't support transfer from margin to futures.
                        '-21003': BadResponse, // Fail to retrieve margin assets.
                        '-21004': OperationRejected, // User doesn’t have portfolio margin bankruptcy loan
                        '-21005': InsufficientFunds, // User’s spot wallet doesn’t have enough BUSD to repay portfolio margin bankruptcy loan
                        '-21006': OperationFailed, // User had portfolio margin bankruptcy loan repayment in process
                        '-21007': OperationFailed, // User failed to repay portfolio margin bankruptcy loan since liquidation was in process
                    },
                },
                'exact': {
                    // error codes to cover ALL market types (however, specific market type might have override)
                    //
                    //        1xxx
                    //
                    '-1000': OperationFailed, // {"code":-1000,"msg":"An unknown error occured while processing the request."}
                    '-1001': OperationFailed, // {"code":-1001,"msg":"'Internal error; unable to process your request. Please try again.'"}
                    '-1002': AuthenticationError, // {"code":-1002,"msg":"'You are not authorized to execute this request.'"}
                    '-1003': RateLimitExceeded, // {"code":-1003,"msg":"Too much request weight used, current limit is 1200 request weight per 1 MINUTE. Please use the websocket for live updates to avoid polling the API."}
                    '-1004': OperationRejected, // DUPLICATE_IP : This IP is already on the white list
                    '-1006': OperationFailed, // {"code":-1006,"msg":"An unexpected response was received from the message bus. Execution status unknown."}
                    '-1007': RequestTimeout, // {"code":-1007,"msg":"Timeout waiting for response from backend server. Send status unknown; execution status unknown."}
                    '-1010': OperationFailed, // {"code":-1010,"msg":"ERROR_MSG_RECEIVED."}
                    '-1013': BadRequest, // INVALID_MESSAGE
                    '-1014': InvalidOrder, // {"code":-1014,"msg":"Unsupported order combination."}
                    '-1015': RateLimitExceeded, // {"code":-1015,"msg":"'Too many new orders; current limit is %s orders per %s.'"}
                    '-1016': BadRequest, // {"code":-1016,"msg":"'This service is no longer available.',"}
                    '-1020': BadRequest, // {"code":-1020,"msg":"'This operation is not supported.'"}
                    '-1021': InvalidNonce, // {"code":-1021,"msg":"'your time is ahead of server'"}
                    '-1022': AuthenticationError, // {"code":-1022,"msg":"Signature for this request is not valid."}
                    '-1100': BadRequest, // {"code":-1100,"msg":"createOrder(symbol, 1, asdf) -> 'Illegal characters found in parameter 'price'"}
                    '-1101': BadRequest, // {"code":-1101,"msg":"Too many parameters; expected %s and received %s."}
                    '-1102': BadRequest, // {"code":-1102,"msg":"Param %s or %s must be sent, but both were empty"}
                    '-1103': BadRequest, // {"code":-1103,"msg":"An unknown parameter was sent."}
                    '-1104': BadRequest, // {"code":-1104,"msg":"Not all sent parameters were read, read 8 parameters but was sent 9"}
                    '-1105': BadRequest, // {"code":-1105,"msg":"Parameter %s was empty."}
                    '-1106': BadRequest, // {"code":-1106,"msg":"Parameter %s sent when not required."}
                    '-1108': BadSymbol, // {"code":-1108,"msg":"Invalid asset."}
                    '-1111': BadRequest, // {"code":-1111,"msg":"Precision is over the maximum defined for this asset."}
                    '-1112': OperationFailed, // {"code":-1112,"msg":"No orders on book for symbol."}
                    '-1114': BadRequest, // {"code":-1114,"msg":"TimeInForce parameter sent when not required."}
                    '-1115': BadRequest, // {"code":-1115,"msg":"Invalid timeInForce."}
                    '-1116': BadRequest, // {"code":-1116,"msg":"Invalid orderType."}
                    '-1117': BadRequest, // {"code":-1117,"msg":"Invalid side."}
                    '-1118': BadRequest, // {"code":-1118,"msg":"New client order ID was empty."}
                    '-1119': BadRequest, // {"code":-1119,"msg":"Original client order ID was empty."}
                    '-1120': BadRequest, // {"code":-1120,"msg":"Invalid interval."}
                    '-1121': BadSymbol, // {"code":-1121,"msg":"Invalid symbol."}
                    '-1125': AuthenticationError, // {"code":-1125,"msg":"This listenKey does not exist."}
                    '-1127': BadRequest, // {"code":-1127,"msg":"More than %s hours between startTime and endTime."}
                    '-1128': BadRequest, // {"code":-1128,"msg":"Combination of optional parameters invalid."}
                    '-1130': BadRequest, // {"code":-1130,"msg":"Data sent for paramter %s is not valid."}
                    //
                    //        2xxx
                    //
                    '-2010': InvalidOrder, // NEW_ORDER_REJECTED
                    '-2011': OrderNotFound, // {"code":-2011,"msg":"cancelOrder(1, 'BTC/USDT') -> 'UNKNOWN_ORDER'"}
                    '-2013': OrderNotFound, // {"code":-2013,"msg":"fetchOrder (1, 'BTC/USDT') -> 'Order does not exist'"}
                    '-2014': AuthenticationError, // {"code":-2014,"msg":"API-key format invalid."}
                    '-2015': AuthenticationError, // {"code":-2015,"msg":"Invalid API-key, IP, or permissions for action."}
                    //
                    //        4xxx (common for linear, inverse, pm)
                    //
                    '-4000': InvalidOrder, // INVALID_ORDER_STATUS
                    '-4001': BadRequest, // PRICE_LESS_THAN_ZERO
                    '-4002': BadRequest, // PRICE_GREATER_THAN_MAX_PRICE
                    '-4003': BadRequest, // QTY_LESS_THAN_ZERO
                    '-4004': BadRequest, // QTY_LESS_THAN_MIN_QTY
                    '-4005': BadRequest, // QTY_GREATER_THAN_MAX_QTY
                    '-4006': BadRequest, // STOP_PRICE_LESS_THAN_ZERO
                    '-4007': BadRequest, // STOP_PRICE_GREATER_THAN_MAX_PRICE
                    '-4008': BadRequest, // TICK SIZE LESS THAN ZERO
                    '-4009': BadRequest, // MAX_PRICE_LESS_THAN_MIN_PRICE
                    '-4010': BadRequest, // MAX_QTY_LESS_THAN_MIN_QTY
                    '-4011': BadRequest, // STEP_SIZE_LESS_THAN_ZERO
                    '-4012': BadRequest, // MAX_NUM_ORDERS_LESS_THAN_ZERO
                    '-4013': BadRequest, // PRICE_LESS_THAN_MIN_PRICE
                    '-4014': BadRequest, // PRICE NOT INCREASED BY TICK SIZE
                    '-4015': BadRequest, // Client order id is not valid
                    '-4016': BadRequest, // Price is higher than mark price multiplier cap.
                    '-4017': BadRequest, // MULTIPLIER_UP_LESS_THAN_ZERO
                    '-4018': BadRequest, // MULTIPLIER_DOWN_LESS_THAN_ZERO
                    '-4019': OperationRejected, // COMPOSITE_SCALE_OVERFLOW
                    '-4020': BadRequest, // TARGET_STRATEGY_INVALID
                    '-4021': BadRequest, // INVALID_DEPTH_LIMIT
                    '-4022': BadRequest, // WRONG_MARKET_STATUS
                    '-4023': BadRequest, // QTY_NOT_INCREASED_BY_STEP_SIZE
                    '-4024': BadRequest, // PRICE_LOWER_THAN_MULTIPLIER_DOWN
                    '-4025': BadRequest, // MULTIPLIER_DECIMAL_LESS_THAN_ZERO
                    '-4026': BadRequest, // COMMISSION_INVALID
                    '-4027': BadRequest, // INVALID_ACCOUNT_TYPE
                    '-4028': BadRequest, // INVALID_LEVERAGE
                    '-4029': BadRequest, // INVALID_TICK SIZE_PRECISION
                    '-4030': BadRequest, // INVALID_STEP_SIZE_PRECISION
                    '-4031': BadRequest, // INVALID_WORKING_TYPE
                    '-4032': OperationRejected, // EXCEED_MAX_CANCEL_ORDER_SIZE (or Invalid parameter working type: %s)
                    '-4033': BadRequest, // INSURANCE_ACCOUNT_NOT_FOUND
                    '-4044': BadRequest, // INVALID_BALANCE_TYPE
                    '-4045': OperationRejected, // MAX_STOP_ORDER_EXCEEDED
                    '-4046': OperationRejected, // NO_NEED_TO_CHANGE_MARGIN_TYPE
                    '-4047': OperationRejected, // Margin type cannot be changed if there exists open orders.
                    '-4048': OperationRejected, // Margin type cannot be changed if there exists position.
                    '-4049': BadRequest, // Add margin only support for isolated position.
                    '-4050': InsufficientFunds, // Cross balance insufficient
                    '-4051': InsufficientFunds, // Isolated balance insufficient.
                    '-4052': OperationRejected, // No need to change auto add margin.
                    '-4053': BadRequest, // Auto add margin only support for isolated position.
                    '-4054': OperationRejected, // Cannot add position margin: position is 0.
                    '-4055': BadRequest, // Amount must be positive.
                    '-4056': AuthenticationError, // INVALID_API_KEY_TYPE
                    '-4057': AuthenticationError, // INVALID_RSA_PUBLIC_KEY: Invalid api public key
                    '-4058': BadRequest, // MAX_PRICE_TOO_LARGE
                    '-4059': OperationRejected, // NO_NEED_TO_CHANGE_POSITION_SIDE
                    '-4060': BadRequest, // INVALID_POSITION_SIDE
                    '-4061': OperationRejected, // POSITION_SIDE_NOT_MATCH: Order's position side does not match user's setting.
                    '-4062': BadRequest, // REDUCE_ONLY_CONFLICT: Invalid or improper reduceOnly value.
                    '-4067': OperationRejected, // Position side cannot be changed if there exists open orders.
                    '-4068': OperationRejected, // Position side cannot be changed if there exists position.
                    '-4082': BadRequest, // Invalid number of batch place orders.
                    '-4083': OperationRejected, // PLACE_BATCH_ORDERS_FAIL : Fail to place batch orders.
                    '-4084': BadRequest, // UPCOMING_METHOD : Method is not allowed currently. Upcoming soon.
                    '-4086': BadRequest, // Invalid price spread threshold.
                    '-4104': BadRequest, // INVALID_CONTRACT_TYPE
                    '-4135': BadRequest, // Invalid activation price
                    '-4137': BadRequest, // Quantity must be zero with closePosition equals true
                    '-4138': BadRequest, // Reduce only must be true with closePosition equals true
                    '-4139': BadRequest, // Order type can not be market if it's unable to cancel
                    '-4142': OrderImmediatelyFillable, // REJECT: take profit or stop order will be triggered immediately
                    //
                    //        2xxxx
                    //
                    // 20xxx - spot & futures algo (TBD for OPTIONS & PORTFOLIO MARGIN)
                    '-20121': BadSymbol, // Invalid symbol.
                    '-20124': BadRequest, // Invalid algo id or it has been completed.
                    '-20130': BadRequest, // Invalid data sent for a parameter
                    '-20132': BadRequest, // The client algo id is duplicated
                    '-20194': BadRequest, // Duration is too short to execute all required quantity.
                    '-20195': BadRequest, // The total size is too small.
                    '-20196': BadRequest, // The total size is too large.
                    '-20198': OperationRejected, // Reach the max open orders allowed.
                    '-20204': BadRequest, // The notional of USD is less or more than the limit.
                    //
                    // strings
                    //
                    'System is under maintenance.': OnMaintenance, // {"code":1,"msg":"System is under maintenance."}
                    'System abnormality': OperationFailed, // {"code":-1000,"msg":"System abnormality"}
                    'You are not authorized to execute this request.': PermissionDenied, // {"msg":"You are not authorized to execute this request."}
                    'API key does not exist': AuthenticationError,
                    'Order would trigger immediately.': OrderImmediatelyFillable,
                    'Stop price would trigger immediately.': OrderImmediatelyFillable, // {"code":-2010,"msg":"Stop price would trigger immediately."}
                    'Order would immediately match and take.': OrderImmediatelyFillable, // {"code":-2010,"msg":"Order would immediately match and take."}
                    'Account has insufficient balance for requested action.': InsufficientFunds,
                    'Rest API trading is not enabled.': PermissionDenied,
                    'This account may not place or cancel orders.': PermissionDenied,
                    "You don't have permission.": PermissionDenied, // {"msg":"You don't have permission.","success":false}
                    'Market is closed.': MarketClosed, // {"code":-1013,"msg":"Market is closed."}
                    'Too many requests. Please try again later.': RateLimitExceeded, // {"msg":"Too many requests. Please try again later.","success":false}
                    'This action is disabled on this account.': AccountSuspended, // {"code":-2011,"msg":"This action is disabled on this account."}
                    'Limit orders require GTC for this phase.': BadRequest,
                    'This order type is not possible in this trading phase.': BadRequest,
                    'This type of sub-account exceeds the maximum number limit': OperationRejected, // {"code":-9000,"msg":"This type of sub-account exceeds the maximum number limit"}
                    'This symbol is restricted for this account.': PermissionDenied,
                    'This symbol is not permitted for this account.': PermissionDenied, // {"code":-2010,"msg":"This symbol is not permitted for this account."}
                },
                'broad': {
                    'has no operation privilege': PermissionDenied,
                    'MAX_POSITION': BadRequest, // {"code":-2010,"msg":"Filter failure: MAX_POSITION"}
                },
            },
        });
    }

    isInverse (type: string, subType: Str = undefined): boolean {
        if (subType === undefined) {
            return (type === 'delivery');
        } else {
            return subType === 'inverse';
        }
    }

    isLinear (type: string, subType: Str = undefined): boolean {
        if (subType === undefined) {
            return (type === 'future') || (type === 'swap');
        } else {
            return subType === 'linear';
        }
    }

    setSandboxMode (enable: boolean) {
        super.setSandboxMode (enable);
        this.options['sandboxMode'] = enable;
    }

    createExpiredOptionMarket (symbol: string) {
        // support expired option contracts
        const settle = 'USDT';
        const optionParts = symbol.split ('-');
        const symbolBase = symbol.split ('/');
        let base = undefined;
        if (symbol.indexOf ('/') > -1) {
            base = this.safeString (symbolBase, 0);
        } else {
            base = this.safeString (optionParts, 0);
        }
        const expiry = this.safeString (optionParts, 1);
        const strike = this.safeInteger (optionParts, 2);
        const strikeAsString = this.safeString (optionParts, 2);
        const optionType = this.safeString (optionParts, 3);
        const datetime = this.convertExpireDate (expiry);
        const timestamp = this.parse8601 (datetime);
        return {
            'id': base + '-' + expiry + '-' + strikeAsString + '-' + optionType,
            'symbol': base + '/' + settle + ':' + settle + '-' + expiry + '-' + strikeAsString + '-' + optionType,
            'base': base,
            'quote': settle,
            'baseId': base,
            'quoteId': settle,
            'active': undefined,
            'type': 'option',
            'linear': undefined,
            'inverse': undefined,
            'spot': false,
            'swap': false,
            'future': false,
            'option': true,
            'margin': false,
            'contract': true,
            'contractSize': undefined,
            'expiry': timestamp,
            'expiryDatetime': datetime,
            'optionType': (optionType === 'C') ? 'call' : 'put',
            'strike': strike,
            'settle': settle,
            'settleId': settle,
            'precision': {
                'amount': undefined,
                'price': undefined,
            },
            'limits': {
                'amount': {
                    'min': undefined,
                    'max': undefined,
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'info': undefined,
        } as MarketInterface;
    }

    market (symbol: string): MarketInterface {
        if (this.markets === undefined) {
            throw new ExchangeError (this.id + ' markets not loaded');
        }
        // defaultType has legacy support on binance
        let defaultType = this.safeString (this.options, 'defaultType');
        const defaultSubType = this.safeString (this.options, 'defaultSubType');
        const isLegacyLinear = defaultType === 'future';
        const isLegacyInverse = defaultType === 'delivery';
        const isLegacy = isLegacyLinear || isLegacyInverse;
        if (typeof symbol === 'string') {
            if (symbol in this.markets) {
                const market = this.markets[symbol];
                // begin diff
                if (isLegacy && market['spot']) {
                    const settle = isLegacyLinear ? market['quote'] : market['base'];
                    const futuresSymbol = symbol + ':' + settle;
                    if (futuresSymbol in this.markets) {
                        return this.markets[futuresSymbol];
                    }
                } else {
                    return market;
                }
                // end diff
            } else if (symbol in this.markets_by_id) {
                const markets = this.markets_by_id[symbol];
                // begin diff
                if (isLegacyLinear) {
                    defaultType = 'linear';
                } else if (isLegacyInverse) {
                    defaultType = 'inverse';
                } else if (defaultType === undefined) {
                    defaultType = defaultSubType;
                }
                // end diff
                for (let i = 0; i < markets.length; i++) {
                    const market = markets[i];
                    if (market[defaultType]) {
                        return market;
                    }
                }
                return markets[0];
            } else if ((symbol.indexOf ('/') > -1) && (symbol.indexOf (':') < 0)) {
                // support legacy symbols
                const [ base, quote ] = symbol.split ('/');
                const settle = (quote === 'USD') ? base : quote;
                const futuresSymbol = symbol + ':' + settle;
                if (futuresSymbol in this.markets) {
                    return this.markets[futuresSymbol];
                }
            } else if ((symbol.indexOf ('-C') > -1) || (symbol.indexOf ('-P') > -1)) { // both exchange-id and unified symbols are supported this way regardless of the defaultType
                return this.createExpiredOptionMarket (symbol);
            }
        }
        throw new BadSymbol (this.id + ' does not have market symbol ' + symbol);
    }

    safeMarket (marketId: Str = undefined, market: Market = undefined, delimiter: Str = undefined, marketType: Str = undefined): MarketInterface {
        const isOption = (marketId !== undefined) && ((marketId.indexOf ('-C') > -1) || (marketId.indexOf ('-P') > -1));
        if (isOption && !(marketId in this.markets_by_id)) {
            // handle expired option contracts
            return this.createExpiredOptionMarket (marketId);
        }
        return super.safeMarket (marketId, market, delimiter, marketType);
    }

    costToPrecision (symbol, cost) {
        return this.decimalToPrecision (cost, TRUNCATE, this.markets[symbol]['precision']['quote'], this.precisionMode, this.paddingMode);
    }

    currencyToPrecision (code, fee, networkCode = undefined) {
        // info is available in currencies only if the user has configured his api keys
        if (this.safeValue (this.currencies[code], 'precision') !== undefined) {
            return this.decimalToPrecision (fee, TRUNCATE, this.currencies[code]['precision'], this.precisionMode, this.paddingMode);
        } else {
            return this.numberToString (fee);
        }
    }

    nonce () {
        return this.milliseconds () - this.options['timeDifference'];
    }

    /**
     * @method
     * @name binance#fetchTime
     * @description fetches the current integer timestamp in milliseconds from the exchange server
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#check-server-time                            // spot
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Check-Server-Time    // swap
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Check-Server-time             // future
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {int} the current integer timestamp in milliseconds from the exchange server
     */
    async fetchTime (params = {}) {
        const defaultType = this.safeString2 (this.options, 'fetchTime', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        const query = this.omit (params, 'type');
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchTime', undefined, params);
        let response = undefined;
        if (this.isLinear (type, subType)) {
            response = await this.fapiPublicGetTime (query);
        } else if (this.isInverse (type, subType)) {
            response = await this.dapiPublicGetTime (query);
        } else {
            response = await this.publicGetTime (query);
        }
        return this.safeInteger (response, 'serverTime');
    }

    /**
     * @method
     * @name binance#fetchCurrencies
     * @description fetches all available currencies on an exchange
     * @see https://developers.binance.com/docs/wallet/capital/all-coins-info
     * @see https://developers.binance.com/docs/margin_trading/market-data/Get-All-Margin-Assets
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an associative dictionary of currencies
     */
    async fetchCurrencies (params = {}): Promise<Currencies> {
        const fetchCurrenciesEnabled = this.safeBool (this.options, 'fetchCurrencies');
        if (!fetchCurrenciesEnabled) {
            return undefined;
        }
        // this endpoint requires authentication
        // while fetchCurrencies is a public API method by design
        // therefore we check the keys here
        // and fallback to generating the currencies from the markets
        if (!this.checkRequiredCredentials (false)) {
            return undefined;
        }
        // sandbox/testnet does not support sapi endpoints
        const apiBackup = this.safeValue (this.urls, 'apiBackup');
        if (apiBackup !== undefined) {
            return undefined;
        }
        const promises = [ this.sapiGetCapitalConfigGetall (params) ];
        const fetchMargins = this.safeBool (this.options, 'fetchMargins', false);
        if (fetchMargins) {
            promises.push (this.sapiGetMarginAllPairs (params));
        }
        const results = await Promise.all (promises);
        const responseCurrencies = results[0];
        let marginablesById = undefined;
        if (fetchMargins) {
            const responseMarginables = results[1];
            marginablesById = this.indexBy (responseMarginables, 'assetName');
        }
        const result: Dict = {};
        for (let i = 0; i < responseCurrencies.length; i++) {
            //
            //    {
            //        "coin": "LINK",
            //        "depositAllEnable": true,
            //        "withdrawAllEnable": true,
            //        "name": "ChainLink",
            //        "free": "0",
            //        "locked": "0",
            //        "freeze": "0",
            //        "withdrawing": "0",
            //        "ipoing": "0",
            //        "ipoable": "0",
            //        "storage": "0",
            //        "isLegalMoney": false,
            //        "trading": true,
            //        "networkList": [
            //            {
            //                "network": "BSC",
            //                "coin": "LINK",
            //                "withdrawIntegerMultiple": "0.00000001",
            //                "isDefault": false,
            //                "depositEnable": true,
            //                "withdrawEnable": true,
            //                "depositDesc": "",
            //                "withdrawDesc": "",
            //                "specialTips": "",
            //                "specialWithdrawTips": "The network you have selected is BSC. Please ensure that the withdrawal address supports the Binance Smart Chain network. You will lose your assets if the chosen platform does not support retrievals.",
            //                "name": "BNB Smart Chain (BEP20)",
            //                "resetAddressStatus": false,
            //                "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
            //                "addressRule": "",
            //                "memoRegex": "",
            //                "withdrawFee": "0.012",
            //                "withdrawMin": "0.024",
            //                "withdrawMax": "9999999999.99999999",
            //                "minConfirm": "15",
            //                "unLockConfirm": "0",
            //                "sameAddress": false,
            //                "estimatedArrivalTime": "5",
            //                "busy": false,
            //                "country": "AE,BINANCE_BAHRAIN_BSC"
            //            },
            //            {
            //                "network": "BNB",
            //                "coin": "LINK",
            //                "withdrawIntegerMultiple": "0.00000001",
            //                "isDefault": false,
            //                "depositEnable": true,
            //                "withdrawEnable": true,
            //                "depositDesc": "",
            //                "withdrawDesc": "",
            //                "specialTips": "Both a MEMO and an Address are required to successfully deposit your LINK BEP2 tokens to Binance.",
            //                "specialWithdrawTips": "",
            //                "name": "BNB Beacon Chain (BEP2)",
            //                "resetAddressStatus": false,
            //                "addressRegex": "^(bnb1)[0-9a-z]{38}$",
            //                "addressRule": "",
            //                "memoRegex": "^[0-9A-Za-z\\-_]{1,120}$",
            //                "withdrawFee": "0.002",
            //                "withdrawMin": "0.01",
            //                "withdrawMax": "10000000000",
            //                "minConfirm": "1",
            //                "unLockConfirm": "0",
            //                "sameAddress": true,
            //                "estimatedArrivalTime": "5",
            //                "busy": false,
            //                "country": "AE,BINANCE_BAHRAIN_BSC"
            //            },
            //            {
            //                "network": "ETH",
            //                "coin": "LINK",
            //                "withdrawIntegerMultiple": "0.00000001",
            //                "isDefault": true,
            //                "depositEnable": true,
            //                "withdrawEnable": true,
            //                "depositDesc": "",
            //                "withdrawDesc": "",
            //                "name": "Ethereum (ERC20)",
            //                "resetAddressStatus": false,
            //                "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
            //                "addressRule": "",
            //                "memoRegex": "",
            //                "withdrawFee": "0.55",
            //                "withdrawMin": "1.1",
            //                "withdrawMax": "10000000000",
            //                "minConfirm": "12",
            //                "unLockConfirm": "0",
            //                "sameAddress": false,
            //                "estimatedArrivalTime": "5",
            //                "busy": false,
            //                "country": "AE,BINANCE_BAHRAIN_BSC"
            //            }
            //        ]
            //    }
            //
            const entry = responseCurrencies[i];
            const id = this.safeString (entry, 'coin');
            const name = this.safeString (entry, 'name');
            const code = this.safeCurrencyCode (id);
            let minPrecision = undefined;
            let isWithdrawEnabled = true;
            let isDepositEnabled = true;
            const networkList = this.safeList (entry, 'networkList', []);
            const fees: Dict = {};
            let fee = undefined;
            const networks: Dict = {};
            for (let j = 0; j < networkList.length; j++) {
                const networkItem = networkList[j];
                const network = this.safeString (networkItem, 'network');
                const networkCode = this.networkIdToCode (network);
                // const name = this.safeString (networkItem, 'name');
                const withdrawFee = this.safeNumber (networkItem, 'withdrawFee');
                const depositEnable = this.safeBool (networkItem, 'depositEnable');
                const withdrawEnable = this.safeBool (networkItem, 'withdrawEnable');
                isDepositEnabled = isDepositEnabled || depositEnable;
                isWithdrawEnabled = isWithdrawEnabled || withdrawEnable;
                fees[network] = withdrawFee;
                const isDefault = this.safeBool (networkItem, 'isDefault');
                if (isDefault || (fee === undefined)) {
                    fee = withdrawFee;
                }
                const precisionTick = this.safeString (networkItem, 'withdrawIntegerMultiple');
                // avoid zero values, which are mostly from fiat or leveraged tokens : https://github.com/ccxt/ccxt/pull/14902#issuecomment-1271636731
                // so, when there is zero instead of i.e. 0.001, then we skip those cases, because we don't know the precision - it might be because of network is suspended or other reasons
                if (!Precise.stringEq (precisionTick, '0')) {
                    minPrecision = (minPrecision === undefined) ? precisionTick : Precise.stringMin (minPrecision, precisionTick);
                }
                networks[networkCode] = {
                    'info': networkItem,
                    'id': network,
                    'network': networkCode,
                    'active': depositEnable && withdrawEnable,
                    'deposit': depositEnable,
                    'withdraw': withdrawEnable,
                    'fee': withdrawFee,
                    'precision': this.parseNumber (precisionTick),
                    'limits': {
                        'withdraw': {
                            'min': this.safeNumber (networkItem, 'withdrawMin'),
                            'max': this.safeNumber (networkItem, 'withdrawMax'),
                        },
                        'deposit': {
                            'min': this.safeNumber (networkItem, 'depositDust'),
                            'max': undefined,
                        },
                    },
                };
            }
            const trading = this.safeBool (entry, 'trading');
            const active = (isWithdrawEnabled && isDepositEnabled && trading);
            const marginEntry = this.safeDict (marginablesById, id, {});
            //
            //     {
            //         assetName: "BTC",
            //         assetFullName: "Bitcoin",
            //         isBorrowable: true,
            //         isMortgageable: true,
            //         userMinBorrow: "0",
            //         userMinRepay: "0",
            //     }
            //
            result[code] = {
                'id': id,
                'name': name,
                'code': code,
                'precision': this.parseNumber (minPrecision),
                'info': entry,
                'active': active,
                'deposit': isDepositEnabled,
                'withdraw': isWithdrawEnabled,
                'networks': networks,
                'fee': fee,
                'fees': fees,
                'limits': this.limits,
                'margin': this.safeBool (marginEntry, 'isBorrowable'),
            };
        }
        return result;
    }

    /**
     * @method
     * @name binance#fetchMarkets
     * @description retrieves data on all markets for binance
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#exchange-information                             // spot
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Exchange-Information     // swap
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Exchange-Information              // future
     * @see https://developers.binance.com/docs/derivatives/option/market-data/Exchange-Information                             // option
     * @see https://developers.binance.com/docs/margin_trading/market-data/Get-All-Cross-Margin-Pairs                             // cross margin
     * @see https://developers.binance.com/docs/margin_trading/market-data/Get-All-Isolated-Margin-Symbol                             // isolated margin
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of objects representing market data
     */
    async fetchMarkets (params = {}): Promise<Market[]> {
        const promisesRaw = [];
        const rawFetchMarkets = this.safeList (this.options, 'fetchMarkets', [ 'spot', 'linear', 'inverse' ]);
        const sandboxMode = this.safeBool (this.options, 'sandboxMode', false);
        const fetchMarkets = [];
        for (let i = 0; i < rawFetchMarkets.length; i++) {
            const type = rawFetchMarkets[i];
            if (type === 'option' && sandboxMode) {
                continue;
            }
            fetchMarkets.push (type);
        }
        const fetchMargins = this.safeBool (this.options, 'fetchMargins', false);
        for (let i = 0; i < fetchMarkets.length; i++) {
            const marketType = fetchMarkets[i];
            if (marketType === 'spot') {
                promisesRaw.push (this.publicGetExchangeInfo (params));
                if (fetchMargins && this.checkRequiredCredentials (false) && !sandboxMode) {
                    promisesRaw.push (this.sapiGetMarginAllPairs (params));
                    promisesRaw.push (this.sapiGetMarginIsolatedAllPairs (params));
                }
            } else if (marketType === 'linear') {
                promisesRaw.push (this.fapiPublicGetExchangeInfo (params));
            } else if (marketType === 'inverse') {
                promisesRaw.push (this.dapiPublicGetExchangeInfo (params));
            } else if (marketType === 'option') {
                promisesRaw.push (this.eapiPublicGetExchangeInfo (params));
            } else {
                throw new ExchangeError (this.id + ' fetchMarkets() this.options fetchMarkets "' + marketType + '" is not a supported market type');
            }
        }
        const results = await Promise.all (promisesRaw);
        let markets = [];
        this.options['crossMarginPairsData'] = [];
        this.options['isolatedMarginPairsData'] = [];
        for (let i = 0; i < results.length; i++) {
            const res = this.safeValue (results, i);
            if (fetchMargins && Array.isArray (res)) {
                const keysList = Object.keys (this.indexBy (res, 'symbol'));
                const length = this.options['crossMarginPairsData'].length;
                // first one is the cross-margin promise
                if (length === 0) {
                    this.options['crossMarginPairsData'] = keysList;
                } else {
                    this.options['isolatedMarginPairsData'] = keysList;
                }
            } else {
                const resultMarkets = this.safeList2 (res, 'symbols', 'optionSymbols', []);
                markets = this.arrayConcat (markets, resultMarkets);
            }
        }
        //
        // spot / margin
        //
        //     {
        //         "timezone":"UTC",
        //         "serverTime":1575416692969,
        //         "rateLimits":[
        //             {"rateLimitType":"REQUEST_WEIGHT","interval":"MINUTE","intervalNum":1,"limit":1200},
        //             {"rateLimitType":"ORDERS","interval":"SECOND","intervalNum":10,"limit":100},
        //             {"rateLimitType":"ORDERS","interval":"DAY","intervalNum":1,"limit":200000}
        //         ],
        //         "exchangeFilters":[],
        //         "symbols":[
        //             {
        //                 "symbol":"ETHBTC",
        //                 "status":"TRADING",
        //                 "baseAsset":"ETH",
        //                 "baseAssetPrecision":8,
        //                 "quoteAsset":"BTC",
        //                 "quotePrecision":8,
        //                 "baseCommissionPrecision":8,
        //                 "quoteCommissionPrecision":8,
        //                 "orderTypes":["LIMIT","LIMIT_MAKER","MARKET","STOP_LOSS_LIMIT","TAKE_PROFIT_LIMIT"],
        //                 "icebergAllowed":true,
        //                 "ocoAllowed":true,
        //                 "quoteOrderQtyMarketAllowed":true,
        //                 "allowTrailingStop":false,
        //                 "isSpotTradingAllowed":true,
        //                 "isMarginTradingAllowed":true,
        //                 "filters":[
        //                     {"filterType":"PRICE_FILTER","minPrice":"0.00000100","maxPrice":"100000.00000000","tickSize":"0.00000100"},
        //                     {"filterType":"PERCENT_PRICE","multiplierUp":"5","multiplierDown":"0.2","avgPriceMins":5},
        //                     {"filterType":"LOT_SIZE","minQty":"0.00100000","maxQty":"100000.00000000","stepSize":"0.00100000"},
        //                     {"filterType":"MIN_NOTIONAL","minNotional":"0.00010000","applyToMarket":true,"avgPriceMins":5},
        //                     {"filterType":"ICEBERG_PARTS","limit":10},
        //                     {"filterType":"MARKET_LOT_SIZE","minQty":"0.00000000","maxQty":"63100.00000000","stepSize":"0.00000000"},
        //                     {"filterType":"MAX_NUM_ORDERS","maxNumOrders":200},
        //                     {"filterType":"MAX_NUM_ALGO_ORDERS","maxNumAlgoOrders":5}
        //                 ],
        //                 "permissions":["SPOT","MARGIN"]}
        //             },
        //         ],
        //     }
        //
        // cross & isolated pairs response:
        //
        //     [
        //         {
        //           symbol: "BTCUSDT",
        //           base: "BTC",
        //           quote: "USDT",
        //           isMarginTrade: true,
        //           isBuyAllowed: true,
        //           isSellAllowed: true,
        //           id: "376870555451677893", // doesn't exist in isolated
        //         },
        //     ]
        //
        // futures/usdt-margined (fapi)
        //
        //     {
        //         "timezone":"UTC",
        //         "serverTime":1575417244353,
        //         "rateLimits":[
        //             {"rateLimitType":"REQUEST_WEIGHT","interval":"MINUTE","intervalNum":1,"limit":1200},
        //             {"rateLimitType":"ORDERS","interval":"MINUTE","intervalNum":1,"limit":1200}
        //         ],
        //         "exchangeFilters":[],
        //         "symbols":[
        //             {
        //                 "symbol":"BTCUSDT",
        //                 "status":"TRADING",
        //                 "maintMarginPercent":"2.5000",
        //                 "requiredMarginPercent":"5.0000",
        //                 "baseAsset":"BTC",
        //                 "quoteAsset":"USDT",
        //                 "pricePrecision":2,
        //                 "quantityPrecision":3,
        //                 "baseAssetPrecision":8,
        //                 "quotePrecision":8,
        //                 "filters":[
        //                     {"minPrice":"0.01","maxPrice":"100000","filterType":"PRICE_FILTER","tickSize":"0.01"},
        //                     {"stepSize":"0.001","filterType":"LOT_SIZE","maxQty":"1000","minQty":"0.001"},
        //                     {"stepSize":"0.001","filterType":"MARKET_LOT_SIZE","maxQty":"1000","minQty":"0.001"},
        //                     {"limit":200,"filterType":"MAX_NUM_ORDERS"},
        //                     {"multiplierDown":"0.8500","multiplierUp":"1.1500","multiplierDecimal":"4","filterType":"PERCENT_PRICE"}
        //                 ],
        //                 "orderTypes":["LIMIT","MARKET","STOP"],
        //                 "timeInForce":["GTC","IOC","FOK","GTX"]
        //             }
        //         ]
        //     }
        //
        // delivery/coin-margined (dapi)
        //
        //     {
        //         "timezone": "UTC",
        //         "serverTime": 1597667052958,
        //         "rateLimits": [
        //             {"rateLimitType":"REQUEST_WEIGHT","interval":"MINUTE","intervalNum":1,"limit":6000},
        //             {"rateLimitType":"ORDERS","interval":"MINUTE","intervalNum":1,"limit":6000}
        //         ],
        //         "exchangeFilters": [],
        //         "symbols": [
        //             {
        //                 "symbol": "BTCUSD_200925",
        //                 "pair": "BTCUSD",
        //                 "contractType": "CURRENT_QUARTER",
        //                 "deliveryDate": 1601020800000,
        //                 "onboardDate": 1590739200000,
        //                 "contractStatus": "TRADING",
        //                 "contractSize": 100,
        //                 "marginAsset": "BTC",
        //                 "maintMarginPercent": "2.5000",
        //                 "requiredMarginPercent": "5.0000",
        //                 "baseAsset": "BTC",
        //                 "quoteAsset": "USD",
        //                 "pricePrecision": 1,
        //                 "quantityPrecision": 0,
        //                 "baseAssetPrecision": 8,
        //                 "quotePrecision": 8,
        //                 "equalQtyPrecision": 4,
        //                 "filters": [
        //                     {"minPrice":"0.1","maxPrice":"100000","filterType":"PRICE_FILTER","tickSize":"0.1"},
        //                     {"stepSize":"1","filterType":"LOT_SIZE","maxQty":"100000","minQty":"1"},
        //                     {"stepSize":"0","filterType":"MARKET_LOT_SIZE","maxQty":"100000","minQty":"1"},
        //                     {"limit":200,"filterType":"MAX_NUM_ORDERS"},
        //                     {"multiplierDown":"0.9500","multiplierUp":"1.0500","multiplierDecimal":"4","filterType":"PERCENT_PRICE"}
        //                 ],
        //                 "orderTypes": ["LIMIT","MARKET","STOP","STOP_MARKET","TAKE_PROFIT","TAKE_PROFIT_MARKET","TRAILING_STOP_MARKET"],
        //                 "timeInForce": ["GTC","IOC","FOK","GTX"]
        //             },
        //             {
        //                 "symbol": "BTCUSD_PERP",
        //                 "pair": "BTCUSD",
        //                 "contractType": "PERPETUAL",
        //                 "deliveryDate": 4133404800000,
        //                 "onboardDate": 1596006000000,
        //                 "contractStatus": "TRADING",
        //                 "contractSize": 100,
        //                 "marginAsset": "BTC",
        //                 "maintMarginPercent": "2.5000",
        //                 "requiredMarginPercent": "5.0000",
        //                 "baseAsset": "BTC",
        //                 "quoteAsset": "USD",
        //                 "pricePrecision": 1,
        //                 "quantityPrecision": 0,
        //                 "baseAssetPrecision": 8,
        //                 "quotePrecision": 8,
        //                 "equalQtyPrecision": 4,
        //                 "filters": [
        //                     {"minPrice":"0.1","maxPrice":"100000","filterType":"PRICE_FILTER","tickSize":"0.1"},
        //                     {"stepSize":"1","filterType":"LOT_SIZE","maxQty":"100000","minQty":"1"},
        //                     {"stepSize":"1","filterType":"MARKET_LOT_SIZE","maxQty":"100000","minQty":"1"},
        //                     {"limit":200,"filterType":"MAX_NUM_ORDERS"},
        //                     {"multiplierDown":"0.8500","multiplierUp":"1.1500","multiplierDecimal":"4","filterType":"PERCENT_PRICE"}
        //                 ],
        //                 "orderTypes": ["LIMIT","MARKET","STOP","STOP_MARKET","TAKE_PROFIT","TAKE_PROFIT_MARKET","TRAILING_STOP_MARKET"],
        //                 "timeInForce": ["GTC","IOC","FOK","GTX"]
        //             }
        //         ]
        //     }
        //
        // options (eapi)
        //
        //     {
        //         "timezone": "UTC",
        //         "serverTime": 1675912490405,
        //         "optionContracts": [
        //             {
        //                 "id": 1,
        //                 "baseAsset": "SOL",
        //                 "quoteAsset": "USDT",
        //                 "underlying": "SOLUSDT",
        //                 "settleAsset": "USDT"
        //             },
        //             ...
        //         ],
        //         "optionAssets": [
        //             {"id":1,"name":"USDT"}
        //         ],
        //         "optionSymbols": [
        //             {
        //                 "contractId": 3,
        //                 "expiryDate": 1677225600000,
        //                 "filters": [
        //                     {"filterType":"PRICE_FILTER","minPrice":"724.6","maxPrice":"919.2","tickSize":"0.1"},
        //                     {"filterType":"LOT_SIZE","minQty":"0.01","maxQty":"1000","stepSize":"0.01"}
        //                 ],
        //                 "id": 2474,
        //                 "symbol": "ETH-230224-800-C",
        //                 "side": "CALL",
        //                 "strikePrice": "800.00000000",
        //                 "underlying": "ETHUSDT",
        //                 "unit": 1,
        //                 "makerFeeRate": "0.00020000",
        //                 "takerFeeRate": "0.00020000",
        //                 "minQty": "0.01",
        //                 "maxQty": "1000",
        //                 "initialMargin": "0.15000000",
        //                 "maintenanceMargin": "0.07500000",
        //                 "minInitialMargin": "0.10000000",
        //                 "minMaintenanceMargin": "0.05000000",
        //                 "priceScale": 1,
        //                 "quantityScale": 2,
        //                 "quoteAsset": "USDT"
        //             },
        //             ...
        //         ],
        //         "rateLimits": [
        //             {"rateLimitType":"REQUEST_WEIGHT","interval":"MINUTE","intervalNum":1,"limit":400},
        //             {"rateLimitType":"ORDERS","interval":"MINUTE","intervalNum":1,"limit":100},
        //             {"rateLimitType":"ORDERS","interval":"SECOND","intervalNum":10,"limit":30}
        //         ]
        //     }
        //
        if (this.options['adjustForTimeDifference']) {
            await this.loadTimeDifference ();
        }
        const result = [];
        for (let i = 0; i < markets.length; i++) {
            result.push (this.parseMarket (markets[i]));
        }
        return result;
    }

    parseMarket (market: Dict): Market {
        let swap = false;
        let future = false;
        let option = false;
        const underlying = this.safeString (market, 'underlying');
        const id = this.safeString (market, 'symbol');
        const optionParts = id.split ('-');
        const optionBase = this.safeString (optionParts, 0);
        const lowercaseId = this.safeStringLower (market, 'symbol');
        const baseId = this.safeString (market, 'baseAsset', optionBase);
        const quoteId = this.safeString (market, 'quoteAsset');
        const base = this.safeCurrencyCode (baseId);
        const quote = this.safeCurrencyCode (quoteId);
        const contractType = this.safeString (market, 'contractType');
        let contract = ('contractType' in market);
        let expiry = this.safeInteger2 (market, 'deliveryDate', 'expiryDate');
        let settleId = this.safeString (market, 'marginAsset');
        if ((contractType === 'PERPETUAL') || (expiry === 4133404800000)) { // some swap markets do not have contract type, eg: BTCST
            expiry = undefined;
            swap = true;
        } else if (underlying !== undefined) {
            contract = true;
            option = true;
            settleId = (settleId === undefined) ? 'USDT' : settleId;
        } else if (expiry !== undefined) {
            future = true;
        }
        const settle = this.safeCurrencyCode (settleId);
        const spot = !contract;
        const filters = this.safeList (market, 'filters', []);
        const filtersByType = this.indexBy (filters, 'filterType');
        const status = this.safeString2 (market, 'status', 'contractStatus');
        let contractSize = undefined;
        let fees = this.fees;
        let linear = undefined;
        let inverse = undefined;
        let symbol = base + '/' + quote;
        let strike = undefined;
        if (contract) {
            if (swap) {
                symbol = symbol + ':' + settle;
            } else if (future) {
                symbol = symbol + ':' + settle + '-' + this.yymmdd (expiry);
            } else if (option) {
                strike = this.numberToString (this.parseToNumeric (this.safeString (market, 'strikePrice')));
                symbol = symbol + ':' + settle + '-' + this.yymmdd (expiry) + '-' + strike + '-' + this.safeString (optionParts, 3);
            }
            contractSize = this.safeNumber2 (market, 'contractSize', 'unit', this.parseNumber ('1'));
            linear = settle === quote;
            inverse = settle === base;
            const feesType = linear ? 'linear' : 'inverse';
            fees = this.safeDict (this.fees, feesType, {}) as any;
        }
        let active = (status === 'TRADING');
        if (spot) {
            const permissions = this.safeList (market, 'permissions', []);
            for (let j = 0; j < permissions.length; j++) {
                if (permissions[j] === 'TRD_GRP_003') {
                    active = false;
                    break;
                }
            }
        }
        const isMarginTradingAllowed = this.safeBool (market, 'isMarginTradingAllowed', false);
        let marginModes = undefined;
        if (spot) {
            const hasCrossMargin = this.inArray (id, this.options['crossMarginPairsData']);
            const hasIsolatedMargin = this.inArray (id, this.options['isolatedMarginPairsData']);
            marginModes = {
                'cross': hasCrossMargin,
                'isolated': hasIsolatedMargin,
            };
        } else if (linear || inverse) {
            marginModes = {
                'cross': true,
                'isolated': true,
            };
        }
        let unifiedType = undefined;
        if (spot) {
            unifiedType = 'spot';
        } else if (swap) {
            unifiedType = 'swap';
        } else if (future) {
            unifiedType = 'future';
        } else if (option) {
            unifiedType = 'option';
            active = undefined;
        }
        let parsedStrike = undefined;
        if (strike !== undefined) {
            parsedStrike = this.parseToNumeric (strike);
        }
        const entry = {
            'id': id,
            'lowercaseId': lowercaseId,
            'symbol': symbol,
            'base': base,
            'quote': quote,
            'settle': settle,
            'baseId': baseId,
            'quoteId': quoteId,
            'settleId': settleId,
            'type': unifiedType,
            'spot': spot,
            'margin': spot && isMarginTradingAllowed,
            'marginModes': marginModes,
            'swap': swap,
            'future': future,
            'option': option,
            'active': active,
            'contract': contract,
            'linear': linear,
            'inverse': inverse,
            'taker': fees['trading']['taker'],
            'maker': fees['trading']['maker'],
            'contractSize': contractSize,
            'expiry': expiry,
            'expiryDatetime': this.iso8601 (expiry),
            'strike': parsedStrike,
            'optionType': this.safeStringLower (market, 'side'),
            'precision': {
                'amount': this.parseNumber (this.parsePrecision (this.safeString2 (market, 'quantityPrecision', 'quantityScale'))),
                'price': this.parseNumber (this.parsePrecision (this.safeString2 (market, 'pricePrecision', 'priceScale'))),
                'base': this.parseNumber (this.parsePrecision (this.safeString (market, 'baseAssetPrecision'))),
                'quote': this.parseNumber (this.parsePrecision (this.safeString (market, 'quotePrecision'))),
            },
            'limits': {
                'leverage': {
                    'min': undefined,
                    'max': undefined,
                },
                'amount': {
                    'min': this.safeNumber (market, 'minQty'),
                    'max': this.safeNumber (market, 'maxQty'),
                },
                'price': {
                    'min': undefined,
                    'max': undefined,
                },
                'cost': {
                    'min': undefined,
                    'max': undefined,
                },
            },
            'info': market,
            'created': this.safeInteger (market, 'onboardDate'), // present in inverse & linear apis
        };
        if ('PRICE_FILTER' in filtersByType) {
            const filter = this.safeDict (filtersByType, 'PRICE_FILTER', {});
            // PRICE_FILTER reports zero values for maxPrice
            // since they updated filter types in November 2018
            // https://github.com/ccxt/ccxt/issues/4286
            // therefore limits['price']['max'] doesn't have any meaningful value except undefined
            entry['limits']['price'] = {
                'min': this.safeNumber (filter, 'minPrice'),
                'max': this.safeNumber (filter, 'maxPrice'),
            };
            entry['precision']['price'] = this.safeNumber (filter, 'tickSize');
        }
        if ('LOT_SIZE' in filtersByType) {
            const filter = this.safeDict (filtersByType, 'LOT_SIZE', {});
            entry['precision']['amount'] = this.safeNumber (filter, 'stepSize');
            entry['limits']['amount'] = {
                'min': this.safeNumber (filter, 'minQty'),
                'max': this.safeNumber (filter, 'maxQty'),
            };
        }
        if ('MARKET_LOT_SIZE' in filtersByType) {
            const filter = this.safeDict (filtersByType, 'MARKET_LOT_SIZE', {});
            entry['limits']['market'] = {
                'min': this.safeNumber (filter, 'minQty'),
                'max': this.safeNumber (filter, 'maxQty'),
            };
        }
        if (('MIN_NOTIONAL' in filtersByType) || ('NOTIONAL' in filtersByType)) { // notional added in 12/04/23 to spot testnet
            const filter = this.safeDict2 (filtersByType, 'MIN_NOTIONAL', 'NOTIONAL', {});
            entry['limits']['cost']['min'] = this.safeNumber2 (filter, 'minNotional', 'notional');
            entry['limits']['cost']['max'] = this.safeNumber (filter, 'maxNotional');
        }
        return entry;
    }

    parseBalanceHelper (entry) {
        const account = this.account ();
        account['used'] = this.safeString (entry, 'locked');
        account['free'] = this.safeString (entry, 'free');
        const interest = this.safeString (entry, 'interest');
        const debt = this.safeString (entry, 'borrowed');
        account['debt'] = Precise.stringAdd (debt, interest);
        return account;
    }

    parseBalanceCustom (response, type = undefined, marginMode = undefined, isPortfolioMargin = false): Balances {
        const result = {
            'info': response,
        };
        let timestamp = undefined;
        const isolated = marginMode === 'isolated';
        const cross = (type === 'margin') || (marginMode === 'cross');
        if (isPortfolioMargin) {
            for (let i = 0; i < response.length; i++) {
                const entry = response[i];
                const account = this.account ();
                const currencyId = this.safeString (entry, 'asset');
                const code = this.safeCurrencyCode (currencyId);
                if (type === 'linear') {
                    account['free'] = this.safeString (entry, 'umWalletBalance');
                    account['used'] = this.safeString (entry, 'umUnrealizedPNL');
                } else if (type === 'inverse') {
                    account['free'] = this.safeString (entry, 'cmWalletBalance');
                    account['used'] = this.safeString (entry, 'cmUnrealizedPNL');
                } else if (cross) {
                    const borrowed = this.safeString (entry, 'crossMarginBorrowed');
                    const interest = this.safeString (entry, 'crossMarginInterest');
                    account['debt'] = Precise.stringAdd (borrowed, interest);
                    account['free'] = this.safeString (entry, 'crossMarginFree');
                    account['used'] = this.safeString (entry, 'crossMarginLocked');
                    account['total'] = this.safeString (entry, 'crossMarginAsset');
                } else {
                    account['total'] = this.safeString (entry, 'totalWalletBalance');
                }
                result[code] = account;
            }
        } else if (!isolated && ((type === 'spot') || cross)) {
            timestamp = this.safeInteger (response, 'updateTime');
            const balances = this.safeList2 (response, 'balances', 'userAssets', []);
            for (let i = 0; i < balances.length; i++) {
                const balance = balances[i];
                const currencyId = this.safeString (balance, 'asset');
                const code = this.safeCurrencyCode (currencyId);
                const account = this.account ();
                account['free'] = this.safeString (balance, 'free');
                account['used'] = this.safeString (balance, 'locked');
                if (cross) {
                    const debt = this.safeString (balance, 'borrowed');
                    const interest = this.safeString (balance, 'interest');
                    account['debt'] = Precise.stringAdd (debt, interest);
                }
                result[code] = account;
            }
        } else if (isolated) {
            const assets = this.safeList (response, 'assets');
            for (let i = 0; i < assets.length; i++) {
                const asset = assets[i];
                const marketId = this.safeString (asset, 'symbol');
                const symbol = this.safeSymbol (marketId, undefined, undefined, 'spot');
                const base = this.safeDict (asset, 'baseAsset', {});
                const quote = this.safeDict (asset, 'quoteAsset', {});
                const baseCode = this.safeCurrencyCode (this.safeString (base, 'asset'));
                const quoteCode = this.safeCurrencyCode (this.safeString (quote, 'asset'));
                const subResult: Dict = {};
                subResult[baseCode] = this.parseBalanceHelper (base);
                subResult[quoteCode] = this.parseBalanceHelper (quote);
                result[symbol] = this.safeBalance (subResult);
            }
        } else if (type === 'savings') {
            const positionAmountVos = this.safeList (response, 'positionAmountVos', []);
            for (let i = 0; i < positionAmountVos.length; i++) {
                const entry = positionAmountVos[i];
                const currencyId = this.safeString (entry, 'asset');
                const code = this.safeCurrencyCode (currencyId);
                const account = this.account ();
                const usedAndTotal = this.safeString (entry, 'amount');
                account['total'] = usedAndTotal;
                account['used'] = usedAndTotal;
                result[code] = account;
            }
        } else if (type === 'funding') {
            for (let i = 0; i < response.length; i++) {
                const entry = response[i];
                const account = this.account ();
                const currencyId = this.safeString (entry, 'asset');
                const code = this.safeCurrencyCode (currencyId);
                account['free'] = this.safeString (entry, 'free');
                const frozen = this.safeString (entry, 'freeze');
                const withdrawing = this.safeString (entry, 'withdrawing');
                const locked = this.safeString (entry, 'locked');
                account['used'] = Precise.stringAdd (frozen, Precise.stringAdd (locked, withdrawing));
                result[code] = account;
            }
        } else {
            let balances = response;
            if (!Array.isArray (response)) {
                balances = this.safeList (response, 'assets', []);
            }
            for (let i = 0; i < balances.length; i++) {
                const balance = balances[i];
                const currencyId = this.safeString (balance, 'asset');
                const code = this.safeCurrencyCode (currencyId);
                const account = this.account ();
                account['free'] = this.safeString (balance, 'availableBalance');
                account['used'] = this.safeString (balance, 'initialMargin');
                account['total'] = this.safeString2 (balance, 'marginBalance', 'balance');
                result[code] = account;
            }
        }
        result['timestamp'] = timestamp;
        result['datetime'] = this.iso8601 (timestamp);
        return isolated ? result : this.safeBalance (result);
    }

    /**
     * @method
     * @name binance#fetchBalance
     * @description query for balance and get the amount of funds available for trading or funds locked in orders
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#account-information-user_data                    // spot
     * @see https://developers.binance.com/docs/margin_trading/account/Query-Cross-Margin-Account-Details                       // cross margin
     * @see https://developers.binance.com/docs/margin_trading/account/Query-Isolated-Margin-Account-Info                       // isolated margin
     * @see https://developers.binance.com/docs/wallet/asset/funding-wallet                                                     // funding
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Futures-Account-Balance-V2   // swap
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Futures-Account-Balance               // future
     * @see https://developers.binance.com/docs/derivatives/option/account/Option-Account-Information                           // option
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Account-Balance                            // portfolio margin
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.type] 'future', 'delivery', 'savings', 'funding', or 'spot' or 'papi'
     * @param {string} [params.marginMode] 'cross' or 'isolated', for margin trading, uses this.options.defaultMarginMode if not passed, defaults to undefined/None/null
     * @param {string[]|undefined} [params.symbols] unified market symbols, only used in isolated margin mode
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch the balance for a portfolio margin account
     * @param {string} [params.subType] 'linear' or 'inverse'
     * @returns {object} a [balance structure]{@link https://docs.ccxt.com/#/?id=balance-structure}
     */
    async fetchBalance (params = {}): Promise<Balances> {
        await this.loadMarkets ();
        const defaultType = this.safeString2 (this.options, 'fetchBalance', 'defaultType', 'spot');
        let type = this.safeString (params, 'type', defaultType);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchBalance', undefined, params);
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchBalance', 'papi', 'portfolioMargin', false);
        let marginMode = undefined;
        let query = undefined;
        [ marginMode, query ] = this.handleMarginModeAndParams ('fetchBalance', params);
        query = this.omit (query, 'type');
        let response = undefined;
        const request: Dict = {};
        if (isPortfolioMargin || (type === 'papi')) {
            if (this.isLinear (type, subType)) {
                type = 'linear';
            } else if (this.isInverse (type, subType)) {
                type = 'inverse';
            }
            isPortfolioMargin = true;
            response = await this.papiGetBalance (this.extend (request, query));
        } else if (this.isLinear (type, subType)) {
            type = 'linear';
            let useV2 = undefined;
            [ useV2, params ] = this.handleOptionAndParams (params, 'fetchBalance', 'useV2', false);
            params = this.extend (request, query);
            if (!useV2) {
                response = await this.fapiPrivateV3GetAccount (params);
            } else {
                response = await this.fapiPrivateV2GetAccount (params);
            }
        } else if (this.isInverse (type, subType)) {
            type = 'inverse';
            response = await this.dapiPrivateGetAccount (this.extend (request, query));
        } else if (marginMode === 'isolated') {
            const paramSymbols = this.safeList (params, 'symbols');
            query = this.omit (query, 'symbols');
            if (paramSymbols !== undefined) {
                let symbols = '';
                if (Array.isArray (paramSymbols)) {
                    symbols = this.marketId (paramSymbols[0]);
                    for (let i = 1; i < paramSymbols.length; i++) {
                        const symbol = paramSymbols[i];
                        const id = this.marketId (symbol);
                        symbols += ',' + id;
                    }
                } else {
                    symbols = paramSymbols;
                }
                request['symbols'] = symbols;
            }
            response = await this.sapiGetMarginIsolatedAccount (this.extend (request, query));
        } else if ((type === 'margin') || (marginMode === 'cross')) {
            response = await this.sapiGetMarginAccount (this.extend (request, query));
        } else if (type === 'savings') {
            response = await this.sapiGetLendingUnionAccount (this.extend (request, query));
        } else if (type === 'funding') {
            response = await this.sapiPostAssetGetFundingAsset (this.extend (request, query));
        } else {
            response = await this.privateGetAccount (this.extend (request, query));
        }
        //
        // spot
        //
        //     {
        //         "makerCommission": 10,
        //         "takerCommission": 10,
        //         "buyerCommission": 0,
        //         "sellerCommission": 0,
        //         "canTrade": true,
        //         "canWithdraw": true,
        //         "canDeposit": true,
        //         "updateTime": 1575357359602,
        //         "accountType": "MARGIN",
        //         "balances": [
        //             { asset: "BTC", free: "0.00219821", locked: "0.00000000"  },
        //         ]
        //     }
        //
        // margin (cross)
        //
        //     {
        //         "borrowEnabled":true,
        //         "marginLevel":"999.00000000",
        //         "totalAssetOfBtc":"0.00000000",
        //         "totalLiabilityOfBtc":"0.00000000",
        //         "totalNetAssetOfBtc":"0.00000000",
        //         "tradeEnabled":true,
        //         "transferEnabled":true,
        //         "userAssets":[
        //             {"asset":"MATIC","borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000"},
        //             {"asset":"VET","borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000"},
        //             {"asset":"USDT","borrowed":"0.00000000","free":"0.00000000","interest":"0.00000000","locked":"0.00000000","netAsset":"0.00000000"}
        //         ],
        //     }
        //
        // margin (isolated)
        //
        //    {
        //        "info": {
        //            "assets": [
        //                {
        //                    "baseAsset": {
        //                        "asset": "1INCH",
        //                        "borrowEnabled": true,
        //                        "borrowed": "0",
        //                        "free": "0",
        //                        "interest": "0",
        //                        "locked": "0",
        //                        "netAsset": "0",
        //                        "netAssetOfBtc": "0",
        //                        "repayEnabled": true,
        //                        "totalAsset": "0"
        //                    },
        //                    "quoteAsset": {
        //                        "asset": "USDT",
        //                        "borrowEnabled": true,
        //                        "borrowed": "0",
        //                        "free": "11",
        //                        "interest": "0",
        //                        "locked": "0",
        //                        "netAsset": "11",
        //                        "netAssetOfBtc": "0.00054615",
        //                        "repayEnabled": true,
        //                        "totalAsset": "11"
        //                    },
        //                    "symbol": "1INCHUSDT",
        //                    "isolatedCreated": true,
        //                    "marginLevel": "999",
        //                    "marginLevelStatus": "EXCESSIVE",
        //                    "marginRatio": "5",
        //                    "indexPrice": "0.59184331",
        //                    "liquidatePrice": "0",
        //                    "liquidateRate": "0",
        //                    "tradeEnabled": true,
        //                    "enabled": true
        //                },
        //            ]
        //        }
        //    }
        //
        // futures (fapi)
        //
        //     fapiPrivateV3GetAccount
        //
        //     {
        //         "feeTier":0,
        //         "canTrade":true,
        //         "canDeposit":true,
        //         "canWithdraw":true,
        //         "updateTime":0,
        //         "totalInitialMargin":"0.00000000",
        //         "totalMaintMargin":"0.00000000",
        //         "totalWalletBalance":"0.00000000",
        //         "totalUnrealizedProfit":"0.00000000",
        //         "totalMarginBalance":"0.00000000",
        //         "totalPositionInitialMargin":"0.00000000",
        //         "totalOpenOrderInitialMargin":"0.00000000",
        //         "totalCrossWalletBalance":"0.00000000",
        //         "totalCrossUnPnl":"0.00000000",
        //         "availableBalance":"0.00000000",
        //         "maxWithdrawAmount":"0.00000000",
        //         "assets":[
        //             {
        //                 "asset":"BNB",
        //                 "walletBalance":"0.01000000",
        //                 "unrealizedProfit":"0.00000000",
        //                 "marginBalance":"0.01000000",
        //                 "maintMargin":"0.00000000",
        //                 "initialMargin":"0.00000000",
        //                 "positionInitialMargin":"0.00000000",
        //                 "openOrderInitialMargin":"0.00000000",
        //                 "maxWithdrawAmount":"0.01000000",
        //                 "crossWalletBalance":"0.01000000",
        //                 "crossUnPnl":"0.00000000",
        //                 "availableBalance":"0.01000000"
        //             }
        //         ],
        //         "positions":[
        //             {
        //                 "symbol":"BTCUSDT",
        //                 "initialMargin":"0",
        //                 "maintMargin":"0",
        //                 "unrealizedProfit":"0.00000000",
        //                 "positionInitialMargin":"0",
        //                 "openOrderInitialMargin":"0",
        //                 "leverage":"21",
        //                 "isolated":false,
        //                 "entryPrice":"0.00000",
        //                 "maxNotional":"5000000",
        //                 "positionSide":"BOTH"
        //             },
        //         ]
        //     }
        //
        //     fapiPrivateV2GetBalance
        //
        //     [
        //         {
        //             "accountAlias":"FzFzXquXXqoC",
        //             "asset":"BNB",
        //             "balance":"0.01000000",
        //             "crossWalletBalance":"0.01000000",
        //             "crossUnPnl":"0.00000000",
        //             "availableBalance":"0.01000000",
        //             "maxWithdrawAmount":"0.01000000"
        //         }
        //     ]
        //
        // binance pay
        //
        //     [
        //       {
        //         "asset": "BUSD",
        //         "free": "1129.83",
        //         "locked": "0",
        //         "freeze": "0",
        //         "withdrawing": "0"
        //       }
        //     ]
        //
        // portfolio margin
        //
        //     [
        //         {
        //             "asset": "USDT",
        //             "totalWalletBalance": "66.9923261",
        //             "crossMarginAsset": "35.9697141",
        //             "crossMarginBorrowed": "0.0",
        //             "crossMarginFree": "35.9697141",
        //             "crossMarginInterest": "0.0",
        //             "crossMarginLocked": "0.0",
        //             "umWalletBalance": "31.022612",
        //             "umUnrealizedPNL": "0.0",
        //             "cmWalletBalance": "0.0",
        //             "cmUnrealizedPNL": "0.0",
        //             "updateTime": 0,
        //             "negativeBalance": "0.0"
        //         },
        //     ]
        //
        return this.parseBalanceCustom (response, type, marginMode, isPortfolioMargin);
    }

    /**
     * @method
     * @name binance#fetchOrderBook
     * @description fetches information on open orders with bid (buy) and ask (sell) prices, volumes and other data
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#order-book                           // spot
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Order-Book   // swap
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Order-Book            // future
     * @see https://developers.binance.com/docs/derivatives/option/market-data/Order-Book                           // option
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {int} [limit] the maximum amount of order book entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} A dictionary of [order book structures]{@link https://docs.ccxt.com/#/?id=order-book-structure} indexed by market symbols
     */
    async fetchOrderBook (symbol: string, limit: Int = undefined, params = {}): Promise<OrderBook> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        if (limit !== undefined) {
            request['limit'] = limit; // default 100, max 5000, see https://github.com/binance/binance-spot-api-docs/blob/master/rest-api.md#order-book
        }
        let response = undefined;
        if (market['option']) {
            response = await this.eapiPublicGetDepth (this.extend (request, params));
        } else if (market['linear']) {
            response = await this.fapiPublicGetDepth (this.extend (request, params));
        } else if (market['inverse']) {
            response = await this.dapiPublicGetDepth (this.extend (request, params));
        } else {
            response = await this.publicGetDepth (this.extend (request, params));
        }
        //
        // future
        //
        //     {
        //         "lastUpdateId":333598053905,
        //         "E":1618631511986,
        //         "T":1618631511964,
        //         "bids":[
        //             ["2493.56","20.189"],
        //             ["2493.54","1.000"],
        //             ["2493.51","0.005"]
        //         ],
        //         "asks":[
        //             ["2493.57","0.877"],
        //             ["2493.62","0.063"],
        //             ["2493.71","12.054"],
        //         ]
        //     }
        //
        // options (eapi)
        //
        //     {
        //         "bids": [
        //             ["108.7","16.08"],
        //             ["106","21.29"],
        //             ["82.4","0.02"]
        //         ],
        //         "asks": [
        //             ["111.4","19.52"],
        //             ["119.9","17.6"],
        //             ["141.2","31"]
        //         ],
        //         "T": 1676771382078,
        //         "u": 1015939
        //     }
        //
        const timestamp = this.safeInteger (response, 'T');
        const orderbook = this.parseOrderBook (response, symbol, timestamp);
        orderbook['nonce'] = this.safeInteger2 (response, 'lastUpdateId', 'u');
        return orderbook;
    }

    parseTicker (ticker: Dict, market: Market = undefined): Ticker {
        // markPrices
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "markPrice": "11793.63104562",  // mark price
        //         "indexPrice": "11781.80495970", // index price
        //         "estimatedSettlePrice": "11781.16138815", // Estimated Settle Price, only useful in the last hour before the settlement starts.
        //         "lastFundingRate": "0.00038246",  // This is the lastest estimated funding rate
        //         "nextFundingTime": 1597392000000,
        //         "interestRate": "0.00010000",
        //         "time": 1597370495002
        //     }
        //
        //     {
        //         "symbol": "ETHBTC",
        //         "priceChange": "0.00068700",
        //         "priceChangePercent": "2.075",
        //         "weightedAvgPrice": "0.03342681",
        //         "prevClosePrice": "0.03310300",
        //         "lastPrice": "0.03378900",
        //         "lastQty": "0.07700000",
        //         "bidPrice": "0.03378900",
        //         "bidQty": "7.16800000",
        //         "askPrice": "0.03379000",
        //         "askQty": "24.00000000",
        //         "openPrice": "0.03310200",
        //         "highPrice": "0.03388900",
        //         "lowPrice": "0.03306900",
        //         "volume": "205478.41000000",
        //         "quoteVolume": "6868.48826294",
        //         "openTime": 1601469986932,
        //         "closeTime": 1601556386932,
        //         "firstId": 196098772,
        //         "lastId": 196186315,
        //         "count": 87544
        //     }
        //
        // coinm
        //
        //     {
        //         "baseVolume": "214549.95171161",
        //         "closeTime": "1621965286847",
        //         "count": "1283779",
        //         "firstId": "152560106",
        //         "highPrice": "39938.3",
        //         "lastId": "153843955",
        //         "lastPrice": "37993.4",
        //         "lastQty": "1",
        //         "lowPrice": "36457.2",
        //         "openPrice": "37783.4",
        //         "openTime": "1621878840000",
        //         "pair": "BTCUSD",
        //         "priceChange": "210.0",
        //         "priceChangePercent": "0.556",
        //         "symbol": "BTCUSD_PERP",
        //         "volume": "81990451",
        //         "weightedAvgPrice": "38215.08713747"
        //     }
        //
        // eapi: fetchTicker, fetchTickers
        //
        //     {
        //         "symbol": "ETH-230510-1825-C",
        //         "priceChange": "-5.1",
        //         "priceChangePercent": "-0.1854",
        //         "lastPrice": "22.4",
        //         "lastQty": "0",
        //         "open": "27.5",
        //         "high": "34.1",
        //         "low": "22.4",
        //         "volume": "6.83",
        //         "amount": "201.44",
        //         "bidPrice": "21.9",
        //         "askPrice": "22.4",
        //         "openTime": 1683614771898,
        //         "closeTime": 1683695017784,
        //         "firstTradeId": 12,
        //         "tradeCount": 22,
        //         "strikePrice": "1825",
        //         "exercisePrice": "1845.95341176"
        //     }
        //
        // spot bidsAsks
        //
        //     {
        //         "symbol":"ETHBTC",
        //         "bidPrice":"0.07466800",
        //         "bidQty":"5.31990000",
        //         "askPrice":"0.07466900",
        //         "askQty":"10.93540000"
        //     }
        //
        // usdm bidsAsks
        //
        //     {
        //         "symbol":"BTCUSDT",
        //         "bidPrice":"21321.90",
        //         "bidQty":"33.592",
        //         "askPrice":"21322.00",
        //         "askQty":"1.427",
        //         "time":"1673899207538"
        //     }
        //
        // coinm bidsAsks
        //
        //     {
        //         "symbol":"BTCUSD_PERP",
        //         "pair":"BTCUSD",
        //         "bidPrice":"21301.2",
        //         "bidQty":"188",
        //         "askPrice":"21301.3",
        //         "askQty":"10302",
        //         "time":"1673899278514"
        //     }
        //
        const timestamp = this.safeInteger2 (ticker, 'closeTime', 'time');
        let marketType = undefined;
        if (('time' in ticker)) {
            marketType = 'contract';
        }
        if (marketType === undefined) {
            marketType = ('bidQty' in ticker) ? 'spot' : 'contract';
        }
        const marketId = this.safeString (ticker, 'symbol');
        const symbol = this.safeSymbol (marketId, market, undefined, marketType);
        const last = this.safeString (ticker, 'lastPrice');
        const wAvg = this.safeString (ticker, 'weightedAvgPrice');
        const isCoinm = ('baseVolume' in ticker);
        let baseVolume = undefined;
        let quoteVolume = undefined;
        if (isCoinm) {
            baseVolume = this.safeString (ticker, 'baseVolume');
            // 'volume' field in inverse markets is not quoteVolume, but traded amount (per contracts)
            quoteVolume = Precise.stringMul (baseVolume, wAvg);
        } else {
            baseVolume = this.safeString (ticker, 'volume');
            quoteVolume = this.safeString2 (ticker, 'quoteVolume', 'amount');
        }
        return this.safeTicker ({
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'high': this.safeString2 (ticker, 'highPrice', 'high'),
            'low': this.safeString2 (ticker, 'lowPrice', 'low'),
            'bid': this.safeString (ticker, 'bidPrice'),
            'bidVolume': this.safeString (ticker, 'bidQty'),
            'ask': this.safeString (ticker, 'askPrice'),
            'askVolume': this.safeString (ticker, 'askQty'),
            'vwap': wAvg,
            'open': this.safeString2 (ticker, 'openPrice', 'open'),
            'close': last,
            'last': last,
            'previousClose': this.safeString (ticker, 'prevClosePrice'), // previous day close
            'change': this.safeString (ticker, 'priceChange'),
            'percentage': this.safeString (ticker, 'priceChangePercent'),
            'average': undefined,
            'baseVolume': baseVolume,
            'quoteVolume': quoteVolume,
            'markPrice': this.safeString (ticker, 'markPrice'),
            'indexPrice': this.safeString (ticker, 'indexPrice'),
            'info': ticker,
        }, market);
    }

    /**
     * @method
     * @name binance#fetchStatus
     * @description the latest known information on the availability of the exchange API
     * @see https://developers.binance.com/docs/wallet/others/system-status
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [status structure]{@link https://docs.ccxt.com/#/?id=exchange-status-structure}
     */
    async fetchStatus (params = {}) {
        const response = await this.sapiGetSystemStatus (params);
        //
        //     {
        //         "status": 0,              // 0: normal，1：system maintenance
        //         "msg": "normal"           // "normal", "system_maintenance"
        //     }
        //
        const statusRaw = this.safeString (response, 'status');
        return {
            'status': this.safeString ({ '0': 'ok', '1': 'maintenance' }, statusRaw, statusRaw),
            'updated': undefined,
            'eta': undefined,
            'url': undefined,
            'info': response,
        };
    }

    /**
     * @method
     * @name binance#fetchTicker
     * @description fetches a price ticker, a statistical calculation with the information calculated over the past 24 hours for a specific market
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#24hr-ticker-price-change-statistics                           // spot
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#rolling-window-price-change-statistics                        // spot
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics   // swap
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/24hr-Ticker-Price-Change-Statistics            // future
     * @see https://developers.binance.com/docs/derivatives/option/market-data/24hr-Ticker-Price-Change-Statistics                           // option
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.rolling] (spot only) default false, if true, uses the rolling 24 hour ticker endpoint /api/v3/ticker
     * @returns {object} a [ticker structure]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTicker (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (market['option']) {
            response = await this.eapiPublicGetTicker (this.extend (request, params));
        } else if (market['linear']) {
            response = await this.fapiPublicGetTicker24hr (this.extend (request, params));
        } else if (market['inverse']) {
            response = await this.dapiPublicGetTicker24hr (this.extend (request, params));
        } else {
            const rolling = this.safeBool (params, 'rolling', false);
            params = this.omit (params, 'rolling');
            if (rolling) {
                response = await this.publicGetTicker (this.extend (request, params));
            } else {
                response = await this.publicGetTicker24hr (this.extend (request, params));
            }
        }
        if (Array.isArray (response)) {
            const firstTicker = this.safeDict (response, 0, {});
            return this.parseTicker (firstTicker, market);
        }
        return this.parseTicker (response, market);
    }

    /**
     * @method
     * @name binance#fetchBidsAsks
     * @description fetches the bid and ask price and volume for multiple markets
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#symbol-order-book-ticker                         // spot
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Order-Book-Ticker // swap
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Symbol-Order-Book-Ticker          // future
     * @param {string[]|undefined} symbols unified symbols of the markets to fetch the bids and asks for, all markets are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchBidsAsks (symbols: Strings = undefined, params = {}) {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols, undefined, true, true, true);
        const market = this.getMarketFromSymbols (symbols);
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchBidsAsks', market, params);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchBidsAsks', market, params);
        let response = undefined;
        if (this.isLinear (type, subType)) {
            response = await this.fapiPublicGetTickerBookTicker (params);
        } else if (this.isInverse (type, subType)) {
            response = await this.dapiPublicGetTickerBookTicker (params);
        } else if (type === 'spot') {
            const request: Dict = {};
            if (symbols !== undefined) {
                request['symbols'] = this.json (this.marketIds (symbols));
            }
            response = await this.publicGetTickerBookTicker (this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchBidsAsks() does not support ' + type + ' markets yet');
        }
        return this.parseTickers (response, symbols);
    }

    /**
     * @method
     * @name binance#fetchLastPrices
     * @description fetches the last price for multiple markets
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#symbol-price-ticker                          // spot
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Symbol-Price-Ticker  // swap
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Symbol-Price-Ticker           // future
     * @param {string[]|undefined} symbols unified symbols of the markets to fetch the last prices
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a dictionary of lastprices structures
     */
    async fetchLastPrices (symbols: Strings = undefined, params = {}) {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols, undefined, true, true, true);
        const market = this.getMarketFromSymbols (symbols);
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchLastPrices', market, params);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchLastPrices', market, params);
        let response = undefined;
        if (this.isLinear (type, subType)) {
            response = await this.fapiPublicV2GetTickerPrice (params);
            //
            //     [
            //         {
            //             "symbol": "LTCBTC",
            //             "price": "4.00000200"
            //             "time": 1589437530011
            //         },
            //         ...
            //     ]
            //
        } else if (this.isInverse (type, subType)) {
            response = await this.dapiPublicGetTickerPrice (params);
            //
            //     [
            //         {
            //             "symbol": "BTCUSD_200626",
            //             "ps": "9647.8",
            //             "price": "9647.8",
            //             "time": 1591257246176
            //         }
            //     ]
            //
        } else if (type === 'spot') {
            response = await this.publicGetTickerPrice (params);
            //
            //     [
            //         {
            //             "symbol": "LTCBTC",
            //             "price": "4.00000200"
            //         },
            //         ...
            //     ]
            //
        } else {
            throw new NotSupported (this.id + ' fetchLastPrices() does not support ' + type + ' markets yet');
        }
        return this.parseLastPrices (response, symbols);
    }

    parseLastPrice (entry, market: Market = undefined) {
        //
        // spot
        //
        //     {
        //         "symbol": "LTCBTC",
        //         "price": "4.00000200"
        //     }
        //
        // usdm (swap/future)
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "price": "6000.01",
        //         "time": 1589437530011   // Transaction time
        //     }
        //
        //
        // coinm (swap/future)
        //
        //     {
        //         "symbol": "BTCUSD_200626", // symbol ("BTCUSD_200626", "BTCUSD_PERP", etc..)
        //         "ps": "BTCUSD", // pair
        //         "price": "9647.8",
        //         "time": 1591257246176
        //     }
        //
        const timestamp = this.safeInteger (entry, 'time');
        const type = (timestamp === undefined) ? 'spot' : 'swap';
        const marketId = this.safeString (entry, 'symbol');
        market = this.safeMarket (marketId, market, undefined, type);
        const price = this.safeNumber (entry, 'price');
        return {
            'symbol': market['symbol'],
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'price': price,
            'side': undefined,
            'info': entry,
        };
    }

    /**
     * @method
     * @name binance#fetchTickers
     * @description fetches price tickers for multiple markets, statistical information calculated over the past 24 hours for each market
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#24hr-ticker-price-change-statistics                          // spot
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/24hr-Ticker-Price-Change-Statistics  // swap
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/24hr-Ticker-Price-Change-Statistics           // future
     * @see https://developers.binance.com/docs/derivatives/option/market-data/24hr-Ticker-Price-Change-Statistics                          // option
     * @param {string[]} [symbols] unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @param {string} [params.type] 'spot', 'option', use params["subType"] for swap and future markets
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchTickers (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols, undefined, true, true, true);
        const market = this.getMarketFromSymbols (symbols);
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchTickers', market, params);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchTickers', market, params);
        let response = undefined;
        if (this.isLinear (type, subType)) {
            response = await this.fapiPublicGetTicker24hr (params);
        } else if (this.isInverse (type, subType)) {
            response = await this.dapiPublicGetTicker24hr (params);
        } else if (type === 'spot') {
            const request: Dict = {};
            if (symbols !== undefined) {
                request['symbols'] = this.json (this.marketIds (symbols));
            }
            response = await this.publicGetTicker24hr (this.extend (request, params));
        } else if (type === 'option') {
            response = await this.eapiPublicGetTicker (params);
        } else {
            throw new NotSupported (this.id + ' fetchTickers() does not support ' + type + ' markets yet');
        }
        return this.parseTickers (response, symbols);
    }

    /**
     * @method
     * @name binance#fetchMarkPrice
     * @description fetches mark price for the market
     * @see https://binance-docs.github.io/apidocs/futures/en/#mark-price
     * @see https://binance-docs.github.io/apidocs/delivery/en/#index-price-and-mark-price
     * @param {string} symbol unified symbol of the market to fetch the ticker for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchMarkPrice (symbol: string, params = {}): Promise<Ticker> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchMarkPrice', market, params, 'swap');
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchMarkPrice', market, params, 'linear');
        const request = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (this.isLinear (type, subType)) {
            response = await this.fapiPublicGetPremiumIndex (this.extend (request, params));
        } else if (this.isInverse (type, subType)) {
            response = await this.dapiPublicGetPremiumIndex (this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchMarkPrice() does not support ' + type + ' markets yet');
        }
        if (Array.isArray (response)) {
            return this.parseTicker (this.safeDict (response, 0, {}), market);
        }
        return this.parseTicker (response, market);
    }

    /**
     * @method
     * @name binance#fetchMarkPrices
     * @description fetches mark prices for multiple markets
     * @see https://binance-docs.github.io/apidocs/futures/en/#mark-price
     * @see https://binance-docs.github.io/apidocs/delivery/en/#index-price-and-mark-price
     * @param {string[]} [symbols] unified symbols of the markets to fetch the ticker for, all market tickers are returned if not assigned
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a dictionary of [ticker structures]{@link https://docs.ccxt.com/#/?id=ticker-structure}
     */
    async fetchMarkPrices (symbols: Strings = undefined, params = {}): Promise<Tickers> {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols, undefined, true, true, true);
        const market = this.getMarketFromSymbols (symbols);
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchMarkPrices', market, params, 'swap');
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchMarkPrices', market, params, 'linear');
        let response = undefined;
        if (this.isLinear (type, subType)) {
            response = await this.fapiPublicGetPremiumIndex (params);
        } else if (this.isInverse (type, subType)) {
            response = await this.dapiPublicGetPremiumIndex (params);
        } else {
            throw new NotSupported (this.id + ' fetchMarkPrices() does not support ' + type + ' markets yet');
        }
        return this.parseTickers (response, symbols);
    }

    parseOHLCV (ohlcv, market: Market = undefined): OHLCV {
        // when api method = publicGetKlines || fapiPublicGetKlines || dapiPublicGetKlines
        //     [
        //         1591478520000, // open time
        //         "0.02501300",  // open
        //         "0.02501800",  // high
        //         "0.02500000",  // low
        //         "0.02500000",  // close
        //         "22.19000000", // volume
        //         1591478579999, // close time
        //         "0.55490906",  // quote asset volume, base asset volume for dapi
        //         40,            // number of trades
        //         "10.92900000", // taker buy base asset volume
        //         "0.27336462",  // taker buy quote asset volume
        //         "0"            // ignore
        //     ]
        //
        //  when api method = fapiPublicGetMarkPriceKlines || fapiPublicGetIndexPriceKlines
        //     [
        //         [
        //         1591256460000,          // Open time
        //         "9653.29201333",        // Open
        //         "9654.56401333",        // High
        //         "9653.07367333",        // Low
        //         "9653.07367333",        // Close (or latest price)
        //         "0",                    // Ignore
        //         1591256519999,          // Close time
        //         "0",                    // Ignore
        //         60,                     // Number of bisic data
        //         "0",                    // Ignore
        //         "0",                    // Ignore
        //         "0"                     // Ignore
        //         ]
        //     ]
        //
        // options
        //
        //     {
        //         "open": "32.2",
        //         "high": "32.2",
        //         "low": "32.2",
        //         "close": "32.2",
        //         "volume": "0",
        //         "interval": "5m",
        //         "tradeCount": 0,
        //         "takerVolume": "0",
        //         "takerAmount": "0",
        //         "amount": "0",
        //         "openTime": 1677096900000,
        //         "closeTime": 1677097200000
        //     }
        //
        const inverse = this.safeBool (market, 'inverse');
        const volumeIndex = inverse ? 7 : 5;
        return [
            this.safeInteger2 (ohlcv, 0, 'openTime'),
            this.safeNumber2 (ohlcv, 1, 'open'),
            this.safeNumber2 (ohlcv, 2, 'high'),
            this.safeNumber2 (ohlcv, 3, 'low'),
            this.safeNumber2 (ohlcv, 4, 'close'),
            this.safeNumber2 (ohlcv, volumeIndex, 'volume'),
        ];
    }

    /**
     * @method
     * @name binance#fetchOHLCV
     * @description fetches historical candlestick data containing the open, high, low, and close price, and the volume of a market
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#klinecandlestick-data
     * @see https://developers.binance.com/docs/derivatives/option/market-data/Kline-Candlestick-Data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Kline-Candlestick-Data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Index-Price-Kline-Candlestick-Data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price-Kline-Candlestick-Data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Premium-Index-Kline-Data
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Kline-Candlestick-Data
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Index-Price-Kline-Candlestick-Data
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Mark-Price-Kline-Candlestick-Data
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Premium-Index-Kline-Data
     * @param {string} symbol unified symbol of the market to fetch OHLCV data for
     * @param {string} timeframe the length of time each candle represents
     * @param {int} [since] timestamp in ms of the earliest candle to fetch
     * @param {int} [limit] the maximum amount of candles to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.price] "mark" or "index" for mark price and index price candles
     * @param {int} [params.until] timestamp in ms of the latest candle to fetch
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {int[][]} A list of candles ordered as timestamp, open, high, low, close, volume
     */
    async fetchOHLCV (symbol: string, timeframe = '1m', since: Int = undefined, limit: Int = undefined, params = {}): Promise<OHLCV[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchOHLCV', 'paginate', false);
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic ('fetchOHLCV', symbol, since, limit, timeframe, params, 1000) as OHLCV[];
        }
        const market = this.market (symbol);
        // binance docs say that the default limit 500, max 1500 for futures, max 1000 for spot markets
        // the reality is that the time range wider than 500 candles won't work right
        const defaultLimit = 500;
        const maxLimit = 1500;
        const price = this.safeString (params, 'price');
        const until = this.safeInteger (params, 'until');
        params = this.omit (params, [ 'price', 'until' ]);
        if (since !== undefined && until !== undefined && limit === undefined) {
            limit = maxLimit;
        }
        limit = (limit === undefined) ? defaultLimit : Math.min (limit, maxLimit);
        const request: Dict = {
            'interval': this.safeString (this.timeframes, timeframe, timeframe),
            'limit': limit,
        };
        const marketId = market['id'];
        if (price === 'index') {
            const parts = marketId.split ('_');
            const pair = this.safeString (parts, 0);
            request['pair'] = pair;   // Index price takes this argument instead of symbol
        } else {
            request['symbol'] = marketId;
        }
        // const duration = this.parseTimeframe (timeframe);
        if (since !== undefined) {
            request['startTime'] = since;
            //
            // It didn't work before without the endTime
            // https://github.com/ccxt/ccxt/issues/8454
            //
            if (market['inverse']) {
                if (since > 0) {
                    const duration = this.parseTimeframe (timeframe);
                    const endTime = this.sum (since, limit * duration * 1000 - 1);
                    const now = this.milliseconds ();
                    request['endTime'] = Math.min (now, endTime);
                }
            }
        }
        if (until !== undefined) {
            request['endTime'] = until;
        }
        let response = undefined;
        if (market['option']) {
            response = await this.eapiPublicGetKlines (this.extend (request, params));
        } else if (price === 'mark') {
            if (market['inverse']) {
                response = await this.dapiPublicGetMarkPriceKlines (this.extend (request, params));
            } else {
                response = await this.fapiPublicGetMarkPriceKlines (this.extend (request, params));
            }
        } else if (price === 'index') {
            if (market['inverse']) {
                response = await this.dapiPublicGetIndexPriceKlines (this.extend (request, params));
            } else {
                response = await this.fapiPublicGetIndexPriceKlines (this.extend (request, params));
            }
        } else if (price === 'premiumIndex') {
            if (market['inverse']) {
                response = await this.dapiPublicGetPremiumIndexKlines (this.extend (request, params));
            } else {
                response = await this.fapiPublicGetPremiumIndexKlines (this.extend (request, params));
            }
        } else if (market['linear']) {
            response = await this.fapiPublicGetKlines (this.extend (request, params));
        } else if (market['inverse']) {
            response = await this.dapiPublicGetKlines (this.extend (request, params));
        } else {
            response = await this.publicGetKlines (this.extend (request, params));
        }
        //
        //     [
        //         [1591478520000,"0.02501300","0.02501800","0.02500000","0.02500000","22.19000000",1591478579999,"0.55490906",40,"10.92900000","0.27336462","0"],
        //         [1591478580000,"0.02499600","0.02500900","0.02499400","0.02500300","21.34700000",1591478639999,"0.53370468",24,"7.53800000","0.18850725","0"],
        //         [1591478640000,"0.02500800","0.02501100","0.02500300","0.02500800","154.14200000",1591478699999,"3.85405839",97,"5.32300000","0.13312641","0"],
        //     ]
        //
        // options (eapi)
        //
        //     [
        //         {
        //             "open": "32.2",
        //             "high": "32.2",
        //             "low": "32.2",
        //             "close": "32.2",
        //             "volume": "0",
        //             "interval": "5m",
        //             "tradeCount": 0,
        //             "takerVolume": "0",
        //             "takerAmount": "0",
        //             "amount": "0",
        //             "openTime": 1677096900000,
        //             "closeTime": 1677097200000
        //         }
        //     ]
        //
        return this.parseOHLCVs (response, market, timeframe, since, limit);
    }

    parseTrade (trade: Dict, market: Market = undefined): Trade {
        if ('isDustTrade' in trade) {
            return this.parseDustTrade (trade, market);
        }
        //
        // aggregate trades
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#compressedaggregate-trades-list
        //
        //     {
        //         "a": 26129,         // Aggregate tradeId
        //         "p": "0.01633102",  // Price
        //         "q": "4.70443515",  // Quantity
        //         "f": 27781,         // First tradeId
        //         "l": 27781,         // Last tradeId
        //         "T": 1498793709153, // Timestamp
        //         "m": true,          // Was the buyer the maker?
        //         "M": true           // Was the trade the best price match?
        //     }
        //
        // REST: aggregate trades for swap & future (both linear and inverse)
        //
        //     {
        //         "a": "269772814",
        //         "p": "25864.1",
        //         "q": "3",
        //         "f": "662149354",
        //         "l": "662149355",
        //         "T": "1694209776022",
        //         "m": false,
        //     }
        //
        // recent public trades and old public trades
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#recent-trades-list
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#old-trade-lookup-market_data
        //
        //     {
        //         "id": 28457,
        //         "price": "4.00000100",
        //         "qty": "12.00000000",
        //         "time": 1499865549590,
        //         "isBuyerMaker": true,
        //         "isBestMatch": true
        //     }
        //
        // private trades
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#account-trade-list-user_data
        //
        //     {
        //         "symbol": "BNBBTC",
        //         "id": 28457,
        //         "orderId": 100234,
        //         "price": "4.00000100",
        //         "qty": "12.00000000",
        //         "commission": "10.10000000",
        //         "commissionAsset": "BNB",
        //         "time": 1499865549590,
        //         "isBuyer": true,
        //         "isMaker": false,
        //         "isBestMatch": true
        //     }
        //
        // futures trades
        //
        //     {
        //       "accountId": 20,
        //       "buyer": False,
        //       "commission": "-0.07819010",
        //       "commissionAsset": "USDT",
        //       "counterPartyId": 653,
        //       "id": 698759,
        //       "maker": False,
        //       "orderId": 25851813,
        //       "price": "7819.01",
        //       "qty": "0.002",
        //       "quoteQty": "0.01563",
        //       "realizedPnl": "-0.91539999",
        //       "side": "SELL",
        //       "symbol": "BTCUSDT",
        //       "time": 1569514978020
        //     }
        //     {
        //       "symbol": "BTCUSDT",
        //       "id": 477128891,
        //       "orderId": 13809777875,
        //       "side": "SELL",
        //       "price": "38479.55",
        //       "qty": "0.001",
        //       "realizedPnl": "-0.00009534",
        //       "marginAsset": "USDT",
        //       "quoteQty": "38.47955",
        //       "commission": "-0.00076959",
        //       "commissionAsset": "USDT",
        //       "time": 1612733566708,
        //       "positionSide": "BOTH",
        //       "maker": true,
        //       "buyer": false
        //     }
        //
        // { respType: FULL }
        //
        //     {
        //       "price": "4000.00000000",
        //       "qty": "1.00000000",
        //       "commission": "4.00000000",
        //       "commissionAsset": "USDT",
        //       "tradeId": "1234",
        //     }
        //
        // options: fetchMyTrades
        //
        //     {
        //         "id": 1125899906844226012,
        //         "tradeId": 73,
        //         "orderId": 4638761100843040768,
        //         "symbol": "ETH-230211-1500-C",
        //         "price": "18.70000000",
        //         "quantity": "-0.57000000",
        //         "fee": "0.17305890",
        //         "realizedProfit": "-3.53400000",
        //         "side": "SELL",
        //         "type": "LIMIT",
        //         "volatility": "0.30000000",
        //         "liquidity": "MAKER",
        //         "time": 1676085216845,
        //         "priceScale": 1,
        //         "quantityScale": 2,
        //         "optionSide": "CALL",
        //         "quoteAsset": "USDT"
        //     }
        //
        // options: fetchTrades
        //
        //     {
        //         "id": 1,
        //         "symbol": "ETH-230216-1500-C",
        //         "price": "35.5",
        //         "qty": "0.03",
        //         "quoteQty": "1.065",
        //         "side": 1,
        //         "time": 1676366446072
        //     }
        //
        // fetchMyTrades: linear portfolio margin
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "id": 4575108247,
        //         "orderId": 261942655610,
        //         "side": "SELL",
        //         "price": "47263.40",
        //         "qty": "0.010",
        //         "realizedPnl": "27.38400000",
        //         "marginAsset": "USDT",
        //         "quoteQty": "472.63",
        //         "commission": "0.18905360",
        //         "commissionAsset": "USDT",
        //         "time": 1707530039409,
        //         "buyer": false,
        //         "maker": false,
        //         "positionSide": "LONG"
        //     }
        //
        // fetchMyTrades: inverse portfolio margin
        //
        //     {
        //         "symbol": "ETHUSD_PERP",
        //         "id": 701907838,
        //         "orderId": 71548909034,
        //         "pair": "ETHUSD",
        //         "side": "SELL",
        //         "price": "2498.15",
        //         "qty": "1",
        //         "realizedPnl": "0.00012517",
        //         "marginAsset": "ETH",
        //         "baseQty": "0.00400296",
        //         "commission": "0.00000160",
        //         "commissionAsset": "ETH",
        //         "time": 1707530317519,
        //         "positionSide": "LONG",
        //         "buyer": false,
        //         "maker": false
        //     }
        //
        // fetchMyTrades: spot margin portfolio margin
        //
        //     {
        //         "symbol": "ADAUSDT",
        //         "id": 470227543,
        //         "orderId": 4421170947,
        //         "price": "0.53880000",
        //         "qty": "10.00000000",
        //         "quoteQty": "5.38800000",
        //         "commission": "0.00538800",
        //         "commissionAsset": "USDT",
        //         "time": 1707545780522,
        //         "isBuyer": false,
        //         "isMaker": false,
        //         "isBestMatch": true
        //     }
        //
        const timestamp = this.safeInteger2 (trade, 'T', 'time');
        let amount = this.safeString2 (trade, 'q', 'qty');
        amount = this.safeString (trade, 'quantity', amount);
        const marketId = this.safeString (trade, 'symbol');
        const isSpotTrade = ('isIsolated' in trade) || ('M' in trade) || ('orderListId' in trade) || ('isMaker' in trade);
        const marketType = isSpotTrade ? 'spot' : 'contract';
        market = this.safeMarket (marketId, market, undefined, marketType);
        const symbol = market['symbol'];
        let side = undefined;
        const buyerMaker = this.safeBool2 (trade, 'm', 'isBuyerMaker');
        let takerOrMaker = undefined;
        if (buyerMaker !== undefined) {
            side = buyerMaker ? 'sell' : 'buy'; // this is reversed intentionally
        } else if ('side' in trade) {
            side = this.safeStringLower (trade, 'side');
        } else {
            if ('isBuyer' in trade) {
                side = trade['isBuyer'] ? 'buy' : 'sell'; // this is a true side
            }
        }
        let fee = undefined;
        if ('commission' in trade) {
            fee = {
                'cost': this.safeString (trade, 'commission'),
                'currency': this.safeCurrencyCode (this.safeString (trade, 'commissionAsset')),
            };
        }
        if ('isMaker' in trade) {
            takerOrMaker = trade['isMaker'] ? 'maker' : 'taker';
        }
        if ('maker' in trade) {
            takerOrMaker = trade['maker'] ? 'maker' : 'taker';
        }
        if (('optionSide' in trade) || market['option']) {
            const settle = this.safeCurrencyCode (this.safeString (trade, 'quoteAsset', 'USDT'));
            takerOrMaker = this.safeStringLower (trade, 'liquidity');
            if ('fee' in trade) {
                fee = {
                    'cost': this.safeString (trade, 'fee'),
                    'currency': settle,
                };
            }
            if ((side !== 'buy') && (side !== 'sell')) {
                side = (side === '1') ? 'buy' : 'sell';
            }
            if ('optionSide' in trade) {
                if (side !== 'buy') {
                    amount = Precise.stringMul ('-1', amount);
                }
            }
        }
        return this.safeTrade ({
            'info': trade,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'id': this.safeStringN (trade, [ 't', 'a', 'tradeId', 'id' ]),
            'order': this.safeString (trade, 'orderId'),
            'type': this.safeStringLower (trade, 'type'),
            'side': side,
            'takerOrMaker': takerOrMaker,
            'price': this.safeString2 (trade, 'p', 'price'),
            'amount': amount,
            'cost': this.safeString2 (trade, 'quoteQty', 'baseQty'),
            'fee': fee,
        }, market);
    }

    /**
     * @method
     * @name binance#fetchTrades
     * @description get the list of most recent trades for a particular symbol
     * Default fetchTradesMethod
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#compressedaggregate-trades-list                          // publicGetAggTrades (spot)
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Compressed-Aggregate-Trades-List // fapiPublicGetAggTrades (swap)
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Compressed-Aggregate-Trades-List          // dapiPublicGetAggTrades (future)
     * @see https://developers.binance.com/docs/derivatives/option/market-data/Recent-Trades-List                                       // eapiPublicGetTrades (option)
     * Other fetchTradesMethod
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#recent-trades-list                                       // publicGetTrades (spot)
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Recent-Trades-List               // fapiPublicGetTrades (swap)
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Recent-Trades-List                        // dapiPublicGetTrades (future)
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#old-trade-lookup                                         // publicGetHistoricalTrades (spot)
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Old-Trades-Lookup                // fapiPublicGetHistoricalTrades (swap)
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Old-Trades-Lookup                         // dapiPublicGetHistoricalTrades (future)
     * @see https://developers.binance.com/docs/derivatives/option/market-data/Old-Trades-Lookup                                        // eapiPublicGetHistoricalTrades (option)
     * @param {string} symbol unified symbol of the market to fetch trades for
     * @param {int} [since] only used when fetchTradesMethod is 'publicGetAggTrades', 'fapiPublicGetAggTrades', or 'dapiPublicGetAggTrades'
     * @param {int} [limit] default 500, max 1000
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] only used when fetchTradesMethod is 'publicGetAggTrades', 'fapiPublicGetAggTrades', or 'dapiPublicGetAggTrades'
     * @param {int} [params.fetchTradesMethod] 'publicGetAggTrades' (spot default), 'fapiPublicGetAggTrades' (swap default), 'dapiPublicGetAggTrades' (future default), 'eapiPublicGetTrades' (option default), 'publicGetTrades', 'fapiPublicGetTrades', 'dapiPublicGetTrades', 'publicGetHistoricalTrades', 'fapiPublicGetHistoricalTrades', 'dapiPublicGetHistoricalTrades', 'eapiPublicGetHistoricalTrades'
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     *
     * EXCHANGE SPECIFIC PARAMETERS
     * @param {int} [params.fromId] trade id to fetch from, default gets most recent trades, not used when fetchTradesMethod is 'publicGetTrades', 'fapiPublicGetTrades', 'dapiPublicGetTrades', or 'eapiPublicGetTrades'
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=public-trades}
     */
    async fetchTrades (symbol: string, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Trade[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchTrades', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchTrades', symbol, since, limit, params) as Trade[];
        }
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
            // 'fromId': 123,    // ID to get aggregate trades from INCLUSIVE.
            // 'startTime': 456, // Timestamp in ms to get aggregate trades from INCLUSIVE.
            // 'endTime': 789,   // Timestamp in ms to get aggregate trades until INCLUSIVE.
            // 'limit': 500,     // default = 500, maximum = 1000
        };
        if (!market['option']) {
            if (since !== undefined) {
                request['startTime'] = since;
                // https://github.com/ccxt/ccxt/issues/6400
                // https://github.com/binance-exchange/binance-official-api-docs/blob/master/rest-api.md#compressedaggregate-trades-list
                request['endTime'] = this.sum (since, 3600000);
            }
            const until = this.safeInteger (params, 'until');
            if (until !== undefined) {
                request['endTime'] = until;
            }
        }
        if (limit !== undefined) {
            const isFutureOrSwap = (market['swap'] || market['future']);
            request['limit'] = isFutureOrSwap ? Math.min (limit, 1000) : limit; // default = 500, maximum = 1000
        }
        let method = this.safeString (this.options, 'fetchTradesMethod');
        method = this.safeString2 (params, 'fetchTradesMethod', 'method', method);
        params = this.omit (params, [ 'until', 'fetchTradesMethod' ]);
        let response = undefined;
        if (market['option'] || method === 'eapiPublicGetTrades') {
            response = await this.eapiPublicGetTrades (this.extend (request, params));
        } else if (market['linear'] || method === 'fapiPublicGetAggTrades') {
            response = await this.fapiPublicGetAggTrades (this.extend (request, params));
        } else if (market['inverse'] || method === 'dapiPublicGetAggTrades') {
            response = await this.dapiPublicGetAggTrades (this.extend (request, params));
        } else {
            response = await this.publicGetAggTrades (this.extend (request, params));
        }
        //
        // Caveats:
        // - default limit (500) applies only if no other parameters set, trades up
        //   to the maximum limit may be returned to satisfy other parameters
        // - if both limit and time window is set and time window contains more
        //   trades than the limit then the last trades from the window are returned
        // - "tradeId" accepted and returned by this method is "aggregate" trade id
        //   which is different from actual trade id
        // - setting both fromId and time window results in error
        //
        // aggregate trades
        //
        //     [
        //         {
        //             "a": 26129,         // Aggregate tradeId
        //             "p": "0.01633102",  // Price
        //             "q": "4.70443515",  // Quantity
        //             "f": 27781,         // First tradeId
        //             "l": 27781,         // Last tradeId
        //             "T": 1498793709153, // Timestamp
        //             "m": true,          // Was the buyer the maker?
        //             "M": true           // Was the trade the best price match?
        //         }
        //     ]
        //
        // inverse (swap & future)
        //
        //     [
        //      {
        //         "a": "269772814",
        //         "p": "25864.1",
        //         "q": "3",
        //         "f": "662149354",
        //         "l": "662149355",
        //         "T": "1694209776022",
        //         "m": false,
        //      },
        //     ]
        //
        // recent public trades and historical public trades
        //
        //     [
        //         {
        //             "id": 28457,
        //             "price": "4.00000100",
        //             "qty": "12.00000000",
        //             "time": 1499865549590,
        //             "isBuyerMaker": true,
        //             "isBestMatch": true
        //         }
        //     ]
        //
        // options (eapi)
        //
        //     [
        //         {
        //             "id": 1,
        //             "symbol": "ETH-230216-1500-C",
        //             "price": "35.5",
        //             "qty": "0.03",
        //             "quoteQty": "1.065",
        //             "side": 1,
        //             "time": 1676366446072
        //         },
        //     ]
        //
        return this.parseTrades (response, market, since, limit);
    }

    /**
     * @method
     * @name binance#editSpotOrder
     * @ignore
     * @description edit a trade order
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#cancel-an-existing-order-and-send-a-new-order-trade
     * @param {string} id cancel order id
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit' or 'STOP_LOSS' or 'STOP_LOSS_LIMIT' or 'TAKE_PROFIT' or 'TAKE_PROFIT_LIMIT' or 'STOP'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.marginMode] 'cross' or 'isolated', for spot margin trading
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async editSpotOrder (id: string, symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['spot']) {
            throw new NotSupported (this.id + ' editSpotOrder() does not support ' + market['type'] + ' orders');
        }
        const payload = this.editSpotOrderRequest (id, symbol, type, side, amount, price, params);
        const response = await this.privatePostOrderCancelReplace (payload);
        //
        // spot
        //
        //     {
        //         "cancelResult": "SUCCESS",
        //         "newOrderResult": "SUCCESS",
        //         "cancelResponse": {
        //             "symbol": "BTCUSDT",
        //             "origClientOrderId": "web_3f6286480b194b079870ac75fb6978b7",
        //             "orderId": 16383156620,
        //             "orderListId": -1,
        //             "clientOrderId": "Azt6foVTTgHPNhqBf41TTt",
        //             "price": "14000.00000000",
        //             "origQty": "0.00110000",
        //             "executedQty": "0.00000000",
        //             "cummulativeQuoteQty": "0.00000000",
        //             "status": "CANCELED",
        //             "timeInForce": "GTC",
        //             "type": "LIMIT",
        //             "side": "BUY"
        //         },
        //         "newOrderResponse": {
        //             "symbol": "BTCUSDT",
        //             "orderId": 16383176297,
        //             "orderListId": -1,
        //             "clientOrderId": "x-R4BD3S8222ecb58eb9074fb1be018c",
        //             "transactTime": 1670891847932,
        //             "price": "13500.00000000",
        //             "origQty": "0.00085000",
        //             "executedQty": "0.00000000",
        //             "cummulativeQuoteQty": "0.00000000",
        //             "status": "NEW",
        //             "timeInForce": "GTC",
        //             "type": "LIMIT",
        //             "side": "BUY",
        //             "fills": []
        //         }
        //     }
        //
        const data = this.safeDict (response, 'newOrderResponse');
        return this.parseOrder (data, market);
    }

    editSpotOrderRequest (id: string, symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        /**
         * @method
         * @ignore
         * @name binance#editSpotOrderRequest
         * @description helper function to build request for editSpotOrder
         * @param {string} id order id to be edited
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit' or 'STOP_LOSS' or 'STOP_LOSS_LIMIT' or 'TAKE_PROFIT' or 'TAKE_PROFIT_LIMIT' or 'STOP'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much of currency you want to trade in units of base currency
         * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
         * @param {object} params extra parameters specific to the exchange API endpoint
         * @param {string} [params.marginMode] 'cross' or 'isolated', for spot margin trading
         * @returns {object} request to be sent to the exchange
         */
        const market = this.market (symbol);
        const clientOrderId = this.safeStringN (params, [ 'newClientOrderId', 'clientOrderId', 'origClientOrderId' ]);
        const request: Dict = {
            'symbol': market['id'],
            'side': side.toUpperCase (),
        };
        const initialUppercaseType = type.toUpperCase ();
        let uppercaseType = initialUppercaseType;
        const postOnly = this.isPostOnly (initialUppercaseType === 'MARKET', initialUppercaseType === 'LIMIT_MAKER', params);
        if (postOnly) {
            uppercaseType = 'LIMIT_MAKER';
        }
        request['type'] = uppercaseType;
        const stopPrice = this.safeNumber2 (params, 'stopPrice', 'triggerPrice');
        if (stopPrice !== undefined) {
            if (uppercaseType === 'MARKET') {
                uppercaseType = 'STOP_LOSS';
            } else if (uppercaseType === 'LIMIT') {
                uppercaseType = 'STOP_LOSS_LIMIT';
            }
        }
        const validOrderTypes = this.safeList (market['info'], 'orderTypes');
        if (!this.inArray (uppercaseType, validOrderTypes)) {
            if (initialUppercaseType !== uppercaseType) {
                throw new InvalidOrder (this.id + ' stopPrice parameter is not allowed for ' + symbol + ' ' + type + ' orders');
            } else {
                throw new InvalidOrder (this.id + ' ' + type + ' is not a valid order type for the ' + symbol + ' market');
            }
        }
        if (clientOrderId === undefined) {
            const broker = this.safeDict (this.options, 'broker');
            if (broker !== undefined) {
                const brokerId = this.safeString (broker, 'spot');
                if (brokerId !== undefined) {
                    request['newClientOrderId'] = brokerId + this.uuid22 ();
                }
            }
        } else {
            request['newClientOrderId'] = clientOrderId;
        }
        request['newOrderRespType'] = this.safeValue (this.options['newOrderRespType'], type, 'RESULT'); // 'ACK' for order id, 'RESULT' for full order or 'FULL' for order with fills
        let timeInForceIsRequired = false;
        let priceIsRequired = false;
        let stopPriceIsRequired = false;
        let quantityIsRequired = false;
        if (uppercaseType === 'MARKET') {
            const quoteOrderQty = this.safeBool (this.options, 'quoteOrderQty', true);
            if (quoteOrderQty) {
                const quoteOrderQtyNew = this.safeValue2 (params, 'quoteOrderQty', 'cost');
                const precision = market['precision']['price'];
                if (quoteOrderQtyNew !== undefined) {
                    request['quoteOrderQty'] = this.decimalToPrecision (quoteOrderQtyNew, TRUNCATE, precision, this.precisionMode);
                } else if (price !== undefined) {
                    const amountString = this.numberToString (amount);
                    const priceString = this.numberToString (price);
                    const quoteOrderQuantity = Precise.stringMul (amountString, priceString);
                    request['quoteOrderQty'] = this.decimalToPrecision (quoteOrderQuantity, TRUNCATE, precision, this.precisionMode);
                } else {
                    quantityIsRequired = true;
                }
            } else {
                quantityIsRequired = true;
            }
        } else if (uppercaseType === 'LIMIT') {
            priceIsRequired = true;
            timeInForceIsRequired = true;
            quantityIsRequired = true;
        } else if ((uppercaseType === 'STOP_LOSS') || (uppercaseType === 'TAKE_PROFIT')) {
            stopPriceIsRequired = true;
            quantityIsRequired = true;
        } else if ((uppercaseType === 'STOP_LOSS_LIMIT') || (uppercaseType === 'TAKE_PROFIT_LIMIT')) {
            quantityIsRequired = true;
            stopPriceIsRequired = true;
            priceIsRequired = true;
            timeInForceIsRequired = true;
        } else if (uppercaseType === 'LIMIT_MAKER') {
            priceIsRequired = true;
            quantityIsRequired = true;
        }
        if (quantityIsRequired) {
            request['quantity'] = this.amountToPrecision (symbol, amount);
        }
        if (priceIsRequired) {
            if (price === undefined) {
                throw new InvalidOrder (this.id + ' editOrder() requires a price argument for a ' + type + ' order');
            }
            request['price'] = this.priceToPrecision (symbol, price);
        }
        if (timeInForceIsRequired && (this.safeString (params, 'timeInForce') === undefined)) {
            request['timeInForce'] = this.options['defaultTimeInForce']; // 'GTC' = Good To Cancel (default), 'IOC' = Immediate Or Cancel
        }
        if (stopPriceIsRequired) {
            if (stopPrice === undefined) {
                throw new InvalidOrder (this.id + ' editOrder() requires a stopPrice extra param for a ' + type + ' order');
            } else {
                request['stopPrice'] = this.priceToPrecision (symbol, stopPrice);
            }
        }
        request['cancelReplaceMode'] = 'STOP_ON_FAILURE'; // If the cancel request fails, the new order placement will not be attempted.
        const cancelId = this.safeString2 (params, 'cancelNewClientOrderId', 'cancelOrigClientOrderId');
        if (cancelId === undefined) {
            request['cancelOrderId'] = id; // user can provide either cancelOrderId, cancelOrigClientOrderId or cancelOrigClientOrderId
        }
        // remove timeInForce from params because PO is only used by this.isPostOnly and it's not a valid value for Binance
        if (this.safeString (params, 'timeInForce') === 'PO') {
            params = this.omit (params, [ 'timeInForce' ]);
        }
        params = this.omit (params, [ 'quoteOrderQty', 'cost', 'stopPrice', 'newClientOrderId', 'clientOrderId', 'postOnly' ]);
        return this.extend (request, params);
    }

    editContractOrderRequest (id: string, symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        const market = this.market (symbol);
        if (!market['contract']) {
            throw new NotSupported (this.id + ' editContractOrder() does not support ' + market['type'] + ' orders');
        }
        const request: Dict = {
            'symbol': market['id'],
            'side': side.toUpperCase (),
        };
        const clientOrderId = this.safeStringN (params, [ 'newClientOrderId', 'clientOrderId', 'origClientOrderId' ]);
        request['orderId'] = id;
        request['quantity'] = this.amountToPrecision (symbol, amount);
        if (price !== undefined) {
            request['price'] = this.priceToPrecision (symbol, price);
        }
        if (clientOrderId !== undefined) {
            request['origClientOrderId'] = clientOrderId;
        }
        params = this.omit (params, [ 'clientOrderId', 'newClientOrderId' ]);
        return request;
    }

    /**
     * @method
     * @name binance#editContractOrder
     * @description edit a trade order
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Order
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Modify-Order
     * @param {string} id cancel order id
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async editContractOrder (id: string, symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request = this.editContractOrderRequest (id, symbol, type, side, amount, price, params);
        let response = undefined;
        if (market['linear']) {
            response = await this.fapiPrivatePutOrder (this.extend (request, params));
        } else if (market['inverse']) {
            response = await this.dapiPrivatePutOrder (this.extend (request, params));
        }
        //
        // swap and future
        //
        //     {
        //         "orderId": 151007482392,
        //         "symbol": "BTCUSDT",
        //         "status": "NEW",
        //         "clientOrderId": "web_pCCGp9AIHjziKLlpGpXI",
        //         "price": "25000",
        //         "avgPrice": "0.00000",
        //         "origQty": "0.001",
        //         "executedQty": "0",
        //         "cumQty": "0",
        //         "cumQuote": "0",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "closePosition": false,
        //         "side": "BUY",
        //         "positionSide": "BOTH",
        //         "stopPrice": "0",
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "origType": "LIMIT",
        //         "updateTime": 1684300587845
        //     }
        //
        return this.parseOrder (response, market);
    }

    /**
     * @method
     * @name binance#editOrder
     * @description edit a trade order
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#cancel-an-existing-order-and-send-a-new-order-trade
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Order
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Modify-Order
     * @param {string} id cancel order id
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of currency you want to trade in units of base currency
     * @param {float} [price] the price at which the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async editOrder (id: string, symbol: string, type:OrderType, side: OrderSide, amount: Num = undefined, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (market['option']) {
            throw new NotSupported (this.id + ' editOrder() does not support ' + market['type'] + ' orders');
        }
        if (market['spot']) {
            return await this.editSpotOrder (id, symbol, type, side, amount, price, params);
        } else {
            return await this.editContractOrder (id, symbol, type, side, amount, price, params);
        }
    }

    parseOrderStatus (status: Str) {
        const statuses: Dict = {
            'NEW': 'open',
            'PARTIALLY_FILLED': 'open',
            'ACCEPTED': 'open',
            'FILLED': 'closed',
            'CANCELED': 'canceled',
            'CANCELLED': 'canceled',
            'PENDING_CANCEL': 'canceling', // currently unused
            'REJECTED': 'rejected',
            'EXPIRED': 'expired',
            'EXPIRED_IN_MATCH': 'expired',
        };
        return this.safeString (statuses, status, status);
    }

    parseOrder (order: Dict, market: Market = undefined): Order {
        //
        // spot
        //
        //     {
        //         "symbol": "LTCBTC",
        //         "orderId": 1,
        //         "clientOrderId": "myOrder1",
        //         "price": "0.1",
        //         "origQty": "1.0",
        //         "executedQty": "0.0",
        //         "cummulativeQuoteQty": "0.0",
        //         "status": "NEW",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "side": "BUY",
        //         "stopPrice": "0.0",
        //         "icebergQty": "0.0",
        //         "time": 1499827319559,
        //         "updateTime": 1499827319559,
        //         "isWorking": true
        //     }
        //
        // spot: editOrder
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "orderId": 16383176297,
        //         "orderListId": -1,
        //         "clientOrderId": "x-R4BD3S8222ecb58eb9074fb1be018c",
        //         "transactTime": 1670891847932,
        //         "price": "13500.00000000",
        //         "origQty": "0.00085000",
        //         "executedQty": "0.00000000",
        //         "cummulativeQuoteQty": "0.00000000",
        //         "status": "NEW",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "side": "BUY",
        //         "fills": []
        //     }
        //
        // swap and future: editOrder
        //
        //     {
        //         "orderId": 151007482392,
        //         "symbol": "BTCUSDT",
        //         "status": "NEW",
        //         "clientOrderId": "web_pCCGp9AIHjziKLlpGpXI",
        //         "price": "25000",
        //         "avgPrice": "0.00000",
        //         "origQty": "0.001",
        //         "executedQty": "0",
        //         "cumQty": "0",
        //         "cumQuote": "0",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "closePosition": false,
        //         "side": "BUY",
        //         "positionSide": "BOTH",
        //         "stopPrice": "0",
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "origType": "LIMIT",
        //         "updateTime": 1684300587845
        //     }
        //
        // futures
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "orderId": 1,
        //         "clientOrderId": "myOrder1",
        //         "price": "0.1",
        //         "origQty": "1.0",
        //         "executedQty": "1.0",
        //         "cumQuote": "10.0",
        //         "status": "NEW",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "side": "BUY",
        //         "stopPrice": "0.0",
        //         "updateTime": 1499827319559
        //     }
        //
        // createOrder with { "newOrderRespType": "FULL" }
        //
        //     {
        //       "symbol": "BTCUSDT",
        //       "orderId": 5403233939,
        //       "orderListId": -1,
        //       "clientOrderId": "x-R4BD3S825e669e75b6c14f69a2c43e",
        //       "transactTime": 1617151923742,
        //       "price": "0.00000000",
        //       "origQty": "0.00050000",
        //       "executedQty": "0.00050000",
        //       "cummulativeQuoteQty": "29.47081500",
        //       "status": "FILLED",
        //       "timeInForce": "GTC",
        //       "type": "MARKET",
        //       "side": "BUY",
        //       "fills": [
        //         {
        //           "price": "58941.63000000",
        //           "qty": "0.00050000",
        //           "commission": "0.00007050",
        //           "commissionAsset": "BNB",
        //           "tradeId": 737466631
        //         }
        //       ]
        //     }
        //
        // delivery
        //
        //     {
        //       "orderId": "18742727411",
        //       "symbol": "ETHUSD_PERP",
        //       "pair": "ETHUSD",
        //       "status": "FILLED",
        //       "clientOrderId": "x-xcKtGhcu3e2d1503fdd543b3b02419",
        //       "price": "0",
        //       "avgPrice": "4522.14",
        //       "origQty": "1",
        //       "executedQty": "1",
        //       "cumBase": "0.00221134",
        //       "timeInForce": "GTC",
        //       "type": "MARKET",
        //       "reduceOnly": false,
        //       "closePosition": false,
        //       "side": "SELL",
        //       "positionSide": "BOTH",
        //       "stopPrice": "0",
        //       "workingType": "CONTRACT_PRICE",
        //       "priceProtect": false,
        //       "origType": "MARKET",
        //       "time": "1636061952660",
        //       "updateTime": "1636061952660"
        //     }
        //
        // option: createOrder, fetchOrder, fetchOpenOrders, fetchOrders
        //
        //     {
        //         "orderId": 4728833085436977152,
        //         "symbol": "ETH-230211-1500-C",
        //         "price": "10.0",
        //         "quantity": "1.00",
        //         "executedQty": "0.00",
        //         "fee": "0",
        //         "side": "BUY",
        //         "type": "LIMIT",
        //         "timeInForce": "GTC",
        //         "reduceOnly": false,
        //         "postOnly": false,
        //         "createTime": 1676083034462,
        //         "updateTime": 1676083034462,
        //         "status": "ACCEPTED",
        //         "avgPrice": "0",
        //         "source": "API",
        //         "clientOrderId": "",
        //         "priceScale": 1,
        //         "quantityScale": 2,
        //         "optionSide": "CALL",
        //         "quoteAsset": "USDT",
        //         "lastTrade": {"id":"69","time":"1676084430567","price":"24.9","qty":"1.00"},
        //         "mmp": false
        //     }
        //
        // cancelOrders/createOrders
        //
        //     {
        //         "code": -4005,
        //         "msg": "Quantity greater than max quantity."
        //     }
        //
        // createOrder, fetchOpenOrders, fetchOrder, cancelOrder, fetchOrders: portfolio margin linear swap and future
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "side": "BUY",
        //         "executedQty": "0.000",
        //         "orderId": 258649539704,
        //         "goodTillDate": 0,
        //         "avgPrice": "0",
        //         "origQty": "0.010",
        //         "clientOrderId": "x-xcKtGhcu02573c6f15e544e990057b",
        //         "positionSide": "BOTH",
        //         "cumQty": "0.000",
        //         "updateTime": 1707110415436,
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "price": "35000.00",
        //         "cumQuote": "0.00000",
        //         "selfTradePreventionMode": "NONE",
        //         "timeInForce": "GTC",
        //         "status": "NEW"
        //     }
        //
        // createOrder, fetchOpenOrders, fetchOrder, cancelOrder, fetchOrders: portfolio margin inverse swap and future
        //
        //     {
        //         "symbol": "ETHUSD_PERP",
        //         "side": "BUY",
        //         "cumBase": "0",
        //         "executedQty": "0",
        //         "orderId": 71275227732,
        //         "avgPrice": "0.00",
        //         "origQty": "1",
        //         "clientOrderId": "x-xcKtGhcuca5af3acfb5044198c5398",
        //         "positionSide": "BOTH",
        //         "cumQty": "0",
        //         "updateTime": 1707110994334,
        //         "type": "LIMIT",
        //         "pair": "ETHUSD",
        //         "reduceOnly": false,
        //         "price": "2000",
        //         "timeInForce": "GTC",
        //         "status": "NEW"
        //     }
        //
        // createOrder, fetchOpenOrders, fetchOpenOrder: portfolio margin linear swap and future conditional
        //
        //     {
        //         "newClientStrategyId": "x-xcKtGhcu27f109953d6e4dc0974006",
        //         "strategyId": 3645916,
        //         "strategyStatus": "NEW",
        //         "strategyType": "STOP",
        //         "origQty": "0.010",
        //         "price": "35000.00",
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "BOTH",
        //         "stopPrice": "45000.00",
        //         "symbol": "BTCUSDT",
        //         "timeInForce": "GTC",
        //         "bookTime": 1707112625879,
        //         "updateTime": 1707112625879,
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "goodTillDate": 0,
        //         "selfTradePreventionMode": "NONE"
        //     }
        //
        // createOrder, fetchOpenOrders: portfolio margin inverse swap and future conditional
        //
        //     {
        //         "newClientStrategyId": "x-xcKtGhcuc6b86f053bb34933850739",
        //         "strategyId": 1423462,
        //         "strategyStatus": "NEW",
        //         "strategyType": "STOP",
        //         "origQty": "1",
        //         "price": "2000",
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "BOTH",
        //         "stopPrice": "3000",
        //         "symbol": "ETHUSD_PERP",
        //         "timeInForce": "GTC",
        //         "bookTime": 1707113098840,
        //         "updateTime": 1707113098840,
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false
        //     }
        //
        // createOrder, cancelAllOrders, cancelOrder: portfolio margin spot margin
        //
        //     {
        //         "clientOrderId": "x-R4BD3S82e9ef29d8346440f0b28b86",
        //         "cummulativeQuoteQty": "0.00000000",
        //         "executedQty": "0.00000000",
        //         "fills": [],
        //         "orderId": 24684460474,
        //         "origQty": "0.00100000",
        //         "price": "35000.00000000",
        //         "selfTradePreventionMode": "EXPIRE_MAKER",
        //         "side": "BUY",
        //         "status": "NEW",
        //         "symbol": "BTCUSDT",
        //         "timeInForce": "GTC",
        //         "transactTime": 1707113538870,
        //         "type": "LIMIT"
        //     }
        //
        // fetchOpenOrders, fetchOrder, fetchOrders: portfolio margin spot margin
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "orderId": 24700763749,
        //         "clientOrderId": "x-R4BD3S826f724c2a4af6425f98c7b6",
        //         "price": "35000.00000000",
        //         "origQty": "0.00100000",
        //         "executedQty": "0.00000000",
        //         "cummulativeQuoteQty": "0.00000000",
        //         "status": "NEW",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "side": "BUY",
        //         "stopPrice": "0.00000000",
        //         "icebergQty": "0.00000000",
        //         "time": 1707199187679,
        //         "updateTime": 1707199187679,
        //         "isWorking": true,
        //         "accountId": 200180970,
        //         "selfTradePreventionMode": "EXPIRE_MAKER",
        //         "preventedMatchId": null,
        //         "preventedQuantity": null
        //     }
        //
        // cancelOrder: portfolio margin linear and inverse swap conditional
        //
        //     {
        //         "strategyId": 3733211,
        //         "newClientStrategyId": "x-xcKtGhcuaf166172ed504cd1bc0396",
        //         "strategyType": "STOP",
        //         "strategyStatus": "CANCELED",
        //         "origQty": "0.010",
        //         "price": "35000.00",
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "BOTH",
        //         "stopPrice": "50000.00", // ignored with trailing orders
        //         "symbol": "BTCUSDT",
        //         "timeInForce": "GTC",
        //         "activatePrice": null,  // only return with trailing orders
        //         "priceRate": null,      // only return with trailing orders
        //         "bookTime": 1707270098774,
        //         "updateTime": 1707270119261,
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "goodTillDate": 0,
        //         "selfTradePreventionMode": "NONE"
        //     }
        //
        // fetchOrders: portfolio margin linear and inverse swap conditional
        //
        //     {
        //         "newClientStrategyId": "x-xcKtGhcuaf166172ed504cd1bc0396",
        //         "strategyId": 3733211,
        //         "strategyStatus": "CANCELLED",
        //         "strategyType": "STOP",
        //         "origQty": "0.010",
        //         "price": "35000",
        //         "orderId": 0,
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "BOTH",
        //         "stopPrice": "50000",
        //         "symbol": "BTCUSDT",
        //         "type": "LIMIT",
        //         "bookTime": 1707270098774,
        //         "updateTime": 1707270119261,
        //         "timeInForce": "GTC",
        //         "triggerTime": 0,
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "goodTillDate": 0,
        //         "selfTradePreventionMode": "NONE"
        //     }
        //
        // fetchOpenOrder: linear swap
        //
        //     {
        //         "orderId": 3697213934,
        //         "symbol": "BTCUSDT",
        //         "status": "NEW",
        //         "clientOrderId": "x-xcKtGhcufb20c5a7761a4aa09aa156",
        //         "price": "33000.00",
        //         "avgPrice": "0.00000",
        //         "origQty": "0.010",
        //         "executedQty": "0.000",
        //         "cumQuote": "0.00000",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "closePosition": false,
        //         "side": "BUY",
        //         "positionSide": "BOTH",
        //         "stopPrice": "0.00",
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "origType": "LIMIT",
        //         "priceMatch": "NONE",
        //         "selfTradePreventionMode": "NONE",
        //         "goodTillDate": 0,
        //         "time": 1707892893502,
        //         "updateTime": 1707892893515
        //     }
        //
        // fetchOpenOrder: inverse swap
        //
        //     {
        //         "orderId": 597368542,
        //         "symbol": "BTCUSD_PERP",
        //         "pair": "BTCUSD",
        //         "status": "NEW",
        //         "clientOrderId": "x-xcKtGhcubbde7ba93b1a4ab881eff3",
        //         "price": "35000",
        //         "avgPrice": "0",
        //         "origQty": "1",
        //         "executedQty": "0",
        //         "cumBase": "0",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "closePosition": false,
        //         "side": "BUY",
        //         "positionSide": "BOTH",
        //         "stopPrice": "0",
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "origType": "LIMIT",
        //         "time": 1707893453199,
        //         "updateTime": 1707893453199
        //     }
        //
        // fetchOpenOrder: linear portfolio margin
        //
        //     {
        //         "orderId": 264895013409,
        //         "symbol": "BTCUSDT",
        //         "status": "NEW",
        //         "clientOrderId": "x-xcKtGhcu6278f1adbdf14f74ab432e",
        //         "price": "35000",
        //         "avgPrice": "0",
        //         "origQty": "0.010",
        //         "executedQty": "0",
        //         "cumQuote": "0",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "LONG",
        //         "origType": "LIMIT",
        //         "time": 1707893839364,
        //         "updateTime": 1707893839364,
        //         "goodTillDate": 0,
        //         "selfTradePreventionMode": "NONE"
        //     }
        //
        // fetchOpenOrder: inverse portfolio margin
        //
        //     {
        //         "orderId": 71790316950,
        //         "symbol": "ETHUSD_PERP",
        //         "pair": "ETHUSD",
        //         "status": "NEW",
        //         "clientOrderId": "x-xcKtGhcuec11030474204ab08ba2c2",
        //         "price": "2500",
        //         "avgPrice": "0",
        //         "origQty": "1",
        //         "executedQty": "0",
        //         "cumBase": "0",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "LONG",
        //         "origType": "LIMIT",
        //         "time": 1707894181694,
        //         "updateTime": 1707894181694
        //     }
        //
        // fetchOpenOrder: inverse portfolio margin conditional
        //
        //     {
        //         "newClientStrategyId": "x-xcKtGhcu2da9c765294b433994ffce",
        //         "strategyId": 1423501,
        //         "strategyStatus": "NEW",
        //         "strategyType": "STOP",
        //         "origQty": "1",
        //         "price": "2500",
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "LONG",
        //         "stopPrice": "4000",
        //         "symbol": "ETHUSD_PERP",
        //         "bookTime": 1707894782679,
        //         "updateTime": 1707894782679,
        //         "timeInForce": "GTC",
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false
        //     }
        //
        const code = this.safeString (order, 'code');
        if (code !== undefined) {
            // cancelOrders/createOrders might have a partial success
            return this.safeOrder ({ 'info': order, 'status': 'rejected' }, market);
        }
        const status = this.parseOrderStatus (this.safeString2 (order, 'status', 'strategyStatus'));
        const marketId = this.safeString (order, 'symbol');
        const isContract = ('positionSide' in order) || ('cumQuote' in order);
        const marketType = isContract ? 'contract' : 'spot';
        const symbol = this.safeSymbol (marketId, market, undefined, marketType);
        const filled = this.safeString (order, 'executedQty', '0');
        const timestamp = this.safeIntegerN (order, [ 'time', 'createTime', 'workingTime', 'transactTime', 'updateTime' ]); // order of the keys matters here
        let lastTradeTimestamp = undefined;
        if (('transactTime' in order) || ('updateTime' in order)) {
            const timestampValue = this.safeInteger2 (order, 'updateTime', 'transactTime');
            if (status === 'open') {
                if (Precise.stringGt (filled, '0')) {
                    lastTradeTimestamp = timestampValue;
                }
            } else if (status === 'closed') {
                lastTradeTimestamp = timestampValue;
            }
        }
        const lastUpdateTimestamp = this.safeInteger2 (order, 'transactTime', 'updateTime');
        const average = this.safeString (order, 'avgPrice');
        const price = this.safeString (order, 'price');
        const amount = this.safeString2 (order, 'origQty', 'quantity');
        // - Spot/Margin market: cummulativeQuoteQty
        // - Futures market: cumQuote.
        //   Note this is not the actual cost, since Binance futures uses leverage to calculate margins.
        let cost = this.safeString2 (order, 'cummulativeQuoteQty', 'cumQuote');
        cost = this.safeString (order, 'cumBase', cost);
        let type = this.safeStringLower (order, 'type');
        const side = this.safeStringLower (order, 'side');
        const fills = this.safeList (order, 'fills', []);
        let timeInForce = this.safeString (order, 'timeInForce');
        if (timeInForce === 'GTX') {
            // GTX means "Good Till Crossing" and is an equivalent way of saying Post Only
            timeInForce = 'PO';
        }
        const postOnly = (type === 'limit_maker') || (timeInForce === 'PO');
        if (type === 'limit_maker') {
            type = 'limit';
        }
        const stopPriceString = this.safeString (order, 'stopPrice');
        const stopPrice = this.parseNumber (this.omitZero (stopPriceString));
        const feeCost = this.safeNumber (order, 'fee');
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = {
                'currency': this.safeString (order, 'quoteAsset'),
                'cost': feeCost,
                'rate': undefined,
            };
        }
        return this.safeOrder ({
            'info': order,
            'id': this.safeString2 (order, 'strategyId', 'orderId'),
            'clientOrderId': this.safeString2 (order, 'clientOrderId', 'newClientStrategyId'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'lastTradeTimestamp': lastTradeTimestamp,
            'lastUpdateTimestamp': lastUpdateTimestamp,
            'symbol': symbol,
            'type': type,
            'timeInForce': timeInForce,
            'postOnly': postOnly,
            'reduceOnly': this.safeBool (order, 'reduceOnly'),
            'side': side,
            'price': price,
            'triggerPrice': stopPrice,
            'amount': amount,
            'cost': cost,
            'average': average,
            'filled': filled,
            'remaining': undefined,
            'status': status,
            'fee': fee,
            'trades': fills,
        }, market);
    }

    /**
     * @method
     * @name binance#createOrders
     * @description *contract only* create a list of trade orders
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Place-Multiple-Orders
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Place-Multiple-Orders
     * @see https://developers.binance.com/docs/derivatives/option/trade/Place-Multiple-Orders
     * @param {Array} orders list of orders to create, each object should contain the parameters required by createOrder, namely symbol, type, side, amount, price and params
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrders (orders: OrderRequest[], params = {}) {
        await this.loadMarkets ();
        const ordersRequests = [];
        let orderSymbols = [];
        for (let i = 0; i < orders.length; i++) {
            const rawOrder = orders[i];
            const marketId = this.safeString (rawOrder, 'symbol');
            orderSymbols.push (marketId);
            const type = this.safeString (rawOrder, 'type');
            const side = this.safeString (rawOrder, 'side');
            const amount = this.safeValue (rawOrder, 'amount');
            const price = this.safeValue (rawOrder, 'price');
            const orderParams = this.safeDict (rawOrder, 'params', {});
            const orderRequest = this.createOrderRequest (marketId, type, side, amount, price, orderParams);
            ordersRequests.push (orderRequest);
        }
        orderSymbols = this.marketSymbols (orderSymbols, undefined, false, true, true);
        const market = this.market (orderSymbols[0]);
        if (market['spot']) {
            throw new NotSupported (this.id + ' createOrders() does not support ' + market['type'] + ' orders');
        }
        let response = undefined;
        let request: Dict = {
            'batchOrders': ordersRequests,
        };
        request = this.extend (request, params);
        if (market['linear']) {
            response = await this.fapiPrivatePostBatchOrders (request);
        } else if (market['option']) {
            response = await this.eapiPrivatePostBatchOrders (request);
        } else {
            response = await this.dapiPrivatePostBatchOrders (request);
        }
        //
        //   [
        //       {
        //          "code": -4005,
        //          "msg": "Quantity greater than max quantity."
        //       },
        //       {
        //          "orderId": 650640530,
        //          "symbol": "LTCUSDT",
        //          "status": "NEW",
        //          "clientOrderId": "x-xcKtGhcu32184eb13585491289bbaf",
        //          "price": "54.00",
        //          "avgPrice": "0.00",
        //          "origQty": "0.100",
        //          "executedQty": "0.000",
        //          "cumQty": "0.000",
        //          "cumQuote": "0.00000",
        //          "timeInForce": "GTC",
        //          "type": "LIMIT",
        //          "reduceOnly": false,
        //          "closePosition": false,
        //          "side": "BUY",
        //          "positionSide": "BOTH",
        //          "stopPrice": "0.00",
        //          "workingType": "CONTRACT_PRICE",
        //          "priceProtect": false,
        //          "origType": "LIMIT",
        //          "priceMatch": "NONE",
        //          "selfTradePreventionMode": "NONE",
        //          "goodTillDate": 0,
        //          "updateTime": 1698073926929
        //       }
        //   ]
        //
        return this.parseOrders (response);
    }

    /**
     * @method
     * @name binance#createOrder
     * @description create a trade order
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#new-order-trade
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#test-new-order-trade
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/New-Order
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/New-Order
     * @see https://developers.binance.com/docs/derivatives/option/trade/New-Order
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#sor
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#test-new-order-using-sor-trade
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-CM-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-Margin-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-UM-Conditional-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/New-CM-Conditional-Order
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} type 'market' or 'limit' or 'STOP_LOSS' or 'STOP_LOSS_LIMIT' or 'TAKE_PROFIT' or 'TAKE_PROFIT_LIMIT' or 'STOP'
     * @param {string} side 'buy' or 'sell'
     * @param {float} amount how much of you want to trade in units of the base currency
     * @param {float} [price] the price that the order is to be fulfilled, in units of the quote currency, ignored in market orders
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.reduceOnly] for swap and future reduceOnly is a string 'true' or 'false' that cant be sent with close position set to true or in hedge mode. For spot margin and option reduceOnly is a boolean.
     * @param {string} [params.marginMode] 'cross' or 'isolated', for spot margin trading
     * @param {boolean} [params.sor] *spot only* whether to use SOR (Smart Order Routing) or not, default is false
     * @param {boolean} [params.test] *spot only* whether to use the test endpoint or not, default is false
     * @param {float} [params.trailingPercent] the percent to trail away from the current market price
     * @param {float} [params.trailingTriggerPrice] the price to trigger a trailing order, default uses the price argument
     * @param {float} [params.triggerPrice] the price that a trigger order is triggered at
     * @param {float} [params.stopLossPrice] the price that a stop loss order is triggered at
     * @param {float} [params.takeProfitPrice] the price that a take profit order is triggered at
     * @param {boolean} [params.portfolioMargin] set to true if you would like to create an order in a portfolio margin account
     * @param {string} [params.stopLossOrTakeProfit] 'stopLoss' or 'takeProfit', required for spot trailing orders
     * @param {string} [params.positionSide] *swap and portfolio margin only* "BOTH" for one-way mode, "LONG" for buy side of hedged mode, "SHORT" for sell side of hedged mode
     * @param {bool} [params.hedged] *swap and portfolio margin only* true for hedged mode, false for one way mode, default is false
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createOrder (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const marketType = this.safeString (params, 'type', market['type']);
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('createOrder', params);
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'createOrder', 'papi', 'portfolioMargin', false);
        const triggerPrice = this.safeString2 (params, 'triggerPrice', 'stopPrice');
        const stopLossPrice = this.safeString (params, 'stopLossPrice');
        const takeProfitPrice = this.safeString (params, 'takeProfitPrice');
        const trailingPercent = this.safeString2 (params, 'trailingPercent', 'callbackRate');
        const isTrailingPercentOrder = trailingPercent !== undefined;
        const isStopLoss = stopLossPrice !== undefined;
        const isTakeProfit = takeProfitPrice !== undefined;
        const isConditional = (triggerPrice !== undefined) || isTrailingPercentOrder || isStopLoss || isTakeProfit;
        const sor = this.safeBool2 (params, 'sor', 'SOR', false);
        const test = this.safeBool (params, 'test', false);
        params = this.omit (params, [ 'sor', 'SOR', 'test' ]);
        if (isPortfolioMargin) {
            params['portfolioMargin'] = isPortfolioMargin;
        }
        const request = this.createOrderRequest (symbol, type, side, amount, price, params);
        let response = undefined;
        if (market['option']) {
            response = await this.eapiPrivatePostOrder (request);
        } else if (sor) {
            if (test) {
                response = await this.privatePostSorOrderTest (request);
            } else {
                response = await this.privatePostSorOrder (request);
            }
        } else if (market['linear']) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiPostUmConditionalOrder (request);
                } else {
                    response = await this.papiPostUmOrder (request);
                }
            } else {
                response = await this.fapiPrivatePostOrder (request);
            }
        } else if (market['inverse']) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiPostCmConditionalOrder (request);
                } else {
                    response = await this.papiPostCmOrder (request);
                }
            } else {
                response = await this.dapiPrivatePostOrder (request);
            }
        } else if (marketType === 'margin' || marginMode !== undefined || isPortfolioMargin) {
            if (isPortfolioMargin) {
                response = await this.papiPostMarginOrder (request);
            } else {
                response = await this.sapiPostMarginOrder (request);
            }
        } else {
            if (test) {
                response = await this.privatePostOrderTest (request);
            } else {
                response = await this.privatePostOrder (request);
            }
        }
        return this.parseOrder (response, market);
    }

    createOrderRequest (symbol: string, type: OrderType, side: OrderSide, amount: number, price: Num = undefined, params = {}) {
        /**
         * @method
         * @ignore
         * @name binance#createOrderRequest
         * @description helper function to build the request
         * @param {string} symbol unified symbol of the market to create an order in
         * @param {string} type 'market' or 'limit'
         * @param {string} side 'buy' or 'sell'
         * @param {float} amount how much you want to trade in units of the base currency
         * @param {float} [price] the price that the order is to be fulfilled, in units of the quote currency, ignored in market orders
         * @param {object} [params] extra parameters specific to the exchange API endpoint
         * @returns {object} request to be sent to the exchange
         */
        const market = this.market (symbol);
        const marketType = this.safeString (params, 'type', market['type']);
        const clientOrderId = this.safeString2 (params, 'newClientOrderId', 'clientOrderId');
        const initialUppercaseType = type.toUpperCase ();
        const isMarketOrder = initialUppercaseType === 'MARKET';
        const isLimitOrder = initialUppercaseType === 'LIMIT';
        const request: Dict = {
            'symbol': market['id'],
            'side': side.toUpperCase (),
        };
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'createOrder', 'papi', 'portfolioMargin', false);
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('createOrder', params);
        const reduceOnly = this.safeBool (params, 'reduceOnly', false);
        if ((marketType === 'margin') || (marginMode !== undefined) || market['option']) {
            // for swap and future reduceOnly is a string that cant be sent with close position set to true or in hedge mode
            params = this.omit (params, 'reduceOnly');
            if (market['option']) {
                request['reduceOnly'] = reduceOnly;
            } else {
                if (reduceOnly) {
                    request['sideEffectType'] = 'AUTO_REPAY';
                }
            }
        }
        const triggerPrice = this.safeString2 (params, 'triggerPrice', 'stopPrice');
        const stopLossPrice = this.safeString (params, 'stopLossPrice', triggerPrice); // fallback to stopLoss
        const takeProfitPrice = this.safeString (params, 'takeProfitPrice');
        const trailingDelta = this.safeString (params, 'trailingDelta');
        const trailingTriggerPrice = this.safeString2 (params, 'trailingTriggerPrice', 'activationPrice');
        const trailingPercent = this.safeStringN (params, [ 'trailingPercent', 'callbackRate', 'trailingDelta' ]);
        const priceMatch = this.safeString (params, 'priceMatch');
        const isTrailingPercentOrder = trailingPercent !== undefined;
        const isStopLoss = stopLossPrice !== undefined || trailingDelta !== undefined;
        const isTakeProfit = takeProfitPrice !== undefined;
        const isTriggerOrder = triggerPrice !== undefined;
        const isConditional = isTriggerOrder || isTrailingPercentOrder || isStopLoss || isTakeProfit;
        const isPortfolioMarginConditional = (isPortfolioMargin && isConditional);
        const isPriceMatch = priceMatch !== undefined;
        let uppercaseType = type.toUpperCase ();
        let stopPrice = undefined;
        if (isTrailingPercentOrder) {
            if (market['swap']) {
                uppercaseType = 'TRAILING_STOP_MARKET';
                request['callbackRate'] = trailingPercent;
                if (trailingTriggerPrice !== undefined) {
                    request['activationPrice'] = this.priceToPrecision (symbol, trailingTriggerPrice);
                }
            } else {
                if (isMarketOrder) {
                    throw new InvalidOrder (this.id + ' trailingPercent orders are not supported for ' + symbol + ' ' + type + ' orders');
                }
                const stopLossOrTakeProfit = this.safeString (params, 'stopLossOrTakeProfit');
                params = this.omit (params, 'stopLossOrTakeProfit');
                if (stopLossOrTakeProfit !== 'stopLoss' && stopLossOrTakeProfit !== 'takeProfit') {
                    throw new InvalidOrder (this.id + symbol + ' trailingPercent orders require a stopLossOrTakeProfit parameter of either stopLoss or takeProfit');
                }
                if (stopLossOrTakeProfit === 'stopLoss') {
                    uppercaseType = 'STOP_LOSS_LIMIT';
                } else if (stopLossOrTakeProfit === 'takeProfit') {
                    uppercaseType = 'TAKE_PROFIT_LIMIT';
                }
                if (trailingTriggerPrice !== undefined) {
                    stopPrice = this.priceToPrecision (symbol, trailingTriggerPrice);
                }
                const trailingPercentConverted = Precise.stringMul (trailingPercent, '100');
                request['trailingDelta'] = trailingPercentConverted;
            }
        } else if (isStopLoss) {
            stopPrice = stopLossPrice;
            if (isMarketOrder) {
                // spot STOP_LOSS market orders are not a valid order type
                uppercaseType = market['contract'] ? 'STOP_MARKET' : 'STOP_LOSS';
            } else if (isLimitOrder) {
                uppercaseType = market['contract'] ? 'STOP' : 'STOP_LOSS_LIMIT';
            }
        } else if (isTakeProfit) {
            stopPrice = takeProfitPrice;
            if (isMarketOrder) {
                // spot TAKE_PROFIT market orders are not a valid order type
                uppercaseType = market['contract'] ? 'TAKE_PROFIT_MARKET' : 'TAKE_PROFIT';
            } else if (isLimitOrder) {
                uppercaseType = market['contract'] ? 'TAKE_PROFIT' : 'TAKE_PROFIT_LIMIT';
            }
        }
        if (market['option']) {
            if (type === 'market') {
                throw new InvalidOrder (this.id + ' ' + type + ' is not a valid order type for the ' + symbol + ' market');
            }
        } else {
            const validOrderTypes = this.safeList (market['info'], 'orderTypes');
            if (!this.inArray (uppercaseType, validOrderTypes)) {
                if (initialUppercaseType !== uppercaseType) {
                    throw new InvalidOrder (this.id + ' stopPrice parameter is not allowed for ' + symbol + ' ' + type + ' orders');
                } else {
                    throw new InvalidOrder (this.id + ' ' + type + ' is not a valid order type for the ' + symbol + ' market');
                }
            }
        }
        const clientOrderIdRequest = isPortfolioMarginConditional ? 'newClientStrategyId' : 'newClientOrderId';
        if (clientOrderId === undefined) {
            const broker = this.safeDict (this.options, 'broker', {});
            const defaultId = (market['contract']) ? 'x-xcKtGhcu' : 'x-R4BD3S82';
            const brokerId = this.safeString (broker, marketType, defaultId);
            request[clientOrderIdRequest] = brokerId + this.uuid22 ();
        } else {
            request[clientOrderIdRequest] = clientOrderId;
        }
        let postOnly = undefined;
        if (!isPortfolioMargin) {
            postOnly = this.isPostOnly (isMarketOrder, initialUppercaseType === 'LIMIT_MAKER', params);
            if (market['spot'] || marketType === 'margin') {
                // only supported for spot/margin api (all margin markets are spot markets)
                if (postOnly) {
                    uppercaseType = 'LIMIT_MAKER';
                }
                if (marginMode === 'isolated') {
                    request['isIsolated'] = true;
                }
            }
        } else {
            postOnly = this.isPostOnly (isMarketOrder, initialUppercaseType === 'LIMIT_MAKER', params);
            if (postOnly) {
                if (!market['contract']) {
                    uppercaseType = 'LIMIT_MAKER';
                } else {
                    request['timeInForce'] = 'GTX';
                }
            }
        }
        // handle newOrderRespType response type
        if (((marketType === 'spot') || (marketType === 'margin')) && !isPortfolioMargin) {
            request['newOrderRespType'] = this.safeString (this.options['newOrderRespType'], type, 'FULL'); // 'ACK' for order id, 'RESULT' for full order or 'FULL' for order with fills
        } else {
            // swap, futures and options
            request['newOrderRespType'] = 'RESULT';  // "ACK", "RESULT", default "ACK"
        }
        const typeRequest = isPortfolioMarginConditional ? 'strategyType' : 'type';
        request[typeRequest] = uppercaseType;
        // additional required fields depending on the order type
        let timeInForceIsRequired = false;
        let priceIsRequired = false;
        let stopPriceIsRequired = false;
        let quantityIsRequired = false;
        //
        // spot/margin
        //
        //     LIMIT                timeInForce, quantity, price
        //     MARKET               quantity or quoteOrderQty
        //     STOP_LOSS            quantity, stopPrice
        //     STOP_LOSS_LIMIT      timeInForce, quantity, price, stopPrice
        //     TAKE_PROFIT          quantity, stopPrice
        //     TAKE_PROFIT_LIMIT    timeInForce, quantity, price, stopPrice
        //     LIMIT_MAKER          quantity, price
        //
        // futures
        //
        //     LIMIT                timeInForce, quantity, price
        //     MARKET               quantity
        //     STOP/TAKE_PROFIT     quantity, price, stopPrice
        //     STOP_MARKET          stopPrice
        //     TAKE_PROFIT_MARKET   stopPrice
        //     TRAILING_STOP_MARKET callbackRate
        //
        if (uppercaseType === 'MARKET') {
            if (market['spot']) {
                const quoteOrderQty = this.safeBool (this.options, 'quoteOrderQty', true);
                if (quoteOrderQty) {
                    const quoteOrderQtyNew = this.safeString2 (params, 'quoteOrderQty', 'cost');
                    const precision = market['precision']['price'];
                    if (quoteOrderQtyNew !== undefined) {
                        request['quoteOrderQty'] = this.decimalToPrecision (quoteOrderQtyNew, TRUNCATE, precision, this.precisionMode);
                    } else if (price !== undefined) {
                        const amountString = this.numberToString (amount);
                        const priceString = this.numberToString (price);
                        const quoteOrderQuantity = Precise.stringMul (amountString, priceString);
                        request['quoteOrderQty'] = this.decimalToPrecision (quoteOrderQuantity, TRUNCATE, precision, this.precisionMode);
                    } else {
                        quantityIsRequired = true;
                    }
                } else {
                    quantityIsRequired = true;
                }
            } else {
                quantityIsRequired = true;
            }
        } else if (uppercaseType === 'LIMIT') {
            priceIsRequired = true;
            timeInForceIsRequired = true;
            quantityIsRequired = true;
        } else if ((uppercaseType === 'STOP_LOSS') || (uppercaseType === 'TAKE_PROFIT')) {
            stopPriceIsRequired = true;
            quantityIsRequired = true;
            if (market['linear'] || market['inverse']) {
                priceIsRequired = true;
            }
        } else if ((uppercaseType === 'STOP_LOSS_LIMIT') || (uppercaseType === 'TAKE_PROFIT_LIMIT')) {
            quantityIsRequired = true;
            stopPriceIsRequired = true;
            priceIsRequired = true;
            timeInForceIsRequired = true;
        } else if (uppercaseType === 'LIMIT_MAKER') {
            priceIsRequired = true;
            quantityIsRequired = true;
        } else if (uppercaseType === 'STOP') {
            quantityIsRequired = true;
            stopPriceIsRequired = true;
            priceIsRequired = true;
        } else if ((uppercaseType === 'STOP_MARKET') || (uppercaseType === 'TAKE_PROFIT_MARKET')) {
            const closePosition = this.safeBool (params, 'closePosition');
            if (closePosition === undefined) {
                quantityIsRequired = true;
            }
            stopPriceIsRequired = true;
        } else if (uppercaseType === 'TRAILING_STOP_MARKET') {
            quantityIsRequired = true;
            if (trailingPercent === undefined) {
                throw new InvalidOrder (this.id + ' createOrder() requires a trailingPercent param for a ' + type + ' order');
            }
        }
        if (quantityIsRequired) {
            // portfolio margin has a different amount precision
            if (isPortfolioMargin) {
                request['quantity'] = this.parseToNumeric (amount);
            } else {
                const marketAmountPrecision = this.safeString (market['precision'], 'amount');
                const isPrecisionAvailable = (marketAmountPrecision !== undefined);
                if (isPrecisionAvailable) {
                    request['quantity'] = this.amountToPrecision (symbol, amount);
                } else {
                    request['quantity'] = this.parseToNumeric (amount); // some options don't have the precision available
                }
            }
        }
        if (priceIsRequired && !isPriceMatch) {
            if (price === undefined) {
                throw new InvalidOrder (this.id + ' createOrder() requires a price argument for a ' + type + ' order');
            }
            const pricePrecision = this.safeString (market['precision'], 'price');
            const isPricePrecisionAvailable = (pricePrecision !== undefined);
            if (isPricePrecisionAvailable) {
                request['price'] = this.priceToPrecision (symbol, price);
            } else {
                request['price'] = this.parseToNumeric (price); // some options don't have the precision available
            }
        }
        if (stopPriceIsRequired) {
            if (market['contract']) {
                if (stopPrice === undefined) {
                    throw new InvalidOrder (this.id + ' createOrder() requires a stopPrice extra param for a ' + type + ' order');
                }
            } else {
                // check for delta price as well
                if (trailingDelta === undefined && stopPrice === undefined && trailingPercent === undefined) {
                    throw new InvalidOrder (this.id + ' createOrder() requires a stopPrice, trailingDelta or trailingPercent param for a ' + type + ' order');
                }
            }
            if (stopPrice !== undefined) {
                request['stopPrice'] = this.priceToPrecision (symbol, stopPrice);
            }
        }
        if (timeInForceIsRequired && (this.safeString (params, 'timeInForce') === undefined) && (this.safeString (request, 'timeInForce') === undefined)) {
            request['timeInForce'] = this.options['defaultTimeInForce']; // 'GTC' = Good To Cancel (default), 'IOC' = Immediate Or Cancel
        }
        if (!isPortfolioMargin && market['contract'] && postOnly) {
            request['timeInForce'] = 'GTX';
        }
        // remove timeInForce from params because PO is only used by this.isPostOnly and it's not a valid value for Binance
        if (this.safeString (params, 'timeInForce') === 'PO') {
            params = this.omit (params, 'timeInForce');
        }
        const hedged = this.safeBool (params, 'hedged', false);
        if (!market['spot'] && !market['option'] && hedged) {
            if (reduceOnly) {
                params = this.omit (params, 'reduceOnly');
                side = (side === 'buy') ? 'sell' : 'buy';
            }
            request['positionSide'] = (side === 'buy') ? 'LONG' : 'SHORT';
        }
        const requestParams = this.omit (params, [ 'type', 'newClientOrderId', 'clientOrderId', 'postOnly', 'stopLossPrice', 'takeProfitPrice', 'stopPrice', 'triggerPrice', 'trailingTriggerPrice', 'trailingPercent', 'quoteOrderQty', 'cost', 'test', 'hedged' ]);
        return this.extend (request, requestParams);
    }

    /**
     * @method
     * @name binance#createMarketOrderWithCost
     * @description create a market order by providing the symbol, side and cost
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#new-order-trade
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {string} side 'buy' or 'sell'
     * @param {float} cost how much you want to trade in units of the quote currency
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createMarketOrderWithCost (symbol: string, side: OrderSide, cost: number, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['spot']) {
            throw new NotSupported (this.id + ' createMarketOrderWithCost() supports spot orders only');
        }
        params['cost'] = cost;
        return await this.createOrder (symbol, 'market', side, cost, undefined, params);
    }

    /**
     * @method
     * @name binance#createMarketBuyOrderWithCost
     * @description create a market buy order by providing the symbol and cost
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#new-order-trade
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {float} cost how much you want to trade in units of the quote currency
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createMarketBuyOrderWithCost (symbol: string, cost: number, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['spot']) {
            throw new NotSupported (this.id + ' createMarketBuyOrderWithCost() supports spot orders only');
        }
        params['cost'] = cost;
        return await this.createOrder (symbol, 'market', 'buy', cost, undefined, params);
    }

    /**
     * @method
     * @name binance#createMarketSellOrderWithCost
     * @description create a market sell order by providing the symbol and cost
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#new-order-trade
     * @param {string} symbol unified symbol of the market to create an order in
     * @param {float} cost how much you want to trade in units of the quote currency
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async createMarketSellOrderWithCost (symbol: string, cost: number, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['spot']) {
            throw new NotSupported (this.id + ' createMarketSellOrderWithCost() supports spot orders only');
        }
        params['quoteOrderQty'] = cost;
        return await this.createOrder (symbol, 'market', 'sell', cost, undefined, params);
    }

    /**
     * @method
     * @name binance#fetchOrder
     * @description fetches information on an order made by the user
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#query-order-user_data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Order
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Query-Order
     * @see https://developers.binance.com/docs/derivatives/option/trade/Query-Single-Order
     * @see https://developers.binance.com/docs/margin_trading/trade/Query-Margin-Account-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-UM-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-CM-Order
     * @param {string} id the order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.marginMode] 'cross' or 'isolated', for spot margin trading
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch an order in a portfolio margin account
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrder (id: string, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const defaultType = this.safeString2 (this.options, 'fetchOrder', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('fetchOrder', params);
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchOrder', 'papi', 'portfolioMargin', false);
        const request: Dict = {
            'symbol': market['id'],
        };
        const clientOrderId = this.safeString2 (params, 'origClientOrderId', 'clientOrderId');
        if (clientOrderId !== undefined) {
            if (market['option']) {
                request['clientOrderId'] = clientOrderId;
            } else {
                request['origClientOrderId'] = clientOrderId;
            }
        } else {
            request['orderId'] = id;
        }
        params = this.omit (params, [ 'type', 'clientOrderId', 'origClientOrderId' ]);
        let response = undefined;
        if (market['option']) {
            response = await this.eapiPrivateGetOrder (this.extend (request, params));
        } else if (market['linear']) {
            if (isPortfolioMargin) {
                response = await this.papiGetUmOrder (this.extend (request, params));
            } else {
                response = await this.fapiPrivateGetOrder (this.extend (request, params));
            }
        } else if (market['inverse']) {
            if (isPortfolioMargin) {
                response = await this.papiGetCmOrder (this.extend (request, params));
            } else {
                response = await this.dapiPrivateGetOrder (this.extend (request, params));
            }
        } else if ((type === 'margin') || (marginMode !== undefined) || isPortfolioMargin) {
            if (isPortfolioMargin) {
                response = await this.papiGetMarginOrder (this.extend (request, params));
            } else {
                if (marginMode === 'isolated') {
                    request['isIsolated'] = true;
                }
                response = await this.sapiGetMarginOrder (this.extend (request, params));
            }
        } else {
            response = await this.privateGetOrder (this.extend (request, params));
        }
        return this.parseOrder (response, market);
    }

    /**
     * @method
     * @name binance#fetchOrders
     * @description fetches information on multiple orders made by the user
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#all-orders-user_data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/All-Orders
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/All-Orders
     * @see https://developers.binance.com/docs/derivatives/option/trade/Query-Option-Order-History
     * @see https://developers.binance.com/docs/margin_trading/trade/Query-Margin-Account-All-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-CM-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-CM-Conditional-Orders
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.marginMode] 'cross' or 'isolated', for spot margin trading
     * @param {int} [params.until] the latest time in ms to fetch orders for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch orders in a portfolio margin account
     * @param {boolean} [params.stop] set to true if you would like to fetch portfolio margin account stop or conditional orders
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchOrders', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchOrders', symbol, since, limit, params) as Order[];
        }
        const market = this.market (symbol);
        const defaultType = this.safeString2 (this.options, 'fetchOrders', 'defaultType', market['type']);
        const type = this.safeString (params, 'type', defaultType);
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('fetchOrders', params);
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchOrders', 'papi', 'portfolioMargin', false);
        const isConditional = this.safeBoolN (params, [ 'stop', 'trigger', 'conditional' ]);
        params = this.omit (params, [ 'stop', 'trigger', 'conditional', 'type' ]);
        let request: Dict = {
            'symbol': market['id'],
        };
        [ request, params ] = this.handleUntilOption ('endTime', request, params);
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let response = undefined;
        if (market['option']) {
            response = await this.eapiPrivateGetHistoryOrders (this.extend (request, params));
        } else if (market['linear']) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiGetUmConditionalAllOrders (this.extend (request, params));
                } else {
                    response = await this.papiGetUmAllOrders (this.extend (request, params));
                }
            } else {
                response = await this.fapiPrivateGetAllOrders (this.extend (request, params));
            }
        } else if (market['inverse']) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiGetCmConditionalAllOrders (this.extend (request, params));
                } else {
                    response = await this.papiGetCmAllOrders (this.extend (request, params));
                }
            } else {
                response = await this.dapiPrivateGetAllOrders (this.extend (request, params));
            }
        } else {
            if (isPortfolioMargin) {
                response = await this.papiGetMarginAllOrders (this.extend (request, params));
            } else if (type === 'margin' || marginMode !== undefined) {
                if (marginMode === 'isolated') {
                    request['isIsolated'] = true;
                }
                response = await this.sapiGetMarginAllOrders (this.extend (request, params));
            } else {
                response = await this.privateGetAllOrders (this.extend (request, params));
            }
        }
        //
        //  spot
        //
        //     [
        //         {
        //             "symbol": "LTCBTC",
        //             "orderId": 1,
        //             "clientOrderId": "myOrder1",
        //             "price": "0.1",
        //             "origQty": "1.0",
        //             "executedQty": "0.0",
        //             "cummulativeQuoteQty": "0.0",
        //             "status": "NEW",
        //             "timeInForce": "GTC",
        //             "type": "LIMIT",
        //             "side": "BUY",
        //             "stopPrice": "0.0",
        //             "icebergQty": "0.0",
        //             "time": 1499827319559,
        //             "updateTime": 1499827319559,
        //             "isWorking": true
        //         }
        //     ]
        //
        //  futures
        //
        //     [
        //         {
        //             "symbol": "BTCUSDT",
        //             "orderId": 1,
        //             "clientOrderId": "myOrder1",
        //             "price": "0.1",
        //             "origQty": "1.0",
        //             "executedQty": "1.0",
        //             "cumQuote": "10.0",
        //             "status": "NEW",
        //             "timeInForce": "GTC",
        //             "type": "LIMIT",
        //             "side": "BUY",
        //             "stopPrice": "0.0",
        //             "updateTime": 1499827319559
        //         }
        //     ]
        //
        // options
        //
        //     [
        //         {
        //             "orderId": 4728833085436977152,
        //             "symbol": "ETH-230211-1500-C",
        //             "price": "10.0",
        //             "quantity": "1.00",
        //             "executedQty": "0.00",
        //             "fee": "0",
        //             "side": "BUY",
        //             "type": "LIMIT",
        //             "timeInForce": "GTC",
        //             "reduceOnly": false,
        //             "postOnly": false,
        //             "createTime": 1676083034462,
        //             "updateTime": 1676083034462,
        //             "status": "ACCEPTED",
        //             "avgPrice": "0",
        //             "source": "API",
        //             "clientOrderId": "",
        //             "priceScale": 1,
        //             "quantityScale": 2,
        //             "optionSide": "CALL",
        //             "quoteAsset": "USDT",
        //             "lastTrade": {"id":"69","time":"1676084430567","price":"24.9","qty":"1.00"},
        //             "mmp": false
        //         }
        //     ]
        //
        // inverse portfolio margin
        //
        //     [
        //         {
        //             "orderId": 71328442983,
        //             "symbol": "ETHUSD_PERP",
        //             "pair": "ETHUSD",
        //             "status": "CANCELED",
        //             "clientOrderId": "x-xcKtGhcu4b3e3d8515dd4dc5ba9ccc",
        //             "price": "2000",
        //             "avgPrice": "0.00",
        //             "origQty": "1",
        //             "executedQty": "0",
        //             "cumBase": "0",
        //             "timeInForce": "GTC",
        //             "type": "LIMIT",
        //             "reduceOnly": false,
        //             "side": "BUY",
        //             "origType": "LIMIT",
        //             "time": 1707197843046,
        //             "updateTime": 1707197941373,
        //             "positionSide": "BOTH"
        //         },
        //     ]
        //
        // linear portfolio margin
        //
        //     [
        //         {
        //             "orderId": 259235347005,
        //             "symbol": "BTCUSDT",
        //             "status": "CANCELED",
        //             "clientOrderId": "x-xcKtGhcu402881c9103f42bdb4183b",
        //             "price": "35000",
        //             "avgPrice": "0.00000",
        //             "origQty": "0.010",
        //             "executedQty": "0",
        //             "cumQuote": "0",
        //             "timeInForce": "GTC",
        //             "type": "LIMIT",
        //             "reduceOnly": false,
        //             "side": "BUY",
        //             "origType": "LIMIT",
        //             "time": 1707194702167,
        //             "updateTime": 1707197804748,
        //             "positionSide": "BOTH",
        //             "selfTradePreventionMode": "NONE",
        //             "goodTillDate": 0
        //         },
        //     ]
        //
        // conditional portfolio margin
        //
        //     [
        //         {
        //             "newClientStrategyId": "x-xcKtGhcuaf166172ed504cd1bc0396",
        //             "strategyId": 3733211,
        //             "strategyStatus": "CANCELLED",
        //             "strategyType": "STOP",
        //             "origQty": "0.010",
        //             "price": "35000",
        //             "orderId": 0,
        //             "reduceOnly": false,
        //             "side": "BUY",
        //             "positionSide": "BOTH",
        //             "stopPrice": "50000",
        //             "symbol": "BTCUSDT",
        //             "type": "LIMIT",
        //             "bookTime": 1707270098774,
        //             "updateTime": 1707270119261,
        //             "timeInForce": "GTC",
        //             "triggerTime": 0,
        //             "workingType": "CONTRACT_PRICE",
        //             "priceProtect": false,
        //             "goodTillDate": 0,
        //             "selfTradePreventionMode": "NONE"
        //         },
        //     ]
        //
        // spot margin portfolio margin
        //
        //     [
        //         {
        //             "symbol": "BTCUSDT",
        //             "orderId": 24684460474,
        //             "clientOrderId": "x-R4BD3S82e9ef29d8346440f0b28b86",
        //             "price": "35000.00000000",
        //             "origQty": "0.00100000",
        //             "executedQty": "0.00000000",
        //             "cummulativeQuoteQty": "0.00000000",
        //             "status": "CANCELED",
        //             "timeInForce": "GTC",
        //             "type": "LIMIT",
        //             "side": "BUY",
        //             "stopPrice": "0.00000000",
        //             "icebergQty": "0.00000000",
        //             "time": 1707113538870,
        //             "updateTime": 1707113797688,
        //             "isWorking": true,
        //             "accountId": 200180970,
        //             "selfTradePreventionMode": "EXPIRE_MAKER",
        //             "preventedMatchId": null,
        //             "preventedQuantity": null
        //         },
        //     ]
        //
        return this.parseOrders (response, market, since, limit);
    }

    /**
     * @method
     * @name binance#fetchOpenOrders
     * @description fetch all unfilled currently open orders
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#current-open-orders-user_data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Current-All-Open-Orders
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Current-All-Open-Orders
     * @see https://developers.binance.com/docs/derivatives/option/trade/Query-Current-Open-Option-Orders
     * @see https://developers.binance.com/docs/margin_trading/trade/Query-Margin-Account-Open-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-UM-Open-Conditional-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-CM-Open-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-Current-CM-Open-Conditional-Orders
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch open orders for
     * @param {int} [limit] the maximum number of open orders structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.marginMode] 'cross' or 'isolated', for spot margin trading
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch open orders in the portfolio margin account
     * @param {boolean} [params.stop] set to true if you would like to fetch portfolio margin account conditional orders
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        await this.loadMarkets ();
        let market = undefined;
        let type = undefined;
        const request: Dict = {};
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('fetchOpenOrders', params);
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchOpenOrders', 'papi', 'portfolioMargin', false);
        const isConditional = this.safeBoolN (params, [ 'stop', 'trigger', 'conditional' ]);
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
            const defaultType = this.safeString2 (this.options, 'fetchOpenOrders', 'defaultType', 'spot');
            const marketType = ('type' in market) ? market['type'] : defaultType;
            type = this.safeString (params, 'type', marketType);
        } else if (this.options['warnOnFetchOpenOrdersWithoutSymbol']) {
            throw new ExchangeError (this.id + ' fetchOpenOrders() WARNING: fetching open orders without specifying a symbol has stricter rate limits (10 times more for spot, 40 times more for other markets) compared to requesting with symbol argument. To acknowledge this warning, set ' + this.id + '.options["warnOnFetchOpenOrdersWithoutSymbol"] = false to suppress this warning message.');
        } else {
            const defaultType = this.safeString2 (this.options, 'fetchOpenOrders', 'defaultType', 'spot');
            type = this.safeString (params, 'type', defaultType);
        }
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchOpenOrders', market, params);
        params = this.omit (params, [ 'type', 'stop', 'trigger', 'conditional' ]);
        let response = undefined;
        if (type === 'option') {
            if (since !== undefined) {
                request['startTime'] = since;
            }
            if (limit !== undefined) {
                request['limit'] = limit;
            }
            response = await this.eapiPrivateGetOpenOrders (this.extend (request, params));
        } else if (this.isLinear (type, subType)) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiGetUmConditionalOpenOrders (this.extend (request, params));
                } else {
                    response = await this.papiGetUmOpenOrders (this.extend (request, params));
                }
            } else {
                response = await this.fapiPrivateGetOpenOrders (this.extend (request, params));
            }
        } else if (this.isInverse (type, subType)) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiGetCmConditionalOpenOrders (this.extend (request, params));
                } else {
                    response = await this.papiGetCmOpenOrders (this.extend (request, params));
                }
            } else {
                response = await this.dapiPrivateGetOpenOrders (this.extend (request, params));
            }
        } else if (type === 'margin' || marginMode !== undefined || isPortfolioMargin) {
            if (isPortfolioMargin) {
                response = await this.papiGetMarginOpenOrders (this.extend (request, params));
            } else {
                if (marginMode === 'isolated') {
                    request['isIsolated'] = true;
                    if (symbol === undefined) {
                        throw new ArgumentsRequired (this.id + ' fetchOpenOrders() requires a symbol argument for isolated markets');
                    }
                }
                response = await this.sapiGetMarginOpenOrders (this.extend (request, params));
            }
        } else {
            response = await this.privateGetOpenOrders (this.extend (request, params));
        }
        return this.parseOrders (response, market, since, limit);
    }

    /**
     * @method
     * @name binance#fetchOpenOrder
     * @description fetch an open order by the id
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Query-Current-Open-Order
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Query-Current-Open-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-UM-Open-Conditional-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Current-CM-Open-Conditional-Order
     * @param {string} id order id
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.trigger] set to true if you would like to fetch portfolio margin account stop or conditional orders
     * @returns {object} an [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchOpenOrder (id: string, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOpenOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchOpenOrder', 'papi', 'portfolioMargin', false);
        const isConditional = this.safeBoolN (params, [ 'stop', 'trigger', 'conditional' ]);
        params = this.omit (params, [ 'stop', 'trigger', 'conditional' ]);
        const isPortfolioMarginConditional = (isPortfolioMargin && isConditional);
        const orderIdRequest = isPortfolioMarginConditional ? 'strategyId' : 'orderId';
        request[orderIdRequest] = id;
        let response = undefined;
        if (market['linear']) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiGetUmConditionalOpenOrder (this.extend (request, params));
                } else {
                    response = await this.papiGetUmOpenOrder (this.extend (request, params));
                }
            } else {
                response = await this.fapiPrivateGetOpenOrder (this.extend (request, params));
            }
        } else if (market['inverse']) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiGetCmConditionalOpenOrder (this.extend (request, params));
                } else {
                    response = await this.papiGetCmOpenOrder (this.extend (request, params));
                }
            } else {
                response = await this.dapiPrivateGetOpenOrder (this.extend (request, params));
            }
        } else {
            if (market['option']) {
                throw new NotSupported (this.id + ' fetchOpenOrder() does not support option markets');
            } else if (market['spot']) {
                throw new NotSupported (this.id + ' fetchOpenOrder() does not support spot markets');
            }
        }
        //
        // linear swap
        //
        //     {
        //         "orderId": 3697213934,
        //         "symbol": "BTCUSDT",
        //         "status": "NEW",
        //         "clientOrderId": "x-xcKtGhcufb20c5a7761a4aa09aa156",
        //         "price": "33000.00",
        //         "avgPrice": "0.00000",
        //         "origQty": "0.010",
        //         "executedQty": "0.000",
        //         "cumQuote": "0.00000",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "closePosition": false,
        //         "side": "BUY",
        //         "positionSide": "BOTH",
        //         "stopPrice": "0.00",
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "origType": "LIMIT",
        //         "priceMatch": "NONE",
        //         "selfTradePreventionMode": "NONE",
        //         "goodTillDate": 0,
        //         "time": 1707892893502,
        //         "updateTime": 1707892893515
        //     }
        //
        // inverse swap
        //
        //     {
        //         "orderId": 597368542,
        //         "symbol": "BTCUSD_PERP",
        //         "pair": "BTCUSD",
        //         "status": "NEW",
        //         "clientOrderId": "x-xcKtGhcubbde7ba93b1a4ab881eff3",
        //         "price": "35000",
        //         "avgPrice": "0",
        //         "origQty": "1",
        //         "executedQty": "0",
        //         "cumBase": "0",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "closePosition": false,
        //         "side": "BUY",
        //         "positionSide": "BOTH",
        //         "stopPrice": "0",
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "origType": "LIMIT",
        //         "time": 1707893453199,
        //         "updateTime": 1707893453199
        //     }
        //
        // linear portfolio margin
        //
        //     {
        //         "orderId": 264895013409,
        //         "symbol": "BTCUSDT",
        //         "status": "NEW",
        //         "clientOrderId": "x-xcKtGhcu6278f1adbdf14f74ab432e",
        //         "price": "35000",
        //         "avgPrice": "0",
        //         "origQty": "0.010",
        //         "executedQty": "0",
        //         "cumQuote": "0",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "LONG",
        //         "origType": "LIMIT",
        //         "time": 1707893839364,
        //         "updateTime": 1707893839364,
        //         "goodTillDate": 0,
        //         "selfTradePreventionMode": "NONE"
        //     }
        //
        // inverse portfolio margin
        //
        //     {
        //         "orderId": 71790316950,
        //         "symbol": "ETHUSD_PERP",
        //         "pair": "ETHUSD",
        //         "status": "NEW",
        //         "clientOrderId": "x-xcKtGhcuec11030474204ab08ba2c2",
        //         "price": "2500",
        //         "avgPrice": "0",
        //         "origQty": "1",
        //         "executedQty": "0",
        //         "cumBase": "0",
        //         "timeInForce": "GTC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "LONG",
        //         "origType": "LIMIT",
        //         "time": 1707894181694,
        //         "updateTime": 1707894181694
        //     }
        //
        // linear portfolio margin conditional
        //
        //     {
        //         "newClientStrategyId": "x-xcKtGhcu2205fde44418483ca21874",
        //         "strategyId": 4084339,
        //         "strategyStatus": "NEW",
        //         "strategyType": "STOP",
        //         "origQty": "0.010",
        //         "price": "35000",
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "LONG",
        //         "stopPrice": "60000",
        //         "symbol": "BTCUSDT",
        //         "bookTime": 1707894490094,
        //         "updateTime": 1707894490094,
        //         "timeInForce": "GTC",
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "goodTillDate": 0,
        //         "selfTradePreventionMode": "NONE"
        //     }
        //
        // inverse portfolio margin conditional
        //
        //     {
        //         "newClientStrategyId": "x-xcKtGhcu2da9c765294b433994ffce",
        //         "strategyId": 1423501,
        //         "strategyStatus": "NEW",
        //         "strategyType": "STOP",
        //         "origQty": "1",
        //         "price": "2500",
        //         "reduceOnly": false,
        //         "side": "BUY",
        //         "positionSide": "LONG",
        //         "stopPrice": "4000",
        //         "symbol": "ETHUSD_PERP",
        //         "bookTime": 1707894782679,
        //         "updateTime": 1707894782679,
        //         "timeInForce": "GTC",
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false
        //     }
        //
        return this.parseOrder (response, market);
    }

    /**
     * @method
     * @name binance#fetchClosedOrders
     * @description fetches information on multiple closed orders made by the user
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#all-orders-user_data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/All-Orders
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/All-Orders
     * @see https://developers.binance.com/docs/derivatives/option/trade/Query-Option-Order-History
     * @see https://developers.binance.com/docs/margin_trading/trade/Query-Margin-Account-All-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-CM-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-CM-Conditional-Orders
     * @param {string} symbol unified market symbol of the market orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch orders in a portfolio margin account
     * @param {boolean} [params.stop] set to true if you would like to fetch portfolio margin account stop or conditional orders
     * @returns {Order[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchClosedOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchClosedOrders() requires a symbol argument');
        }
        const orders = await this.fetchOrders (symbol, since, undefined, params);
        const filteredOrders = this.filterBy (orders, 'status', 'closed');
        return this.filterBySinceLimit (filteredOrders, since, limit);
    }

    /**
     * @method
     * @name binance#fetchCanceledOrders
     * @description fetches information on multiple canceled orders made by the user
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#all-orders-user_data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/All-Orders
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/All-Orders
     * @see https://developers.binance.com/docs/derivatives/option/trade/Query-Option-Order-History
     * @see https://developers.binance.com/docs/margin_trading/trade/Query-Margin-Account-All-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-CM-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-CM-Conditional-Orders
     * @param {string} symbol unified market symbol of the market the orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch orders in a portfolio margin account
     * @param {boolean} [params.stop] set to true if you would like to fetch portfolio margin account stop or conditional orders
     * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchCanceledOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchCanceledOrders() requires a symbol argument');
        }
        const orders = await this.fetchOrders (symbol, since, undefined, params);
        const filteredOrders = this.filterBy (orders, 'status', 'canceled');
        return this.filterBySinceLimit (filteredOrders, since, limit);
    }

    /**
     * @method
     * @name binance#fetchCanceledAndClosedOrders
     * @description fetches information on multiple canceled orders made by the user
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#all-orders-user_data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/All-Orders
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/All-Orders
     * @see https://developers.binance.com/docs/derivatives/option/trade/Query-Option-Order-History
     * @see https://developers.binance.com/docs/margin_trading/trade/Query-Margin-Account-All-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-CM-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-UM-Conditional-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-All-CM-Conditional-Orders
     * @param {string} symbol unified market symbol of the market the orders were made in
     * @param {int} [since] the earliest time in ms to fetch orders for
     * @param {int} [limit] the maximum number of order structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch orders in a portfolio margin account
     * @param {boolean} [params.stop] set to true if you would like to fetch portfolio margin account stop or conditional orders
     * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async fetchCanceledAndClosedOrders (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Order[]> {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchCanceledAndClosedOrders() requires a symbol argument');
        }
        const orders = await this.fetchOrders (symbol, since, undefined, params);
        const canceledOrders = this.filterBy (orders, 'status', 'canceled');
        const closedOrders = this.filterBy (orders, 'status', 'closed');
        const filteredOrders = this.arrayConcat (canceledOrders, closedOrders);
        const sortedOrders = this.sortBy (filteredOrders, 'timestamp');
        return this.filterBySinceLimit (sortedOrders, since, limit);
    }

    /**
     * @method
     * @name binance#cancelOrder
     * @description cancels an open order
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#cancel-order-trade
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Order
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Cancel-Order
     * @see https://developers.binance.com/docs/derivatives/option/trade/Cancel-Option-Order
     * @see https://developers.binance.com/docs/margin_trading/trade/Margin-Account-Cancel-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-UM-Conditional-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-CM-Conditional-Order
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-Order
     * @param {string} id order id
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.portfolioMargin] set to true if you would like to cancel an order in a portfolio margin account
     * @param {boolean} [params.stop] set to true if you would like to cancel a portfolio margin account conditional order
     * @returns {object} An [order structure]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrder (id: string, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrder() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const defaultType = this.safeString2 (this.options, 'cancelOrder', 'defaultType', 'spot');
        const type = this.safeString (params, 'type', defaultType);
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('cancelOrder', params);
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'cancelOrder', 'papi', 'portfolioMargin', false);
        const isConditional = this.safeBoolN (params, [ 'stop', 'trigger', 'conditional' ]);
        const request: Dict = {
            'symbol': market['id'],
        };
        const clientOrderId = this.safeStringN (params, [ 'origClientOrderId', 'clientOrderId', 'newClientStrategyId' ]);
        if (clientOrderId !== undefined) {
            if (market['option']) {
                request['clientOrderId'] = clientOrderId;
            } else {
                if (isPortfolioMargin && isConditional) {
                    request['newClientStrategyId'] = clientOrderId;
                } else {
                    request['origClientOrderId'] = clientOrderId;
                }
            }
        } else {
            if (isPortfolioMargin && isConditional) {
                request['strategyId'] = id;
            } else {
                request['orderId'] = id;
            }
        }
        params = this.omit (params, [ 'type', 'origClientOrderId', 'clientOrderId', 'newClientStrategyId', 'stop', 'trigger', 'conditional' ]);
        let response = undefined;
        if (market['option']) {
            response = await this.eapiPrivateDeleteOrder (this.extend (request, params));
        } else if (market['linear']) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiDeleteUmConditionalOrder (this.extend (request, params));
                } else {
                    response = await this.papiDeleteUmOrder (this.extend (request, params));
                }
            } else {
                response = await this.fapiPrivateDeleteOrder (this.extend (request, params));
            }
        } else if (market['inverse']) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiDeleteCmConditionalOrder (this.extend (request, params));
                } else {
                    response = await this.papiDeleteCmOrder (this.extend (request, params));
                }
            } else {
                response = await this.dapiPrivateDeleteOrder (this.extend (request, params));
            }
        } else if ((type === 'margin') || (marginMode !== undefined) || isPortfolioMargin) {
            if (isPortfolioMargin) {
                response = await this.papiDeleteMarginOrder (this.extend (request, params));
            } else {
                if (marginMode === 'isolated') {
                    request['isIsolated'] = true;
                }
                response = await this.sapiDeleteMarginOrder (this.extend (request, params));
            }
        } else {
            response = await this.privateDeleteOrder (this.extend (request, params));
        }
        return this.parseOrder (response, market);
    }

    /**
     * @method
     * @name binance#cancelAllOrders
     * @description cancel all open orders in a market
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#cancel-all-open-orders-on-a-symbol-trade
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-All-Open-Orders
     * @see https://developers.binance.com/docs/derivatives/option/trade/Cancel-all-Option-orders-on-specific-symbol
     * @see https://developers.binance.com/docs/margin_trading/trade/Margin-Account-Cancel-All-Open-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-All-UM-Open-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-All-UM-Open-Conditional-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-All-CM-Open-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-All-CM-Open-Conditional-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Cancel-Margin-Account-All-Open-Orders-on-a-Symbol
     * @param {string} symbol unified market symbol of the market to cancel orders in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.marginMode] 'cross' or 'isolated', for spot margin trading
     * @param {boolean} [params.portfolioMargin] set to true if you would like to cancel orders in a portfolio margin account
     * @param {boolean} [params.stop] set to true if you would like to cancel portfolio margin account conditional orders
     * @returns {object[]} a list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelAllOrders (symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelAllOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'cancelAllOrders', 'papi', 'portfolioMargin', false);
        const isConditional = this.safeBoolN (params, [ 'stop', 'trigger', 'conditional' ]);
        const type = this.safeString (params, 'type', market['type']);
        params = this.omit (params, [ 'type', 'stop', 'trigger', 'conditional' ]);
        let marginMode = undefined;
        [ marginMode, params ] = this.handleMarginModeAndParams ('cancelAllOrders', params);
        let response = undefined;
        if (market['option']) {
            response = await this.eapiPrivateDeleteAllOpenOrders (this.extend (request, params));
            //
            //    {
            //        "code": 0,
            //        "msg": "success"
            //    }
            //
        } else if (market['linear']) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiDeleteUmConditionalAllOpenOrders (this.extend (request, params));
                    //
                    //    {
                    //        "code": "200",
                    //        "msg": "The operation of cancel all conditional open order is done."
                    //    }
                    //
                } else {
                    response = await this.papiDeleteUmAllOpenOrders (this.extend (request, params));
                    //
                    //    {
                    //        "code": 200,
                    //        "msg": "The operation of cancel all open order is done."
                    //    }
                    //
                }
            } else {
                response = await this.fapiPrivateDeleteAllOpenOrders (this.extend (request, params));
                //
                //    {
                //        "code": 200,
                //        "msg": "The operation of cancel all open order is done."
                //    }
                //
            }
        } else if (market['inverse']) {
            if (isPortfolioMargin) {
                if (isConditional) {
                    response = await this.papiDeleteCmConditionalAllOpenOrders (this.extend (request, params));
                    //
                    //    {
                    //        "code": "200",
                    //        "msg": "The operation of cancel all conditional open order is done."
                    //    }
                    //
                } else {
                    response = await this.papiDeleteCmAllOpenOrders (this.extend (request, params));
                    //
                    //    {
                    //        "code": 200,
                    //        "msg": "The operation of cancel all open order is done."
                    //    }
                    //
                }
            } else {
                response = await this.dapiPrivateDeleteAllOpenOrders (this.extend (request, params));
                //
                //    {
                //        "code": 200,
                //        "msg": "The operation of cancel all open order is done."
                //    }
                //
            }
        } else if ((type === 'margin') || (marginMode !== undefined) || isPortfolioMargin) {
            if (isPortfolioMargin) {
                response = await this.papiDeleteMarginAllOpenOrders (this.extend (request, params));
            } else {
                if (marginMode === 'isolated') {
                    request['isIsolated'] = true;
                }
                response = await this.sapiDeleteMarginOpenOrders (this.extend (request, params));
                //
                //    [
                //        {
                //          "symbol": "BTCUSDT",
                //          "isIsolated": true,       // if isolated margin
                //          "origClientOrderId": "E6APeyTJvkMvLMYMqu1KQ4",
                //          "orderId": 11,
                //          "orderListId": -1,
                //          "clientOrderId": "pXLV6Hz6mprAcVYpVMTGgx",
                //          "price": "0.089853",
                //          "origQty": "0.178622",
                //          "executedQty": "0.000000",
                //          "cummulativeQuoteQty": "0.000000",
                //          "status": "CANCELED",
                //          "timeInForce": "GTC",
                //          "type": "LIMIT",
                //          "side": "BUY",
                //          "selfTradePreventionMode": "NONE"
                //        },
                //        ...
                //    ]
                //
            }
        } else {
            response = await this.privateDeleteOpenOrders (this.extend (request, params));
            //
            //    [
            //        {
            //            "symbol": "ADAUSDT",
            //            "origClientOrderId": "x-R4BD3S82662cde7a90114475b86e21",
            //            "orderId": 3935107,
            //            "orderListId": -1,
            //            "clientOrderId": "bqM2w1oTlugfRAjnTIFBE8",
            //            "transactTime": 1720589016657,
            //            "price": "0.35000000",
            //            "origQty": "30.00000000",
            //            "executedQty": "0.00000000",
            //            "cummulativeQuoteQty": "0.00000000",
            //            "status": "CANCELED",
            //            "timeInForce": "GTC",
            //            "type": "LIMIT",
            //            "side": "BUY",
            //            "selfTradePreventionMode": "EXPIRE_MAKER"
            //        }
            //    ]
            //
        }
        if (Array.isArray (response)) {
            return this.parseOrders (response, market);
        } else {
            return [
                this.safeOrder ({
                    'info': response,
                }),
            ];
        }
    }

    /**
     * @method
     * @name binance#cancelOrders
     * @description cancel multiple orders
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Cancel-Multiple-Orders
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Cancel-Multiple-Orders
     * @param {string[]} ids order ids
     * @param {string} [symbol] unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     *
     * EXCHANGE SPECIFIC PARAMETERS
     * @param {string[]} [params.origClientOrderIdList] max length 10 e.g. ["my_id_1","my_id_2"], encode the double quotes. No space after comma
     * @param {int[]} [params.recvWindow]
     * @returns {object} an list of [order structures]{@link https://docs.ccxt.com/#/?id=order-structure}
     */
    async cancelOrders (ids:string[], symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' cancelOrders() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['contract']) {
            throw new BadRequest (this.id + ' cancelOrders is only supported for swap markets.');
        }
        const request: Dict = {
            'symbol': market['id'],
            'orderidlist': ids,
        };
        let response = undefined;
        if (market['linear']) {
            response = await this.fapiPrivateDeleteBatchOrders (this.extend (request, params));
        } else if (market['inverse']) {
            response = await this.dapiPrivateDeleteBatchOrders (this.extend (request, params));
        }
        //
        //    [
        //        {
        //            "clientOrderId": "myOrder1",
        //            "cumQty": "0",
        //            "cumQuote": "0",
        //            "executedQty": "0",
        //            "orderId": 283194212,
        //            "origQty": "11",
        //            "origType": "TRAILING_STOP_MARKET",
        //            "price": "0",
        //            "reduceOnly": false,
        //            "side": "BUY",
        //            "positionSide": "SHORT",
        //            "status": "CANCELED",
        //            "stopPrice": "9300",                  // please ignore when order type is TRAILING_STOP_MARKET
        //            "closePosition": false,               // if Close-All
        //            "symbol": "BTCUSDT",
        //            "timeInForce": "GTC",
        //            "type": "TRAILING_STOP_MARKET",
        //            "activatePrice": "9020",              // activation price, only return with TRAILING_STOP_MARKET order
        //            "priceRate": "0.3",                   // callback rate, only return with TRAILING_STOP_MARKET order
        //            "updateTime": 1571110484038,
        //            "workingType": "CONTRACT_PRICE",
        //            "priceProtect": false,                // if conditional order trigger is protected
        //            "priceMatch": "NONE",                 // price match mode
        //            "selfTradePreventionMode": "NONE",    // self trading preventation mode
        //            "goodTillDate": 0                     // order pre-set auot cancel time for TIF GTD order
        //        },
        //        {
        //            "code": -2011,
        //            "msg": "Unknown order sent."
        //        }
        //    ]
        //
        return this.parseOrders (response, market);
    }

    /**
     * @method
     * @name binance#fetchOrderTrades
     * @description fetch all the trades made from a single order
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#account-trade-list-user_data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Account-Trade-List
     * @see https://developers.binance.com/docs/margin_trading/trade/Query-Margin-Account-Trade-List
     * @param {string} id order id
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchOrderTrades (id: string, symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchOrderTrades() requires a symbol argument');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const type = this.safeString (params, 'type', market['type']);
        params = this.omit (params, 'type');
        if (type !== 'spot') {
            throw new NotSupported (this.id + ' fetchOrderTrades() supports spot markets only');
        }
        const request: Dict = {
            'orderId': id,
        };
        return await this.fetchMyTrades (symbol, since, limit, this.extend (request, params));
    }

    /**
     * @method
     * @name binance#fetchMyTrades
     * @description fetch all trades made by the user
     * @see https://developers.binance.com/docs/binance-spot-api-docs/rest-api#account-trade-list-user_data
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Account-Trade-List
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Account-Trade-List
     * @see https://developers.binance.com/docs/margin_trading/trade/Query-Margin-Account-Trade-List
     * @see https://developers.binance.com/docs/derivatives/option/trade/Account-Trade-List
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/UM-Account-Trade-List
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/CM-Account-Trade-List
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch trades for
     * @param {int} [limit] the maximum number of trades structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {int} [params.until] the latest time in ms to fetch entries for
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch trades for a portfolio margin account
     * @returns {Trade[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchMyTrades', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchMyTrades', symbol, since, limit, params) as Trade[];
        }
        const request: Dict = {};
        let market = undefined;
        let type = undefined;
        let marginMode = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        [ type, params ] = this.handleMarketTypeAndParams ('fetchMyTrades', market, params);
        let endTime = this.safeInteger2 (params, 'until', 'endTime');
        if (since !== undefined) {
            const startTime = since;
            request['startTime'] = startTime;
            // If startTime and endTime are both not sent, then the last 7 days' data will be returned.
            // The time between startTime and endTime cannot be longer than 7 days.
            // The parameter fromId cannot be sent with startTime or endTime.
            const currentTimestamp = this.milliseconds ();
            const oneWeek = 7 * 24 * 60 * 60 * 1000;
            if ((currentTimestamp - startTime) >= oneWeek) {
                if ((endTime === undefined) && market['linear']) {
                    endTime = this.sum (startTime, oneWeek);
                    endTime = Math.min (endTime, currentTimestamp);
                }
            }
        }
        if (endTime !== undefined) {
            request['endTime'] = endTime;
            params = this.omit (params, [ 'endTime', 'until' ]);
        }
        if (limit !== undefined) {
            if ((type === 'option') || market['contract']) {
                limit = Math.min (limit, 1000); // above 1000, returns error
            }
            request['limit'] = limit;
        }
        let response = undefined;
        if (type === 'option') {
            response = await this.eapiPrivateGetUserTrades (this.extend (request, params));
        } else {
            if (symbol === undefined) {
                throw new ArgumentsRequired (this.id + ' fetchMyTrades() requires a symbol argument');
            }
            [ marginMode, params ] = this.handleMarginModeAndParams ('fetchMyTrades', params);
            let isPortfolioMargin = undefined;
            [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchMyTrades', 'papi', 'portfolioMargin', false);
            if (type === 'spot' || type === 'margin') {
                if (isPortfolioMargin) {
                    response = await this.papiGetMarginMyTrades (this.extend (request, params));
                } else if ((type === 'margin') || (marginMode !== undefined)) {
                    if (marginMode === 'isolated') {
                        request['isIsolated'] = true;
                    }
                    response = await this.sapiGetMarginMyTrades (this.extend (request, params));
                } else {
                    response = await this.privateGetMyTrades (this.extend (request, params));
                }
            } else if (market['linear']) {
                if (isPortfolioMargin) {
                    response = await this.papiGetUmUserTrades (this.extend (request, params));
                } else {
                    response = await this.fapiPrivateGetUserTrades (this.extend (request, params));
                }
            } else if (market['inverse']) {
                if (isPortfolioMargin) {
                    response = await this.papiGetCmUserTrades (this.extend (request, params));
                } else {
                    response = await this.dapiPrivateGetUserTrades (this.extend (request, params));
                }
            }
        }
        //
        // spot trade
        //
        //     [
        //         {
        //             "symbol": "BNBBTC",
        //             "id": 28457,
        //             "orderId": 100234,
        //             "price": "4.00000100",
        //             "qty": "12.00000000",
        //             "commission": "10.10000000",
        //             "commissionAsset": "BNB",
        //             "time": 1499865549590,
        //             "isBuyer": true,
        //             "isMaker": false,
        //             "isBestMatch": true,
        //         }
        //     ]
        //
        // futures trade
        //
        //     [
        //         {
        //             "accountId": 20,
        //             "buyer": False,
        //             "commission": "-0.07819010",
        //             "commissionAsset": "USDT",
        //             "counterPartyId": 653,
        //             "id": 698759,
        //             "maker": False,
        //             "orderId": 25851813,
        //             "price": "7819.01",
        //             "qty": "0.002",
        //             "quoteQty": "0.01563",
        //             "realizedPnl": "-0.91539999",
        //             "side": "SELL",
        //             "symbol": "BTCUSDT",
        //             "time": 1569514978020
        //         }
        //     ]
        //
        // options (eapi)
        //
        //     [
        //         {
        //             "id": 1125899906844226012,
        //             "tradeId": 73,
        //             "orderId": 4638761100843040768,
        //             "symbol": "ETH-230211-1500-C",
        //             "price": "18.70000000",
        //             "quantity": "-0.57000000",
        //             "fee": "0.17305890",
        //             "realizedProfit": "-3.53400000",
        //             "side": "SELL",
        //             "type": "LIMIT",
        //             "volatility": "0.30000000",
        //             "liquidity": "MAKER",
        //             "time": 1676085216845,
        //             "priceScale": 1,
        //             "quantityScale": 2,
        //             "optionSide": "CALL",
        //             "quoteAsset": "USDT"
        //         }
        //     ]
        //
        // linear portfolio margin
        //
        //     [
        //         {
        //             "symbol": "BTCUSDT",
        //             "id": 4575108247,
        //             "orderId": 261942655610,
        //             "side": "SELL",
        //             "price": "47263.40",
        //             "qty": "0.010",
        //             "realizedPnl": "27.38400000",
        //             "marginAsset": "USDT",
        //             "quoteQty": "472.63",
        //             "commission": "0.18905360",
        //             "commissionAsset": "USDT",
        //             "time": 1707530039409,
        //             "buyer": false,
        //             "maker": false,
        //             "positionSide": "LONG"
        //         }
        //     ]
        //
        // inverse portfolio margin
        //
        //     [
        //         {
        //             "symbol": "ETHUSD_PERP",
        //             "id": 701907838,
        //             "orderId": 71548909034,
        //             "pair": "ETHUSD",
        //             "side": "SELL",
        //             "price": "2498.15",
        //             "qty": "1",
        //             "realizedPnl": "0.00012517",
        //             "marginAsset": "ETH",
        //             "baseQty": "0.00400296",
        //             "commission": "0.00000160",
        //             "commissionAsset": "ETH",
        //             "time": 1707530317519,
        //             "positionSide": "LONG",
        //             "buyer": false,
        //             "maker": false
        //         }
        //     ]
        //
        // spot margin portfolio margin
        //
        //     [
        //         {
        //             "symbol": "ADAUSDT",
        //             "id": 470227543,
        //             "orderId": 4421170947,
        //             "price": "0.53880000",
        //             "qty": "10.00000000",
        //             "quoteQty": "5.38800000",
        //             "commission": "0.00538800",
        //             "commissionAsset": "USDT",
        //             "time": 1707545780522,
        //             "isBuyer": false,
        //             "isMaker": false,
        //             "isBestMatch": true
        //         }
        //     ]
        //
        return this.parseTrades (response, market, since, limit);
    }

    /**
     * @method
     * @name binance#fetchMyDustTrades
     * @description fetch all dust trades made by the user
     * @see https://developers.binance.com/docs/wallet/asset/dust-log
     * @param {string} symbol not used by binance fetchMyDustTrades ()
     * @param {int} [since] the earliest time in ms to fetch my dust trades for
     * @param {int} [limit] the maximum number of dust trades to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.type] 'spot' or 'margin', default spot
     * @returns {object[]} a list of [trade structures]{@link https://docs.ccxt.com/#/?id=trade-structure}
     */
    async fetchMyDustTrades (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        //
        // Binance provides an opportunity to trade insignificant (i.e. non-tradable and non-withdrawable)
        // token leftovers (of any asset) into `BNB` coin which in turn can be used to pay trading fees with it.
        // The corresponding trades history is called the `Dust Log` and can be requested via the following end-point:
        // https://github.com/binance-exchange/binance-official-api-docs/blob/master/wapi-api.md#dustlog-user_data
        //
        await this.loadMarkets ();
        const request: Dict = {};
        if (since !== undefined) {
            request['startTime'] = since;
            request['endTime'] = this.sum (since, 7776000000);
        }
        const accountType = this.safeStringUpper (params, 'type');
        params = this.omit (params, 'type');
        if (accountType !== undefined) {
            request['accountType'] = accountType;
        }
        const response = await this.sapiGetAssetDribblet (this.extend (request, params));
        //     {
        //       "total": "4",
        //       "userAssetDribblets": [
        //         {
        //           "operateTime": "1627575731000",
        //           "totalServiceChargeAmount": "0.00001453",
        //           "totalTransferedAmount": "0.00072693",
        //           "transId": "70899815863",
        //           "userAssetDribbletDetails": [
        //             {
        //               "fromAsset": "LTC",
        //               "amount": "0.000006",
        //               "transferedAmount": "0.00000267",
        //               "serviceChargeAmount": "0.00000005",
        //               "operateTime": "1627575731000",
        //               "transId": "70899815863"
        //             },
        //             {
        //               "fromAsset": "GBP",
        //               "amount": "0.15949157",
        //               "transferedAmount": "0.00072426",
        //               "serviceChargeAmount": "0.00001448",
        //               "operateTime": "1627575731000",
        //               "transId": "70899815863"
        //             }
        //           ]
        //         },
        //       ]
        //     }
        const results = this.safeList (response, 'userAssetDribblets', []);
        const rows = this.safeInteger (response, 'total', 0);
        const data = [];
        for (let i = 0; i < rows; i++) {
            const logs = this.safeList (results[i], 'userAssetDribbletDetails', []);
            for (let j = 0; j < logs.length; j++) {
                logs[j]['isDustTrade'] = true;
                data.push (logs[j]);
            }
        }
        const trades = this.parseTrades (data, undefined, since, limit);
        return this.filterBySinceLimit (trades, since, limit);
    }

    parseDustTrade (trade, market: Market = undefined) {
        //
        //     {
        //       "fromAsset": "USDT",
        //       "amount": "0.009669",
        //       "transferedAmount": "0.00002992",
        //       "serviceChargeAmount": "0.00000059",
        //       "operateTime": "1628076010000",
        //       "transId": "71416578712",
        //       "isDustTrade": true
        //     }
        //
        const orderId = this.safeString (trade, 'transId');
        const timestamp = this.safeInteger (trade, 'operateTime');
        const currencyId = this.safeString (trade, 'fromAsset');
        const tradedCurrency = this.safeCurrencyCode (currencyId);
        const bnb = this.currency ('BNB');
        const earnedCurrency = bnb['code'];
        const applicantSymbol = earnedCurrency + '/' + tradedCurrency;
        let tradedCurrencyIsQuote = false;
        if (applicantSymbol in this.markets) {
            tradedCurrencyIsQuote = true;
        }
        const feeCostString = this.safeString (trade, 'serviceChargeAmount');
        const fee = {
            'currency': earnedCurrency,
            'cost': this.parseNumber (feeCostString),
        };
        let symbol = undefined;
        let amountString = undefined;
        let costString = undefined;
        let side = undefined;
        if (tradedCurrencyIsQuote) {
            symbol = applicantSymbol;
            amountString = this.safeString (trade, 'transferedAmount');
            costString = this.safeString (trade, 'amount');
            side = 'buy';
        } else {
            symbol = tradedCurrency + '/' + earnedCurrency;
            amountString = this.safeString (trade, 'amount');
            costString = this.safeString (trade, 'transferedAmount');
            side = 'sell';
        }
        let priceString = undefined;
        if (costString !== undefined) {
            if (amountString) {
                priceString = Precise.stringDiv (costString, amountString);
            }
        }
        const id = undefined;
        const amount = this.parseNumber (amountString);
        const price = this.parseNumber (priceString);
        const cost = this.parseNumber (costString);
        const type = undefined;
        const takerOrMaker = undefined;
        return {
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'symbol': symbol,
            'order': orderId,
            'type': type,
            'takerOrMaker': takerOrMaker,
            'side': side,
            'amount': amount,
            'price': price,
            'cost': cost,
            'fee': fee,
            'info': trade,
        };
    }

    /**
     * @method
     * @name binance#fetchDeposits
     * @description fetch all deposits made to an account
     * @see https://developers.binance.com/docs/wallet/capital/deposite-history
     * @see https://developers.binance.com/docs/fiat/rest-api/Get-Fiat-Deposit-Withdraw-History
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch deposits for
     * @param {int} [limit] the maximum number of deposits structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {bool} [params.fiat] if true, only fiat deposits will be returned
     * @param {int} [params.until] the latest time in ms to fetch entries for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchDeposits (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchDeposits', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchDeposits', code, since, limit, params);
        }
        let currency = undefined;
        let response = undefined;
        const request: Dict = {};
        const legalMoney = this.safeDict (this.options, 'legalMoney', {});
        const fiatOnly = this.safeBool (params, 'fiat', false);
        params = this.omit (params, 'fiatOnly');
        const until = this.safeInteger (params, 'until');
        params = this.omit (params, 'until');
        if (fiatOnly || (code in legalMoney)) {
            if (code !== undefined) {
                currency = this.currency (code);
            }
            request['transactionType'] = 0;
            if (since !== undefined) {
                request['beginTime'] = since;
            }
            if (until !== undefined) {
                request['endTime'] = until;
            }
            const raw = await this.sapiGetFiatOrders (this.extend (request, params));
            response = this.safeList (raw, 'data', []);
            //     {
            //       "code": "000000",
            //       "message": "success",
            //       "data": [
            //         {
            //           "orderNo": "25ced37075c1470ba8939d0df2316e23",
            //           "fiatCurrency": "EUR",
            //           "indicatedAmount": "15.00",
            //           "amount": "15.00",
            //           "totalFee": "0.00",
            //           "method": "card",
            //           "status": "Failed",
            //           "createTime": 1627501026000,
            //           "updateTime": 1627501027000
            //         }
            //       ],
            //       "total": 1,
            //       "success": true
            //     }
        } else {
            if (code !== undefined) {
                currency = this.currency (code);
                request['coin'] = currency['id'];
            }
            if (since !== undefined) {
                request['startTime'] = since;
                // max 3 months range https://github.com/ccxt/ccxt/issues/6495
                let endTime = this.sum (since, 7776000000);
                if (until !== undefined) {
                    endTime = Math.min (endTime, until);
                }
                request['endTime'] = endTime;
            }
            if (limit !== undefined) {
                request['limit'] = limit;
            }
            response = await this.sapiGetCapitalDepositHisrec (this.extend (request, params));
            //     [
            //       {
            //         "amount": "0.01844487",
            //         "coin": "BCH",
            //         "network": "BCH",
            //         "status": 1,
            //         "address": "1NYxAJhW2281HK1KtJeaENBqHeygA88FzR",
            //         "addressTag": "",
            //         "txId": "bafc5902504d6504a00b7d0306a41154cbf1d1b767ab70f3bc226327362588af",
            //         "insertTime": 1610784980000,
            //         "transferType": 0,
            //         "confirmTimes": "2/2"
            //       },
            //       {
            //         "amount": "4500",
            //         "coin": "USDT",
            //         "network": "BSC",
            //         "status": 1,
            //         "address": "0xc9c923c87347ca0f3451d6d308ce84f691b9f501",
            //         "addressTag": "",
            //         "txId": "Internal transfer 51376627901",
            //         "insertTime": 1618394381000,
            //         "transferType": 1,
            //         "confirmTimes": "1/15"
            //     }
            //   ]
        }
        for (let i = 0; i < response.length; i++) {
            response[i]['type'] = 'deposit';
        }
        return this.parseTransactions (response, currency, since, limit);
    }

    /**
     * @method
     * @name binance#fetchWithdrawals
     * @description fetch all withdrawals made from an account
     * @see https://developers.binance.com/docs/wallet/capital/withdraw-history
     * @see https://developers.binance.com/docs/fiat/rest-api/Get-Fiat-Deposit-Withdraw-History
     * @param {string} code unified currency code
     * @param {int} [since] the earliest time in ms to fetch withdrawals for
     * @param {int} [limit] the maximum number of withdrawals structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {bool} [params.fiat] if true, only fiat withdrawals will be returned
     * @param {int} [params.until] the latest time in ms to fetch withdrawals for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {object[]} a list of [transaction structures]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async fetchWithdrawals (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Transaction[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchWithdrawals', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchWithdrawals', code, since, limit, params);
        }
        const legalMoney = this.safeDict (this.options, 'legalMoney', {});
        const fiatOnly = this.safeBool (params, 'fiat', false);
        params = this.omit (params, 'fiatOnly');
        const request: Dict = {};
        const until = this.safeInteger (params, 'until');
        if (until !== undefined) {
            params = this.omit (params, 'until');
            request['endTime'] = until;
        }
        let response = undefined;
        let currency = undefined;
        if (fiatOnly || (code in legalMoney)) {
            if (code !== undefined) {
                currency = this.currency (code);
            }
            request['transactionType'] = 1;
            if (since !== undefined) {
                request['beginTime'] = since;
            }
            const raw = await this.sapiGetFiatOrders (this.extend (request, params));
            response = this.safeList (raw, 'data', []);
            //     {
            //       "code": "000000",
            //       "message": "success",
            //       "data": [
            //         {
            //           "orderNo": "CJW706452266115170304",
            //           "fiatCurrency": "GBP",
            //           "indicatedAmount": "10001.50",
            //           "amount": "100.00",
            //           "totalFee": "1.50",
            //           "method": "bank transfer",
            //           "status": "Successful",
            //           "createTime": 1620037745000,
            //           "updateTime": 1620038480000
            //         },
            //         {
            //           "orderNo": "CJW706287492781891584",
            //           "fiatCurrency": "GBP",
            //           "indicatedAmount": "10001.50",
            //           "amount": "100.00",
            //           "totalFee": "1.50",
            //           "method": "bank transfer",
            //           "status": "Successful",
            //           "createTime": 1619998460000,
            //           "updateTime": 1619998823000
            //         }
            //       ],
            //       "total": 39,
            //       "success": true
            //     }
        } else {
            if (code !== undefined) {
                currency = this.currency (code);
                request['coin'] = currency['id'];
            }
            if (since !== undefined) {
                request['startTime'] = since;
                // max 3 months range https://github.com/ccxt/ccxt/issues/6495
                request['endTime'] = this.sum (since, 7776000000);
            }
            if (limit !== undefined) {
                request['limit'] = limit;
            }
            response = await this.sapiGetCapitalWithdrawHistory (this.extend (request, params));
            //     [
            //       {
            //         "id": "69e53ad305124b96b43668ceab158a18",
            //         "amount": "28.75",
            //         "transactionFee": "0.25",
            //         "coin": "XRP",
            //         "status": 6,
            //         "address": "r3T75fuLjX51mmfb5Sk1kMNuhBgBPJsjza",
            //         "addressTag": "101286922",
            //         "txId": "19A5B24ED0B697E4F0E9CD09FCB007170A605BC93C9280B9E6379C5E6EF0F65A",
            //         "applyTime": "2021-04-15 12:09:16",
            //         "network": "XRP",
            //         "transferType": 0
            //       },
            //       {
            //         "id": "9a67628b16ba4988ae20d329333f16bc",
            //         "amount": "20",
            //         "transactionFee": "20",
            //         "coin": "USDT",
            //         "status": 6,
            //         "address": "0x0AB991497116f7F5532a4c2f4f7B1784488628e1",
            //         "txId": "0x77fbf2cf2c85b552f0fd31fd2e56dc95c08adae031d96f3717d8b17e1aea3e46",
            //         "applyTime": "2021-04-15 12:06:53",
            //         "network": "ETH",
            //         "transferType": 0
            //       },
            //       {
            //         "id": "a7cdc0afbfa44a48bd225c9ece958fe2",
            //         "amount": "51",
            //         "transactionFee": "1",
            //         "coin": "USDT",
            //         "status": 6,
            //         "address": "TYDmtuWL8bsyjvcauUTerpfYyVhFtBjqyo",
            //         "txId": "168a75112bce6ceb4823c66726ad47620ad332e69fe92d9cb8ceb76023f9a028",
            //         "applyTime": "2021-04-13 12:46:59",
            //         "network": "TRX",
            //         "transferType": 0
            //       }
            //     ]
        }
        for (let i = 0; i < response.length; i++) {
            response[i]['type'] = 'withdrawal';
        }
        return this.parseTransactions (response, currency, since, limit);
    }

    parseTransactionStatusByType (status, type = undefined) {
        if (type === undefined) {
            return status;
        }
        const statusesByType: Dict = {
            'deposit': {
                '0': 'pending',
                '1': 'ok',
                '6': 'ok',
                // Fiat
                // Processing, Failed, Successful, Finished, Refunding, Refunded, Refund Failed, Order Partial credit Stopped
                'Processing': 'pending',
                'Failed': 'failed',
                'Successful': 'ok',
                'Refunding': 'canceled',
                'Refunded': 'canceled',
                'Refund Failed': 'failed',
            },
            'withdrawal': {
                '0': 'pending', // Email Sent
                '1': 'canceled', // Cancelled (different from 1 = ok in deposits)
                '2': 'pending', // Awaiting Approval
                '3': 'failed', // Rejected
                '4': 'pending', // Processing
                '5': 'failed', // Failure
                '6': 'ok', // Completed
                // Fiat
                // Processing, Failed, Successful, Finished, Refunding, Refunded, Refund Failed, Order Partial credit Stopped
                'Processing': 'pending',
                'Failed': 'failed',
                'Successful': 'ok',
                'Refunding': 'canceled',
                'Refunded': 'canceled',
                'Refund Failed': 'failed',
            },
        };
        const statuses = this.safeDict (statusesByType, type, {});
        return this.safeString (statuses, status, status);
    }

    parseTransaction (transaction: Dict, currency: Currency = undefined): Transaction {
        //
        // fetchDeposits
        //
        //     {
        //       "amount": "4500",
        //       "coin": "USDT",
        //       "network": "BSC",
        //       "status": 1,
        //       "address": "0xc9c923c87347ca0f3451d6d308ce84f691b9f501",
        //       "addressTag": "",
        //       "txId": "Internal transfer 51376627901",
        //       "insertTime": 1618394381000,
        //       "transferType": 1,
        //       "confirmTimes": "1/15"
        //     }
        //
        // fetchWithdrawals
        //
        //     {
        //       "id": "69e53ad305124b96b43668ceab158a18",
        //       "amount": "28.75",
        //       "transactionFee": "0.25",
        //       "coin": "XRP",
        //       "status": 6,
        //       "address": "r3T75fuLjX51mmfb5Sk1kMNuhBgBPJsjza",
        //       "addressTag": "101286922",
        //       "txId": "19A5B24ED0B697E4F0E9CD09FCB007170A605BC93C9280B9E6379C5E6EF0F65A",
        //       "applyTime": "2021-04-15 12:09:16",
        //       "network": "XRP",
        //       "transferType": 0
        //     }
        //
        // fiat transaction
        // withdraw
        //     {
        //       "orderNo": "CJW684897551397171200",
        //       "fiatCurrency": "GBP",
        //       "indicatedAmount": "29.99",
        //       "amount": "28.49",
        //       "totalFee": "1.50",
        //       "method": "bank transfer",
        //       "status": "Successful",
        //       "createTime": 1614898701000,
        //       "updateTime": 1614898820000
        //     }
        //
        // deposit
        //     {
        //       "orderNo": "25ced37075c1470ba8939d0df2316e23",
        //       "fiatCurrency": "EUR",
        //       "transactionType": 0,
        //       "indicatedAmount": "15.00",
        //       "amount": "15.00",
        //       "totalFee": "0.00",
        //       "method": "card",
        //       "status": "Failed",
        //       "createTime": "1627501026000",
        //       "updateTime": "1627501027000"
        //     }
        //
        // withdraw
        //
        //    { id: "9a67628b16ba4988ae20d329333f16bc" }
        //
        const id = this.safeString2 (transaction, 'id', 'orderNo');
        const address = this.safeString (transaction, 'address');
        let tag = this.safeString (transaction, 'addressTag'); // set but unused
        if (tag !== undefined) {
            if (tag.length < 1) {
                tag = undefined;
            }
        }
        let txid = this.safeString (transaction, 'txId');
        if ((txid !== undefined) && (txid.indexOf ('Internal transfer ') >= 0)) {
            txid = txid.slice (18);
        }
        const currencyId = this.safeString2 (transaction, 'coin', 'fiatCurrency');
        let code = this.safeCurrencyCode (currencyId, currency);
        let timestamp = undefined;
        timestamp = this.safeInteger2 (transaction, 'insertTime', 'createTime');
        if (timestamp === undefined) {
            timestamp = this.parse8601 (this.safeString (transaction, 'applyTime'));
        }
        const updated = this.safeInteger2 (transaction, 'successTime', 'updateTime');
        let type = this.safeString (transaction, 'type');
        if (type === undefined) {
            const txType = this.safeString (transaction, 'transactionType');
            if (txType !== undefined) {
                type = (txType === '0') ? 'deposit' : 'withdrawal';
            }
            const legalMoneyCurrenciesById = this.safeDict (this.options, 'legalMoneyCurrenciesById');
            code = this.safeString (legalMoneyCurrenciesById, code, code);
        }
        const status = this.parseTransactionStatusByType (this.safeString (transaction, 'status'), type);
        const amount = this.safeNumber (transaction, 'amount');
        const feeCost = this.safeNumber2 (transaction, 'transactionFee', 'totalFee');
        let fee = undefined;
        if (feeCost !== undefined) {
            fee = { 'currency': code, 'cost': feeCost };
        }
        const internalInteger = this.safeInteger (transaction, 'transferType');
        let internal = undefined;
        if (internalInteger !== undefined) {
            internal = internalInteger ? true : false;
        }
        const network = this.safeString (transaction, 'network');
        return {
            'info': transaction,
            'id': id,
            'txid': txid,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'network': network,
            'address': address,
            'addressTo': address,
            'addressFrom': undefined,
            'tag': tag,
            'tagTo': tag,
            'tagFrom': undefined,
            'type': type,
            'amount': amount,
            'currency': code,
            'status': status,
            'updated': updated,
            'internal': internal,
            'comment': undefined,
            'fee': fee,
        } as Transaction;
    }

    parseTransferStatus (status: Str): Str {
        const statuses: Dict = {
            'CONFIRMED': 'ok',
        };
        return this.safeString (statuses, status, status);
    }

    parseTransfer (transfer: Dict, currency: Currency = undefined): TransferEntry {
        //
        // transfer
        //
        //     {
        //         "tranId":13526853623
        //     }
        //
        // fetchTransfers
        //
        //     {
        //         "timestamp": 1614640878000,
        //         "asset": "USDT",
        //         "amount": "25",
        //         "type": "MAIN_UMFUTURE",
        //         "status": "CONFIRMED",
        //         "tranId": 43000126248
        //     }
        //
        //     {
        //             "orderType": "C2C", // Enum：PAY(C2B Merchant Acquiring Payment), PAY_REFUND(C2B Merchant Acquiring Payment,refund), C2C(C2C Transfer Payment),CRYPTO_BOX(Crypto box), CRYPTO_BOX_RF(Crypto Box, refund), C2C_HOLDING(Transfer to new Binance user), C2C_HOLDING_RF(Transfer to new Binance user,refund), PAYOUT(B2C Disbursement Payment), REMITTANCE（Send cash)
        //             "transactionId": "M_P_71505104267788288",
        //             "transactionTime": 1610090460133, //trade timestamp
        //             "amount": "23.72469206", //order amount(up to 8 decimal places), positive is income, negative is expenditure
        //             "currency": "BNB",
        //             "walletType": 1, //main wallet type, 1 for funding wallet, 2 for spot wallet, 3 for fiat wallet, 4 or 6 for card payment, 5 for earn wallet
        //             "walletTypes": [1,2], //array format，there are multiple values when using combination payment
        //             "fundsDetail": [ // details
        //                     {
        //                         "currency": "USDT", //asset
        //                         "amount": "1.2",
        //                         "walletAssetCost":[ //details of asset cost per wallet
        //                             {"1":"0.6"},
        //                             {"2":"0.6"}
        //                         ]
        //                     },
        //                     {
        //                         "currency": "ETH",
        //                         "amount": "0.0001",
        //                         "walletAssetCost":[
        //                             {"1":"0.00005"},
        //                             {"2":"0.00005"}
        //                         ]
        //                     }
        //                 ],
        //             "payerInfo":{
        //                     "name":"Jack", //nickname or merchant name
        //                     "type":"USER", //account type，USER for personal，MERCHANT for merchant
        //                     "binanceId":"12345678", //binance uid
        //                     "accountId":"67736251" //binance pay id
        //                 },
        //             "receiverInfo":{
        //                     "name":"Alan", //nickname or merchant name
        //                     "type":"MERCHANT", //account type，USER for personal，MERCHANT for merchant
        //                     "email":"alan@binance.com", //email
        //                     "binanceId":"34355667", //binance uid
        //                     "accountId":"21326891", //binance pay id
        //                     "countryCode":"1", //International area code
        //                     "phoneNumber":"8057651210",
        //                     "mobileCode":"US", //country code
        //                     "extend":[ //extension field
        //                             "institutionName": "",
        //                             "cardNumber": "",
        //                             "digitalWalletId": ""
        //                     ]
        //                 }
        //             }
        const id = this.safeString2 (transfer, 'tranId', 'transactionId');
        const currencyId = this.safeString2 (transfer, 'asset', 'currency');
        const code = this.safeCurrencyCode (currencyId, currency);
        const amount = this.safeNumber (transfer, 'amount');
        const type = this.safeString (transfer, 'type');
        let fromAccount = undefined;
        let toAccount = undefined;
        const accountsById = this.safeDict (this.options, 'accountsById', {});
        if (type !== undefined) {
            const parts = type.split ('_');
            fromAccount = this.safeValue (parts, 0);
            toAccount = this.safeValue (parts, 1);
            fromAccount = this.safeString (accountsById, fromAccount, fromAccount);
            toAccount = this.safeString (accountsById, toAccount, toAccount);
        }
        const walletType = this.safeInteger (transfer, 'walletType');
        if (walletType !== undefined) {
            const payer = this.safeDict (transfer, 'payerInfo', {});
            const receiver = this.safeDict (transfer, 'receiverInfo', {});
            fromAccount = this.safeString (payer, 'accountId');
            toAccount = this.safeString (receiver, 'accountId');
        }
        const timestamp = this.safeInteger2 (transfer, 'timestamp', 'transactionTime');
        const status = this.parseTransferStatus (this.safeString (transfer, 'status'));
        return {
            'info': transfer,
            'id': id,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'currency': code,
            'amount': amount,
            'fromAccount': fromAccount,
            'toAccount': toAccount,
            'status': status,
        };
    }

    parseIncome (income, market: Market = undefined) {
        //
        //     {
        //       "symbol": "ETHUSDT",
        //       "incomeType": "FUNDING_FEE",
        //       "income": "0.00134317",
        //       "asset": "USDT",
        //       "time": "1621584000000",
        //       "info": "FUNDING_FEE",
        //       "tranId": "4480321991774044580",
        //       "tradeId": ""
        //     }
        //
        const marketId = this.safeString (income, 'symbol');
        const currencyId = this.safeString (income, 'asset');
        const timestamp = this.safeInteger (income, 'time');
        return {
            'info': income,
            'symbol': this.safeSymbol (marketId, market, undefined, 'swap'),
            'code': this.safeCurrencyCode (currencyId),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'id': this.safeString (income, 'tranId'),
            'amount': this.safeNumber (income, 'income'),
        };
    }

    /**
     * @method
     * @name binance#transfer
     * @description transfer currency internally between wallets on the same account
     * @see https://developers.binance.com/docs/wallet/asset/user-universal-transfer
     * @param {string} code unified currency code
     * @param {float} amount amount to transfer
     * @param {string} fromAccount account to transfer from
     * @param {string} toAccount account to transfer to
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.type] exchange specific transfer type
     * @param {string} [params.symbol] the unified symbol, required for isolated margin transfers
     * @returns {object} a [transfer structure]{@link https://docs.ccxt.com/#/?id=transfer-structure}
     */
    async transfer (code: string, amount: number, fromAccount: string, toAccount:string, params = {}): Promise<TransferEntry> {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'asset': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
        };
        request['type'] = this.safeString (params, 'type');
        params = this.omit (params, 'type');
        if (request['type'] === undefined) {
            const symbol = this.safeString (params, 'symbol');
            let market = undefined;
            if (symbol !== undefined) {
                market = this.market (symbol);
                params = this.omit (params, 'symbol');
            }
            let fromId = this.convertTypeToAccount (fromAccount).toUpperCase ();
            let toId = this.convertTypeToAccount (toAccount).toUpperCase ();
            let isolatedSymbol = undefined;
            if (market !== undefined) {
                isolatedSymbol = market['id'];
            }
            if (fromId === 'ISOLATED') {
                if (symbol === undefined) {
                    throw new ArgumentsRequired (this.id + ' transfer () requires params["symbol"] when fromAccount is ' + fromAccount);
                }
            }
            if (toId === 'ISOLATED') {
                if (symbol === undefined) {
                    throw new ArgumentsRequired (this.id + ' transfer () requires params["symbol"] when toAccount is ' + toAccount);
                }
            }
            const accountsById = this.safeDict (this.options, 'accountsById', {});
            const fromIsolated = !(fromId in accountsById);
            const toIsolated = !(toId in accountsById);
            if (fromIsolated && (market === undefined)) {
                isolatedSymbol = fromId; // allow user provide symbol as the from/to account
            }
            if (toIsolated && (market === undefined)) {
                isolatedSymbol = toId;
            }
            if (fromIsolated || toIsolated) { // Isolated margin transfer
                const fromFuture = fromId === 'UMFUTURE' || fromId === 'CMFUTURE';
                const toFuture = toId === 'UMFUTURE' || toId === 'CMFUTURE';
                const fromSpot = fromId === 'MAIN';
                const toSpot = toId === 'MAIN';
                const funding = fromId === 'FUNDING' || toId === 'FUNDING';
                const option = fromId === 'OPTION' || toId === 'OPTION';
                const prohibitedWithIsolated = fromFuture || toFuture || funding || option;
                if ((fromIsolated || toIsolated) && prohibitedWithIsolated) {
                    throw new BadRequest (this.id + ' transfer () does not allow transfers between ' + fromAccount + ' and ' + toAccount);
                } else if (toSpot && fromIsolated) {
                    fromId = 'ISOLATED_MARGIN';
                    request['fromSymbol'] = isolatedSymbol;
                } else if (fromSpot && toIsolated) {
                    toId = 'ISOLATED_MARGIN';
                    request['toSymbol'] = isolatedSymbol;
                } else {
                    if (fromIsolated && toIsolated) {
                        request['fromSymbol'] = fromId;
                        request['toSymbol'] = toId;
                        fromId = 'ISOLATEDMARGIN';
                        toId = 'ISOLATEDMARGIN';
                    } else {
                        if (fromIsolated) {
                            request['fromSymbol'] = isolatedSymbol;
                            fromId = 'ISOLATEDMARGIN';
                        }
                        if (toIsolated) {
                            request['toSymbol'] = isolatedSymbol;
                            toId = 'ISOLATEDMARGIN';
                        }
                    }
                }
                request['type'] = fromId + '_' + toId;
            } else {
                request['type'] = fromId + '_' + toId;
            }
        }
        const response = await this.sapiPostAssetTransfer (this.extend (request, params));
        //
        //     {
        //         "tranId":13526853623
        //     }
        //
        return this.parseTransfer (response, currency);
    }

    /**
     * @method
     * @name binance#fetchTransfers
     * @description fetch a history of internal transfers made on an account
     * @see https://developers.binance.com/docs/wallet/asset/query-user-universal-transfer
     * @param {string} code unified currency code of the currency transferred
     * @param {int} [since] the earliest time in ms to fetch transfers for
     * @param {int} [limit] the maximum number of transfers structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] the latest time in ms to fetch transfers for
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {boolean} [params.internal] default false, when true will fetch pay trade history
     * @returns {object[]} a list of [transfer structures]{@link https://docs.ccxt.com/#/?id=transfer-structure}
     */
    async fetchTransfers (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<TransferEntry[]> {
        await this.loadMarkets ();
        const internal = this.safeBool (params, 'internal');
        params = this.omit (params, 'internal');
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchTransfers', 'paginate');
        if (paginate && !internal) {
            return await this.fetchPaginatedCallDynamic ('fetchTransfers', code, since, limit, params);
        }
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const request: Dict = {};
        let limitKey = 'limit';
        if (!internal) {
            const defaultType = this.safeString2 (this.options, 'fetchTransfers', 'defaultType', 'spot');
            const fromAccount = this.safeString (params, 'fromAccount', defaultType);
            const defaultTo = (fromAccount === 'future') ? 'spot' : 'future';
            const toAccount = this.safeString (params, 'toAccount', defaultTo);
            let type = this.safeString (params, 'type');
            const accountsByType = this.safeDict (this.options, 'accountsByType', {});
            const fromId = this.safeString (accountsByType, fromAccount);
            const toId = this.safeString (accountsByType, toAccount);
            if (type === undefined) {
                if (fromId === undefined) {
                    const keys = Object.keys (accountsByType);
                    throw new ExchangeError (this.id + ' fromAccount parameter must be one of ' + keys.join (', '));
                }
                if (toId === undefined) {
                    const keys = Object.keys (accountsByType);
                    throw new ExchangeError (this.id + ' toAccount parameter must be one of ' + keys.join (', '));
                }
                type = fromId + '_' + toId;
            }
            request['type'] = type;
            limitKey = 'size';
        }
        if (limit !== undefined) {
            request[limitKey] = limit;
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        const until = this.safeInteger (params, 'until');
        if (until !== undefined) {
            params = this.omit (params, 'until');
            request['endTime'] = until;
        }
        let response = undefined;
        if (internal) {
            response = await this.sapiGetPayTransactions (this.extend (request, params));
            //
            // {
            //     "code": "000000",
            //     "message": "success",
            //     "data": [
            //     {
            //         "orderType": "C2C", // Enum：PAY(C2B Merchant Acquiring Payment), PAY_REFUND(C2B Merchant Acquiring Payment,refund), C2C(C2C Transfer Payment),CRYPTO_BOX(Crypto box), CRYPTO_BOX_RF(Crypto Box, refund), C2C_HOLDING(Transfer to new Binance user), C2C_HOLDING_RF(Transfer to new Binance user,refund), PAYOUT(B2C Disbursement Payment), REMITTANCE（Send cash)
            //         "transactionId": "M_P_71505104267788288",
            //         "transactionTime": 1610090460133, //trade timestamp
            //         "amount": "23.72469206", //order amount(up to 8 decimal places), positive is income, negative is expenditure
            //         "currency": "BNB",
            //         "walletType": 1, //main wallet type, 1 for funding wallet, 2 for spot wallet, 3 for fiat wallet, 4 or 6 for card payment, 5 for earn wallet
            //         "walletTypes": [1,2], //array format，there are multiple values when using combination payment
            //         "fundsDetail": [ // details
            //                 {
            //                  "currency": "USDT", //asset
            //                  "amount": "1.2",
            //                  "walletAssetCost":[ //details of asset cost per wallet
            //                      {"1":"0.6"},
            //                      {"2":"0.6"}
            //                  ]
            //                 },
            //                 {
            //                   "currency": "ETH",
            //                   "amount": "0.0001",
            //                   "walletAssetCost":[
            //                      {"1":"0.00005"},
            //                      {"2":"0.00005"}
            //                   ]
            //                 }
            //            ],
            //         "payerInfo":{
            //                 "name":"Jack", //nickname or merchant name
            //                 "type":"USER", //account type，USER for personal，MERCHANT for merchant
            //                 "binanceId":"12345678", //binance uid
            //                 "accountId":"67736251" //binance pay id
            //             },
            //         "receiverInfo":{
            //                 "name":"Alan", //nickname or merchant name
            //                 "type":"MERCHANT", //account type，USER for personal，MERCHANT for merchant
            //                 "email":"alan@binance.com", //email
            //                 "binanceId":"34355667", //binance uid
            //                 "accountId":"21326891", //binance pay id
            //                 "countryCode":"1", //International area code
            //                 "phoneNumber":"8057651210",
            //                 "mobileCode":"US", //country code
            //                 "extend":[ //extension field
            //                      "institutionName": "",
            //                      "cardNumber": "",
            //                      "digitalWalletId": ""
            //                 ]
            //             }
            //       }
            //    ],
            //    "success": true
            // }
            //
        } else {
            response = await this.sapiGetAssetTransfer (this.extend (request, params));
            //
            //     {
            //         "total": 3,
            //         "rows": [
            //             {
            //                 "timestamp": 1614640878000,
            //                 "asset": "USDT",
            //                 "amount": "25",
            //                 "type": "MAIN_UMFUTURE",
            //                 "status": "CONFIRMED",
            //                 "tranId": 43000126248
            //             },
            //         ]
            //     }
            //
        }
        const rows = this.safeList2 (response, 'rows', 'data', []);
        return this.parseTransfers (rows, currency, since, limit);
    }

    /**
     * @method
     * @name binance#fetchDepositAddress
     * @description fetch the deposit address for a currency associated with this account
     * @see https://developers.binance.com/docs/wallet/capital/deposite-address
     * @param {string} code unified currency code
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.network] network for fetch deposit address
     * @returns {object} an [address structure]{@link https://docs.ccxt.com/#/?id=address-structure}
     */
    async fetchDepositAddress (code: string, params = {}): Promise<DepositAddress> {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'coin': currency['id'],
            // 'network': 'ETH', // 'BSC', 'XMR', you can get network and isDefault in networkList in the response of sapiGetCapitalConfigDetail
        };
        const networks = this.safeDict (this.options, 'networks', {});
        let network = this.safeStringUpper (params, 'network'); // this line allows the user to specify either ERC20 or ETH
        network = this.safeString (networks, network, network); // handle ERC20>ETH alias
        if (network !== undefined) {
            request['network'] = network;
            params = this.omit (params, 'network');
        }
        // has support for the 'network' parameter
        const response = await this.sapiGetCapitalDepositAddress (this.extend (request, params));
        //
        //     {
        //         "currency": "XRP",
        //         "address": "rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh",
        //         "tag": "108618262",
        //         "info": {
        //             "coin": "XRP",
        //             "address": "rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh",
        //             "tag": "108618262",
        //             "url": "https://bithomp.com/explorer/rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh"
        //         }
        //     }
        //
        return this.parseDepositAddress (response, currency);
    }

    parseDepositAddress (response, currency: Currency = undefined): DepositAddress {
        //
        //     {
        //         "currency": "XRP",
        //         "address": "rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh",
        //         "tag": "108618262",
        //         "info": {
        //             "coin": "XRP",
        //             "address": "rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh",
        //             "tag": "108618262",
        //             "url": "https://bithomp.com/explorer/rEb8TK3gBgk5auZkwc6sHnwrGVJH8DuaLh"
        //         }
        //     }
        //
        const info = this.safeDict (response, 'info', {});
        const url = this.safeString (info, 'url');
        const address = this.safeString (response, 'address');
        const currencyId = this.safeString (response, 'currency');
        const code = this.safeCurrencyCode (currencyId, currency);
        let impliedNetwork = undefined;
        if (url !== undefined) {
            const reverseNetworks = this.safeDict (this.options, 'reverseNetworks', {});
            const parts = url.split ('/');
            let topLevel = this.safeString (parts, 2);
            if ((topLevel === 'blockchair.com') || (topLevel === 'viewblock.io')) {
                const subLevel = this.safeString (parts, 3);
                if (subLevel !== undefined) {
                    topLevel = topLevel + '/' + subLevel;
                }
            }
            impliedNetwork = this.safeString (reverseNetworks, topLevel);
            const impliedNetworks = this.safeDict (this.options, 'impliedNetworks', {
                'ETH': { 'ERC20': 'ETH' },
                'TRX': { 'TRC20': 'TRX' },
            });
            if (code in impliedNetworks) {
                const conversion = this.safeDict (impliedNetworks, code, {});
                impliedNetwork = this.safeString (conversion, impliedNetwork, impliedNetwork);
            }
        }
        let tag = this.safeString (response, 'tag', '');
        if (tag.length === 0) {
            tag = undefined;
        }
        this.checkAddress (address);
        return {
            'info': response,
            'currency': code,
            'network': impliedNetwork,
            'address': address,
            'tag': tag,
        } as DepositAddress;
    }

    /**
     * @method
     * @name binance#fetchTransactionFees
     * @deprecated
     * @description please use fetchDepositWithdrawFees instead
     * @see https://developers.binance.com/docs/wallet/capital/all-coins-info
     * @param {string[]|undefined} codes not used by binance fetchTransactionFees ()
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [fee structures]{@link https://docs.ccxt.com/#/?id=fee-structure}
     */
    async fetchTransactionFees (codes: Strings = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.sapiGetCapitalConfigGetall (params);
        //
        //  [
        //     {
        //       "coin": "BAT",
        //       "depositAllEnable": true,
        //       "withdrawAllEnable": true,
        //       "name": "Basic Attention Token",
        //       "free": "0",
        //       "locked": "0",
        //       "freeze": "0",
        //       "withdrawing": "0",
        //       "ipoing": "0",
        //       "ipoable": "0",
        //       "storage": "0",
        //       "isLegalMoney": false,
        //       "trading": true,
        //       "networkList": [
        //         {
        //           "network": "BNB",
        //           "coin": "BAT",
        //           "withdrawIntegerMultiple": "0.00000001",
        //           "isDefault": false,
        //           "depositEnable": true,
        //           "withdrawEnable": true,
        //           "depositDesc": '',
        //           "withdrawDesc": '',
        //           "specialTips": "The name of this asset is Basic Attention Token (BAT). Both a MEMO and an Address are required to successfully deposit your BEP2 tokens to Binance.",
        //           "name": "BEP2",
        //           "resetAddressStatus": false,
        //           "addressRegex": "^(bnb1)[0-9a-z]{38}$",
        //           "memoRegex": "^[0-9A-Za-z\\-_]{1,120}$",
        //           "withdrawFee": "0.27",
        //           "withdrawMin": "0.54",
        //           "withdrawMax": "10000000000",
        //           "minConfirm": "1",
        //           "unLockConfirm": "0"
        //         },
        //         {
        //           "network": "BSC",
        //           "coin": "BAT",
        //           "withdrawIntegerMultiple": "0.00000001",
        //           "isDefault": false,
        //           "depositEnable": true,
        //           "withdrawEnable": true,
        //           "depositDesc": '',
        //           "withdrawDesc": '',
        //           "specialTips": "The name of this asset is Basic Attention Token. Please ensure you are depositing Basic Attention Token (BAT) tokens under the contract address ending in 9766e.",
        //           "name": "BEP20 (BSC)",
        //           "resetAddressStatus": false,
        //           "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
        //           "memoRegex": '',
        //           "withdrawFee": "0.27",
        //           "withdrawMin": "0.54",
        //           "withdrawMax": "10000000000",
        //           "minConfirm": "15",
        //           "unLockConfirm": "0"
        //         },
        //         {
        //           "network": "ETH",
        //           "coin": "BAT",
        //           "withdrawIntegerMultiple": "0.00000001",
        //           "isDefault": true,
        //           "depositEnable": true,
        //           "withdrawEnable": true,
        //           "depositDesc": '',
        //           "withdrawDesc": '',
        //           "specialTips": "The name of this asset is Basic Attention Token. Please ensure you are depositing Basic Attention Token (BAT) tokens under the contract address ending in 887ef.",
        //           "name": "ERC20",
        //           "resetAddressStatus": false,
        //           "addressRegex": "^(0x)[0-9A-Fa-f]{40}$",
        //           "memoRegex": '',
        //           "withdrawFee": "27",
        //           "withdrawMin": "54",
        //           "withdrawMax": "10000000000",
        //           "minConfirm": "12",
        //           "unLockConfirm": "0"
        //         }
        //       ]
        //     }
        //  ]
        //
        const withdrawFees: Dict = {};
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            const currencyId = this.safeString (entry, 'coin');
            const code = this.safeCurrencyCode (currencyId);
            const networkList = this.safeList (entry, 'networkList', []);
            withdrawFees[code] = {};
            for (let j = 0; j < networkList.length; j++) {
                const networkEntry = networkList[j];
                const networkId = this.safeString (networkEntry, 'network');
                const networkCode = this.safeCurrencyCode (networkId);
                const fee = this.safeNumber (networkEntry, 'withdrawFee');
                withdrawFees[code][networkCode] = fee;
            }
        }
        return {
            'withdraw': withdrawFees,
            'deposit': {},
            'info': response,
        };
    }

    /**
     * @method
     * @name binance#fetchDepositWithdrawFees
     * @description fetch deposit and withdraw fees
     * @see https://developers.binance.com/docs/wallet/capital/all-coins-info
     * @param {string[]|undefined} codes not used by binance fetchDepositWithdrawFees ()
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [fee structures]{@link https://docs.ccxt.com/#/?id=fee-structure}
     */
    async fetchDepositWithdrawFees (codes: Strings = undefined, params = {}) {
        await this.loadMarkets ();
        const response = await this.sapiGetCapitalConfigGetall (params);
        //
        //    [
        //        {
        //            "coin": "BAT",
        //            "depositAllEnable": true,
        //            "withdrawAllEnable": true,
        //            "name": "Basic Attention Token",
        //            "free": "0",
        //            "locked": "0",
        //            "freeze": "0",
        //            "withdrawing": "0",
        //            "ipoing": "0",
        //            "ipoable": "0",
        //            "storage": "0",
        //            "isLegalMoney": false,
        //            "trading": true,
        //            "networkList": [
        //                {
        //                    "network": "BNB",
        //                    "coin": "BAT",
        //                    "withdrawIntegerMultiple": "0.00000001",
        //                    "isDefault": false,
        //                    "depositEnable": true,
        //                    "withdrawEnable": true,
        //                    "depositDesc": '',
        //                    "withdrawDesc": '',
        //                    "specialTips": "The name of this asset is Basic Attention Token (BAT). Both a MEMO and an Address are required to successfully deposit your BEP2 tokens to Binance.",
        //                    "name": "BEP2",
        //                    "resetAddressStatus": false,
        //                    "addressRegex": "^(bnb1)[0-9a-z]{38}$",
        //                    "memoRegex": "^[0-9A-Za-z\\-_]{1,120}$",
        //                    "withdrawFee": "0.27",
        //                    "withdrawMin": "0.54",
        //                    "withdrawMax": "10000000000",
        //                    "minConfirm": "1",
        //                    "unLockConfirm": "0"
        //                },
        //                ...
        //            ]
        //        }
        //    ]
        //
        return this.parseDepositWithdrawFees (response, codes, 'coin');
    }

    parseDepositWithdrawFee (fee, currency: Currency = undefined) {
        //
        //    {
        //        "coin": "BAT",
        //        "depositAllEnable": true,
        //        "withdrawAllEnable": true,
        //        "name": "Basic Attention Token",
        //        "free": "0",
        //        "locked": "0",
        //        "freeze": "0",
        //        "withdrawing": "0",
        //        "ipoing": "0",
        //        "ipoable": "0",
        //        "storage": "0",
        //        "isLegalMoney": false,
        //        "trading": true,
        //        "networkList": [
        //            {
        //                "network": "BNB",
        //                "coin": "BAT",
        //                "withdrawIntegerMultiple": "0.00000001",
        //                "isDefault": false,
        //                "depositEnable": true,
        //                "withdrawEnable": true,
        //                "depositDesc": '',
        //                "withdrawDesc": '',
        //                "specialTips": "The name of this asset is Basic Attention Token (BAT). Both a MEMO and an Address are required to successfully deposit your BEP2 tokens to Binance.",
        //                "name": "BEP2",
        //                "resetAddressStatus": false,
        //                "addressRegex": "^(bnb1)[0-9a-z]{38}$",
        //                "memoRegex": "^[0-9A-Za-z\\-_]{1,120}$",
        //                "withdrawFee": "0.27",
        //                "withdrawMin": "0.54",
        //                "withdrawMax": "10000000000",
        //                "minConfirm": "1",
        //                "unLockConfirm": "0"
        //            },
        //            ...
        //        ]
        //    }
        //
        const networkList = this.safeList (fee, 'networkList', []);
        const result = this.depositWithdrawFee (fee);
        for (let j = 0; j < networkList.length; j++) {
            const networkEntry = networkList[j];
            const networkId = this.safeString (networkEntry, 'network');
            const networkCode = this.networkIdToCode (networkId);
            const withdrawFee = this.safeNumber (networkEntry, 'withdrawFee');
            const isDefault = this.safeBool (networkEntry, 'isDefault');
            if (isDefault === true) {
                result['withdraw'] = {
                    'fee': withdrawFee,
                    'percentage': undefined,
                };
            }
            result['networks'][networkCode] = {
                'withdraw': {
                    'fee': withdrawFee,
                    'percentage': undefined,
                },
                'deposit': {
                    'fee': undefined,
                    'percentage': undefined,
                },
            };
        }
        return result;
    }

    /**
     * @method
     * @name binance#withdraw
     * @description make a withdrawal
     * @see https://developers.binance.com/docs/wallet/capital/withdraw
     * @param {string} code unified currency code
     * @param {float} amount the amount to withdraw
     * @param {string} address the address to withdraw to
     * @param {string} tag
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [transaction structure]{@link https://docs.ccxt.com/#/?id=transaction-structure}
     */
    async withdraw (code: string, amount: number, address: string, tag = undefined, params = {}): Promise<Transaction> {
        [ tag, params ] = this.handleWithdrawTagAndParams (tag, params);
        this.checkAddress (address);
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'coin': currency['id'],
            'address': address,
            'amount': this.currencyToPrecision (code, amount),
            // issue sapiGetCapitalConfigGetall () to get networks for withdrawing USDT ERC20 vs USDT Omni
            // 'network': 'ETH', // 'BTC', 'TRX', etc, optional
        };
        if (tag !== undefined) {
            request['addressTag'] = tag;
        }
        const networks = this.safeDict (this.options, 'networks', {});
        let network = this.safeStringUpper (params, 'network'); // this line allows the user to specify either ERC20 or ETH
        network = this.safeString (networks, network, network); // handle ERC20>ETH alias
        if (network !== undefined) {
            request['network'] = network;
            params = this.omit (params, 'network');
        }
        const response = await this.sapiPostCapitalWithdrawApply (this.extend (request, params));
        //     { id: '9a67628b16ba4988ae20d329333f16bc' }
        return this.parseTransaction (response, currency);
    }

    parseTradingFee (fee: Dict, market: Market = undefined): TradingFeeInterface {
        //
        // spot
        //     [
        //       {
        //         "symbol": "BTCUSDT",
        //         "makerCommission": "0.001",
        //         "takerCommission": "0.001"
        //       }
        //     ]
        //
        // swap
        //     {
        //         "symbol": "BTCUSD_PERP",
        //         "makerCommissionRate": "0.00015",  // 0.015%
        //         "takerCommissionRate": "0.00040"   // 0.040%
        //     }
        //
        const marketId = this.safeString (fee, 'symbol');
        const symbol = this.safeSymbol (marketId, market, undefined, 'spot');
        return {
            'info': fee,
            'symbol': symbol,
            'maker': this.safeNumber2 (fee, 'makerCommission', 'makerCommissionRate'),
            'taker': this.safeNumber2 (fee, 'takerCommission', 'takerCommissionRate'),
            'percentage': undefined,
            'tierBased': undefined,
        };
    }

    /**
     * @method
     * @name binance#fetchTradingFee
     * @description fetch the trading fees for a market
     * @see https://developers.binance.com/docs/wallet/asset/trade-fee
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/User-Commission-Rate
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/User-Commission-Rate
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-UM
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-User-Commission-Rate-for-CM
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch trading fees in a portfolio margin account
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a [fee structure]{@link https://docs.ccxt.com/#/?id=fee-structure}
     */
    async fetchTradingFee (symbol: string, params = {}): Promise<TradingFeeInterface> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const type = market['type'];
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchTradingFee', market, params);
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchTradingFee', 'papi', 'portfolioMargin', false);
        const isLinear = this.isLinear (type, subType);
        const isInverse = this.isInverse (type, subType);
        const request: Dict = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (isLinear) {
            if (isPortfolioMargin) {
                response = await this.papiGetUmCommissionRate (this.extend (request, params));
            } else {
                response = await this.fapiPrivateGetCommissionRate (this.extend (request, params));
            }
        } else if (isInverse) {
            if (isPortfolioMargin) {
                response = await this.papiGetCmCommissionRate (this.extend (request, params));
            } else {
                response = await this.dapiPrivateGetCommissionRate (this.extend (request, params));
            }
        } else {
            response = await this.sapiGetAssetTradeFee (this.extend (request, params));
        }
        //
        // spot
        //
        //     [
        //       {
        //         "symbol": "BTCUSDT",
        //         "makerCommission": "0.001",
        //         "takerCommission": "0.001"
        //       }
        //     ]
        //
        // swap
        //
        //     {
        //         "symbol": "BTCUSD_PERP",
        //         "makerCommissionRate": "0.00015",  // 0.015%
        //         "takerCommissionRate": "0.00040"   // 0.040%
        //     }
        //
        let data = response;
        if (Array.isArray (data)) {
            data = this.safeDict (data, 0, {});
        }
        return this.parseTradingFee (data, market);
    }

    /**
     * @method
     * @name binance#fetchTradingFees
     * @description fetch the trading fees for multiple markets
     * @see https://developers.binance.com/docs/wallet/asset/trade-fee
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V2
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Account-Information
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Config
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a dictionary of [fee structures]{@link https://docs.ccxt.com/#/?id=fee-structure} indexed by market symbols
     */
    async fetchTradingFees (params = {}): Promise<TradingFees> {
        await this.loadMarkets ();
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchTradingFees', undefined, params);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchTradingFees', undefined, params, 'linear');
        const isSpotOrMargin = (type === 'spot') || (type === 'margin');
        const isLinear = this.isLinear (type, subType);
        const isInverse = this.isInverse (type, subType);
        let response = undefined;
        if (isSpotOrMargin) {
            response = await this.sapiGetAssetTradeFee (params);
        } else if (isLinear) {
            response = await this.fapiPrivateGetAccountConfig (params);
        } else if (isInverse) {
            response = await this.dapiPrivateGetAccount (params);
        }
        //
        // sapi / spot
        //
        //    [
        //       {
        //         "symbol": "ZRXBNB",
        //         "makerCommission": "0.001",
        //         "takerCommission": "0.001"
        //       },
        //       {
        //         "symbol": "ZRXBTC",
        //         "makerCommission": "0.001",
        //         "takerCommission": "0.001"
        //       },
        //    ]
        //
        // fapi / future / linear
        //
        //     {
        //         "feeTier": 0,       // account commisssion tier
        //         "canTrade": true,   // if can trade
        //         "canDeposit": true,     // if can transfer in asset
        //         "canWithdraw": true,    // if can transfer out asset
        //         "updateTime": 0,
        //         "totalInitialMargin": "0.00000000",    // total initial margin required with current mark price (useless with isolated positions), only for USDT asset
        //         "totalMaintMargin": "0.00000000",     // total maintenance margin required, only for USDT asset
        //         "totalWalletBalance": "23.72469206",     // total wallet balance, only for USDT asset
        //         "totalUnrealizedProfit": "0.00000000",   // total unrealized profit, only for USDT asset
        //         "totalMarginBalance": "23.72469206",     // total margin balance, only for USDT asset
        //         "totalPositionInitialMargin": "0.00000000",    // initial margin required for positions with current mark price, only for USDT asset
        //         "totalOpenOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price, only for USDT asset
        //         "totalCrossWalletBalance": "23.72469206",      // crossed wallet balance, only for USDT asset
        //         "totalCrossUnPnl": "0.00000000",      // unrealized profit of crossed positions, only for USDT asset
        //         "availableBalance": "23.72469206",       // available balance, only for USDT asset
        //         "maxWithdrawAmount": "23.72469206"     // maximum amount for transfer out, only for USDT asset
        //         ...
        //     }
        //
        // dapi / delivery / inverse
        //
        //     {
        //         "canDeposit": true,
        //         "canTrade": true,
        //         "canWithdraw": true,
        //         "feeTier": 2,
        //         "updateTime": 0
        //     }
        //
        if (isSpotOrMargin) {
            //
            //    [
            //       {
            //         "symbol": "ZRXBNB",
            //         "makerCommission": "0.001",
            //         "takerCommission": "0.001"
            //       },
            //       {
            //         "symbol": "ZRXBTC",
            //         "makerCommission": "0.001",
            //         "takerCommission": "0.001"
            //       },
            //    ]
            //
            const result: Dict = {};
            for (let i = 0; i < response.length; i++) {
                const fee = this.parseTradingFee (response[i]);
                const symbol = fee['symbol'];
                result[symbol] = fee;
            }
            return result;
        } else if (isLinear) {
            //
            //     {
            //         "feeTier": 0,       // account commisssion tier
            //         "canTrade": true,   // if can trade
            //         "canDeposit": true,     // if can transfer in asset
            //         "canWithdraw": true,    // if can transfer out asset
            //         "updateTime": 0,
            //         "totalInitialMargin": "0.00000000",    // total initial margin required with current mark price (useless with isolated positions), only for USDT asset
            //         "totalMaintMargin": "0.00000000",     // total maintenance margin required, only for USDT asset
            //         "totalWalletBalance": "23.72469206",     // total wallet balance, only for USDT asset
            //         "totalUnrealizedProfit": "0.00000000",   // total unrealized profit, only for USDT asset
            //         "totalMarginBalance": "23.72469206",     // total margin balance, only for USDT asset
            //         "totalPositionInitialMargin": "0.00000000",    // initial margin required for positions with current mark price, only for USDT asset
            //         "totalOpenOrderInitialMargin": "0.00000000",   // initial margin required for open orders with current mark price, only for USDT asset
            //         "totalCrossWalletBalance": "23.72469206",      // crossed wallet balance, only for USDT asset
            //         "totalCrossUnPnl": "0.00000000",      // unrealized profit of crossed positions, only for USDT asset
            //         "availableBalance": "23.72469206",       // available balance, only for USDT asset
            //         "maxWithdrawAmount": "23.72469206"     // maximum amount for transfer out, only for USDT asset
            //         ...
            //     }
            //
            const symbols = Object.keys (this.markets);
            const result: Dict = {};
            const feeTier = this.safeInteger (response, 'feeTier');
            const feeTiers = this.fees['linear']['trading']['tiers'];
            const maker = feeTiers['maker'][feeTier][1];
            const taker = feeTiers['taker'][feeTier][1];
            for (let i = 0; i < symbols.length; i++) {
                const symbol = symbols[i];
                const market = this.markets[symbol];
                if (market['linear']) {
                    result[symbol] = {
                        'info': {
                            'feeTier': feeTier,
                        },
                        'symbol': symbol,
                        'maker': maker,
                        'taker': taker,
                    };
                }
            }
            return result;
        } else if (isInverse) {
            //
            //     {
            //         "canDeposit": true,
            //         "canTrade": true,
            //         "canWithdraw": true,
            //         "feeTier": 2,
            //         "updateTime": 0
            //     }
            //
            const symbols = Object.keys (this.markets);
            const result: Dict = {};
            const feeTier = this.safeInteger (response, 'feeTier');
            const feeTiers = this.fees['inverse']['trading']['tiers'];
            const maker = feeTiers['maker'][feeTier][1];
            const taker = feeTiers['taker'][feeTier][1];
            for (let i = 0; i < symbols.length; i++) {
                const symbol = symbols[i];
                const market = this.markets[symbol];
                if (market['inverse']) {
                    result[symbol] = {
                        'info': {
                            'feeTier': feeTier,
                        },
                        'symbol': symbol,
                        'maker': maker,
                        'taker': taker,
                    };
                }
            }
            return result;
        }
        return undefined;
    }

    /**
     * @method
     * @name binance#futuresTransfer
     * @ignore
     * @description transfer between futures account
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/New-Future-Account-Transfer
     * @param {string} code unified currency code
     * @param {float} amount the amount to transfer
     * @param {string} type 1 - transfer from spot account to USDT-Ⓜ futures account, 2 - transfer from USDT-Ⓜ futures account to spot account, 3 - transfer from spot account to COIN-Ⓜ futures account, 4 - transfer from COIN-Ⓜ futures account to spot account
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {float} params.recvWindow
     * @returns {object} a [transfer structure]{@link https://docs.ccxt.com/#/?id=futures-transfer-structure}
     */
    async futuresTransfer (code: string, amount, type, params = {}) {
        if ((type < 1) || (type > 4)) {
            throw new ArgumentsRequired (this.id + ' type must be between 1 and 4');
        }
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'asset': currency['id'],
            'amount': amount,
            'type': type,
        };
        const response = await this.sapiPostFuturesTransfer (this.extend (request, params));
        //
        //   {
        //       "tranId": 100000001
        //   }
        //
        return this.parseTransfer (response, currency);
    }

    /**
     * @method
     * @name binance#fetchFundingRate
     * @description fetch the current funding rate
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Index-Price-and-Mark-Price
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [funding rate structure]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}
     */
    async fetchFundingRate (symbol: string, params = {}): Promise<FundingRate> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        let response = undefined;
        if (market['linear']) {
            response = await this.fapiPublicGetPremiumIndex (this.extend (request, params));
        } else if (market['inverse']) {
            response = await this.dapiPublicGetPremiumIndex (this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchFundingRate() supports linear and inverse contracts only');
        }
        if (market['inverse']) {
            response = response[0];
        }
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "markPrice": "45802.81129892",
        //         "indexPrice": "45745.47701915",
        //         "estimatedSettlePrice": "45133.91753671",
        //         "lastFundingRate": "0.00063521",
        //         "interestRate": "0.00010000",
        //         "nextFundingTime": "1621267200000",
        //         "time": "1621252344001"
        //     }
        //
        return this.parseFundingRate (response, market);
    }

    /**
     * @method
     * @name binance#fetchFundingRateHistory
     * @description fetches historical funding rate prices
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Rate-History
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Get-Funding-Rate-History-of-Perpetual-Futures
     * @param {string} symbol unified symbol of the market to fetch the funding rate history for
     * @param {int} [since] timestamp in ms of the earliest funding rate to fetch
     * @param {int} [limit] the maximum amount of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure} to fetch
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] timestamp in ms of the latest funding rate
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-history-structure}
     */
    async fetchFundingRateHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        const request: Dict = {};
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchFundingRateHistory', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic ('fetchFundingRateHistory', symbol, since, limit, '8h', params) as FundingRateHistory[];
        }
        const defaultType = this.safeString2 (this.options, 'fetchFundingRateHistory', 'defaultType', 'future');
        const type = this.safeString (params, 'type', defaultType);
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
            symbol = market['symbol'];
            request['symbol'] = market['id'];
        }
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchFundingRateHistory', market, params, 'linear');
        params = this.omit (params, 'type');
        if (since !== undefined) {
            request['startTime'] = since;
        }
        const until = this.safeInteger (params, 'until'); // unified in milliseconds
        const endTime = this.safeInteger (params, 'endTime', until); // exchange-specific in milliseconds
        params = this.omit (params, [ 'endTime', 'until' ]);
        if (endTime !== undefined) {
            request['endTime'] = endTime;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let response = undefined;
        if (this.isLinear (type, subType)) {
            response = await this.fapiPublicGetFundingRate (this.extend (request, params));
        } else if (this.isInverse (type, subType)) {
            response = await this.dapiPublicGetFundingRate (this.extend (request, params));
        } else {
            throw new NotSupported (this.id + ' fetchFundingRateHistory() is not supported for ' + type + ' markets');
        }
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "fundingRate": "0.00063521",
        //         "fundingTime": "1621267200000",
        //     }
        //
        const rates = [];
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            const timestamp = this.safeInteger (entry, 'fundingTime');
            rates.push ({
                'info': entry,
                'symbol': this.safeSymbol (this.safeString (entry, 'symbol'), undefined, undefined, 'swap'),
                'fundingRate': this.safeNumber (entry, 'fundingRate'),
                'timestamp': timestamp,
                'datetime': this.iso8601 (timestamp),
            });
        }
        const sorted = this.sortBy (rates, 'timestamp');
        return this.filterBySymbolSinceLimit (sorted, symbol, since, limit) as FundingRateHistory[];
    }

    /**
     * @method
     * @name binance#fetchFundingRates
     * @description fetch the funding rate for multiple markets
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Mark-Price
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Index-Price-and-Mark-Price
     * @param {string[]|undefined} symbols list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rates-structure}, indexed by market symbols
     */
    async fetchFundingRates (symbols: Strings = undefined, params = {}): Promise<FundingRates> {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const defaultType = this.safeString2 (this.options, 'fetchFundingRates', 'defaultType', 'future');
        const type = this.safeString (params, 'type', defaultType);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchFundingRates', undefined, params, 'linear');
        const query = this.omit (params, 'type');
        let response = undefined;
        if (this.isLinear (type, subType)) {
            response = await this.fapiPublicGetPremiumIndex (query);
        } else if (this.isInverse (type, subType)) {
            response = await this.dapiPublicGetPremiumIndex (query);
        } else {
            throw new NotSupported (this.id + ' fetchFundingRates() supports linear and inverse contracts only');
        }
        const result = this.parseFundingRates (response);
        return this.filterByArray (result, 'symbol', symbols);
    }

    parseFundingRate (contract, market: Market = undefined): FundingRate {
        // ensure it matches with https://www.binance.com/en/futures/funding-history/0
        //
        // fetchFundingRate, fetchFundingRates
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "markPrice": "45802.81129892",
        //         "indexPrice": "45745.47701915",
        //         "estimatedSettlePrice": "45133.91753671",
        //         "lastFundingRate": "0.00063521",
        //         "interestRate": "0.00010000",
        //         "nextFundingTime": "1621267200000",
        //         "time": "1621252344001"
        //     }
        //
        // fetchFundingInterval, fetchFundingIntervals
        //
        //     {
        //         "symbol": "BLZUSDT",
        //         "adjustedFundingRateCap": "0.03000000",
        //         "adjustedFundingRateFloor": "-0.03000000",
        //         "fundingIntervalHours": 4,
        //         "disclaimer": false
        //     }
        //
        const timestamp = this.safeInteger (contract, 'time');
        const marketId = this.safeString (contract, 'symbol');
        const symbol = this.safeSymbol (marketId, market, undefined, 'contract');
        const markPrice = this.safeNumber (contract, 'markPrice');
        const indexPrice = this.safeNumber (contract, 'indexPrice');
        const interestRate = this.safeNumber (contract, 'interestRate');
        const estimatedSettlePrice = this.safeNumber (contract, 'estimatedSettlePrice');
        const fundingRate = this.safeNumber (contract, 'lastFundingRate');
        const fundingTime = this.safeInteger (contract, 'nextFundingTime');
        const interval = this.safeString (contract, 'fundingIntervalHours');
        let intervalString = undefined;
        if (interval !== undefined) {
            intervalString = interval + 'h';
        }
        return {
            'info': contract,
            'symbol': symbol,
            'markPrice': markPrice,
            'indexPrice': indexPrice,
            'interestRate': interestRate,
            'estimatedSettlePrice': estimatedSettlePrice,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'fundingRate': fundingRate,
            'fundingTimestamp': fundingTime,
            'fundingDatetime': this.iso8601 (fundingTime),
            'nextFundingRate': undefined,
            'nextFundingTimestamp': undefined,
            'nextFundingDatetime': undefined,
            'previousFundingRate': undefined,
            'previousFundingTimestamp': undefined,
            'previousFundingDatetime': undefined,
            'interval': intervalString,
        } as FundingRate;
    }

    parseAccountPositions (account, filterClosed = false) {
        const positions = this.safeList (account, 'positions');
        const assets = this.safeList (account, 'assets', []);
        const balances: Dict = {};
        for (let i = 0; i < assets.length; i++) {
            const entry = assets[i];
            const currencyId = this.safeString (entry, 'asset');
            const code = this.safeCurrencyCode (currencyId);
            const crossWalletBalance = this.safeString (entry, 'crossWalletBalance');
            const crossUnPnl = this.safeString (entry, 'crossUnPnl');
            balances[code] = {
                'crossMargin': Precise.stringAdd (crossWalletBalance, crossUnPnl),
                'crossWalletBalance': crossWalletBalance,
            };
        }
        const result = [];
        for (let i = 0; i < positions.length; i++) {
            const position = positions[i];
            const marketId = this.safeString (position, 'symbol');
            const market = this.safeMarket (marketId, undefined, undefined, 'contract');
            const code = market['linear'] ? market['quote'] : market['base'];
            const maintenanceMargin = this.safeString (position, 'maintMargin');
            // check for maintenance margin so empty positions are not returned
            const isPositionOpen = (maintenanceMargin !== '0') && (maintenanceMargin !== '0.00000000');
            if (!filterClosed || isPositionOpen) {
                // sometimes not all the codes are correctly returned...
                if (code in balances) {
                    const parsed = this.parseAccountPosition (this.extend (position, {
                        'crossMargin': balances[code]['crossMargin'],
                        'crossWalletBalance': balances[code]['crossWalletBalance'],
                    }), market);
                    result.push (parsed);
                }
            }
        }
        return result;
    }

    parseAccountPosition (position, market: Market = undefined) {
        //
        // usdm
        //
        // v3 (similar for cross & isolated)
        //
        //    {
        //        "symbol": "WLDUSDT",
        //        "positionSide": "BOTH",
        //        "positionAmt": "-849",
        //        "unrealizedProfit": "11.17920750",
        //        "notional": "-1992.46079250",
        //        "isolatedMargin": "0",
        //        "isolatedWallet": "0",
        //        "initialMargin": "99.62303962",
        //        "maintMargin": "11.95476475",
        //        "updateTime": "1721995760449"
        //        "leverage": "50",                        // in v2
        //        "entryPrice": "2.34",                    // in v2
        //        "positionInitialMargin": "118.82116614", // in v2
        //        "openOrderInitialMargin": "0",           // in v2
        //        "isolated": false,                       // in v2
        //        "breakEvenPrice": "2.3395788",           // in v2
        //        "maxNotional": "25000",                  // in v2
        //        "bidNotional": "0",                      // in v2
        //        "askNotional": "0"                       // in v2
        //    }
        //
        // coinm
        //
        //     {
        //       "symbol": "BTCUSD_210625",
        //       "initialMargin": "0.00024393",
        //       "maintMargin": "0.00002439",
        //       "unrealizedProfit": "-0.00000163",
        //       "positionInitialMargin": "0.00024393",
        //       "openOrderInitialMargin": "0",
        //       "leverage": "10",
        //       "isolated": false,
        //       "positionSide": "BOTH",
        //       "entryPrice": "41021.20000069",
        //       "maxQty": "100",
        //       "notionalValue": "0.00243939",
        //       "isolatedWallet": "0",
        //       "crossMargin": "0.314"
        //       "crossWalletBalance": "34",
        //     }
        //
        // linear portfolio margin
        //
        //     {
        //         "symbol": "CTSIUSDT",
        //         "initialMargin": "0",
        //         "maintMargin": "0",
        //         "unrealizedProfit": "0.00000000",
        //         "positionInitialMargin": "0",
        //         "openOrderInitialMargin": "0",
        //         "leverage": "20",
        //         "entryPrice": "0.0",
        //         "maxNotional": "25000",
        //         "bidNotional": "0",
        //         "askNotional": "0",
        //         "positionSide": "SHORT",
        //         "positionAmt": "0",
        //         "updateTime": 0,
        //         "notional": "0",
        //         "breakEvenPrice": "0.0"
        //     }
        //
        // inverse portoflio margin
        //
        //     {
        //         "symbol": "TRXUSD_PERP",
        //         "initialMargin": "0",
        //         "maintMargin": "0",
        //         "unrealizedProfit": "0.00000000",
        //         "positionInitialMargin": "0",
        //         "openOrderInitialMargin": "0",
        //         "leverage": "20",
        //         "entryPrice": "0.00000000",
        //         "positionSide": "SHORT",
        //         "positionAmt": "0",
        //         "maxQty": "5000000",
        //         "updateTime": 0,
        //         "notionalValue": "0",
        //         "breakEvenPrice": "0.00000000"
        //     }
        //
        const marketId = this.safeString (position, 'symbol');
        market = this.safeMarket (marketId, market, undefined, 'contract');
        const symbol = this.safeString (market, 'symbol');
        const leverageString = this.safeString (position, 'leverage');
        const leverage = (leverageString !== undefined) ? parseInt (leverageString) : undefined;
        const initialMarginString = this.safeString (position, 'initialMargin');
        const initialMargin = this.parseNumber (initialMarginString);
        let initialMarginPercentageString = undefined;
        if (leverageString !== undefined) {
            initialMarginPercentageString = Precise.stringDiv ('1', leverageString, 8);
            const rational = this.isRoundNumber (1000 % leverage);
            if (!rational) {
                initialMarginPercentageString = Precise.stringDiv (Precise.stringAdd (initialMarginPercentageString, '1e-8'), '1', 8);
            }
        }
        // as oppose to notionalValue
        const usdm = ('notional' in position);
        const maintenanceMarginString = this.safeString (position, 'maintMargin');
        const maintenanceMargin = this.parseNumber (maintenanceMarginString);
        const entryPriceString = this.safeString (position, 'entryPrice');
        let entryPrice = this.parseNumber (entryPriceString);
        const notionalString = this.safeString2 (position, 'notional', 'notionalValue');
        const notionalStringAbs = Precise.stringAbs (notionalString);
        const notional = this.parseNumber (notionalStringAbs);
        let contractsString = this.safeString (position, 'positionAmt');
        let contractsStringAbs = Precise.stringAbs (contractsString);
        if (contractsString === undefined) {
            const entryNotional = Precise.stringMul (Precise.stringMul (leverageString, initialMarginString), entryPriceString);
            const contractSizeNew = this.safeString (market, 'contractSize');
            contractsString = Precise.stringDiv (entryNotional, contractSizeNew);
            contractsStringAbs = Precise.stringDiv (Precise.stringAdd (contractsString, '0.5'), '1', 0);
        }
        const contracts = this.parseNumber (contractsStringAbs);
        const leverageBrackets = this.safeDict (this.options, 'leverageBrackets', {});
        const leverageBracket = this.safeList (leverageBrackets, symbol, []);
        let maintenanceMarginPercentageString = undefined;
        for (let i = 0; i < leverageBracket.length; i++) {
            const bracket = leverageBracket[i];
            if (Precise.stringLt (notionalStringAbs, bracket[0])) {
                break;
            }
            maintenanceMarginPercentageString = bracket[1];
        }
        const maintenanceMarginPercentage = this.parseNumber (maintenanceMarginPercentageString);
        const unrealizedPnlString = this.safeString (position, 'unrealizedProfit');
        const unrealizedPnl = this.parseNumber (unrealizedPnlString);
        let timestamp = this.safeInteger (position, 'updateTime');
        if (timestamp === 0) {
            timestamp = undefined;
        }
        let isolated = this.safeBool (position, 'isolated');
        if (isolated === undefined) {
            const isolatedMarginRaw = this.safeString (position, 'isolatedMargin');
            isolated = !Precise.stringEq (isolatedMarginRaw, '0');
        }
        let marginMode = undefined;
        let collateralString = undefined;
        let walletBalance = undefined;
        if (isolated) {
            marginMode = 'isolated';
            walletBalance = this.safeString (position, 'isolatedWallet');
            collateralString = Precise.stringAdd (walletBalance, unrealizedPnlString);
        } else {
            marginMode = 'cross';
            walletBalance = this.safeString (position, 'crossWalletBalance');
            collateralString = this.safeString (position, 'crossMargin');
        }
        const collateral = this.parseNumber (collateralString);
        let marginRatio = undefined;
        let side = undefined;
        let percentage = undefined;
        let liquidationPriceStringRaw = undefined;
        let liquidationPrice = undefined;
        const contractSize = this.safeValue (market, 'contractSize');
        const contractSizeString = this.numberToString (contractSize);
        if (Precise.stringEquals (notionalString, '0')) {
            entryPrice = undefined;
        } else {
            side = Precise.stringLt (notionalString, '0') ? 'short' : 'long';
            marginRatio = this.parseNumber (Precise.stringDiv (Precise.stringAdd (Precise.stringDiv (maintenanceMarginString, collateralString), '5e-5'), '1', 4));
            percentage = this.parseNumber (Precise.stringMul (Precise.stringDiv (unrealizedPnlString, initialMarginString, 4), '100'));
            if (usdm) {
                // calculate liquidation price
                //
                // liquidationPrice = (walletBalance / (contracts * (±1 + mmp))) + (±entryPrice / (±1 + mmp))
                //
                // mmp = maintenanceMarginPercentage
                // where ± is negative for long and positive for short
                // TODO: calculate liquidation price for coinm contracts
                let onePlusMaintenanceMarginPercentageString = undefined;
                let entryPriceSignString = entryPriceString;
                if (side === 'short') {
                    onePlusMaintenanceMarginPercentageString = Precise.stringAdd ('1', maintenanceMarginPercentageString);
                } else {
                    onePlusMaintenanceMarginPercentageString = Precise.stringAdd ('-1', maintenanceMarginPercentageString);
                    entryPriceSignString = Precise.stringMul ('-1', entryPriceSignString);
                }
                const leftSide = Precise.stringDiv (walletBalance, Precise.stringMul (contractsStringAbs, onePlusMaintenanceMarginPercentageString));
                const rightSide = Precise.stringDiv (entryPriceSignString, onePlusMaintenanceMarginPercentageString);
                liquidationPriceStringRaw = Precise.stringAdd (leftSide, rightSide);
            } else {
                // calculate liquidation price
                //
                // liquidationPrice = (contracts * contractSize(±1 - mmp)) / (±1/entryPrice * contracts * contractSize - walletBalance)
                //
                let onePlusMaintenanceMarginPercentageString = undefined;
                let entryPriceSignString = entryPriceString;
                if (side === 'short') {
                    onePlusMaintenanceMarginPercentageString = Precise.stringSub ('1', maintenanceMarginPercentageString);
                } else {
                    onePlusMaintenanceMarginPercentageString = Precise.stringSub ('-1', maintenanceMarginPercentageString);
                    entryPriceSignString = Precise.stringMul ('-1', entryPriceSignString);
                }
                const size = Precise.stringMul (contractsStringAbs, contractSizeString);
                const leftSide = Precise.stringMul (size, onePlusMaintenanceMarginPercentageString);
                const rightSide = Precise.stringSub (Precise.stringMul (Precise.stringDiv ('1', entryPriceSignString), size), walletBalance);
                liquidationPriceStringRaw = Precise.stringDiv (leftSide, rightSide);
            }
            const pricePrecision = this.precisionFromString (this.safeString (market['precision'], 'price'));
            const pricePrecisionPlusOne = pricePrecision + 1;
            const pricePrecisionPlusOneString = pricePrecisionPlusOne.toString ();
            // round half up
            const rounder = new Precise ('5e-' + pricePrecisionPlusOneString);
            const rounderString = rounder.toString ();
            const liquidationPriceRoundedString = Precise.stringAdd (rounderString, liquidationPriceStringRaw);
            let truncatedLiquidationPrice = Precise.stringDiv (liquidationPriceRoundedString, '1', pricePrecision);
            if (truncatedLiquidationPrice[0] === '-') {
                // user cannot be liquidated
                // since he has more collateral than the size of the position
                truncatedLiquidationPrice = undefined;
            }
            liquidationPrice = this.parseNumber (truncatedLiquidationPrice);
        }
        const positionSide = this.safeString (position, 'positionSide');
        const hedged = positionSide !== 'BOTH';
        return {
            'info': position,
            'id': undefined,
            'symbol': symbol,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'initialMargin': initialMargin,
            'initialMarginPercentage': this.parseNumber (initialMarginPercentageString),
            'maintenanceMargin': maintenanceMargin,
            'maintenanceMarginPercentage': maintenanceMarginPercentage,
            'entryPrice': entryPrice,
            'notional': notional,
            'leverage': this.parseNumber (leverageString),
            'unrealizedPnl': unrealizedPnl,
            'contracts': contracts,
            'contractSize': contractSize,
            'marginRatio': marginRatio,
            'liquidationPrice': liquidationPrice,
            'markPrice': undefined,
            'collateral': collateral,
            'marginMode': marginMode,
            'side': side,
            'hedged': hedged,
            'percentage': percentage,
        };
    }

    parsePositionRisk (position, market: Market = undefined) {
        //
        // usdm
        //
        //  {
        //     symbol: "WLDUSDT",
        //     positionSide: "BOTH",
        //     positionAmt: "5",
        //     entryPrice: "2.3483",
        //     breakEvenPrice: "2.349356735",
        //     markPrice: "2.39560000",
        //     unRealizedProfit: "0.23650000",
        //     liquidationPrice: "0",
        //     isolatedMargin: "0",
        //     notional: "11.97800000",
        //     isolatedWallet: "0",
        //     updateTime: "1722062678998",
        //     initialMargin: "2.39560000",         // not in v2
        //     maintMargin: "0.07186800",           // not in v2
        //     positionInitialMargin: "2.39560000", // not in v2
        //     openOrderInitialMargin: "0",         // not in v2
        //     adl: "2",                            // not in v2
        //     bidNotional: "0",                    // not in v2
        //     askNotional: "0",                    // not in v2
        //     marginAsset: "USDT",                 // not in v2
        //     // the below fields are only in v2
        //     leverage: "5",
        //     maxNotionalValue: "6000000",
        //     marginType: "cross",
        //     isAutoAddMargin: "false",
        //     isolated: false,
        //     adlQuantile: "2",
        //
        // coinm
        //
        //     {
        //       "symbol": "BTCUSD_PERP",
        //       "positionAmt": "2",
        //       "entryPrice": "37643.10000021",
        //       "markPrice": "38103.05510455",
        //       "unRealizedProfit": "0.00006413",
        //       "liquidationPrice": "25119.97445760",
        //       "leverage": "2",
        //       "maxQty": "1500",
        //       "marginType": "isolated",
        //       "isolatedMargin": "0.00274471",
        //       "isAutoAddMargin": "false",
        //       "positionSide": "BOTH",
        //       "notionalValue": "0.00524892",
        //       "isolatedWallet": "0.00268058"
        //     }
        //
        // inverse portfolio margin
        //
        //     {
        //         "symbol": "ETHUSD_PERP",
        //         "positionAmt": "1",
        //         "entryPrice": "2422.400000007",
        //         "markPrice": "2424.51267823",
        //         "unRealizedProfit": "0.0000036",
        //         "liquidationPrice": "293.57678898",
        //         "leverage": "100",
        //         "positionSide": "LONG",
        //         "updateTime": 1707371941861,
        //         "maxQty": "15",
        //         "notionalValue": "0.00412454",
        //         "breakEvenPrice": "2423.368960034"
        //     }
        //
        // linear portfolio margin
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "positionAmt": "0.01",
        //         "entryPrice": "44525.0",
        //         "markPrice": "45464.1735922",
        //         "unRealizedProfit": "9.39173592",
        //         "liquidationPrice": "38007.16308568",
        //         "leverage": "100",
        //         "positionSide": "LONG",
        //         "updateTime": 1707371879042,
        //         "maxNotionalValue": "500000.0",
        //         "notional": "454.64173592",
        //         "breakEvenPrice": "44542.81"
        //     }
        //
        const marketId = this.safeString (position, 'symbol');
        market = this.safeMarket (marketId, market, undefined, 'contract');
        const symbol = this.safeString (market, 'symbol');
        const isolatedMarginString = this.safeString (position, 'isolatedMargin');
        const leverageBrackets = this.safeDict (this.options, 'leverageBrackets', {});
        const leverageBracket = this.safeList (leverageBrackets, symbol, []);
        const notionalString = this.safeString2 (position, 'notional', 'notionalValue');
        const notionalStringAbs = Precise.stringAbs (notionalString);
        let maintenanceMarginPercentageString = undefined;
        for (let i = 0; i < leverageBracket.length; i++) {
            const bracket = leverageBracket[i];
            if (Precise.stringLt (notionalStringAbs, bracket[0])) {
                break;
            }
            maintenanceMarginPercentageString = bracket[1];
        }
        const notional = this.parseNumber (notionalStringAbs);
        const contractsAbs = Precise.stringAbs (this.safeString (position, 'positionAmt'));
        const contracts = this.parseNumber (contractsAbs);
        const unrealizedPnlString = this.safeString (position, 'unRealizedProfit');
        const unrealizedPnl = this.parseNumber (unrealizedPnlString);
        const liquidationPriceString = this.omitZero (this.safeString (position, 'liquidationPrice'));
        const liquidationPrice = this.parseNumber (liquidationPriceString);
        let collateralString = undefined;
        let marginMode = this.safeString (position, 'marginType');
        if (marginMode === undefined && isolatedMarginString !== undefined) {
            marginMode = Precise.stringEq (isolatedMarginString, '0') ? 'cross' : 'isolated';
        }
        let side = undefined;
        if (Precise.stringGt (notionalString, '0')) {
            side = 'long';
        } else if (Precise.stringLt (notionalString, '0')) {
            side = 'short';
        }
        const entryPriceString = this.safeString (position, 'entryPrice');
        const entryPrice = this.parseNumber (entryPriceString);
        const contractSize = this.safeValue (market, 'contractSize');
        const contractSizeString = this.numberToString (contractSize);
        // as oppose to notionalValue
        const linear = ('notional' in position);
        if (marginMode === 'cross') {
            // calculate collateral
            const precision = this.safeDict (market, 'precision', {});
            const basePrecisionValue = this.safeString (precision, 'base');
            const quotePrecisionValue = this.safeString2 (precision, 'quote', 'price');
            const precisionIsUndefined = (basePrecisionValue === undefined) && (quotePrecisionValue === undefined);
            if (!precisionIsUndefined) {
                if (linear) {
                    // walletBalance = (liquidationPrice * (±1 + mmp) ± entryPrice) * contracts
                    let onePlusMaintenanceMarginPercentageString = undefined;
                    let entryPriceSignString = entryPriceString;
                    if (side === 'short') {
                        onePlusMaintenanceMarginPercentageString = Precise.stringAdd ('1', maintenanceMarginPercentageString);
                        entryPriceSignString = Precise.stringMul ('-1', entryPriceSignString);
                    } else {
                        onePlusMaintenanceMarginPercentageString = Precise.stringAdd ('-1', maintenanceMarginPercentageString);
                    }
                    const inner = Precise.stringMul (liquidationPriceString, onePlusMaintenanceMarginPercentageString);
                    const leftSide = Precise.stringAdd (inner, entryPriceSignString);
                    const quotePrecision = this.precisionFromString (this.safeString2 (precision, 'quote', 'price'));
                    if (quotePrecision !== undefined) {
                        collateralString = Precise.stringDiv (Precise.stringMul (leftSide, contractsAbs), '1', quotePrecision);
                    }
                } else {
                    // walletBalance = (contracts * contractSize) * (±1/entryPrice - (±1 - mmp) / liquidationPrice)
                    let onePlusMaintenanceMarginPercentageString = undefined;
                    let entryPriceSignString = entryPriceString;
                    if (side === 'short') {
                        onePlusMaintenanceMarginPercentageString = Precise.stringSub ('1', maintenanceMarginPercentageString);
                    } else {
                        onePlusMaintenanceMarginPercentageString = Precise.stringSub ('-1', maintenanceMarginPercentageString);
                        entryPriceSignString = Precise.stringMul ('-1', entryPriceSignString);
                    }
                    const leftSide = Precise.stringMul (contractsAbs, contractSizeString);
                    const rightSide = Precise.stringSub (Precise.stringDiv ('1', entryPriceSignString), Precise.stringDiv (onePlusMaintenanceMarginPercentageString, liquidationPriceString));
                    const basePrecision = this.precisionFromString (this.safeString (precision, 'base'));
                    if (basePrecision !== undefined) {
                        collateralString = Precise.stringDiv (Precise.stringMul (leftSide, rightSide), '1', basePrecision);
                    }
                }
            }
        } else {
            collateralString = this.safeString (position, 'isolatedMargin');
        }
        collateralString = (collateralString === undefined) ? '0' : collateralString;
        const collateral = this.parseNumber (collateralString);
        const markPrice = this.parseNumber (this.omitZero (this.safeString (position, 'markPrice')));
        let timestamp = this.safeInteger (position, 'updateTime');
        if (timestamp === 0) {
            timestamp = undefined;
        }
        const maintenanceMarginPercentage = this.parseNumber (maintenanceMarginPercentageString);
        let maintenanceMarginString = Precise.stringMul (maintenanceMarginPercentageString, notionalStringAbs);
        if (maintenanceMarginString === undefined) {
            // for a while, this new value was a backup to the existing calculations, but in future we might prioritize this
            maintenanceMarginString = this.safeString (position, 'maintMargin');
        }
        const maintenanceMargin = this.parseNumber (maintenanceMarginString);
        let initialMarginString = undefined;
        let initialMarginPercentageString = undefined;
        const leverageString = this.safeString (position, 'leverage');
        if (leverageString !== undefined) {
            const leverage = parseInt (leverageString);
            const rational = this.isRoundNumber (1000 % leverage);
            initialMarginPercentageString = Precise.stringDiv ('1', leverageString, 8);
            if (!rational) {
                initialMarginPercentageString = Precise.stringAdd (initialMarginPercentageString, '1e-8');
            }
            const unrounded = Precise.stringMul (notionalStringAbs, initialMarginPercentageString);
            initialMarginString = Precise.stringDiv (unrounded, '1', 8);
        } else {
            initialMarginString = this.safeString (position, 'initialMargin');
            const unrounded = Precise.stringMul (initialMarginString, '1');
            initialMarginPercentageString = Precise.stringDiv (unrounded, notionalStringAbs, 8);
        }
        let marginRatio = undefined;
        let percentage = undefined;
        if (!Precise.stringEquals (collateralString, '0')) {
            marginRatio = this.parseNumber (Precise.stringDiv (Precise.stringAdd (Precise.stringDiv (maintenanceMarginString, collateralString), '5e-5'), '1', 4));
            percentage = this.parseNumber (Precise.stringMul (Precise.stringDiv (unrealizedPnlString, initialMarginString, 4), '100'));
        }
        const positionSide = this.safeString (position, 'positionSide');
        const hedged = positionSide !== 'BOTH';
        return {
            'info': position,
            'id': undefined,
            'symbol': symbol,
            'contracts': contracts,
            'contractSize': contractSize,
            'unrealizedPnl': unrealizedPnl,
            'leverage': this.parseNumber (leverageString),
            'liquidationPrice': liquidationPrice,
            'collateral': collateral,
            'notional': notional,
            'markPrice': markPrice,
            'entryPrice': entryPrice,
            'timestamp': timestamp,
            'initialMargin': this.parseNumber (initialMarginString),
            'initialMarginPercentage': this.parseNumber (initialMarginPercentageString),
            'maintenanceMargin': maintenanceMargin,
            'maintenanceMarginPercentage': maintenanceMarginPercentage,
            'marginRatio': marginRatio,
            'datetime': this.iso8601 (timestamp),
            'marginMode': marginMode,
            'marginType': marginMode, // deprecated
            'side': side,
            'hedged': hedged,
            'percentage': percentage,
            'stopLossPrice': undefined,
            'takeProfitPrice': undefined,
        };
    }

    async loadLeverageBrackets (reload = false, params = {}) {
        await this.loadMarkets ();
        // by default cache the leverage bracket
        // it contains useful stuff like the maintenance margin and initial margin for positions
        const leverageBrackets = this.safeDict (this.options, 'leverageBrackets');
        if ((leverageBrackets === undefined) || (reload)) {
            const defaultType = this.safeString (this.options, 'defaultType', 'future');
            const type = this.safeString (params, 'type', defaultType);
            const query = this.omit (params, 'type');
            let subType = undefined;
            [ subType, params ] = this.handleSubTypeAndParams ('loadLeverageBrackets', undefined, params, 'linear');
            let isPortfolioMargin = undefined;
            [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'loadLeverageBrackets', 'papi', 'portfolioMargin', false);
            let response = undefined;
            if (this.isLinear (type, subType)) {
                if (isPortfolioMargin) {
                    response = await this.papiGetUmLeverageBracket (query);
                } else {
                    response = await this.fapiPrivateGetLeverageBracket (query);
                }
            } else if (this.isInverse (type, subType)) {
                if (isPortfolioMargin) {
                    response = await this.papiGetCmLeverageBracket (query);
                } else {
                    response = await this.dapiPrivateV2GetLeverageBracket (query);
                }
            } else {
                throw new NotSupported (this.id + ' loadLeverageBrackets() supports linear and inverse contracts only');
            }
            this.options['leverageBrackets'] = {};
            for (let i = 0; i < response.length; i++) {
                const entry = response[i];
                const marketId = this.safeString (entry, 'symbol');
                const symbol = this.safeSymbol (marketId, undefined, undefined, 'contract');
                const brackets = this.safeList (entry, 'brackets', []);
                const result = [];
                for (let j = 0; j < brackets.length; j++) {
                    const bracket = brackets[j];
                    const floorValue = this.safeString2 (bracket, 'notionalFloor', 'qtyFloor');
                    const maintenanceMarginPercentage = this.safeString (bracket, 'maintMarginRatio');
                    result.push ([ floorValue, maintenanceMarginPercentage ]);
                }
                this.options['leverageBrackets'][symbol] = result;
            }
        }
        return this.options['leverageBrackets'];
    }

    /**
     * @method
     * @name binance#fetchLeverageTiers
     * @description retrieve information on the maximum leverage, and maintenance margin for trades of varying trade sizes
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Notional-and-Leverage-Brackets
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Notional-Bracket-for-Symbol
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/UM-Notional-and-Leverage-Brackets
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/CM-Notional-and-Leverage-Brackets
     * @param {string[]|undefined} symbols list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch the leverage tiers for a portfolio margin account
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a dictionary of [leverage tiers structures]{@link https://docs.ccxt.com/#/?id=leverage-tiers-structure}, indexed by market symbols
     */
    async fetchLeverageTiers (symbols: Strings = undefined, params = {}): Promise<LeverageTiers> {
        await this.loadMarkets ();
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchLeverageTiers', undefined, params);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchLeverageTiers', undefined, params, 'linear');
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchLeverageTiers', 'papi', 'portfolioMargin', false);
        let response = undefined;
        if (this.isLinear (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetUmLeverageBracket (params);
            } else {
                response = await this.fapiPrivateGetLeverageBracket (params);
            }
        } else if (this.isInverse (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetCmLeverageBracket (params);
            } else {
                response = await this.dapiPrivateV2GetLeverageBracket (params);
            }
        } else {
            throw new NotSupported (this.id + ' fetchLeverageTiers() supports linear and inverse contracts only');
        }
        //
        // usdm
        //
        //    [
        //        {
        //            "symbol": "SUSHIUSDT",
        //            "brackets": [
        //                {
        //                    "bracket": 1,
        //                    "initialLeverage": 50,
        //                    "notionalCap": 50000,
        //                    "notionalFloor": 0,
        //                    "maintMarginRatio": 0.01,
        //                    "cum": 0.0
        //                },
        //                ...
        //            ]
        //        }
        //    ]
        //
        // coinm
        //
        //     [
        //         {
        //             "symbol":"XRPUSD_210326",
        //             "brackets":[
        //                 {
        //                     "bracket":1,
        //                     "initialLeverage":20,
        //                     "qtyCap":500000,
        //                     "qtyFloor":0,
        //                     "maintMarginRatio":0.0185,
        //                     "cum":0.0
        //                 }
        //             ]
        //         }
        //     ]
        //
        return this.parseLeverageTiers (response, symbols, 'symbol');
    }

    parseMarketLeverageTiers (info, market: Market = undefined): LeverageTier[] {
        /**
         * @ignore
         * @method
         * @param {object} info Exchange response for 1 market
         * @param {object} market CCXT market
         */
        //
        //    {
        //        "symbol": "SUSHIUSDT",
        //        "brackets": [
        //            {
        //                "bracket": 1,
        //                "initialLeverage": 50,
        //                "notionalCap": 50000,
        //                "notionalFloor": 0,
        //                "maintMarginRatio": 0.01,
        //                "cum": 0.0
        //            },
        //            ...
        //        ]
        //    }
        //
        const marketId = this.safeString (info, 'symbol');
        market = this.safeMarket (marketId, market, undefined, 'contract');
        const brackets = this.safeList (info, 'brackets', []);
        const tiers = [];
        for (let j = 0; j < brackets.length; j++) {
            const bracket = brackets[j];
            tiers.push ({
                'tier': this.safeNumber (bracket, 'bracket'),
                'symbol': this.safeSymbol (marketId, market),
                'currency': market['quote'],
                'minNotional': this.safeNumber2 (bracket, 'notionalFloor', 'qtyFloor'),
                'maxNotional': this.safeNumber2 (bracket, 'notionalCap', 'qtyCap'),
                'maintenanceMarginRate': this.safeNumber (bracket, 'maintMarginRatio'),
                'maxLeverage': this.safeNumber (bracket, 'initialLeverage'),
                'info': bracket,
            });
        }
        return tiers as LeverageTier[];
    }

    /**
     * @method
     * @name binance#fetchPosition
     * @description fetch data on an open position
     * @see https://developers.binance.com/docs/derivatives/option/trade/Option-Position-Information
     * @param {string} symbol unified market symbol of the market the position is held in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
     */
    async fetchPosition (symbol: string, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (!market['option']) {
            throw new NotSupported (this.id + ' fetchPosition() supports option markets only');
        }
        const request: Dict = {
            'symbol': market['id'],
        };
        const response = await this.eapiPrivateGetPosition (this.extend (request, params));
        //
        //     [
        //         {
        //             "entryPrice": "27.70000000",
        //             "symbol": "ETH-230426-1850-C",
        //             "side": "LONG",
        //             "quantity": "0.50000000",
        //             "reducibleQty": "0.50000000",
        //             "markValue": "10.250000000",
        //             "ror": "-0.2599",
        //             "unrealizedPNL": "-3.600000000",
        //             "markPrice": "20.5",
        //             "strikePrice": "1850.00000000",
        //             "positionCost": "13.85000000",
        //             "expiryDate": 1682496000000,
        //             "priceScale": 1,
        //             "quantityScale": 2,
        //             "optionSide": "CALL",
        //             "quoteAsset": "USDT",
        //             "time": 1682492427106
        //         }
        //     ]
        //
        return this.parsePosition (response[0], market);
    }

    /**
     * @method
     * @name binance#fetchOptionPositions
     * @description fetch data on open options positions
     * @see https://developers.binance.com/docs/derivatives/option/trade/Option-Position-Information
     * @param {string[]|undefined} symbols list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} a list of [position structures]{@link https://docs.ccxt.com/#/?id=position-structure}
     */
    async fetchOptionPositions (symbols: Strings = undefined, params = {}) {
        await this.loadMarkets ();
        symbols = this.marketSymbols (symbols);
        const request: Dict = {};
        let market = undefined;
        if (symbols !== undefined) {
            let symbol = undefined;
            if (Array.isArray (symbols)) {
                const symbolsLength = symbols.length;
                if (symbolsLength > 1) {
                    throw new BadRequest (this.id + ' fetchPositions() symbols argument cannot contain more than 1 symbol');
                }
                symbol = symbols[0];
            } else {
                symbol = symbols;
            }
            market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        const response = await this.eapiPrivateGetPosition (this.extend (request, params));
        //
        //     [
        //         {
        //             "entryPrice": "27.70000000",
        //             "symbol": "ETH-230426-1850-C",
        //             "side": "LONG",
        //             "quantity": "0.50000000",
        //             "reducibleQty": "0.50000000",
        //             "markValue": "10.250000000",
        //             "ror": "-0.2599",
        //             "unrealizedPNL": "-3.600000000",
        //             "markPrice": "20.5",
        //             "strikePrice": "1850.00000000",
        //             "positionCost": "13.85000000",
        //             "expiryDate": 1682496000000,
        //             "priceScale": 1,
        //             "quantityScale": 2,
        //             "optionSide": "CALL",
        //             "quoteAsset": "USDT",
        //             "time": 1682492427106
        //         }
        //     ]
        //
        const result = [];
        for (let i = 0; i < response.length; i++) {
            result.push (this.parsePosition (response[i], market));
        }
        return this.filterByArrayPositions (result, 'symbol', symbols, false);
    }

    parsePosition (position: Dict, market: Market = undefined) {
        //
        //     {
        //         "entryPrice": "27.70000000",
        //         "symbol": "ETH-230426-1850-C",
        //         "side": "LONG",
        //         "quantity": "0.50000000",
        //         "reducibleQty": "0.50000000",
        //         "markValue": "10.250000000",
        //         "ror": "-0.2599",
        //         "unrealizedPNL": "-3.600000000",
        //         "markPrice": "20.5",
        //         "strikePrice": "1850.00000000",
        //         "positionCost": "13.85000000",
        //         "expiryDate": 1682496000000,
        //         "priceScale": 1,
        //         "quantityScale": 2,
        //         "optionSide": "CALL",
        //         "quoteAsset": "USDT",
        //         "time": 1682492427106
        //     }
        //
        const marketId = this.safeString (position, 'symbol');
        market = this.safeMarket (marketId, market);
        const symbol = market['symbol'];
        const side = this.safeStringLower (position, 'side');
        let quantity = this.safeString (position, 'quantity');
        if (side !== 'long') {
            quantity = Precise.stringMul ('-1', quantity);
        }
        const timestamp = this.safeInteger (position, 'time');
        return this.safePosition ({
            'info': position,
            'id': undefined,
            'symbol': symbol,
            'entryPrice': this.safeNumber (position, 'entryPrice'),
            'markPrice': this.safeNumber (position, 'markPrice'),
            'notional': this.safeNumber (position, 'markValue'),
            'collateral': this.safeNumber (position, 'positionCost'),
            'unrealizedPnl': this.safeNumber (position, 'unrealizedPNL'),
            'side': side,
            'contracts': this.parseNumber (quantity),
            'contractSize': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'hedged': undefined,
            'maintenanceMargin': undefined,
            'maintenanceMarginPercentage': undefined,
            'initialMargin': undefined,
            'initialMarginPercentage': undefined,
            'leverage': undefined,
            'liquidationPrice': undefined,
            'marginRatio': undefined,
            'marginMode': undefined,
            'percentage': undefined,
        });
    }

    /**
     * @method
     * @name binance#fetchPositions
     * @description fetch all open positions
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V2
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Account-Information
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Position-Information
     * @see https://developers.binance.com/docs/derivatives/option/trade/Option-Position-Information
     * @param {string[]} [symbols] list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {object} [params.params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.method] method name to call, "positionRisk", "account" or "option", default is "positionRisk"
     * @param {bool} [params.useV2] set to true if you want to use the obsolete endpoint, where some more additional fields were provided
     * @returns {object[]} a list of [position structure]{@link https://docs.ccxt.com/#/?id=position-structure}
     */
    async fetchPositions (symbols: Strings = undefined, params = {}) {
        let defaultMethod = undefined;
        [ defaultMethod, params ] = this.handleOptionAndParams (params, 'fetchPositions', 'method');
        if (defaultMethod === undefined) {
            const options = this.safeDict (this.options, 'fetchPositions');
            if (options === undefined) {
                defaultMethod = this.safeString (this.options, 'fetchPositions', 'positionRisk');
            } else {
                defaultMethod = 'positionRisk';
            }
        }
        if (defaultMethod === 'positionRisk') {
            return await this.fetchPositionsRisk (symbols, params);
        } else if (defaultMethod === 'account') {
            return await this.fetchAccountPositions (symbols, params);
        } else if (defaultMethod === 'option') {
            return await this.fetchOptionPositions (symbols, params);
        } else {
            throw new NotSupported (this.id + '.options["fetchPositions"]["method"] or params["method"] = "' + defaultMethod + '" is invalid, please choose between "account", "positionRisk" and "option"');
        }
    }

    /**
     * @method
     * @name binance#fetchAccountPositions
     * @ignore
     * @description fetch account positions
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V2
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Account-Information
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Position-Information
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V3
     * @param {string[]} [symbols] list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch positions in a portfolio margin account
     * @param {string} [params.subType] "linear" or "inverse"
     * @param {boolean} [params.filterClosed] set to true if you would like to filter out closed positions, default is false
     * @param {boolean} [params.useV2] set to true if you want to use obsolete endpoint, where some more additional fields were provided
     * @returns {object} data on account positions
     */
    async fetchAccountPositions (symbols: Strings = undefined, params = {}) {
        if (symbols !== undefined) {
            if (!Array.isArray (symbols)) {
                throw new ArgumentsRequired (this.id + ' fetchPositions() requires an array argument for symbols');
            }
        }
        await this.loadMarkets ();
        await this.loadLeverageBrackets (false, params);
        const defaultType = this.safeString (this.options, 'defaultType', 'future');
        const type = this.safeString (params, 'type', defaultType);
        params = this.omit (params, 'type');
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchAccountPositions', undefined, params, 'linear');
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchAccountPositions', 'papi', 'portfolioMargin', false);
        let response = undefined;
        if (this.isLinear (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetUmAccount (params);
            } else {
                let useV2 = undefined;
                [ useV2, params ] = this.handleOptionAndParams (params, 'fetchAccountPositions', 'useV2', false);
                if (!useV2) {
                    response = await this.fapiPrivateV3GetAccount (params);
                } else {
                    response = await this.fapiPrivateV2GetAccount (params);
                }
                //
                //    {
                //        "totalInitialMargin": "99.62112386",
                //        "totalMaintMargin": "11.95453485",
                //        "totalWalletBalance": "99.84331553",
                //        "totalUnrealizedProfit": "11.17675690",
                //        "totalMarginBalance": "111.02007243",
                //        "totalPositionInitialMargin": "99.62112386",
                //        "totalOpenOrderInitialMargin": "0.00000000",
                //        "totalCrossWalletBalance": "99.84331553",
                //        "totalCrossUnPnl": "11.17675690",
                //        "availableBalance": "11.39894857",
                //        "maxWithdrawAmount": "11.39894857",
                //        "feeTier": "0",      // in v2
                //        "canTrade": true,    // in v2
                //        "canDeposit": true,  // in v2
                //        "canWithdraw": true, // in v2
                //        "feeBurn": true,     // in v2
                //        "tradeGroupId": "-1",// in v2
                //        "updateTime": "0",   // in v2
                //        "multiAssetsMargin": true // in v2
                //        "assets": [
                //            {
                //                "asset": "USDT",
                //                "walletBalance": "72.72317863",
                //                "unrealizedProfit": "11.17920750",
                //                "marginBalance": "83.90238613",
                //                "maintMargin": "11.95476475",
                //                "initialMargin": "99.62303962",
                //                "positionInitialMargin": "99.62303962",
                //                "openOrderInitialMargin": "0.00000000",
                //                "crossWalletBalance": "72.72317863",
                //                "crossUnPnl": "11.17920750",
                //                "availableBalance": "11.39916777",
                //                "maxWithdrawAmount": "11.39916777",
                //                "updateTime": "1721995605338",
                //                "marginAvailable": true // in v2
                //            },
                //            ... and some few supported settle currencies: USDC, BTC, ETH, BNB ..
                //        ],
                //        "positions": [
                //            {
                //                "symbol": "WLDUSDT",
                //                "positionSide": "BOTH",
                //                "positionAmt": "-849",
                //                "unrealizedProfit": "11.17920750",
                //                "isolatedMargin": "0",
                //                "isolatedWallet": "0",
                //                "notional": "-1992.46079250",
                //                "initialMargin": "99.62303962",
                //                "maintMargin": "11.95476475",
                //                "updateTime": "1721995760449"
                //                "leverage": "50",                        // in v2
                //                "entryPrice": "2.34",                    // in v2
                //                "positionInitialMargin": "118.82116614", // in v2
                //                "openOrderInitialMargin": "0",           // in v2
                //                "isolated": false,                       // in v2
                //                "breakEvenPrice": "2.3395788",           // in v2
                //                "maxNotional": "25000",                  // in v2
                //                "bidNotional": "0",                      // in v2
                //                "askNotional": "0"                       // in v2
                //            },
                //            ...
                //        ]
                //    }
                //
            }
        } else if (this.isInverse (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetCmAccount (params);
            } else {
                response = await this.dapiPrivateGetAccount (params);
            }
        } else {
            throw new NotSupported (this.id + ' fetchPositions() supports linear and inverse contracts only');
        }
        let filterClosed = undefined;
        [ filterClosed, params ] = this.handleOptionAndParams (params, 'fetchAccountPositions', 'filterClosed', false);
        const result = this.parseAccountPositions (response, filterClosed);
        symbols = this.marketSymbols (symbols);
        return this.filterByArrayPositions (result, 'symbol', symbols, false);
    }

    /**
     * @method
     * @name binance#fetchPositionsRisk
     * @ignore
     * @description fetch positions risk
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V2
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Position-Information
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-UM-Position-Information
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Query-CM-Position-Information
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Position-Information-V3
     * @param {string[]|undefined} symbols list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch positions for a portfolio margin account
     * @param {string} [params.subType] "linear" or "inverse"
     * @param {bool} [params.useV2] set to true if you want to use the obsolete endpoint, where some more additional fields were provided
     * @returns {object} data on the positions risk
     */
    async fetchPositionsRisk (symbols: Strings = undefined, params = {}) {
        if (symbols !== undefined) {
            if (!Array.isArray (symbols)) {
                throw new ArgumentsRequired (this.id + ' fetchPositionsRisk() requires an array argument for symbols');
            }
        }
        await this.loadMarkets ();
        await this.loadLeverageBrackets (false, params);
        const request: Dict = {};
        let defaultType = 'future';
        defaultType = this.safeString (this.options, 'defaultType', defaultType);
        const type = this.safeString (params, 'type', defaultType);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchPositionsRisk', undefined, params, 'linear');
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchPositionsRisk', 'papi', 'portfolioMargin', false);
        params = this.omit (params, 'type');
        let response = undefined;
        if (this.isLinear (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetUmPositionRisk (this.extend (request, params));
            } else {
                let useV2 = undefined;
                [ useV2, params ] = this.handleOptionAndParams (params, 'fetchPositionsRisk', 'useV2', false);
                params = this.extend (request, params);
                if (!useV2) {
                    response = await this.fapiPrivateV3GetPositionRisk (params);
                } else {
                    response = await this.fapiPrivateV2GetPositionRisk (params);
                }
                //
                // [
                //  {
                //     symbol: "WLDUSDT",
                //     positionSide: "BOTH",
                //     positionAmt: "5",
                //     entryPrice: "2.3483",
                //     breakEvenPrice: "2.349356735",
                //     markPrice: "2.39560000",
                //     unRealizedProfit: "0.23650000",
                //     liquidationPrice: "0",
                //     isolatedMargin: "0",
                //     notional: "11.97800000",
                //     isolatedWallet: "0",
                //     updateTime: "1722062678998",
                //     initialMargin: "2.39560000",         // added in v3
                //     maintMargin: "0.07186800",           // added in v3
                //     positionInitialMargin: "2.39560000", // added in v3
                //     openOrderInitialMargin: "0",         // added in v3
                //     adl: "2",                            // added in v3
                //     bidNotional: "0",                    // added in v3
                //     askNotional: "0",                    // added in v3
                //     marginAsset: "USDT",                 // added in v3
                //  },
                // ]
                //
            }
        } else if (this.isInverse (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetCmPositionRisk (this.extend (request, params));
            } else {
                response = await this.dapiPrivateGetPositionRisk (this.extend (request, params));
            }
        } else {
            throw new NotSupported (this.id + ' fetchPositionsRisk() supports linear and inverse contracts only');
        }
        // ### Response examples ###
        //
        // For One-way position mode:
        //
        //     [
        //         {
        //             "symbol": "BTCUSDT",
        //             "positionSide": "BOTH",
        //             "positionAmt": "0.000",
        //             "entryPrice": "0.00000",
        //             "markPrice": "6679.50671178",
        //             "unRealizedProfit": "0.00000000",
        //             "liquidationPrice": "0",
        //             "isolatedMargin": "0.00000000",
        //             "marginType": "isolated",
        //             "isAutoAddMargin": "false",
        //             "leverage": "10",
        //             "maxNotionalValue": "20000000",
        //             "updateTime": 0
        //        }
        //     ]
        //
        // For Hedge position mode:
        //
        //     [
        //         {
        //             "entryPrice": "6563.66500",
        //             "marginType": "isolated",
        //             "isAutoAddMargin": "false",
        //             "isolatedMargin": "15517.54150468",
        //             "leverage": "10",
        //             "liquidationPrice": "5930.78",
        //             "markPrice": "6679.50671178",
        //             "maxNotionalValue": "20000000",
        //             "positionSide": "LONG",
        //             "positionAmt": "20.000", // negative value for 'SHORT'
        //             "symbol": "BTCUSDT",
        //             "unRealizedProfit": "2316.83423560"
        //             "updateTime": 1625474304765
        //         },
        //         .. second dict is similar, but with `positionSide: SHORT`
        //     ]
        //
        // inverse portfolio margin:
        //
        //     [
        //         {
        //             "symbol": "ETHUSD_PERP",
        //             "positionAmt": "1",
        //             "entryPrice": "2422.400000007",
        //             "markPrice": "2424.51267823",
        //             "unRealizedProfit": "0.0000036",
        //             "liquidationPrice": "293.57678898",
        //             "leverage": "100",
        //             "positionSide": "LONG",
        //             "updateTime": 1707371941861,
        //             "maxQty": "15",
        //             "notionalValue": "0.00412454",
        //             "breakEvenPrice": "2423.368960034"
        //         }
        //     ]
        //
        // linear portfolio margin:
        //
        //     [
        //         {
        //             "symbol": "BTCUSDT",
        //             "positionAmt": "0.01",
        //             "entryPrice": "44525.0",
        //             "markPrice": "45464.1735922",
        //             "unRealizedProfit": "9.39173592",
        //             "liquidationPrice": "38007.16308568",
        //             "leverage": "100",
        //             "positionSide": "LONG",
        //             "updateTime": 1707371879042,
        //             "maxNotionalValue": "500000.0",
        //             "notional": "454.64173592",
        //             "breakEvenPrice": "44542.81"
        //         }
        //     ]
        //
        const result = [];
        for (let i = 0; i < response.length; i++) {
            const rawPosition = response[i];
            const entryPriceString = this.safeString (rawPosition, 'entryPrice');
            if (Precise.stringGt (entryPriceString, '0')) {
                result.push (this.parsePositionRisk (response[i]));
            }
        }
        symbols = this.marketSymbols (symbols);
        return this.filterByArrayPositions (result, 'symbol', symbols, false);
    }

    /**
     * @method
     * @name binance#fetchFundingHistory
     * @description fetch the history of funding payments paid and received on this account
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-Income-History
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Get-Income-History
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History
     * @param {string} symbol unified market symbol
     * @param {int} [since] the earliest time in ms to fetch funding history for
     * @param {int} [limit] the maximum number of funding history structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] timestamp in ms of the latest funding history entry
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch the funding history for a portfolio margin account
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a [funding history structure]{@link https://docs.ccxt.com/#/?id=funding-history-structure}
     */
    async fetchFundingHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        let market = undefined;
        let request: Dict = {
            'incomeType': 'FUNDING_FEE', // "TRANSFER"，"WELCOME_BONUS", "REALIZED_PNL"，"FUNDING_FEE", "COMMISSION" and "INSURANCE_CLEAR"
        };
        if (symbol !== undefined) {
            market = this.market (symbol);
            request['symbol'] = market['id'];
            if (!market['swap']) {
                throw new NotSupported (this.id + ' fetchFundingHistory() supports swap contracts only');
            }
        }
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchFundingHistory', market, params, 'linear');
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchFundingHistory', 'papi', 'portfolioMargin', false);
        [ request, params ] = this.handleUntilOption ('endTime', request, params);
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const defaultType = this.safeString2 (this.options, 'fetchFundingHistory', 'defaultType', 'future');
        const type = this.safeString (params, 'type', defaultType);
        params = this.omit (params, 'type');
        let response = undefined;
        if (this.isLinear (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetUmIncome (this.extend (request, params));
            } else {
                response = await this.fapiPrivateGetIncome (this.extend (request, params));
            }
        } else if (this.isInverse (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetCmIncome (this.extend (request, params));
            } else {
                response = await this.dapiPrivateGetIncome (this.extend (request, params));
            }
        } else {
            throw new NotSupported (this.id + ' fetchFundingHistory() supports linear and inverse contracts only');
        }
        return this.parseIncomes (response, market, since, limit);
    }

    /**
     * @method
     * @name binance#setLeverage
     * @description set the level of leverage for a market
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Initial-Leverage
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Change-Initial-Leverage
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-UM-Initial-Leverage
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Change-CM-Initial-Leverage
     * @param {float} leverage the rate of leverage
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.portfolioMargin] set to true if you would like to set the leverage for a trading pair in a portfolio margin account
     * @returns {object} response from the exchange
     */
    async setLeverage (leverage: Int, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' setLeverage() requires a symbol argument');
        }
        // WARNING: THIS WILL INCREASE LIQUIDATION PRICE FOR OPEN ISOLATED LONG POSITIONS
        // AND DECREASE LIQUIDATION PRICE FOR OPEN ISOLATED SHORT POSITIONS
        if ((leverage < 1) || (leverage > 125)) {
            throw new BadRequest (this.id + ' leverage should be between 1 and 125');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
            'leverage': leverage,
        };
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'setLeverage', 'papi', 'portfolioMargin', false);
        let response = undefined;
        if (market['linear']) {
            if (isPortfolioMargin) {
                response = await this.papiPostUmLeverage (this.extend (request, params));
            } else {
                response = await this.fapiPrivatePostLeverage (this.extend (request, params));
            }
        } else if (market['inverse']) {
            if (isPortfolioMargin) {
                response = await this.papiPostCmLeverage (this.extend (request, params));
            } else {
                response = await this.dapiPrivatePostLeverage (this.extend (request, params));
            }
        } else {
            throw new NotSupported (this.id + ' setLeverage() supports linear and inverse contracts only');
        }
        return response;
    }

    /**
     * @method
     * @name binance#setMarginMode
     * @description set margin mode to 'cross' or 'isolated'
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Margin-Type
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Change-Margin-Type
     * @param {string} marginMode 'cross' or 'isolated'
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} response from the exchange
     */
    async setMarginMode (marginMode: string, symbol: Str = undefined, params = {}) {
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' setMarginMode() requires a symbol argument');
        }
        //
        // { "code": -4048 , "msg": "Margin type cannot be changed if there exists position." }
        //
        // or
        //
        // { "code": 200, "msg": "success" }
        //
        marginMode = marginMode.toUpperCase ();
        if (marginMode === 'CROSS') {
            marginMode = 'CROSSED';
        }
        if ((marginMode !== 'ISOLATED') && (marginMode !== 'CROSSED')) {
            throw new BadRequest (this.id + ' marginMode must be either isolated or cross');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
            'marginType': marginMode,
        };
        let response = undefined;
        try {
            if (market['linear']) {
                response = await this.fapiPrivatePostMarginType (this.extend (request, params));
            } else if (market['inverse']) {
                response = await this.dapiPrivatePostMarginType (this.extend (request, params));
            } else {
                throw new NotSupported (this.id + ' setMarginMode() supports linear and inverse contracts only');
            }
        } catch (e) {
            // not an error
            // https://github.com/ccxt/ccxt/issues/11268
            // https://github.com/ccxt/ccxt/pull/11624
            // POST https://fapi.binance.com/fapi/v1/marginType 400 Bad Request
            // binanceusdm
            if (e instanceof MarginModeAlreadySet) {
                const throwMarginModeAlreadySet = this.safeBool (this.options, 'throwMarginModeAlreadySet', false);
                if (throwMarginModeAlreadySet) {
                    throw e;
                } else {
                    response = { 'code': -4046, 'msg': 'No need to change margin type.' };
                }
            } else {
                throw e;
            }
        }
        return response;
    }

    /**
     * @method
     * @name binance#setPositionMode
     * @description set hedged to true or false for a market
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Change-Position-Mode
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Change-Position-Mode
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Current-Position-Mode
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Current-Position-Mode
     * @param {bool} hedged set to true to use dualSidePosition
     * @param {string} symbol not used by binance setPositionMode ()
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.portfolioMargin] set to true if you would like to set the position mode for a portfolio margin account
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} response from the exchange
     */
    async setPositionMode (hedged: boolean, symbol: Str = undefined, params = {}) {
        const defaultType = this.safeString (this.options, 'defaultType', 'future');
        const type = this.safeString (params, 'type', defaultType);
        params = this.omit (params, [ 'type' ]);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('setPositionMode', undefined, params);
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'setPositionMode', 'papi', 'portfolioMargin', false);
        let dualSidePosition = undefined;
        if (hedged) {
            dualSidePosition = 'true';
        } else {
            dualSidePosition = 'false';
        }
        const request: Dict = {
            'dualSidePosition': dualSidePosition,
        };
        let response = undefined;
        if (this.isInverse (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiPostCmPositionSideDual (this.extend (request, params));
            } else {
                response = await this.dapiPrivatePostPositionSideDual (this.extend (request, params));
            }
        } else if (this.isLinear (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiPostUmPositionSideDual (this.extend (request, params));
            } else {
                response = await this.fapiPrivatePostPositionSideDual (this.extend (request, params));
            }
        } else {
            throw new BadRequest (this.id + ' setPositionMode() supports linear and inverse contracts only');
        }
        //
        //     {
        //       "code": 200,
        //       "msg": "success"
        //     }
        //
        return response;
    }

    /**
     * @method
     * @name binance#fetchLeverages
     * @description fetch the set leverage for all markets
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V2
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Account-Information
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Account-Detail
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Account-Detail
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Symbol-Config
     * @param {string[]} [symbols] a list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a list of [leverage structures]{@link https://docs.ccxt.com/#/?id=leverage-structure}
     */
    async fetchLeverages (symbols: Strings = undefined, params = {}): Promise<Leverages> {
        await this.loadMarkets ();
        await this.loadLeverageBrackets (false, params);
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchLeverages', undefined, params);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchLeverages', undefined, params, 'linear');
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchLeverages', 'papi', 'portfolioMargin', false);
        let response = undefined;
        if (this.isLinear (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetUmAccount (params);
            } else {
                response = await this.fapiPrivateGetSymbolConfig (params);
            }
        } else if (this.isInverse (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetCmAccount (params);
            } else {
                response = await this.dapiPrivateGetAccount (params);
            }
        } else {
            throw new NotSupported (this.id + ' fetchLeverages() supports linear and inverse contracts only');
        }
        let leverages = this.safeList (response, 'positions', []);
        if (Array.isArray (response)) {
            leverages = response;
        }
        return this.parseLeverages (leverages, symbols, 'symbol');
    }

    parseLeverage (leverage: Dict, market: Market = undefined): Leverage {
        const marketId = this.safeString (leverage, 'symbol');
        const marginModeRaw = this.safeBool (leverage, 'isolated');
        let marginMode = undefined;
        if (marginModeRaw !== undefined) {
            marginMode = marginModeRaw ? 'isolated' : 'cross';
        }
        const marginTypeRaw = this.safeStringLower (leverage, 'marginType');
        if (marginTypeRaw !== undefined) {
            marginMode = (marginTypeRaw === 'crossed') ? 'cross' : 'isolated';
        }
        const side = this.safeStringLower (leverage, 'positionSide');
        let longLeverage = undefined;
        let shortLeverage = undefined;
        const leverageValue = this.safeInteger (leverage, 'leverage');
        if ((side === undefined) || (side === 'both')) {
            longLeverage = leverageValue;
            shortLeverage = leverageValue;
        } else if (side === 'long') {
            longLeverage = leverageValue;
        } else if (side === 'short') {
            shortLeverage = leverageValue;
        }
        return {
            'info': leverage,
            'symbol': this.safeSymbol (marketId, market),
            'marginMode': marginMode,
            'longLeverage': longLeverage,
            'shortLeverage': shortLeverage,
        } as Leverage;
    }

    /**
     * @method
     * @name binance#fetchSettlementHistory
     * @description fetches historical settlement records
     * @see https://developers.binance.com/docs/derivatives/option/market-data/Historical-Exercise-Records
     * @param {string} symbol unified market symbol of the settlement history
     * @param {int} [since] timestamp in ms
     * @param {int} [limit] number of records, default 100, max 100
     * @param {object} [params] exchange specific params
     * @returns {object[]} a list of [settlement history objects]{@link https://docs.ccxt.com/#/?id=settlement-history-structure}
     */
    async fetchSettlementHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        const market = (symbol === undefined) ? undefined : this.market (symbol);
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchSettlementHistory', market, params);
        if (type !== 'option') {
            throw new NotSupported (this.id + ' fetchSettlementHistory() supports option markets only');
        }
        const request: Dict = {};
        if (symbol !== undefined) {
            symbol = market['symbol'];
            request['underlying'] = market['baseId'] + market['quoteId'];
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.eapiPublicGetExerciseHistory (this.extend (request, params));
        //
        //     [
        //         {
        //             "symbol": "ETH-230223-1900-P",
        //             "strikePrice": "1900",
        //             "realStrikePrice": "1665.5897334",
        //             "expiryDate": 1677139200000,
        //             "strikeResult": "REALISTIC_VALUE_STRICKEN"
        //         }
        //     ]
        //
        const settlements = this.parseSettlements (response, market);
        const sorted = this.sortBy (settlements, 'timestamp');
        return this.filterBySymbolSinceLimit (sorted, symbol, since, limit);
    }

    /**
     * @method
     * @name binance#fetchMySettlementHistory
     * @description fetches historical settlement records of the user
     * @see https://developers.binance.com/docs/derivatives/option/trade/User-Exercise-Record
     * @param {string} symbol unified market symbol of the settlement history
     * @param {int} [since] timestamp in ms
     * @param {int} [limit] number of records
     * @param {object} [params] exchange specific params
     * @returns {object[]} a list of [settlement history objects]
     */
    async fetchMySettlementHistory (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        const market = (symbol === undefined) ? undefined : this.market (symbol);
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchMySettlementHistory', market, params);
        if (type !== 'option') {
            throw new NotSupported (this.id + ' fetchMySettlementHistory() supports option markets only');
        }
        const request: Dict = {};
        if (symbol !== undefined) {
            request['symbol'] = market['id'];
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const response = await this.eapiPrivateGetExerciseRecord (this.extend (request, params));
        //
        //     [
        //         {
        //             "id": "1125899906842897036",
        //             "currency": "USDT",
        //             "symbol": "BTC-230728-30000-C",
        //             "exercisePrice": "30000.00000000",
        //             "markPrice": "29160.71284993",
        //             "quantity": "1.00000000",
        //             "amount": "0.00000000",
        //             "fee": "0.00000000",
        //             "createDate": 1690531200000,
        //             "priceScale": 0,
        //             "quantityScale": 2,
        //             "optionSide": "CALL",
        //             "positionSide": "LONG",
        //             "quoteAsset": "USDT"
        //         }
        //     ]
        //
        const settlements = this.parseSettlements (response, market);
        const sorted = this.sortBy (settlements, 'timestamp');
        return this.filterBySymbolSinceLimit (sorted, market['symbol'], since, limit);
    }

    parseSettlement (settlement, market) {
        //
        // fetchSettlementHistory
        //
        //     {
        //         "symbol": "ETH-230223-1900-P",
        //         "strikePrice": "1900",
        //         "realStrikePrice": "1665.5897334",
        //         "expiryDate": 1677139200000,
        //         "strikeResult": "REALISTIC_VALUE_STRICKEN"
        //     }
        //
        // fetchMySettlementHistory
        //
        //     {
        //         "id": "1125899906842897036",
        //         "currency": "USDT",
        //         "symbol": "BTC-230728-30000-C",
        //         "exercisePrice": "30000.00000000",
        //         "markPrice": "29160.71284993",
        //         "quantity": "1.00000000",
        //         "amount": "0.00000000",
        //         "fee": "0.00000000",
        //         "createDate": 1690531200000,
        //         "priceScale": 0,
        //         "quantityScale": 2,
        //         "optionSide": "CALL",
        //         "positionSide": "LONG",
        //         "quoteAsset": "USDT"
        //     }
        //
        const timestamp = this.safeInteger2 (settlement, 'expiryDate', 'createDate');
        const marketId = this.safeString (settlement, 'symbol');
        return {
            'info': settlement,
            'symbol': this.safeSymbol (marketId, market),
            'price': this.safeNumber2 (settlement, 'realStrikePrice', 'exercisePrice'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        };
    }

    parseSettlements (settlements, market) {
        //
        // fetchSettlementHistory
        //
        //     [
        //         {
        //             "symbol": "ETH-230223-1900-P",
        //             "strikePrice": "1900",
        //             "realStrikePrice": "1665.5897334",
        //             "expiryDate": 1677139200000,
        //             "strikeResult": "EXTRINSIC_VALUE_EXPIRED"
        //         }
        //     ]
        //
        // fetchMySettlementHistory
        //
        //     [
        //         {
        //             "id": "1125899906842897036",
        //             "currency": "USDT",
        //             "symbol": "BTC-230728-30000-C",
        //             "exercisePrice": "30000.00000000",
        //             "markPrice": "29160.71284993",
        //             "quantity": "1.00000000",
        //             "amount": "0.00000000",
        //             "fee": "0.00000000",
        //             "createDate": 1690531200000,
        //             "priceScale": 0,
        //             "quantityScale": 2,
        //             "optionSide": "CALL",
        //             "positionSide": "LONG",
        //             "quoteAsset": "USDT"
        //         }
        //     ]
        //
        const result = [];
        for (let i = 0; i < settlements.length; i++) {
            result.push (this.parseSettlement (settlements[i], market));
        }
        return result;
    }

    /**
     * @method
     * @name binance#fetchLedgerEntry
     * @description fetch the history of changes, actions done by the user or operations that altered the balance of the user
     * @see https://developers.binance.com/docs/derivatives/option/account/Account-Funding-Flow
     * @param {string} id the identification number of the ledger entry
     * @param {string} code unified currency code
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [ledger structure]{@link https://docs.ccxt.com/#/?id=ledger-structure}
     */
    async fetchLedgerEntry (id: string, code: Str = undefined, params = {}): Promise<LedgerEntry> {
        await this.loadMarkets ();
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchLedgerEntry', undefined, params);
        if (type !== 'option') {
            throw new BadRequest (this.id + ' fetchLedgerEntry() can only be used for type option');
        }
        this.checkRequiredArgument ('fetchLedgerEntry', code, 'code');
        const currency = this.currency (code);
        const request: Dict = {
            'recordId': id,
            'currency': currency['id'],
        };
        const response = await this.eapiPrivateGetBill (this.extend (request, params));
        //
        //     [
        //         {
        //             "id": "1125899906845701870",
        //             "asset": "USDT",
        //             "amount": "-0.16518203",
        //             "type": "FEE",
        //             "createDate": 1676621042489
        //         }
        //     ]
        //
        const first = this.safeDict (response, 0, response);
        return this.parseLedgerEntry (first, currency);
    }

    /**
     * @method
     * @name binance#fetchLedger
     * @description fetch the history of changes, actions done by the user or operations that altered the balance of the user
     * @see https://developers.binance.com/docs/derivatives/option/account/Account-Funding-Flow
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-Income-History
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Get-Income-History
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-UM-Income-History
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-CM-Income-History
     * @param {string} [code] unified currency code
     * @param {int} [since] timestamp in ms of the earliest ledger entry
     * @param {int} [limit] max number of ledger entries to return
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] timestamp in ms of the latest ledger entry
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch the ledger for a portfolio margin account
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a [ledger structure]{@link https://docs.ccxt.com/#/?id=ledger-structure}
     */
    async fetchLedger (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<LedgerEntry[]> {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchLedger', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallDynamic ('fetchLedger', code, since, limit, params) as LedgerEntry[];
        }
        let type = undefined;
        let subType = undefined;
        let currency = undefined;
        if (code !== undefined) {
            currency = this.currency (code);
        }
        const request: Dict = {};
        [ type, params ] = this.handleMarketTypeAndParams ('fetchLedger', undefined, params);
        [ subType, params ] = this.handleSubTypeAndParams ('fetchLedger', undefined, params);
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const until = this.safeInteger (params, 'until');
        if (until !== undefined) {
            params = this.omit (params, 'until');
            request['endTime'] = until;
        }
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchLedger', 'papi', 'portfolioMargin', false);
        let response = undefined;
        if (type === 'option') {
            this.checkRequiredArgument ('fetchLedger', code, 'code');
            request['currency'] = currency['id'];
            response = await this.eapiPrivateGetBill (this.extend (request, params));
        } else if (this.isLinear (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetUmIncome (this.extend (request, params));
            } else {
                response = await this.fapiPrivateGetIncome (this.extend (request, params));
            }
        } else if (this.isInverse (type, subType)) {
            if (isPortfolioMargin) {
                response = await this.papiGetCmIncome (this.extend (request, params));
            } else {
                response = await this.dapiPrivateGetIncome (this.extend (request, params));
            }
        } else {
            throw new NotSupported (this.id + ' fetchLedger() supports contract wallets only');
        }
        //
        // options (eapi)
        //
        //     [
        //         {
        //             "id": "1125899906845701870",
        //             "asset": "USDT",
        //             "amount": "-0.16518203",
        //             "type": "FEE",
        //             "createDate": 1676621042489
        //         }
        //     ]
        //
        // futures (fapi, dapi, papi)
        //
        //     [
        //         {
        //             "symbol": "",
        //             "incomeType": "TRANSFER",
        //             "income": "10.00000000",
        //             "asset": "USDT",
        //             "time": 1677645250000,
        //             "info": "TRANSFER",
        //             "tranId": 131001573082,
        //             "tradeId": ""
        //         }
        //     ]
        //
        return this.parseLedger (response, currency, since, limit);
    }

    parseLedgerEntry (item: Dict, currency: Currency = undefined): LedgerEntry {
        //
        // options (eapi)
        //
        //     {
        //         "id": "1125899906845701870",
        //         "asset": "USDT",
        //         "amount": "-0.16518203",
        //         "type": "FEE",
        //         "createDate": 1676621042489
        //     }
        //
        // futures (fapi, dapi, papi)
        //
        //     {
        //         "symbol": "",
        //         "incomeType": "TRANSFER",
        //         "income": "10.00000000",
        //         "asset": "USDT",
        //         "time": 1677645250000,
        //         "info": "TRANSFER",
        //         "tranId": 131001573082,
        //         "tradeId": ""
        //     }
        //
        let amount = this.safeString2 (item, 'amount', 'income');
        let direction = undefined;
        if (Precise.stringLe (amount, '0')) {
            direction = 'out';
            amount = Precise.stringMul ('-1', amount);
        } else {
            direction = 'in';
        }
        const currencyId = this.safeString (item, 'asset');
        const code = this.safeCurrencyCode (currencyId, currency);
        currency = this.safeCurrency (currencyId, currency);
        const timestamp = this.safeInteger2 (item, 'createDate', 'time');
        const type = this.safeString2 (item, 'type', 'incomeType');
        return this.safeLedgerEntry ({
            'info': item,
            'id': this.safeString2 (item, 'id', 'tranId'),
            'direction': direction,
            'account': undefined,
            'referenceAccount': undefined,
            'referenceId': this.safeString (item, 'tradeId'),
            'type': this.parseLedgerEntryType (type),
            'currency': code,
            'amount': this.parseNumber (amount),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'before': undefined,
            'after': undefined,
            'status': undefined,
            'fee': undefined,
        }, currency) as LedgerEntry;
    }

    parseLedgerEntryType (type) {
        const ledgerType: Dict = {
            'FEE': 'fee',
            'FUNDING_FEE': 'fee',
            'OPTIONS_PREMIUM_FEE': 'fee',
            'POSITION_LIMIT_INCREASE_FEE': 'fee',
            'CONTRACT': 'trade',
            'REALIZED_PNL': 'trade',
            'TRANSFER': 'transfer',
            'CROSS_COLLATERAL_TRANSFER': 'transfer',
            'INTERNAL_TRANSFER': 'transfer',
            'COIN_SWAP_DEPOSIT': 'deposit',
            'COIN_SWAP_WITHDRAW': 'withdrawal',
            'OPTIONS_SETTLE_PROFIT': 'settlement',
            'DELIVERED_SETTELMENT': 'settlement',
            'WELCOME_BONUS': 'cashback',
            'CONTEST_REWARD': 'cashback',
            'COMMISSION_REBATE': 'rebate',
            'API_REBATE': 'rebate',
            'REFERRAL_KICKBACK': 'referral',
            'COMMISSION': 'commission',
        };
        return this.safeString (ledgerType, type, type);
    }

    sign (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined) {
        const urls = this.urls as any;
        if (!(api in urls['api'])) {
            throw new NotSupported (this.id + ' does not have a testnet/sandbox URL for ' + api + ' endpoints');
        }
        let url = this.urls['api'][api];
        url += '/' + path;
        if (path === 'historicalTrades') {
            if (this.apiKey) {
                headers = {
                    'X-MBX-APIKEY': this.apiKey,
                };
            } else {
                throw new AuthenticationError (this.id + ' historicalTrades endpoint requires `apiKey` credential');
            }
        }
        const userDataStream = (path === 'userDataStream') || (path === 'listenKey');
        if (userDataStream) {
            if (this.apiKey) {
                // v1 special case for userDataStream
                headers = {
                    'X-MBX-APIKEY': this.apiKey,
                    'Content-Type': 'application/x-www-form-urlencoded',
                };
                if (method !== 'GET') {
                    body = this.urlencode (params);
                }
            } else {
                throw new AuthenticationError (this.id + ' userDataStream endpoint requires `apiKey` credential');
            }
        } else if ((api === 'private') || (api === 'eapiPrivate') || (api === 'sapi' && path !== 'system/status') || (api === 'sapiV2') || (api === 'sapiV3') || (api === 'sapiV4') || (api === 'dapiPrivate') || (api === 'dapiPrivateV2') || (api === 'fapiPrivate') || (api === 'fapiPrivateV2') || (api === 'fapiPrivateV3') || (api === 'papi' && path !== 'ping')) {
            this.checkRequiredCredentials ();
            if (method === 'POST' && ((path === 'order') || (path === 'sor/order'))) {
                // inject in implicit API calls
                const newClientOrderId = this.safeString (params, 'newClientOrderId');
                if (newClientOrderId === undefined) {
                    const isSpotOrMargin = (api.indexOf ('sapi') > -1 || api === 'private');
                    const marketType = isSpotOrMargin ? 'spot' : 'future';
                    const defaultId = (!isSpotOrMargin) ? 'x-xcKtGhcu' : 'x-R4BD3S82';
                    const broker = this.safeDict (this.options, 'broker', {});
                    const brokerId = this.safeString (broker, marketType, defaultId);
                    params['newClientOrderId'] = brokerId + this.uuid22 ();
                }
            }
            let query = undefined;
            // handle batchOrders
            if ((path === 'batchOrders') && (method === 'POST')) {
                const batchOrders = this.safeValue (params, 'batchOrders');
                const queryBatch = (this.json (batchOrders));
                params['batchOrders'] = queryBatch;
            }
            const defaultRecvWindow = this.safeInteger (this.options, 'recvWindow');
            let extendedParams = this.extend ({
                'timestamp': this.nonce (),
            }, params);
            if (defaultRecvWindow !== undefined) {
                extendedParams['recvWindow'] = defaultRecvWindow;
            }
            const recvWindow = this.safeInteger (params, 'recvWindow');
            if (recvWindow !== undefined) {
                extendedParams['recvWindow'] = recvWindow;
            }
            if ((api === 'sapi') && (path === 'asset/dust')) {
                query = this.urlencodeWithArrayRepeat (extendedParams);
            } else if ((path === 'batchOrders') || (path.indexOf ('sub-account') >= 0) || (path === 'capital/withdraw/apply') || (path.indexOf ('staking') >= 0) || (path.indexOf ('simple-earn') >= 0)) {
                if ((method === 'DELETE') && (path === 'batchOrders')) {
                    const orderidlist = this.safeList (extendedParams, 'orderidlist', []);
                    const origclientorderidlist = this.safeList (extendedParams, 'origclientorderidlist', []);
                    extendedParams = this.omit (extendedParams, [ 'orderidlist', 'origclientorderidlist' ]);
                    query = this.rawencode (extendedParams);
                    const orderidlistLength = orderidlist.length;
                    const origclientorderidlistLength = origclientorderidlist.length;
                    if (orderidlistLength > 0) {
                        query = query + '&' + 'orderidlist=%5B' + orderidlist.join ('%2C') + '%5D';
                    }
                    if (origclientorderidlistLength > 0) {
                        query = query + '&' + 'origclientorderidlist=%5B' + origclientorderidlist.join ('%2C') + '%5D';
                    }
                } else {
                    query = this.rawencode (extendedParams);
                }
            } else {
                query = this.urlencode (extendedParams);
            }
            let signature = undefined;
            if (this.secret.indexOf ('PRIVATE KEY') > -1) {
                if (this.secret.length > 120) {
                    signature = this.encodeURIComponent (rsa (query, this.secret, sha256));
                } else {
                    signature = this.encodeURIComponent (eddsa (this.encode (query), this.secret, ed25519));
                }
            } else {
                signature = this.hmac (this.encode (query), this.encode (this.secret), sha256);
            }
            query += '&' + 'signature=' + signature;
            headers = {
                'X-MBX-APIKEY': this.apiKey,
            };
            if ((method === 'GET') || (method === 'DELETE')) {
                url += '?' + query;
            } else {
                body = query;
                headers['Content-Type'] = 'application/x-www-form-urlencoded';
            }
        } else {
            if (Object.keys (params).length) {
                url += '?' + this.urlencode (params);
            }
        }
        return { 'url': url, 'method': method, 'body': body, 'headers': headers };
    }

    getExceptionsByUrl (url: string, exactOrBroad: string) {
        let marketType = undefined;
        const hostname = (this.hostname !== undefined) ? this.hostname : 'binance.com';
        if (url.startsWith ('https://api.' + hostname + '/')) {
            marketType = 'spot';
        } else if (url.startsWith ('https://dapi.' + hostname + '/')) {
            marketType = 'inverse';
        } else if (url.startsWith ('https://fapi.' + hostname + '/')) {
            marketType = 'linear';
        } else if (url.startsWith ('https://eapi.' + hostname + '/')) {
            marketType = 'option';
        } else if (url.startsWith ('https://papi.' + hostname + '/')) {
            marketType = 'portfoliomargin';
        }
        if (marketType !== undefined) {
            const exceptionsForMarketType = this.safeDict (this.exceptions, marketType, {});
            return this.safeDict (exceptionsForMarketType, exactOrBroad, {});
        }
        return {};
    }

    handleErrors (code: int, reason: string, url: string, method: string, headers: Dict, body: string, response, requestHeaders, requestBody) {
        if ((code === 418) || (code === 429)) {
            throw new DDoSProtection (this.id + ' ' + code.toString () + ' ' + reason + ' ' + body);
        }
        // error response in a form: { "code": -1013, "msg": "Invalid quantity." }
        // following block cointains legacy checks against message patterns in "msg" property
        // will switch "code" checks eventually, when we know all of them
        if (code >= 400) {
            if (body.indexOf ('Price * QTY is zero or less') >= 0) {
                throw new InvalidOrder (this.id + ' order cost = amount * price is zero or less ' + body);
            }
            if (body.indexOf ('LOT_SIZE') >= 0) {
                throw new InvalidOrder (this.id + ' order amount should be evenly divisible by lot size ' + body);
            }
            if (body.indexOf ('PRICE_FILTER') >= 0) {
                throw new InvalidOrder (this.id + ' order price is invalid, i.e. exceeds allowed price precision, exceeds min price or max price limits or is invalid value in general, use this.priceToPrecision (symbol, amount) ' + body);
            }
        }
        if (response === undefined) {
            return undefined; // fallback to default error handler
        }
        // response in format {'msg': 'The coin does not exist.', 'success': true/false}
        const success = this.safeBool (response, 'success', true);
        if (!success) {
            const messageNew = this.safeString (response, 'msg');
            let parsedMessage = undefined;
            if (messageNew !== undefined) {
                try {
                    parsedMessage = JSON.parse (messageNew);
                } catch (e) {
                    // do nothing
                    parsedMessage = undefined;
                }
                if (parsedMessage !== undefined) {
                    response = parsedMessage;
                }
            }
        }
        const message = this.safeString (response, 'msg');
        if (message !== undefined) {
            this.throwExactlyMatchedException (this.getExceptionsByUrl (url, 'exact'), message, this.id + ' ' + message);
            this.throwExactlyMatchedException (this.exceptions['exact'], message, this.id + ' ' + message);
            this.throwBroadlyMatchedException (this.getExceptionsByUrl (url, 'broad'), message, this.id + ' ' + message);
            this.throwBroadlyMatchedException (this.exceptions['broad'], message, this.id + ' ' + message);
        }
        // checks against error codes
        const error = this.safeString (response, 'code');
        if (error !== undefined) {
            // https://github.com/ccxt/ccxt/issues/6501
            // https://github.com/ccxt/ccxt/issues/7742
            if ((error === '200') || Precise.stringEquals (error, '0')) {
                return undefined;
            }
            // a workaround for {"code":-2015,"msg":"Invalid API-key, IP, or permissions for action."}
            // despite that their message is very confusing, it is raised by Binance
            // on a temporary ban, the API key is valid, but disabled for a while
            if ((error === '-2015') && this.options['hasAlreadyAuthenticatedSuccessfully']) {
                throw new DDoSProtection (this.id + ' ' + body);
            }
            const feedback = this.id + ' ' + body;
            if (message === 'No need to change margin type.') {
                // not an error
                // https://github.com/ccxt/ccxt/issues/11268
                // https://github.com/ccxt/ccxt/pull/11624
                // POST https://fapi.binance.com/fapi/v1/marginType 400 Bad Request
                // binanceusdm {"code":-4046,"msg":"No need to change margin type."}
                throw new MarginModeAlreadySet (feedback);
            }
            this.throwExactlyMatchedException (this.getExceptionsByUrl (url, 'exact'), error, feedback);
            this.throwExactlyMatchedException (this.exceptions['exact'], error, feedback);
            throw new ExchangeError (feedback);
        }
        if (!success) {
            throw new ExchangeError (this.id + ' ' + body);
        }
        if (Array.isArray (response)) {
            // cancelOrders returns an array like this: [{"code":-2011,"msg":"Unknown order sent."}]
            const arrayLength = response.length;
            if (arrayLength === 1) { // when there's a single error we can throw, otherwise we have a partial success
                const element = response[0];
                const errorCode = this.safeString (element, 'code');
                if (errorCode !== undefined) {
                    this.throwExactlyMatchedException (this.getExceptionsByUrl (url, 'exact'), errorCode, this.id + ' ' + body);
                    this.throwExactlyMatchedException (this.exceptions['exact'], errorCode, this.id + ' ' + body);
                }
            }
        }
        return undefined;
    }

    calculateRateLimiterCost (api, method, path, params, config = {}) {
        if (('noCoin' in config) && !('coin' in params)) {
            return config['noCoin'];
        } else if (('noSymbol' in config) && !('symbol' in params)) {
            return config['noSymbol'];
        } else if (('noPoolId' in config) && !('poolId' in params)) {
            return config['noPoolId'];
        } else if (('byLimit' in config) && ('limit' in params)) {
            const limit = params['limit'];
            const byLimit = config['byLimit'] as any;
            for (let i = 0; i < byLimit.length; i++) {
                const entry = byLimit[i];
                if (limit <= entry[0]) {
                    return entry[1];
                }
            }
        }
        return this.safeValue (config, 'cost', 1);
    }

    async request (path, api = 'public', method = 'GET', params = {}, headers = undefined, body = undefined, config = {}) {
        const response = await this.fetch2 (path, api, method, params, headers, body, config);
        // a workaround for {"code":-2015,"msg":"Invalid API-key, IP, or permissions for action."}
        if (api === 'private') {
            this.options['hasAlreadyAuthenticatedSuccessfully'] = true;
        }
        return response;
    }

    async modifyMarginHelper (symbol: string, amount, addOrReduce, params = {}) {
        // used to modify isolated positions
        let defaultType = this.safeString (this.options, 'defaultType', 'future');
        if (defaultType === 'spot') {
            defaultType = 'future';
        }
        const type = this.safeString (params, 'type', defaultType);
        if ((type === 'margin') || (type === 'spot')) {
            throw new NotSupported (this.id + ' add / reduce margin only supported with type future or delivery');
        }
        await this.loadMarkets ();
        const market = this.market (symbol);
        amount = this.amountToPrecision (symbol, amount);
        const request: Dict = {
            'type': addOrReduce,
            'symbol': market['id'],
            'amount': amount,
        };
        let response = undefined;
        let code = undefined;
        if (market['linear']) {
            code = market['quote'];
            response = await this.fapiPrivatePostPositionMargin (this.extend (request, params));
        } else {
            code = market['base'];
            response = await this.dapiPrivatePostPositionMargin (this.extend (request, params));
        }
        //
        //     {
        //         "code": 200,
        //         "msg": "Successfully modify position margin.",
        //         "amount": 0.001,
        //         "type": 1
        //     }
        //
        return this.extend (this.parseMarginModification (response, market), {
            'code': code,
        });
    }

    parseMarginModification (data: Dict, market: Market = undefined): MarginModification {
        //
        // add/reduce margin
        //
        //     {
        //         "code": 200,
        //         "msg": "Successfully modify position margin.",
        //         "amount": 0.001,
        //         "type": 1
        //     }
        //
        // fetchMarginAdjustmentHistory
        //
        //    {
        //        symbol: "XRPUSDT",
        //        type: "1",
        //        deltaType: "TRADE",
        //        amount: "2.57148240",
        //        asset: "USDT",
        //        time: "1711046271555",
        //        positionSide: "BOTH",
        //        clientTranId: ""
        //    }
        //
        const rawType = this.safeInteger (data, 'type');
        const errorCode = this.safeString (data, 'code');
        const marketId = this.safeString (data, 'symbol');
        const timestamp = this.safeInteger (data, 'time');
        market = this.safeMarket (marketId, market, undefined, 'swap');
        const noErrorCode = errorCode === undefined;
        const success = errorCode === '200';
        return {
            'info': data,
            'symbol': market['symbol'],
            'type': (rawType === 1) ? 'add' : 'reduce',
            'marginMode': 'isolated',
            'amount': this.safeNumber (data, 'amount'),
            'code': this.safeString (data, 'asset'),
            'total': undefined,
            'status': (success || noErrorCode) ? 'ok' : 'failed',
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        };
    }

    /**
     * @method
     * @name binance#reduceMargin
     * @description remove margin from a position
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Isolated-Position-Margin
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Modify-Isolated-Position-Margin
     * @param {string} symbol unified market symbol
     * @param {float} amount the amount of margin to remove
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [margin structure]{@link https://docs.ccxt.com/#/?id=reduce-margin-structure}
     */
    async reduceMargin (symbol: string, amount: number, params = {}): Promise<MarginModification> {
        return await this.modifyMarginHelper (symbol, amount, 2, params);
    }

    /**
     * @method
     * @name binance#addMargin
     * @description add margin
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Modify-Isolated-Position-Margin
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Modify-Isolated-Position-Margin
     * @param {string} symbol unified market symbol
     * @param {float} amount amount of margin to add
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [margin structure]{@link https://docs.ccxt.com/#/?id=add-margin-structure}
     */
    async addMargin (symbol: string, amount: number, params = {}): Promise<MarginModification> {
        return await this.modifyMarginHelper (symbol, amount, 1, params);
    }

    /**
     * @method
     * @name binance#fetchCrossBorrowRate
     * @description fetch the rate of interest to borrow a currency for margin trading
     * @see https://developers.binance.com/docs/margin_trading/borrow-and-repay/Query-Margin-Interest-Rate-History
     * @param {string} code unified currency code
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [borrow rate structure]{@link https://docs.ccxt.com/#/?id=borrow-rate-structure}
     */
    async fetchCrossBorrowRate (code: string, params = {}): Promise<CrossBorrowRate> {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'asset': currency['id'],
            // 'vipLevel': this.safeInteger (params, 'vipLevel'),
        };
        const response = await this.sapiGetMarginInterestRateHistory (this.extend (request, params));
        //
        //     [
        //         {
        //             "asset": "USDT",
        //             "timestamp": 1638230400000,
        //             "dailyInterestRate": "0.0006",
        //             "vipLevel": 0
        //         },
        //     ]
        //
        const rate = this.safeDict (response, 0);
        return this.parseBorrowRate (rate);
    }

    /**
     * @method
     * @name binance#fetchIsolatedBorrowRate
     * @description fetch the rate of interest to borrow a currency for margin trading
     * @see https://developers.binance.com/docs/margin_trading/account/Query-Isolated-Margin-Fee-Data
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     *
     * EXCHANGE SPECIFIC PARAMETERS
     * @param {object} [params.vipLevel] user's current specific margin data will be returned if viplevel is omitted
     * @returns {object} an [isolated borrow rate structure]{@link https://docs.ccxt.com/#/?id=isolated-borrow-rate-structure}
     */
    async fetchIsolatedBorrowRate (symbol: string, params = {}): Promise<IsolatedBorrowRate> {
        const request: Dict = {
            'symbol': symbol,
        };
        const borrowRates = await this.fetchIsolatedBorrowRates (this.extend (request, params));
        return this.safeDict (borrowRates, symbol) as IsolatedBorrowRate;
    }

    /**
     * @method
     * @name binance#fetchIsolatedBorrowRates
     * @description fetch the borrow interest rates of all currencies
     * @see https://developers.binance.com/docs/margin_trading/account/Query-Isolated-Margin-Fee-Data
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {object} [params.symbol] unified market symbol
     *
     * EXCHANGE SPECIFIC PARAMETERS
     * @param {object} [params.vipLevel] user's current specific margin data will be returned if viplevel is omitted
     * @returns {object} a [borrow rate structure]{@link https://docs.ccxt.com/#/?id=borrow-rate-structure}
     */
    async fetchIsolatedBorrowRates (params = {}): Promise<IsolatedBorrowRates> {
        await this.loadMarkets ();
        const request: Dict = {};
        const symbol = this.safeString (params, 'symbol');
        params = this.omit (params, 'symbol');
        if (symbol !== undefined) {
            const market = this.market (symbol);
            request['symbol'] = market['id'];
        }
        const response = await this.sapiGetMarginIsolatedMarginData (this.extend (request, params));
        //
        //    [
        //        {
        //            "vipLevel": 0,
        //            "symbol": "BTCUSDT",
        //            "leverage": "10",
        //            "data": [
        //                {
        //                    "coin": "BTC",
        //                    "dailyInterest": "0.00026125",
        //                    "borrowLimit": "270"
        //                },
        //                {
        //                    "coin": "USDT",
        //                    "dailyInterest": "0.000475",
        //                    "borrowLimit": "2100000"
        //                }
        //            ]
        //        }
        //    ]
        //
        return this.parseIsolatedBorrowRates (response);
    }

    /**
     * @method
     * @name binance#fetchBorrowRateHistory
     * @description retrieves a history of a currencies borrow interest rate at specific time slots
     * @see https://developers.binance.com/docs/margin_trading/borrow-and-repay/Query-Margin-Interest-Rate-History
     * @param {string} code unified currency code
     * @param {int} [since] timestamp for the earliest borrow rate
     * @param {int} [limit] the maximum number of [borrow rate structures]{@link https://docs.ccxt.com/#/?id=borrow-rate-structure} to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object[]} an array of [borrow rate structures]{@link https://docs.ccxt.com/#/?id=borrow-rate-structure}
     */
    async fetchBorrowRateHistory (code: string, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        if (limit === undefined) {
            limit = 93;
        } else if (limit > 93) {
            // Binance API says the limit is 100, but "Illegal characters found in a parameter." is returned when limit is > 93
            throw new BadRequest (this.id + ' fetchBorrowRateHistory() limit parameter cannot exceed 92');
        }
        const currency = this.currency (code);
        const request: Dict = {
            'asset': currency['id'],
            'limit': limit,
        };
        if (since !== undefined) {
            request['startTime'] = since;
            const endTime = this.sum (since, limit * 86400000) - 1; // required when startTime is further than 93 days in the past
            const now = this.milliseconds ();
            request['endTime'] = Math.min (endTime, now); // cannot have an endTime later than current time
        }
        const response = await this.sapiGetMarginInterestRateHistory (this.extend (request, params));
        //
        //     [
        //         {
        //             "asset": "USDT",
        //             "timestamp": 1638230400000,
        //             "dailyInterestRate": "0.0006",
        //             "vipLevel": 0
        //         },
        //     ]
        //
        return this.parseBorrowRateHistory (response, code, since, limit);
    }

    parseBorrowRate (info, currency: Currency = undefined) {
        //
        //    {
        //        "asset": "USDT",
        //        "timestamp": 1638230400000,
        //        "dailyInterestRate": "0.0006",
        //        "vipLevel": 0
        //    }
        //
        const timestamp = this.safeInteger (info, 'timestamp');
        const currencyId = this.safeString (info, 'asset');
        return {
            'currency': this.safeCurrencyCode (currencyId, currency),
            'rate': this.safeNumber (info, 'dailyInterestRate'),
            'period': 86400000,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'info': info,
        };
    }

    parseIsolatedBorrowRate (info: Dict, market: Market = undefined): IsolatedBorrowRate {
        //
        //    {
        //        "vipLevel": 0,
        //        "symbol": "BTCUSDT",
        //        "leverage": "10",
        //        "data": [
        //            {
        //                "coin": "BTC",
        //                "dailyInterest": "0.00026125",
        //                "borrowLimit": "270"
        //            },
        //            {
        //                "coin": "USDT",
        //                "dailyInterest": "0.000475",
        //                "borrowLimit": "2100000"
        //            }
        //        ]
        //    }
        //
        const marketId = this.safeString (info, 'symbol');
        market = this.safeMarket (marketId, market, undefined, 'spot');
        const data = this.safeList (info, 'data');
        const baseInfo = this.safeDict (data, 0);
        const quoteInfo = this.safeDict (data, 1);
        return {
            'info': info,
            'symbol': this.safeString (market, 'symbol'),
            'base': this.safeString (baseInfo, 'coin'),
            'baseRate': this.safeNumber (baseInfo, 'dailyInterest'),
            'quote': this.safeString (quoteInfo, 'coin'),
            'quoteRate': this.safeNumber (quoteInfo, 'dailyInterest'),
            'period': 86400000,
            'timestamp': undefined,
            'datetime': undefined,
        };
    }

    /**
     * @method
     * @name binance#createGiftCode
     * @description create gift code
     * @see https://developers.binance.com/docs/gift_card/market-data/Create-a-single-token-gift-card
     * @param {string} code gift code
     * @param {float} amount amount of currency for the gift
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} The gift code id, code, currency and amount
     */
    async createGiftCode (code: string, amount, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        // ensure you have enough token in your funding account before calling this code
        const request: Dict = {
            'token': currency['id'],
            'amount': amount,
        };
        const response = await this.sapiPostGiftcardCreateCode (this.extend (request, params));
        //
        //     {
        //         "code": "000000",
        //         "message": "success",
        //         "data": { referenceNo: "0033002404219823", code: "AP6EXTLKNHM6CEX7" },
        //         "success": true
        //     }
        //
        const data = this.safeDict (response, 'data');
        const giftcardCode = this.safeString (data, 'code');
        const id = this.safeString (data, 'referenceNo');
        return {
            'info': response,
            'id': id,
            'code': giftcardCode,
            'currency': code,
            'amount': amount,
        };
    }

    /**
     * @method
     * @name binance#redeemGiftCode
     * @description redeem gift code
     * @see https://developers.binance.com/docs/gift_card/market-data/Redeem-a-Binance-Gift-Card
     * @param {string} giftcardCode
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} response from the exchange
     */
    async redeemGiftCode (giftcardCode, params = {}) {
        const request: Dict = {
            'code': giftcardCode,
        };
        const response = await this.sapiPostGiftcardRedeemCode (this.extend (request, params));
        //
        //     {
        //         "code": "000000",
        //         "message": "success",
        //         "data": {
        //             "referenceNo": "0033002404219823",
        //             "identityNo": "10316431732801474560"
        //         },
        //         "success": true
        //     }
        //
        return response;
    }

    /**
     * @method
     * @name binance#verifyGiftCode
     * @description verify gift code
     * @see https://developers.binance.com/docs/gift_card/market-data/Verify-Binance-Gift-Card-by-Gift-Card-Number
     * @param {string} id reference number id
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} response from the exchange
     */
    async verifyGiftCode (id: string, params = {}) {
        const request: Dict = {
            'referenceNo': id,
        };
        const response = await this.sapiGetGiftcardVerify (this.extend (request, params));
        //
        //     {
        //         "code": "000000",
        //         "message": "success",
        //         "data": { valid: true },
        //         "success": true
        //     }
        //
        return response;
    }

    /**
     * @method
     * @name binance#fetchBorrowInterest
     * @description fetch the interest owed by the user for borrowing currency for margin trading
     * @see https://developers.binance.com/docs/margin_trading/borrow-and-repay/Get-Interest-History
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/account/Get-Margin-BorrowLoan-Interest-History
     * @param {string} [code] unified currency code
     * @param {string} [symbol] unified market symbol when fetch interest in isolated markets
     * @param {int} [since] the earliest time in ms to fetch borrrow interest for
     * @param {int} [limit] the maximum number of structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch the borrow interest in a portfolio margin account
     * @returns {object[]} a list of [borrow interest structures]{@link https://docs.ccxt.com/#/?id=borrow-interest-structure}
     */
    async fetchBorrowInterest (code: Str = undefined, symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<BorrowInterest[]> {
        await this.loadMarkets ();
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchBorrowInterest', 'papi', 'portfolioMargin', false);
        let request: Dict = {};
        let market = undefined;
        if (code !== undefined) {
            const currency = this.currency (code);
            request['asset'] = currency['id'];
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['size'] = limit;
        }
        [ request, params ] = this.handleUntilOption ('endTime', request, params);
        let response = undefined;
        if (isPortfolioMargin) {
            response = await this.papiGetMarginMarginInterestHistory (this.extend (request, params));
        } else {
            if (symbol !== undefined) {
                market = this.market (symbol);
                request['isolatedSymbol'] = market['id'];
            }
            response = await this.sapiGetMarginInterestHistory (this.extend (request, params));
        }
        //
        // spot margin
        //
        //     {
        //         "rows":[
        //             {
        //                 "isolatedSymbol": "BNBUSDT", // isolated symbol, will not be returned for crossed margin
        //                 "asset": "BNB",
        //                 "interest": "0.02414667",
        //                 "interestAccuredTime": 1566813600000,
        //                 "interestRate": "0.01600000",
        //                 "principal": "36.22000000",
        //                 "type": "ON_BORROW"
        //             }
        //         ],
        //         "total": 1
        //     }
        //
        // spot margin portfolio margin
        //
        //     {
        //         "total": 49,
        //         "rows": [
        //             {
        //                 "txId": 1656187724899910076,
        //                 "interestAccuredTime": 1707541200000,
        //                 "asset": "USDT",
        //                 "rawAsset": "USDT",
        //                 "principal": "0.00011146",
        //                 "interest": "0.00000001",
        //                 "interestRate": "0.00089489",
        //                 "type": "PERIODIC"
        //             },
        //         ]
        //     }
        //
        const rows = this.safeList (response, 'rows');
        const interest = this.parseBorrowInterests (rows, market);
        return this.filterByCurrencySinceLimit (interest, code, since, limit);
    }

    parseBorrowInterest (info: Dict, market: Market = undefined): BorrowInterest {
        const symbol = this.safeString (info, 'isolatedSymbol');
        const timestamp = this.safeInteger (info, 'interestAccuredTime');
        const marginMode = (symbol === undefined) ? 'cross' : 'isolated';
        return {
            'info': info,
            'symbol': symbol,
            'currency': this.safeCurrencyCode (this.safeString (info, 'asset')),
            'interest': this.safeNumber (info, 'interest'),
            'interestRate': this.safeNumber (info, 'interestRate'),
            'amountBorrowed': this.safeNumber (info, 'principal'),
            'marginMode': marginMode,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        } as BorrowInterest;
    }

    /**
     * @method
     * @name binance#repayCrossMargin
     * @description repay borrowed margin and interest
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay
     * @see https://developers.binance.com/docs/margin_trading/borrow-and-repay/Margin-Account-Borrow-Repay
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Repay-Debt
     * @param {string} code unified currency code of the currency to repay
     * @param {float} amount the amount to repay
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.portfolioMargin] set to true if you would like to repay margin in a portfolio margin account
     * @param {string} [params.repayCrossMarginMethod] *portfolio margin only* 'papiPostRepayLoan' (default), 'papiPostMarginRepayDebt' (alternative)
     * @param {string} [params.specifyRepayAssets] *portfolio margin papiPostMarginRepayDebt only* specific asset list to repay debt
     * @returns {object} a [margin loan structure]{@link https://docs.ccxt.com/#/?id=margin-loan-structure}
     */
    async repayCrossMargin (code: string, amount, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'asset': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
        };
        let response = undefined;
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'repayCrossMargin', 'papi', 'portfolioMargin', false);
        if (isPortfolioMargin) {
            let method = undefined;
            [ method, params ] = this.handleOptionAndParams2 (params, 'repayCrossMargin', 'repayCrossMarginMethod', 'method');
            if (method === 'papiPostMarginRepayDebt') {
                response = await this.papiPostMarginRepayDebt (this.extend (request, params));
                //
                //     {
                //         "asset": "USDC",
                //         "amount": 10,
                //         "specifyRepayAssets": null,
                //         "updateTime": 1727170761267,
                //         "success": true
                //     }
                //
            } else {
                response = await this.papiPostRepayLoan (this.extend (request, params));
                //
                //     {
                //         "tranId": 108988250265,
                //         "clientTag":""
                //     }
                //
            }
        } else {
            request['isIsolated'] = 'FALSE';
            request['type'] = 'REPAY';
            response = await this.sapiPostMarginBorrowRepay (this.extend (request, params));
            //
            //     {
            //         "tranId": 108988250265,
            //         "clientTag":""
            //     }
            //
        }
        return this.parseMarginLoan (response, currency);
    }

    /**
     * @method
     * @name binance#repayIsolatedMargin
     * @description repay borrowed margin and interest
     * @see https://developers.binance.com/docs/margin_trading/borrow-and-repay/Margin-Account-Borrow-Repay
     * @param {string} symbol unified market symbol, required for isolated margin
     * @param {string} code unified currency code of the currency to repay
     * @param {float} amount the amount to repay
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [margin loan structure]{@link https://docs.ccxt.com/#/?id=margin-loan-structure}
     */
    async repayIsolatedMargin (symbol: string, code: string, amount, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const market = this.market (symbol);
        const request: Dict = {
            'asset': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
            'symbol': market['id'],
            'isIsolated': 'TRUE',
            'type': 'REPAY',
        };
        const response = await this.sapiPostMarginBorrowRepay (this.extend (request, params));
        //
        //     {
        //         "tranId": 108988250265,
        //         "clientTag":""
        //     }
        //
        return this.parseMarginLoan (response, currency);
    }

    /**
     * @method
     * @name binance#borrowCrossMargin
     * @description create a loan to borrow margin
     * @see https://developers.binance.com/docs/margin_trading/borrow-and-repay/Margin-Account-Borrow-Repay
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Margin-Account-Borrow
     * @param {string} code unified currency code of the currency to borrow
     * @param {float} amount the amount to borrow
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {boolean} [params.portfolioMargin] set to true if you would like to borrow margin in a portfolio margin account
     * @returns {object} a [margin loan structure]{@link https://docs.ccxt.com/#/?id=margin-loan-structure}
     */
    async borrowCrossMargin (code: string, amount: number, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const request: Dict = {
            'asset': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
        };
        let response = undefined;
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'borrowCrossMargin', 'papi', 'portfolioMargin', false);
        if (isPortfolioMargin) {
            response = await this.papiPostMarginLoan (this.extend (request, params));
        } else {
            request['isIsolated'] = 'FALSE';
            request['type'] = 'BORROW';
            response = await this.sapiPostMarginBorrowRepay (this.extend (request, params));
        }
        //
        //     {
        //         "tranId": 108988250265,
        //         "clientTag":""
        //     }
        //
        return this.parseMarginLoan (response, currency);
    }

    /**
     * @method
     * @name binance#borrowIsolatedMargin
     * @description create a loan to borrow margin
     * @see https://developers.binance.com/docs/margin_trading/borrow-and-repay/Margin-Account-Borrow-Repay
     * @param {string} symbol unified market symbol, required for isolated margin
     * @param {string} code unified currency code of the currency to borrow
     * @param {float} amount the amount to borrow
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [margin loan structure]{@link https://docs.ccxt.com/#/?id=margin-loan-structure}
     */
    async borrowIsolatedMargin (symbol: string, code: string, amount: number, params = {}) {
        await this.loadMarkets ();
        const currency = this.currency (code);
        const market = this.market (symbol);
        const request: Dict = {
            'asset': currency['id'],
            'amount': this.currencyToPrecision (code, amount),
            'symbol': market['id'],
            'isIsolated': 'TRUE',
            'type': 'BORROW',
        };
        const response = await this.sapiPostMarginBorrowRepay (this.extend (request, params));
        //
        //     {
        //         "tranId": 108988250265,
        //         "clientTag":""
        //     }
        //
        return this.parseMarginLoan (response, currency);
    }

    parseMarginLoan (info, currency: Currency = undefined) {
        //
        //     {
        //         "tranId": 108988250265,
        //         "clientTag":""
        //     }
        //
        // repayCrossMargin alternative endpoint
        //
        //     {
        //         "asset": "USDC",
        //         "amount": 10,
        //         "specifyRepayAssets": null,
        //         "updateTime": 1727170761267,
        //         "success": true
        //     }
        //
        const currencyId = this.safeString (info, 'asset');
        const timestamp = this.safeInteger (info, 'updateTime');
        return {
            'id': this.safeInteger (info, 'tranId'),
            'currency': this.safeCurrencyCode (currencyId, currency),
            'amount': this.safeNumber (info, 'amount'),
            'symbol': undefined,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'info': info,
        };
    }

    /**
     * @method
     * @name binance#fetchOpenInterestHistory
     * @description Retrieves the open interest history of a currency
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Open-Interest-Statistics
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Open-Interest-Statistics
     * @param {string} symbol Unified CCXT market symbol
     * @param {string} timeframe "5m","15m","30m","1h","2h","4h","6h","12h", or "1d"
     * @param {int} [since] the time(ms) of the earliest record to retrieve as a unix timestamp
     * @param {int} [limit] default 30, max 500
     * @param {object} [params] exchange specific parameters
     * @param {int} [params.until] the time(ms) of the latest record to retrieve as a unix timestamp
     * @param {boolean} [params.paginate] default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [availble parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @returns {object} an array of [open interest structure]{@link https://docs.ccxt.com/#/?id=open-interest-structure}
     */
    async fetchOpenInterestHistory (symbol: string, timeframe = '5m', since: Int = undefined, limit: Int = undefined, params = {}) {
        if (timeframe === '1m') {
            throw new BadRequest (this.id + 'fetchOpenInterestHistory cannot use the 1m timeframe');
        }
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchOpenInterestHistory', 'paginate', false);
        if (paginate) {
            return await this.fetchPaginatedCallDeterministic ('fetchOpenInterestHistory', symbol, since, limit, timeframe, params, 500) as OpenInterest[];
        }
        const market = this.market (symbol);
        const request: Dict = {
            'period': this.safeString (this.timeframes, timeframe, timeframe),
        };
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        const symbolKey = market['linear'] ? 'symbol' : 'pair';
        request[symbolKey] = market['id'];
        if (market['inverse']) {
            request['contractType'] = this.safeString (params, 'contractType', 'CURRENT_QUARTER');
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        const until = this.safeInteger (params, 'until'); // unified in milliseconds
        const endTime = this.safeInteger (params, 'endTime', until); // exchange-specific in milliseconds
        params = this.omit (params, [ 'endTime', 'until' ]);
        if (endTime) {
            request['endTime'] = endTime;
        } else if (since) {
            if (limit === undefined) {
                limit = 30; // Exchange default
            }
            const duration = this.parseTimeframe (timeframe);
            request['endTime'] = this.sum (since, duration * limit * 1000);
        }
        let response = undefined;
        if (market['inverse']) {
            response = await this.dapiDataGetOpenInterestHist (this.extend (request, params));
        } else {
            response = await this.fapiDataGetOpenInterestHist (this.extend (request, params));
        }
        //
        //  [
        //      {
        //          "symbol":"BTCUSDT",
        //          "sumOpenInterest":"75375.61700000",
        //          "sumOpenInterestValue":"3248828883.71251440",
        //          "timestamp":1642179900000
        //      },
        //      ...
        //  ]
        //
        return this.parseOpenInterests (response, market, since, limit);
    }

    /**
     * @method
     * @name binance#fetchOpenInterest
     * @description retrieves the open interest of a contract trading pair
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Open-Interest
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Open-Interest
     * @see https://developers.binance.com/docs/derivatives/option/market-data/Open-Interest
     * @param {string} symbol unified CCXT market symbol
     * @param {object} [params] exchange specific parameters
     * @returns {object} an open interest structure{@link https://docs.ccxt.com/#/?id=open-interest-structure}
     */
    async fetchOpenInterest (symbol: string, params = {}) {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {};
        if (market['option']) {
            request['underlyingAsset'] = market['baseId'];
            if (market['expiry'] === undefined) {
                throw new NotSupported (this.id + ' fetchOpenInterest does not support ' + symbol);
            }
            request['expiration'] = this.yymmdd (market['expiry']);
        } else {
            request['symbol'] = market['id'];
        }
        let response = undefined;
        if (market['option']) {
            response = await this.eapiPublicGetOpenInterest (this.extend (request, params));
        } else if (market['inverse']) {
            response = await this.dapiPublicGetOpenInterest (this.extend (request, params));
        } else {
            response = await this.fapiPublicGetOpenInterest (this.extend (request, params));
        }
        //
        // futures (fapi)
        //
        //     {
        //         "symbol": "ETHUSDT_230331",
        //         "openInterest": "23581.677",
        //         "time": 1677356872265
        //     }
        //
        // futures (dapi)
        //
        //     {
        //         "symbol": "ETHUSD_PERP",
        //         "pair": "ETHUSD",
        //         "openInterest": "26542436",
        //         "contractType": "PERPETUAL",
        //         "time": 1677360272224
        //     }
        //
        // options (eapi)
        //
        //     [
        //         {
        //             "symbol": "ETH-230225-1625-C",
        //             "sumOpenInterest": "460.50",
        //             "sumOpenInterestUsd": "734957.4358092150",
        //             "timestamp": "1677304860000"
        //         }
        //     ]
        //
        if (market['option']) {
            symbol = market['symbol'];
            const result = this.parseOpenInterests (response, market);
            for (let i = 0; i < result.length; i++) {
                const item = result[i];
                if (item['symbol'] === symbol) {
                    return item;
                }
            }
        } else {
            return this.parseOpenInterest (response, market);
        }
        return undefined;
    }

    parseOpenInterest (interest, market: Market = undefined) {
        const timestamp = this.safeInteger2 (interest, 'timestamp', 'time');
        const id = this.safeString (interest, 'symbol');
        const amount = this.safeNumber2 (interest, 'sumOpenInterest', 'openInterest');
        const value = this.safeNumber2 (interest, 'sumOpenInterestValue', 'sumOpenInterestUsd');
        // Inverse returns the number of contracts different from the base or quote volume in this case
        // compared with https://www.binance.com/en/futures/funding-history/quarterly/4
        return this.safeOpenInterest ({
            'symbol': this.safeSymbol (id, market, undefined, 'contract'),
            'baseVolume': market['inverse'] ? undefined : amount,  // deprecated
            'quoteVolume': value,  // deprecated
            'openInterestAmount': amount,
            'openInterestValue': value,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'info': interest,
        }, market);
    }

    /**
     * @method
     * @name binance#fetchMyLiquidations
     * @description retrieves the users liquidated positions
     * @see https://developers.binance.com/docs/margin_trading/trade/Get-Force-Liquidation-Record
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Users-Force-Orders
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Users-Force-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-UM-Force-Orders
     * @see https://developers.binance.com/docs/derivatives/portfolio-margin/trade/Query-Users-CM-Force-Orders
     * @param {string} [symbol] unified CCXT market symbol
     * @param {int} [since] the earliest time in ms to fetch liquidations for
     * @param {int} [limit] the maximum number of liquidation structures to retrieve
     * @param {object} [params] exchange specific parameters for the binance api endpoint
     * @param {int} [params.until] timestamp in ms of the latest liquidation
     * @param {boolean} [params.paginate] *spot only* default false, when true will automatically paginate by calling this endpoint multiple times. See in the docs all the [available parameters](https://github.com/ccxt/ccxt/wiki/Manual#pagination-params)
     * @param {boolean} [params.portfolioMargin] set to true if you would like to fetch liquidations in a portfolio margin account
     * @param {string} [params.type] "spot"
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} an array of [liquidation structures]{@link https://docs.ccxt.com/#/?id=liquidation-structure}
     */
    async fetchMyLiquidations (symbol: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}) {
        await this.loadMarkets ();
        let paginate = false;
        [ paginate, params ] = this.handleOptionAndParams (params, 'fetchMyLiquidations', 'paginate');
        if (paginate) {
            return await this.fetchPaginatedCallIncremental ('fetchMyLiquidations', symbol, since, limit, params, 'current', 100) as Liquidation[];
        }
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let type = undefined;
        [ type, params ] = this.handleMarketTypeAndParams ('fetchMyLiquidations', market, params);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchMyLiquidations', market, params, 'linear');
        let isPortfolioMargin = undefined;
        [ isPortfolioMargin, params ] = this.handleOptionAndParams2 (params, 'fetchMyLiquidations', 'papi', 'portfolioMargin', false);
        let request: Dict = {};
        if (type !== 'spot') {
            request['autoCloseType'] = 'LIQUIDATION';
        }
        if (market !== undefined) {
            const symbolKey = market['spot'] ? 'isolatedSymbol' : 'symbol';
            if (!isPortfolioMargin) {
                request[symbolKey] = market['id'];
            }
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            if (type === 'spot') {
                request['size'] = limit;
            } else {
                request['limit'] = limit;
            }
        }
        [ request, params ] = this.handleUntilOption ('endTime', request, params);
        let response = undefined;
        if (type === 'spot') {
            if (isPortfolioMargin) {
                response = await this.papiGetMarginForceOrders (this.extend (request, params));
            } else {
                response = await this.sapiGetMarginForceLiquidationRec (this.extend (request, params));
            }
        } else if (subType === 'linear') {
            if (isPortfolioMargin) {
                response = await this.papiGetUmForceOrders (this.extend (request, params));
            } else {
                response = await this.fapiPrivateGetForceOrders (this.extend (request, params));
            }
        } else if (subType === 'inverse') {
            if (isPortfolioMargin) {
                response = await this.papiGetCmForceOrders (this.extend (request, params));
            } else {
                response = await this.dapiPrivateGetForceOrders (this.extend (request, params));
            }
        } else {
            throw new NotSupported (this.id + ' fetchMyLiquidations() does not support ' + market['type'] + ' markets');
        }
        //
        // margin
        //
        //     {
        //         "rows": [
        //             {
        //                 "avgPrice": "0.00388359",
        //                 "executedQty": "31.39000000",
        //                 "orderId": 180015097,
        //                 "price": "0.00388110",
        //                 "qty": "31.39000000",
        //                 "side": "SELL",
        //                 "symbol": "BNBBTC",
        //                 "timeInForce": "GTC",
        //                 "isIsolated": true,
        //                 "updatedTime": 1558941374745
        //             }
        //         ],
        //         "total": 1
        //     }
        //
        // linear
        //
        //     [
        //         {
        //             "orderId": 6071832819,
        //             "symbol": "BTCUSDT",
        //             "status": "FILLED",
        //             "clientOrderId": "autoclose-1596107620040000020",
        //             "price": "10871.09",
        //             "avgPrice": "10913.21000",
        //             "origQty": "0.001",
        //             "executedQty": "0.001",
        //             "cumQuote": "10.91321",
        //             "timeInForce": "IOC",
        //             "type": "LIMIT",
        //             "reduceOnly": false,
        //             "closePosition": false,
        //             "side": "SELL",
        //             "positionSide": "BOTH",
        //             "stopPrice": "0",
        //             "workingType": "CONTRACT_PRICE",
        //             "origType": "LIMIT",
        //             "time": 1596107620044,
        //             "updateTime": 1596107620087
        //         },
        //     ]
        //
        // inverse
        //
        //     [
        //         {
        //             "orderId": 165123080,
        //             "symbol": "BTCUSD_200925",
        //             "pair": "BTCUSD",
        //             "status": "FILLED",
        //             "clientOrderId": "autoclose-1596542005017000006",
        //             "price": "11326.9",
        //             "avgPrice": "11326.9",
        //             "origQty": "1",
        //             "executedQty": "1",
        //             "cumBase": "0.00882854",
        //             "timeInForce": "IOC",
        //             "type": "LIMIT",
        //             "reduceOnly": false,
        //             "closePosition": false,
        //             "side": "SELL",
        //             "positionSide": "BOTH",
        //             "stopPrice": "0",
        //             "workingType": "CONTRACT_PRICE",
        //             "priceProtect": false,
        //             "origType": "LIMIT",
        //             "time": 1596542005019,
        //             "updateTime": 1596542005050
        //         },
        //     ]
        //
        const liquidations = this.safeList (response, 'rows', response);
        return this.parseLiquidations (liquidations, market, since, limit);
    }

    parseLiquidation (liquidation, market: Market = undefined) {
        //
        // margin
        //
        //     {
        //         "avgPrice": "0.00388359",
        //         "executedQty": "31.39000000",
        //         "orderId": 180015097,
        //         "price": "0.00388110",
        //         "qty": "31.39000000",
        //         "side": "SELL",
        //         "symbol": "BNBBTC",
        //         "timeInForce": "GTC",
        //         "isIsolated": true,
        //         "updatedTime": 1558941374745
        //     }
        //
        // linear
        //
        //     {
        //         "orderId": 6071832819,
        //         "symbol": "BTCUSDT",
        //         "status": "FILLED",
        //         "clientOrderId": "autoclose-1596107620040000020",
        //         "price": "10871.09",
        //         "avgPrice": "10913.21000",
        //         "origQty": "0.001",
        //         "executedQty": "0.001",
        //         "cumQuote": "10.91321",
        //         "timeInForce": "IOC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "closePosition": false,
        //         "side": "SELL",
        //         "positionSide": "BOTH",
        //         "stopPrice": "0",
        //         "workingType": "CONTRACT_PRICE",
        //         "origType": "LIMIT",
        //         "time": 1596107620044,
        //         "updateTime": 1596107620087
        //     }
        //
        // inverse
        //
        //     {
        //         "orderId": 165123080,
        //         "symbol": "BTCUSD_200925",
        //         "pair": "BTCUSD",
        //         "status": "FILLED",
        //         "clientOrderId": "autoclose-1596542005017000006",
        //         "price": "11326.9",
        //         "avgPrice": "11326.9",
        //         "origQty": "1",
        //         "executedQty": "1",
        //         "cumBase": "0.00882854",
        //         "timeInForce": "IOC",
        //         "type": "LIMIT",
        //         "reduceOnly": false,
        //         "closePosition": false,
        //         "side": "SELL",
        //         "positionSide": "BOTH",
        //         "stopPrice": "0",
        //         "workingType": "CONTRACT_PRICE",
        //         "priceProtect": false,
        //         "origType": "LIMIT",
        //         "time": 1596542005019,
        //         "updateTime": 1596542005050
        //     }
        //
        const marketId = this.safeString (liquidation, 'symbol');
        const timestamp = this.safeInteger2 (liquidation, 'updatedTime', 'updateTime');
        return this.safeLiquidation ({
            'info': liquidation,
            'symbol': this.safeSymbol (marketId, market),
            'contracts': this.safeNumber (liquidation, 'executedQty'),
            'contractSize': this.safeNumber (market, 'contractSize'),
            'price': this.safeNumber (liquidation, 'avgPrice'),
            'baseValue': this.safeNumber (liquidation, 'cumBase'),
            'quoteValue': this.safeNumber (liquidation, 'cumQuote'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
        });
    }

    /**
     * @method
     * @name binance#fetchGreeks
     * @description fetches an option contracts greeks, financial metrics used to measure the factors that affect the price of an options contract
     * @see https://developers.binance.com/docs/derivatives/option/market-data/Option-Mark-Price
     * @param {string} symbol unified symbol of the market to fetch greeks for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [greeks structure]{@link https://docs.ccxt.com/#/?id=greeks-structure}
     */
    async fetchGreeks (symbol: string, params = {}): Promise<Greeks> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        const response = await this.eapiPublicGetMark (this.extend (request, params));
        //
        //     [
        //         {
        //             "symbol": "BTC-231229-40000-C",
        //             "markPrice": "2012",
        //             "bidIV": "0.60236275",
        //             "askIV": "0.62267244",
        //             "markIV": "0.6125176",
        //             "delta": "0.39111646",
        //             "theta": "-32.13948531",
        //             "gamma": "0.00004656",
        //             "vega": "51.70062218",
        //             "highPriceLimit": "6474",
        //             "lowPriceLimit": "5"
        //         }
        //     ]
        //
        return this.parseGreeks (response[0], market);
    }

    parseGreeks (greeks: Dict, market: Market = undefined): Greeks {
        //
        //     {
        //         "symbol": "BTC-231229-40000-C",
        //         "markPrice": "2012",
        //         "bidIV": "0.60236275",
        //         "askIV": "0.62267244",
        //         "markIV": "0.6125176",
        //         "delta": "0.39111646",
        //         "theta": "-32.13948531",
        //         "gamma": "0.00004656",
        //         "vega": "51.70062218",
        //         "highPriceLimit": "6474",
        //         "lowPriceLimit": "5"
        //     }
        //
        const marketId = this.safeString (greeks, 'symbol');
        const symbol = this.safeSymbol (marketId, market);
        return {
            'symbol': symbol,
            'timestamp': undefined,
            'datetime': undefined,
            'delta': this.safeNumber (greeks, 'delta'),
            'gamma': this.safeNumber (greeks, 'gamma'),
            'theta': this.safeNumber (greeks, 'theta'),
            'vega': this.safeNumber (greeks, 'vega'),
            'rho': undefined,
            'bidSize': undefined,
            'askSize': undefined,
            'bidImpliedVolatility': this.safeNumber (greeks, 'bidIV'),
            'askImpliedVolatility': this.safeNumber (greeks, 'askIV'),
            'markImpliedVolatility': this.safeNumber (greeks, 'markIV'),
            'bidPrice': undefined,
            'askPrice': undefined,
            'markPrice': this.safeNumber (greeks, 'markPrice'),
            'lastPrice': undefined,
            'underlyingPrice': undefined,
            'info': greeks,
        };
    }

    async fetchTradingLimits (symbols: Strings = undefined, params = {}) {
        // this method should not be called directly, use loadTradingLimits () instead
        const markets = await this.fetchMarkets ();
        const tradingLimits: Dict = {};
        for (let i = 0; i < markets.length; i++) {
            const market = markets[i];
            const symbol = market['symbol'];
            if ((symbols === undefined) || (this.inArray (symbol, symbols))) {
                tradingLimits[symbol] = market['limits']['amount'];
            }
        }
        return tradingLimits;
    }

    /**
     * @method
     * @name binance#fetchPositionMode
     * @description fetchs the position mode, hedged or one way, hedged for binance is set identically for all linear markets or all inverse markets
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Get-Current-Position-Mode
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Get-Current-Position-Mode
     * @param {string} symbol unified symbol of the market to fetch the order book for
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} an object detailing whether the market is in hedged or one-way mode
     */
    async fetchPositionMode (symbol: Str = undefined, params = {}) {
        let market = undefined;
        if (symbol !== undefined) {
            market = this.market (symbol);
        }
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchPositionMode', market, params);
        let response = undefined;
        if (subType === 'linear') {
            response = await this.fapiPrivateGetPositionSideDual (params);
        } else if (subType === 'inverse') {
            response = await this.dapiPrivateGetPositionSideDual (params);
        } else {
            throw new BadRequest (this.id + ' fetchPositionMode requires either a symbol argument or params["subType"]');
        }
        //
        //    {
        //        dualSidePosition: false
        //    }
        //
        const dualSidePosition = this.safeBool (response, 'dualSidePosition');
        return {
            'info': response,
            'hedged': dualSidePosition,
        };
    }

    /**
     * @method
     * @name binance#fetchMarginModes
     * @description fetches margin modes ("isolated" or "cross") that the market for the symbol in in, with symbol=undefined all markets for a subType (linear/inverse) are returned
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Account-Information
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Account-Information-V2
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Symbol-Config
     * @param {string[]} symbols unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a list of [margin mode structures]{@link https://docs.ccxt.com/#/?id=margin-mode-structure}
     */
    async fetchMarginModes (symbols: Strings = undefined, params = {}): Promise<MarginModes> {
        await this.loadMarkets ();
        let market = undefined;
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
            market = this.market (symbols[0]);
        }
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchMarginMode', market, params);
        let response = undefined;
        if (subType === 'linear') {
            response = await this.fapiPrivateGetSymbolConfig (params);
            //
            // [
            //     {
            //         "symbol": "BTCUSDT",
            //         "marginType": "CROSSED",
            //         "isAutoAddMargin": "false",
            //         "leverage": 21,
            //         "maxNotionalValue": "1000000",
            //     }
            // ]
            //
        } else if (subType === 'inverse') {
            response = await this.dapiPrivateGetAccount (params);
            //
            //    {
            //        feeTier: '0',
            //        canTrade: true,
            //        canDeposit: true,
            //        canWithdraw: true,
            //        updateTime: '0',
            //        assets: [
            //            {
            //                asset: 'APT',
            //                walletBalance: '0.00000000',
            //                unrealizedProfit: '0.00000000',
            //                marginBalance: '0.00000000',
            //                maintMargin: '0.00000000',
            //                initialMargin: '0.00000000',
            //                positionInitialMargin: '0.00000000',
            //                openOrderInitialMargin: '0.00000000',
            //                maxWithdrawAmount: '0.00000000',
            //                crossWalletBalance: '0.00000000',
            //                crossUnPnl: '0.00000000',
            //                availableBalance: '0.00000000',
            //                updateTime: '0'
            //            },
            //            ...
            //        ],
            //        positions: [
            //            {
            //                symbol: 'BCHUSD_240329',
            //                initialMargin: '0',
            //                maintMargin: '0',
            //                unrealizedProfit: '0.00000000',
            //                positionInitialMargin: '0',
            //                openOrderInitialMargin: '0',
            //                leverage: '20',
            //                isolated: false,
            //                positionSide: 'BOTH',
            //                entryPrice: '0.00000000',
            //                maxQty: '1000',
            //                notionalValue: '0',
            //                isolatedWallet: '0',
            //                updateTime: '0',
            //                positionAmt: '0',
            //                breakEvenPrice: '0.00000000'
            //            },
            //            ...
            //        ]
            //    }
            //
        } else {
            throw new BadRequest (this.id + ' fetchMarginModes () supports linear and inverse subTypes only');
        }
        let assets = this.safeList (response, 'positions', []);
        if (Array.isArray (response)) {
            assets = response;
        }
        return this.parseMarginModes (assets, symbols, 'symbol', 'swap');
    }

    /**
     * @method
     * @name binance#fetchMarginMode
     * @description fetches the margin mode of a specific symbol
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/account/rest-api/Symbol-Config
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/account/Account-Information
     * @param {string} symbol unified symbol of the market the order was made in
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object} a [margin mode structure]{@link https://docs.ccxt.com/#/?id=margin-mode-structure}
     */
    async fetchMarginMode (symbol: string, params = {}): Promise<MarginMode> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchMarginMode', market, params);
        let response = undefined;
        if (subType === 'linear') {
            const request: Dict = {
                'symbol': market['id'],
            };
            response = await this.fapiPrivateGetSymbolConfig (this.extend (request, params));
            //
            // [
            //     {
            //         "symbol": "BTCUSDT",
            //         "marginType": "CROSSED",
            //         "isAutoAddMargin": "false",
            //         "leverage": 21,
            //         "maxNotionalValue": "1000000",
            //     }
            // ]
            //
        } else if (subType === 'inverse') {
            const fetchMarginModesResponse = await this.fetchMarginModes ([ symbol ], params);
            return fetchMarginModesResponse[symbol];
        } else {
            throw new BadRequest (this.id + ' fetchMarginMode () supports linear and inverse subTypes only');
        }
        return this.parseMarginMode (response[0], market);
    }

    parseMarginMode (marginMode: Dict, market = undefined): MarginMode {
        const marketId = this.safeString (marginMode, 'symbol');
        market = this.safeMarket (marketId, market);
        const marginModeRaw = this.safeBool (marginMode, 'isolated');
        let reMarginMode = undefined;
        if (marginModeRaw !== undefined) {
            reMarginMode = marginModeRaw ? 'isolated' : 'cross';
        }
        const marginTypeRaw = this.safeStringLower (marginMode, 'marginType');
        if (marginTypeRaw !== undefined) {
            reMarginMode = (marginTypeRaw === 'crossed') ? 'cross' : 'isolated';
        }
        return {
            'info': marginMode,
            'symbol': market['symbol'],
            'marginMode': reMarginMode,
        } as MarginMode;
    }

    /**
     * @method
     * @name binance#fetchOption
     * @description fetches option data that is commonly found in an option chain
     * @see https://developers.binance.com/docs/derivatives/option/market-data/24hr-Ticker-Price-Change-Statistics
     * @param {string} symbol unified market symbol
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an [option chain structure]{@link https://docs.ccxt.com/#/?id=option-chain-structure}
     */
    async fetchOption (symbol: string, params = {}): Promise<Option> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        const request: Dict = {
            'symbol': market['id'],
        };
        const response = await this.eapiPublicGetTicker (this.extend (request, params));
        //
        //     [
        //         {
        //             "symbol": "BTC-241227-80000-C",
        //             "priceChange": "0",
        //             "priceChangePercent": "0",
        //             "lastPrice": "2750",
        //             "lastQty": "0",
        //             "open": "2750",
        //             "high": "2750",
        //             "low": "2750",
        //             "volume": "0",
        //             "amount": "0",
        //             "bidPrice": "4880",
        //             "askPrice": "0",
        //             "openTime": 0,
        //             "closeTime": 0,
        //             "firstTradeId": 0,
        //             "tradeCount": 0,
        //             "strikePrice": "80000",
        //             "exercisePrice": "63944.09893617"
        //         }
        //     ]
        //
        const chain = this.safeDict (response, 0, {});
        return this.parseOption (chain, undefined, market);
    }

    parseOption (chain: Dict, currency: Currency = undefined, market: Market = undefined): Option {
        //
        //     {
        //         "symbol": "BTC-241227-80000-C",
        //         "priceChange": "0",
        //         "priceChangePercent": "0",
        //         "lastPrice": "2750",
        //         "lastQty": "0",
        //         "open": "2750",
        //         "high": "2750",
        //         "low": "2750",
        //         "volume": "0",
        //         "amount": "0",
        //         "bidPrice": "4880",
        //         "askPrice": "0",
        //         "openTime": 0,
        //         "closeTime": 0,
        //         "firstTradeId": 0,
        //         "tradeCount": 0,
        //         "strikePrice": "80000",
        //         "exercisePrice": "63944.09893617"
        //     }
        //
        const marketId = this.safeString (chain, 'symbol');
        market = this.safeMarket (marketId, market);
        return {
            'info': chain,
            'currency': undefined,
            'symbol': market['symbol'],
            'timestamp': undefined,
            'datetime': undefined,
            'impliedVolatility': undefined,
            'openInterest': undefined,
            'bidPrice': this.safeNumber (chain, 'bidPrice'),
            'askPrice': this.safeNumber (chain, 'askPrice'),
            'midPrice': undefined,
            'markPrice': undefined,
            'lastPrice': this.safeNumber (chain, 'lastPrice'),
            'underlyingPrice': this.safeNumber (chain, 'exercisePrice'),
            'change': this.safeNumber (chain, 'priceChange'),
            'percentage': this.safeNumber (chain, 'priceChangePercent'),
            'baseVolume': this.safeNumber (chain, 'volume'),
            'quoteVolume': undefined,
        };
    }

    /**
     * @method
     * @name binance#fetchMarginAdjustmentHistory
     * @description fetches the history of margin added or reduced from contract isolated positions
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/trade/rest-api/Get-Position-Margin-Change-History
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/trade/Get-Position-Margin-Change-History
     * @param {string} symbol unified market symbol
     * @param {string} [type] "add" or "reduce"
     * @param {int} [since] timestamp in ms of the earliest change to fetch
     * @param {int} [limit] the maximum amount of changes to fetch
     * @param {object} params extra parameters specific to the exchange api endpoint
     * @param {int} [params.until] timestamp in ms of the latest change to fetch
     * @returns {object[]} a list of [margin structures]{@link https://docs.ccxt.com/#/?id=margin-loan-structure}
     */
    async fetchMarginAdjustmentHistory (symbol: Str = undefined, type: Str = undefined, since: Num = undefined, limit: Num = undefined, params = {}): Promise<MarginModification[]> {
        await this.loadMarkets ();
        if (symbol === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchMarginAdjustmentHistory () requires a symbol argument');
        }
        const market = this.market (symbol);
        const until = this.safeInteger (params, 'until');
        params = this.omit (params, 'until');
        const request: Dict = {
            'symbol': market['id'],
        };
        if (type !== undefined) {
            request['type'] = (type === 'add') ? 1 : 2;
        }
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        if (until !== undefined) {
            request['endTime'] = until;
        }
        let response = undefined;
        if (market['linear']) {
            response = await this.fapiPrivateGetPositionMarginHistory (this.extend (request, params));
        } else if (market['inverse']) {
            response = await this.dapiPrivateGetPositionMarginHistory (this.extend (request, params));
        } else {
            throw new BadRequest (this.id + 'fetchMarginAdjustmentHistory () is not supported for markets of type ' + market['type']);
        }
        //
        //    [
        //        {
        //            symbol: "XRPUSDT",
        //            type: "1",
        //            deltaType: "TRADE",
        //            amount: "2.57148240",
        //            asset: "USDT",
        //            time: "1711046271555",
        //            positionSide: "BOTH",
        //            clientTranId: ""
        //        }
        //        ...
        //    ]
        //
        const modifications = this.parseMarginModifications (response);
        return this.filterBySymbolSinceLimit (modifications, symbol, since, limit);
    }

    /**
     * @method
     * @name binance#fetchConvertCurrencies
     * @description fetches all available currencies that can be converted
     * @see https://developers.binance.com/docs/convert/market-data/Query-order-quantity-precision-per-asset
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} an associative dictionary of currencies
     */
    async fetchConvertCurrencies (params = {}): Promise<Currencies> {
        await this.loadMarkets ();
        const response = await this.sapiGetConvertAssetInfo (params);
        //
        //     [
        //         {
        //             "asset": "BTC",
        //             "fraction": 8
        //         },
        //     ]
        //
        const result: Dict = {};
        for (let i = 0; i < response.length; i++) {
            const entry = response[i];
            const id = this.safeString (entry, 'asset');
            const code = this.safeCurrencyCode (id);
            result[code] = {
                'info': entry,
                'id': id,
                'code': code,
                'networks': undefined,
                'type': undefined,
                'name': undefined,
                'active': undefined,
                'deposit': undefined,
                'withdraw': undefined,
                'fee': undefined,
                'precision': this.parseNumber (this.parsePrecision (this.safeString (entry, 'fraction'))),
                'limits': {
                    'amount': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'withdraw': {
                        'min': undefined,
                        'max': undefined,
                    },
                    'deposit': {
                        'min': undefined,
                        'max': undefined,
                    },
                },
                'created': undefined,
            };
        }
        return result;
    }

    /**
     * @method
     * @name binance#fetchConvertQuote
     * @description fetch a quote for converting from one currency to another
     * @see https://developers.binance.com/docs/convert/trade/Send-quote-request
     * @param {string} fromCode the currency that you want to sell and convert from
     * @param {string} toCode the currency that you want to buy and convert into
     * @param {float} amount how much you want to trade in units of the from currency
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.walletType] either 'SPOT' or 'FUNDING', the default is 'SPOT'
     * @returns {object} a [conversion structure]{@link https://docs.ccxt.com/#/?id=conversion-structure}
     */
    async fetchConvertQuote (fromCode: string, toCode: string, amount: Num = undefined, params = {}): Promise<Conversion> {
        if (amount === undefined) {
            throw new ArgumentsRequired (this.id + ' fetchConvertQuote() requires an amount argument');
        }
        await this.loadMarkets ();
        const request: Dict = {
            'fromAsset': fromCode,
            'toAsset': toCode,
            'fromAmount': amount,
        };
        const response = await this.sapiPostConvertGetQuote (this.extend (request, params));
        //
        //     {
        //         "quoteId":"12415572564",
        //         "ratio":"38163.7",
        //         "inverseRatio":"0.0000262",
        //         "validTimestamp":1623319461670,
        //         "toAmount":"3816.37",
        //         "fromAmount":"0.1"
        //     }
        //
        const fromCurrency = this.currency (fromCode);
        const toCurrency = this.currency (toCode);
        return this.parseConversion (response, fromCurrency, toCurrency);
    }

    /**
     * @method
     * @name binance#createConvertTrade
     * @description convert from one currency to another
     * @see https://developers.binance.com/docs/convert/trade/Accept-Quote
     * @param {string} id the id of the trade that you want to make
     * @param {string} fromCode the currency that you want to sell and convert from
     * @param {string} toCode the currency that you want to buy and convert into
     * @param {float} [amount] how much you want to trade in units of the from currency
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [conversion structure]{@link https://docs.ccxt.com/#/?id=conversion-structure}
     */
    async createConvertTrade (id: string, fromCode: string, toCode: string, amount: Num = undefined, params = {}): Promise<Conversion> {
        await this.loadMarkets ();
        const request: Dict = {};
        let response = undefined;
        if ((fromCode === 'BUSD') || (toCode === 'BUSD')) {
            if (amount === undefined) {
                throw new ArgumentsRequired (this.id + ' createConvertTrade() requires an amount argument');
            }
            request['clientTranId'] = id;
            request['asset'] = fromCode;
            request['targetAsset'] = toCode;
            request['amount'] = amount;
            response = await this.sapiPostAssetConvertTransfer (this.extend (request, params));
            //
            //     {
            //         "tranId": 118263407119,
            //         "status": "S"
            //     }
            //
        } else {
            request['quoteId'] = id;
            response = await this.sapiPostConvertAcceptQuote (this.extend (request, params));
            //
            //     {
            //         "orderId":"933256278426274426",
            //         "createTime":1623381330472,
            //         "orderStatus":"PROCESS"
            //     }
            //
        }
        const fromCurrency = this.currency (fromCode);
        const toCurrency = this.currency (toCode);
        return this.parseConversion (response, fromCurrency, toCurrency);
    }

    /**
     * @method
     * @name binance#fetchConvertTrade
     * @description fetch the data for a conversion trade
     * @see https://developers.binance.com/docs/convert/trade/Order-Status
     * @param {string} id the id of the trade that you want to fetch
     * @param {string} [code] the unified currency code of the conversion trade
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @returns {object} a [conversion structure]{@link https://docs.ccxt.com/#/?id=conversion-structure}
     */
    async fetchConvertTrade (id: string, code: Str = undefined, params = {}): Promise<Conversion> {
        await this.loadMarkets ();
        const request: Dict = {};
        let response = undefined;
        if (code === 'BUSD') {
            const msInDay = 86400000;
            const now = this.milliseconds ();
            if (code !== undefined) {
                const currency = this.currency (code);
                request['asset'] = currency['id'];
            }
            request['tranId'] = id;
            request['startTime'] = now - msInDay;
            request['endTime'] = now;
            response = await this.sapiGetAssetConvertTransferQueryByPage (this.extend (request, params));
            //
            //     {
            //         "total": 3,
            //         "rows": [
            //             {
            //                 "tranId": 118263615991,
            //                 "type": 244,
            //                 "time": 1664442078000,
            //                 "deductedAsset": "BUSD",
            //                 "deductedAmount": "1",
            //                 "targetAsset": "USDC",
            //                 "targetAmount": "1",
            //                 "status": "S",
            //                 "accountType": "MAIN"
            //             },
            //         ]
            //     }
            //
        } else {
            request['orderId'] = id;
            response = await this.sapiGetConvertOrderStatus (this.extend (request, params));
            //
            //     {
            //         "orderId":933256278426274426,
            //         "orderStatus":"SUCCESS",
            //         "fromAsset":"BTC",
            //         "fromAmount":"0.00054414",
            //         "toAsset":"USDT",
            //         "toAmount":"20",
            //         "ratio":"36755",
            //         "inverseRatio":"0.00002721",
            //         "createTime":1623381330472
            //     }
            //
        }
        let data = response;
        if (code === 'BUSD') {
            const rows = this.safeList (response, 'rows', []);
            data = this.safeDict (rows, 0, {});
        }
        const fromCurrencyId = this.safeString2 (data, 'deductedAsset', 'fromAsset');
        const toCurrencyId = this.safeString2 (data, 'targetAsset', 'toAsset');
        let fromCurrency = undefined;
        let toCurrency = undefined;
        if (fromCurrencyId !== undefined) {
            fromCurrency = this.currency (fromCurrencyId);
        }
        if (toCurrencyId !== undefined) {
            toCurrency = this.currency (toCurrencyId);
        }
        return this.parseConversion (data, fromCurrency, toCurrency);
    }

    /**
     * @method
     * @name binance#fetchConvertTradeHistory
     * @description fetch the users history of conversion trades
     * @see https://developers.binance.com/docs/convert/trade/Get-Convert-Trade-History
     * @param {string} [code] the unified currency code
     * @param {int} [since] the earliest time in ms to fetch conversions for
     * @param {int} [limit] the maximum number of conversion structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] timestamp in ms of the latest conversion to fetch
     * @returns {object[]} a list of [conversion structures]{@link https://docs.ccxt.com/#/?id=conversion-structure}
     */
    async fetchConvertTradeHistory (code: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<Conversion[]> {
        await this.loadMarkets ();
        const request: Dict = {};
        const msInThirtyDays = 2592000000;
        const now = this.milliseconds ();
        if (since !== undefined) {
            request['startTime'] = since;
        } else {
            request['startTime'] = now - msInThirtyDays;
        }
        const endTime = this.safeInteger2 (params, 'endTime', 'until');
        if (endTime !== undefined) {
            request['endTime'] = endTime;
        } else {
            request['endTime'] = now;
        }
        params = this.omit (params, 'until');
        let response = undefined;
        let responseQuery = undefined;
        let fromCurrencyKey = undefined;
        let toCurrencyKey = undefined;
        if (code === 'BUSD') {
            const currency = this.currency (code);
            request['asset'] = currency['id'];
            if (limit !== undefined) {
                request['size'] = limit;
            }
            fromCurrencyKey = 'deductedAsset';
            toCurrencyKey = 'targetAsset';
            responseQuery = 'rows';
            response = await this.sapiGetAssetConvertTransferQueryByPage (this.extend (request, params));
            //
            //     {
            //         "total": 3,
            //         "rows": [
            //             {
            //                 "tranId": 118263615991,
            //                 "type": 244,
            //                 "time": 1664442078000,
            //                 "deductedAsset": "BUSD",
            //                 "deductedAmount": "1",
            //                 "targetAsset": "USDC",
            //                 "targetAmount": "1",
            //                 "status": "S",
            //                 "accountType": "MAIN"
            //             },
            //         ]
            //     }
            //
        } else {
            if ((request['endTime'] - request['startTime']) > msInThirtyDays) {
                throw new BadRequest (this.id + ' fetchConvertTradeHistory () the max interval between startTime and endTime is 30 days.');
            }
            if (limit !== undefined) {
                request['limit'] = limit;
            }
            fromCurrencyKey = 'fromAsset';
            toCurrencyKey = 'toAsset';
            responseQuery = 'list';
            response = await this.sapiGetConvertTradeFlow (this.extend (request, params));
            //
            //     {
            //         "list": [
            //             {
            //                 "quoteId": "f3b91c525b2644c7bc1e1cd31b6e1aa6",
            //                 "orderId": 940708407462087195,
            //                 "orderStatus": "SUCCESS",
            //                 "fromAsset": "USDT",
            //                 "fromAmount": "20",
            //                 "toAsset": "BNB",
            //                 "toAmount": "0.06154036",
            //                 "ratio": "0.00307702",
            //                 "inverseRatio": "324.99",
            //                 "createTime": 1624248872184
            //             }
            //         ],
            //         "startTime": 1623824139000,
            //         "endTime": 1626416139000,
            //         "limit": 100,
            //         "moreData": false
            //     }
            //
        }
        const rows = this.safeList (response, responseQuery, []);
        return this.parseConversions (rows, code, fromCurrencyKey, toCurrencyKey, since, limit);
    }

    parseConversion (conversion: Dict, fromCurrency: Currency = undefined, toCurrency: Currency = undefined): Conversion {
        //
        // fetchConvertQuote
        //
        //     {
        //         "quoteId":"12415572564",
        //         "ratio":"38163.7",
        //         "inverseRatio":"0.0000262",
        //         "validTimestamp":1623319461670,
        //         "toAmount":"3816.37",
        //         "fromAmount":"0.1"
        //     }
        //
        // createConvertTrade
        //
        //     {
        //         "orderId":"933256278426274426",
        //         "createTime":1623381330472,
        //         "orderStatus":"PROCESS"
        //     }
        //
        // createConvertTrade BUSD
        //
        //     {
        //         "tranId": 118263407119,
        //         "status": "S"
        //     }
        //
        // fetchConvertTrade, fetchConvertTradeHistory BUSD
        //
        //     {
        //         "tranId": 118263615991,
        //         "type": 244,
        //         "time": 1664442078000,
        //         "deductedAsset": "BUSD",
        //         "deductedAmount": "1",
        //         "targetAsset": "USDC",
        //         "targetAmount": "1",
        //         "status": "S",
        //         "accountType": "MAIN"
        //     }
        //
        // fetchConvertTrade
        //
        //     {
        //         "orderId":933256278426274426,
        //         "orderStatus":"SUCCESS",
        //         "fromAsset":"BTC",
        //         "fromAmount":"0.00054414",
        //         "toAsset":"USDT",
        //         "toAmount":"20",
        //         "ratio":"36755",
        //         "inverseRatio":"0.00002721",
        //         "createTime":1623381330472
        //     }
        //
        // fetchConvertTradeHistory
        //
        //     {
        //         "quoteId": "f3b91c525b2644c7bc1e1cd31b6e1aa6",
        //         "orderId": 940708407462087195,
        //         "orderStatus": "SUCCESS",
        //         "fromAsset": "USDT",
        //         "fromAmount": "20",
        //         "toAsset": "BNB",
        //         "toAmount": "0.06154036",
        //         "ratio": "0.00307702",
        //         "inverseRatio": "324.99",
        //         "createTime": 1624248872184
        //     }
        //
        const timestamp = this.safeIntegerN (conversion, [ 'time', 'validTimestamp', 'createTime' ]);
        const fromCur = this.safeString2 (conversion, 'deductedAsset', 'fromAsset');
        const fromCode = this.safeCurrencyCode (fromCur, fromCurrency);
        const to = this.safeString2 (conversion, 'targetAsset', 'toAsset');
        const toCode = this.safeCurrencyCode (to, toCurrency);
        return {
            'info': conversion,
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'id': this.safeStringN (conversion, [ 'tranId', 'orderId', 'quoteId' ]),
            'fromCurrency': fromCode,
            'fromAmount': this.safeNumber2 (conversion, 'deductedAmount', 'fromAmount'),
            'toCurrency': toCode,
            'toAmount': this.safeNumber2 (conversion, 'targetAmount', 'toAmount'),
            'price': undefined,
            'fee': undefined,
        } as Conversion;
    }

    /**
     * @method
     * @name binance#fetchFundingIntervals
     * @description fetch the funding rate interval for multiple markets
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Get-Funding-Info
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Get-Funding-Info
     * @param {string[]} [symbols] list of unified market symbols
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {string} [params.subType] "linear" or "inverse"
     * @returns {object[]} a list of [funding rate structures]{@link https://docs.ccxt.com/#/?id=funding-rate-structure}
     */
    async fetchFundingIntervals (symbols: Strings = undefined, params = {}): Promise<FundingRates> {
        await this.loadMarkets ();
        let market = undefined;
        if (symbols !== undefined) {
            symbols = this.marketSymbols (symbols);
            market = this.market (symbols[0]);
        }
        const type = 'swap';
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchFundingIntervals', market, params, 'linear');
        let response = undefined;
        if (this.isLinear (type, subType)) {
            response = await this.fapiPublicGetFundingInfo (params);
        } else if (this.isInverse (type, subType)) {
            response = await this.dapiPublicGetFundingInfo (params);
        } else {
            throw new NotSupported (this.id + ' fetchFundingIntervals() supports linear and inverse swap contracts only');
        }
        //
        //     [
        //         {
        //             "symbol": "BLZUSDT",
        //             "adjustedFundingRateCap": "0.03000000",
        //             "adjustedFundingRateFloor": "-0.03000000",
        //             "fundingIntervalHours": 4,
        //             "disclaimer": false
        //         },
        //     ]
        //
        const result = this.parseFundingRates (response, market);
        return this.filterByArray (result, 'symbol', symbols);
    }

    /**
     * @method
     * @name binance#fetchLongShortRatioHistory
     * @description fetches the long short ratio history for a unified market symbol
     * @see https://developers.binance.com/docs/derivatives/usds-margined-futures/market-data/rest-api/Long-Short-Ratio
     * @see https://developers.binance.com/docs/derivatives/coin-margined-futures/market-data/Long-Short-Ratio
     * @param {string} symbol unified symbol of the market to fetch the long short ratio for
     * @param {string} [timeframe] the period for the ratio, default is 24 hours
     * @param {int} [since] the earliest time in ms to fetch ratios for
     * @param {int} [limit] the maximum number of long short ratio structures to retrieve
     * @param {object} [params] extra parameters specific to the exchange API endpoint
     * @param {int} [params.until] timestamp in ms of the latest ratio to fetch
     * @returns {object[]} an array of [long short ratio structures]{@link https://docs.ccxt.com/#/?id=long-short-ratio-structure}
     */
    async fetchLongShortRatioHistory (symbol: Str = undefined, timeframe: Str = undefined, since: Int = undefined, limit: Int = undefined, params = {}): Promise<LongShortRatio[]> {
        await this.loadMarkets ();
        const market = this.market (symbol);
        if (timeframe === undefined) {
            timeframe = '1d';
        }
        let request: Dict = {
            'period': timeframe,
        };
        [ request, params ] = this.handleUntilOption ('endTime', request, params);
        if (since !== undefined) {
            request['startTime'] = since;
        }
        if (limit !== undefined) {
            request['limit'] = limit;
        }
        let subType = undefined;
        [ subType, params ] = this.handleSubTypeAndParams ('fetchLongShortRatioHistory', market, params);
        let response = undefined;
        if (subType === 'linear') {
            request['symbol'] = market['id'];
            response = await this.fapiDataGetGlobalLongShortAccountRatio (this.extend (request, params));
            //
            //     [
            //         {
            //             "symbol": "BTCUSDT",
            //             "longAccount": "0.4558",
            //             "longShortRatio": "0.8376",
            //             "shortAccount": "0.5442",
            //             "timestamp": 1726790400000
            //         },
            //     ]
            //
        } else if (subType === 'inverse') {
            request['pair'] = market['info']['pair'];
            response = await this.dapiDataGetGlobalLongShortAccountRatio (this.extend (request, params));
            //
            //     [
            //         {
            //             "longAccount": "0.7262",
            //             "longShortRatio": "2.6523",
            //             "shortAccount": "0.2738",
            //             "pair": "BTCUSD",
            //             "timestamp": 1726790400000
            //         },
            //     ]
            //
        } else {
            throw new BadRequest (this.id + ' fetchLongShortRatioHistory() supports linear and inverse subTypes only');
        }
        return this.parseLongShortRatioHistory (response, market);
    }

    parseLongShortRatio (info: Dict, market: Market = undefined): LongShortRatio {
        //
        // linear
        //
        //     {
        //         "symbol": "BTCUSDT",
        //         "longAccount": "0.4558",
        //         "longShortRatio": "0.8376",
        //         "shortAccount": "0.5442",
        //         "timestamp": 1726790400000
        //     }
        //
        // inverse
        //
        //     {
        //         "longAccount": "0.7262",
        //         "longShortRatio": "2.6523",
        //         "shortAccount": "0.2738",
        //         "pair": "BTCUSD",
        //         "timestamp": 1726790400000
        //     }
        //
        const marketId = this.safeString (info, 'symbol');
        const timestamp = this.safeIntegerOmitZero (info, 'timestamp');
        return {
            'info': info,
            'symbol': this.safeSymbol (marketId, market, undefined, 'contract'),
            'timestamp': timestamp,
            'datetime': this.iso8601 (timestamp),
            'timeframe': undefined,
            'longShortRatio': this.safeNumber (info, 'longShortRatio'),
        } as LongShortRatio;
    }
}