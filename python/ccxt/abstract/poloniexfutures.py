from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_contracts_active = publicGetContractsActive = Entry('contracts/active', 'public', 'GET', {'cost': 10})
    public_get_contracts_symbol = publicGetContractsSymbol = Entry('contracts/{symbol}', 'public', 'GET', {'cost': 10})
    public_get_ticker = publicGetTicker = Entry('ticker', 'public', 'GET', {'cost': 10})
    public_get_tickers = publicGetTickers = Entry('tickers', 'public', 'GET', {'cost': 10})
    public_get_level2_snapshot = publicGetLevel2Snapshot = Entry('level2/snapshot', 'public', 'GET', {'cost': 180.002})
    public_get_level2_depth = publicGetLevel2Depth = Entry('level2/depth', 'public', 'GET', {'cost': 180.002})
    public_get_level2_message_query = publicGetLevel2MessageQuery = Entry('level2/message/query', 'public', 'GET', {'cost': 180.002})
    public_get_level3_snapshot = publicGetLevel3Snapshot = Entry('level3/snapshot', 'public', 'GET', {'cost': 180.002})
    public_get_trade_history = publicGetTradeHistory = Entry('trade/history', 'public', 'GET', {'cost': 10})
    public_get_interest_query = publicGetInterestQuery = Entry('interest/query', 'public', 'GET', {'cost': 10})
    public_get_index_query = publicGetIndexQuery = Entry('index/query', 'public', 'GET', {'cost': 10})
    public_get_mark_price_symbol_current = publicGetMarkPriceSymbolCurrent = Entry('mark-price/{symbol}/current', 'public', 'GET', {'cost': 10})
    public_get_premium_query = publicGetPremiumQuery = Entry('premium/query', 'public', 'GET', {'cost': 10})
    public_get_funding_rate_symbol_current = publicGetFundingRateSymbolCurrent = Entry('funding-rate/{symbol}/current', 'public', 'GET', {'cost': 10})
    public_get_timestamp = publicGetTimestamp = Entry('timestamp', 'public', 'GET', {'cost': 10})
    public_get_status = publicGetStatus = Entry('status', 'public', 'GET', {'cost': 10})
    public_get_kline_query = publicGetKlineQuery = Entry('kline/query', 'public', 'GET', {'cost': 10})
    public_post_bullet_public = publicPostBulletPublic = Entry('bullet-public', 'public', 'POST', {'cost': 10})
    private_get_account_overview = privateGetAccountOverview = Entry('account-overview', 'private', 'GET', {'cost': 1})
    private_get_transaction_history = privateGetTransactionHistory = Entry('transaction-history', 'private', 'GET', {'cost': 1})
    private_get_maxactiveorders = privateGetMaxActiveOrders = Entry('maxActiveOrders', 'private', 'GET', {'cost': 1})
    private_get_maxrisklimit = privateGetMaxRiskLimit = Entry('maxRiskLimit', 'private', 'GET', {'cost': 1})
    private_get_userfeerate = privateGetUserFeeRate = Entry('userFeeRate', 'private', 'GET', {'cost': 1})
    private_get_margintype_query = privateGetMarginTypeQuery = Entry('marginType/query', 'private', 'GET', {'cost': 1})
    private_get_orders = privateGetOrders = Entry('orders', 'private', 'GET', {'cost': 1})
    private_get_stoporders = privateGetStopOrders = Entry('stopOrders', 'private', 'GET', {'cost': 1})
    private_get_recentdoneorders = privateGetRecentDoneOrders = Entry('recentDoneOrders', 'private', 'GET', {'cost': 1})
    private_get_orders_order_id = privateGetOrdersOrderId = Entry('orders/{order-id}', 'private', 'GET', {'cost': 1})
    private_get_clientorderid_clientoid = privateGetClientOrderIdClientOid = Entry('clientOrderId/{clientOid}', 'private', 'GET', {'cost': 1})
    private_get_fills = privateGetFills = Entry('fills', 'private', 'GET', {'cost': 1})
    private_get_openorderstatistics = privateGetOpenOrderStatistics = Entry('openOrderStatistics', 'private', 'GET', {'cost': 1})
    private_get_position = privateGetPosition = Entry('position', 'private', 'GET', {'cost': 1.5})
    private_get_positions = privateGetPositions = Entry('positions', 'private', 'GET', {'cost': 1.5})
    private_get_funding_history = privateGetFundingHistory = Entry('funding-history', 'private', 'GET', {'cost': 1})
    private_post_orders = privatePostOrders = Entry('orders', 'private', 'POST', {'cost': 1.5})
    private_post_batchorders = privatePostBatchOrders = Entry('batchOrders', 'private', 'POST', {'cost': 1.5})
    private_post_position_margin_auto_deposit_status = privatePostPositionMarginAutoDepositStatus = Entry('position/margin/auto-deposit-status', 'private', 'POST', {'cost': 1.5})
    private_post_position_margin_deposit_margin = privatePostPositionMarginDepositMargin = Entry('position/margin/deposit-margin', 'private', 'POST', {'cost': 1.5})
    private_post_position_margin_withdraw_margin = privatePostPositionMarginWithdrawMargin = Entry('position/margin/withdraw-margin', 'private', 'POST', {'cost': 1.5})
    private_post_bullet_private = privatePostBulletPrivate = Entry('bullet-private', 'private', 'POST', {'cost': 1})
    private_post_margintype_change = privatePostMarginTypeChange = Entry('marginType/change', 'private', 'POST', {'cost': 1})
    private_delete_orders_order_id = privateDeleteOrdersOrderId = Entry('orders/{order-id}', 'private', 'DELETE', {'cost': 1.5})
    private_delete_orders = privateDeleteOrders = Entry('orders', 'private', 'DELETE', {'cost': 150.016})
    private_delete_stoporders = privateDeleteStopOrders = Entry('stopOrders', 'private', 'DELETE', {'cost': 150.016})