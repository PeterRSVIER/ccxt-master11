from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_auth = publicGetAuth = Entry('auth', 'public', 'GET', {'cost': 1})
    public_get_exchange_token = publicGetExchangeToken = Entry('exchange_token', 'public', 'GET', {'cost': 1})
    public_get_fork_token = publicGetForkToken = Entry('fork_token', 'public', 'GET', {'cost': 1})
    public_get_set_heartbeat = publicGetSetHeartbeat = Entry('set_heartbeat', 'public', 'GET', {'cost': 1})
    public_get_disable_heartbeat = publicGetDisableHeartbeat = Entry('disable_heartbeat', 'public', 'GET', {'cost': 1})
    public_get_get_time = publicGetGetTime = Entry('get_time', 'public', 'GET', {'cost': 1})
    public_get_hello = publicGetHello = Entry('hello', 'public', 'GET', {'cost': 1})
    public_get_status = publicGetStatus = Entry('status', 'public', 'GET', {'cost': 1})
    public_get_test = publicGetTest = Entry('test', 'public', 'GET', {'cost': 1})
    public_get_subscribe = publicGetSubscribe = Entry('subscribe', 'public', 'GET', {'cost': 1})
    public_get_unsubscribe = publicGetUnsubscribe = Entry('unsubscribe', 'public', 'GET', {'cost': 1})
    public_get_unsubscribe_all = publicGetUnsubscribeAll = Entry('unsubscribe_all', 'public', 'GET', {'cost': 1})
    public_get_get_announcements = publicGetGetAnnouncements = Entry('get_announcements', 'public', 'GET', {'cost': 1})
    public_get_get_book_summary_by_currency = publicGetGetBookSummaryByCurrency = Entry('get_book_summary_by_currency', 'public', 'GET', {'cost': 1})
    public_get_get_book_summary_by_instrument = publicGetGetBookSummaryByInstrument = Entry('get_book_summary_by_instrument', 'public', 'GET', {'cost': 1})
    public_get_get_contract_size = publicGetGetContractSize = Entry('get_contract_size', 'public', 'GET', {'cost': 1})
    public_get_get_currencies = publicGetGetCurrencies = Entry('get_currencies', 'public', 'GET', {'cost': 1})
    public_get_get_delivery_prices = publicGetGetDeliveryPrices = Entry('get_delivery_prices', 'public', 'GET', {'cost': 1})
    public_get_get_funding_chart_data = publicGetGetFundingChartData = Entry('get_funding_chart_data', 'public', 'GET', {'cost': 1})
    public_get_get_funding_rate_history = publicGetGetFundingRateHistory = Entry('get_funding_rate_history', 'public', 'GET', {'cost': 1})
    public_get_get_funding_rate_value = publicGetGetFundingRateValue = Entry('get_funding_rate_value', 'public', 'GET', {'cost': 1})
    public_get_get_historical_volatility = publicGetGetHistoricalVolatility = Entry('get_historical_volatility', 'public', 'GET', {'cost': 1})
    public_get_get_index = publicGetGetIndex = Entry('get_index', 'public', 'GET', {'cost': 1})
    public_get_get_index_price = publicGetGetIndexPrice = Entry('get_index_price', 'public', 'GET', {'cost': 1})
    public_get_get_index_price_names = publicGetGetIndexPriceNames = Entry('get_index_price_names', 'public', 'GET', {'cost': 1})
    public_get_get_instrument = publicGetGetInstrument = Entry('get_instrument', 'public', 'GET', {'cost': 1})
    public_get_get_instruments = publicGetGetInstruments = Entry('get_instruments', 'public', 'GET', {'cost': 1})
    public_get_get_last_settlements_by_currency = publicGetGetLastSettlementsByCurrency = Entry('get_last_settlements_by_currency', 'public', 'GET', {'cost': 1})
    public_get_get_last_settlements_by_instrument = publicGetGetLastSettlementsByInstrument = Entry('get_last_settlements_by_instrument', 'public', 'GET', {'cost': 1})
    public_get_get_last_trades_by_currency = publicGetGetLastTradesByCurrency = Entry('get_last_trades_by_currency', 'public', 'GET', {'cost': 1})
    public_get_get_last_trades_by_currency_and_time = publicGetGetLastTradesByCurrencyAndTime = Entry('get_last_trades_by_currency_and_time', 'public', 'GET', {'cost': 1})
    public_get_get_last_trades_by_instrument = publicGetGetLastTradesByInstrument = Entry('get_last_trades_by_instrument', 'public', 'GET', {'cost': 1})
    public_get_get_last_trades_by_instrument_and_time = publicGetGetLastTradesByInstrumentAndTime = Entry('get_last_trades_by_instrument_and_time', 'public', 'GET', {'cost': 1})
    public_get_get_mark_price_history = publicGetGetMarkPriceHistory = Entry('get_mark_price_history', 'public', 'GET', {'cost': 1})
    public_get_get_order_book = publicGetGetOrderBook = Entry('get_order_book', 'public', 'GET', {'cost': 1})
    public_get_get_trade_volumes = publicGetGetTradeVolumes = Entry('get_trade_volumes', 'public', 'GET', {'cost': 1})
    public_get_get_tradingview_chart_data = publicGetGetTradingviewChartData = Entry('get_tradingview_chart_data', 'public', 'GET', {'cost': 1})
    public_get_get_volatility_index_data = publicGetGetVolatilityIndexData = Entry('get_volatility_index_data', 'public', 'GET', {'cost': 1})
    public_get_ticker = publicGetTicker = Entry('ticker', 'public', 'GET', {'cost': 1})
    private_get_logout = privateGetLogout = Entry('logout', 'private', 'GET', {'cost': 1})
    private_get_enable_cancel_on_disconnect = privateGetEnableCancelOnDisconnect = Entry('enable_cancel_on_disconnect', 'private', 'GET', {'cost': 1})
    private_get_disable_cancel_on_disconnect = privateGetDisableCancelOnDisconnect = Entry('disable_cancel_on_disconnect', 'private', 'GET', {'cost': 1})
    private_get_get_cancel_on_disconnect = privateGetGetCancelOnDisconnect = Entry('get_cancel_on_disconnect', 'private', 'GET', {'cost': 1})
    private_get_subscribe = privateGetSubscribe = Entry('subscribe', 'private', 'GET', {'cost': 1})
    private_get_unsubscribe = privateGetUnsubscribe = Entry('unsubscribe', 'private', 'GET', {'cost': 1})
    private_get_unsubscribe_all = privateGetUnsubscribeAll = Entry('unsubscribe_all', 'private', 'GET', {'cost': 1})
    private_get_change_api_key_name = privateGetChangeApiKeyName = Entry('change_api_key_name', 'private', 'GET', {'cost': 1})
    private_get_change_scope_in_api_key = privateGetChangeScopeInApiKey = Entry('change_scope_in_api_key', 'private', 'GET', {'cost': 1})
    private_get_change_subaccount_name = privateGetChangeSubaccountName = Entry('change_subaccount_name', 'private', 'GET', {'cost': 1})
    private_get_create_api_key = privateGetCreateApiKey = Entry('create_api_key', 'private', 'GET', {'cost': 1})
    private_get_create_subaccount = privateGetCreateSubaccount = Entry('create_subaccount', 'private', 'GET', {'cost': 1})
    private_get_disable_api_key = privateGetDisableApiKey = Entry('disable_api_key', 'private', 'GET', {'cost': 1})
    private_get_disable_tfa_for_subaccount = privateGetDisableTfaForSubaccount = Entry('disable_tfa_for_subaccount', 'private', 'GET', {'cost': 1})
    private_get_enable_affiliate_program = privateGetEnableAffiliateProgram = Entry('enable_affiliate_program', 'private', 'GET', {'cost': 1})
    private_get_enable_api_key = privateGetEnableApiKey = Entry('enable_api_key', 'private', 'GET', {'cost': 1})
    private_get_get_access_log = privateGetGetAccessLog = Entry('get_access_log', 'private', 'GET', {'cost': 1})
    private_get_get_account_summary = privateGetGetAccountSummary = Entry('get_account_summary', 'private', 'GET', {'cost': 1})
    private_get_get_affiliate_program_info = privateGetGetAffiliateProgramInfo = Entry('get_affiliate_program_info', 'private', 'GET', {'cost': 1})
    private_get_get_email_language = privateGetGetEmailLanguage = Entry('get_email_language', 'private', 'GET', {'cost': 1})
    private_get_get_new_announcements = privateGetGetNewAnnouncements = Entry('get_new_announcements', 'private', 'GET', {'cost': 1})
    private_get_get_portfolio_margins = privateGetGetPortfolioMargins = Entry('get_portfolio_margins', 'private', 'GET', {'cost': 1})
    private_get_get_position = privateGetGetPosition = Entry('get_position', 'private', 'GET', {'cost': 1})
    private_get_get_positions = privateGetGetPositions = Entry('get_positions', 'private', 'GET', {'cost': 1})
    private_get_get_subaccounts = privateGetGetSubaccounts = Entry('get_subaccounts', 'private', 'GET', {'cost': 1})
    private_get_get_subaccounts_details = privateGetGetSubaccountsDetails = Entry('get_subaccounts_details', 'private', 'GET', {'cost': 1})
    private_get_get_transaction_log = privateGetGetTransactionLog = Entry('get_transaction_log', 'private', 'GET', {'cost': 1})
    private_get_list_api_keys = privateGetListApiKeys = Entry('list_api_keys', 'private', 'GET', {'cost': 1})
    private_get_remove_api_key = privateGetRemoveApiKey = Entry('remove_api_key', 'private', 'GET', {'cost': 1})
    private_get_remove_subaccount = privateGetRemoveSubaccount = Entry('remove_subaccount', 'private', 'GET', {'cost': 1})
    private_get_reset_api_key = privateGetResetApiKey = Entry('reset_api_key', 'private', 'GET', {'cost': 1})
    private_get_set_announcement_as_read = privateGetSetAnnouncementAsRead = Entry('set_announcement_as_read', 'private', 'GET', {'cost': 1})
    private_get_set_api_key_as_default = privateGetSetApiKeyAsDefault = Entry('set_api_key_as_default', 'private', 'GET', {'cost': 1})
    private_get_set_email_for_subaccount = privateGetSetEmailForSubaccount = Entry('set_email_for_subaccount', 'private', 'GET', {'cost': 1})
    private_get_set_email_language = privateGetSetEmailLanguage = Entry('set_email_language', 'private', 'GET', {'cost': 1})
    private_get_set_password_for_subaccount = privateGetSetPasswordForSubaccount = Entry('set_password_for_subaccount', 'private', 'GET', {'cost': 1})
    private_get_toggle_notifications_from_subaccount = privateGetToggleNotificationsFromSubaccount = Entry('toggle_notifications_from_subaccount', 'private', 'GET', {'cost': 1})
    private_get_toggle_subaccount_login = privateGetToggleSubaccountLogin = Entry('toggle_subaccount_login', 'private', 'GET', {'cost': 1})
    private_get_execute_block_trade = privateGetExecuteBlockTrade = Entry('execute_block_trade', 'private', 'GET', {'cost': 4})
    private_get_get_block_trade = privateGetGetBlockTrade = Entry('get_block_trade', 'private', 'GET', {'cost': 1})
    private_get_get_last_block_trades_by_currency = privateGetGetLastBlockTradesByCurrency = Entry('get_last_block_trades_by_currency', 'private', 'GET', {'cost': 1})
    private_get_invalidate_block_trade_signature = privateGetInvalidateBlockTradeSignature = Entry('invalidate_block_trade_signature', 'private', 'GET', {'cost': 1})
    private_get_verify_block_trade = privateGetVerifyBlockTrade = Entry('verify_block_trade', 'private', 'GET', {'cost': 4})
    private_get_buy = privateGetBuy = Entry('buy', 'private', 'GET', {'cost': 4})
    private_get_sell = privateGetSell = Entry('sell', 'private', 'GET', {'cost': 4})
    private_get_edit = privateGetEdit = Entry('edit', 'private', 'GET', {'cost': 4})
    private_get_edit_by_label = privateGetEditByLabel = Entry('edit_by_label', 'private', 'GET', {'cost': 4})
    private_get_cancel = privateGetCancel = Entry('cancel', 'private', 'GET', {'cost': 4})
    private_get_cancel_all = privateGetCancelAll = Entry('cancel_all', 'private', 'GET', {'cost': 4})
    private_get_cancel_all_by_currency = privateGetCancelAllByCurrency = Entry('cancel_all_by_currency', 'private', 'GET', {'cost': 4})
    private_get_cancel_all_by_instrument = privateGetCancelAllByInstrument = Entry('cancel_all_by_instrument', 'private', 'GET', {'cost': 4})
    private_get_cancel_by_label = privateGetCancelByLabel = Entry('cancel_by_label', 'private', 'GET', {'cost': 4})
    private_get_close_position = privateGetClosePosition = Entry('close_position', 'private', 'GET', {'cost': 4})
    private_get_get_margins = privateGetGetMargins = Entry('get_margins', 'private', 'GET', {'cost': 1})
    private_get_get_mmp_config = privateGetGetMmpConfig = Entry('get_mmp_config', 'private', 'GET', {'cost': 1})
    private_get_get_open_orders_by_currency = privateGetGetOpenOrdersByCurrency = Entry('get_open_orders_by_currency', 'private', 'GET', {'cost': 1})
    private_get_get_open_orders_by_instrument = privateGetGetOpenOrdersByInstrument = Entry('get_open_orders_by_instrument', 'private', 'GET', {'cost': 1})
    private_get_get_order_history_by_currency = privateGetGetOrderHistoryByCurrency = Entry('get_order_history_by_currency', 'private', 'GET', {'cost': 1})
    private_get_get_order_history_by_instrument = privateGetGetOrderHistoryByInstrument = Entry('get_order_history_by_instrument', 'private', 'GET', {'cost': 1})
    private_get_get_order_margin_by_ids = privateGetGetOrderMarginByIds = Entry('get_order_margin_by_ids', 'private', 'GET', {'cost': 1})
    private_get_get_order_state = privateGetGetOrderState = Entry('get_order_state', 'private', 'GET', {'cost': 1})
    private_get_get_stop_order_history = privateGetGetStopOrderHistory = Entry('get_stop_order_history', 'private', 'GET', {'cost': 1})
    private_get_get_trigger_order_history = privateGetGetTriggerOrderHistory = Entry('get_trigger_order_history', 'private', 'GET', {'cost': 1})
    private_get_get_user_trades_by_currency = privateGetGetUserTradesByCurrency = Entry('get_user_trades_by_currency', 'private', 'GET', {'cost': 1})
    private_get_get_user_trades_by_currency_and_time = privateGetGetUserTradesByCurrencyAndTime = Entry('get_user_trades_by_currency_and_time', 'private', 'GET', {'cost': 1})
    private_get_get_user_trades_by_instrument = privateGetGetUserTradesByInstrument = Entry('get_user_trades_by_instrument', 'private', 'GET', {'cost': 1})
    private_get_get_user_trades_by_instrument_and_time = privateGetGetUserTradesByInstrumentAndTime = Entry('get_user_trades_by_instrument_and_time', 'private', 'GET', {'cost': 1})
    private_get_get_user_trades_by_order = privateGetGetUserTradesByOrder = Entry('get_user_trades_by_order', 'private', 'GET', {'cost': 1})
    private_get_reset_mmp = privateGetResetMmp = Entry('reset_mmp', 'private', 'GET', {'cost': 1})
    private_get_set_mmp_config = privateGetSetMmpConfig = Entry('set_mmp_config', 'private', 'GET', {'cost': 1})
    private_get_get_settlement_history_by_instrument = privateGetGetSettlementHistoryByInstrument = Entry('get_settlement_history_by_instrument', 'private', 'GET', {'cost': 1})
    private_get_get_settlement_history_by_currency = privateGetGetSettlementHistoryByCurrency = Entry('get_settlement_history_by_currency', 'private', 'GET', {'cost': 1})
    private_get_cancel_transfer_by_id = privateGetCancelTransferById = Entry('cancel_transfer_by_id', 'private', 'GET', {'cost': 1})
    private_get_cancel_withdrawal = privateGetCancelWithdrawal = Entry('cancel_withdrawal', 'private', 'GET', {'cost': 1})
    private_get_create_deposit_address = privateGetCreateDepositAddress = Entry('create_deposit_address', 'private', 'GET', {'cost': 1})
    private_get_get_current_deposit_address = privateGetGetCurrentDepositAddress = Entry('get_current_deposit_address', 'private', 'GET', {'cost': 1})
    private_get_get_deposits = privateGetGetDeposits = Entry('get_deposits', 'private', 'GET', {'cost': 1})
    private_get_get_transfers = privateGetGetTransfers = Entry('get_transfers', 'private', 'GET', {'cost': 1})
    private_get_get_withdrawals = privateGetGetWithdrawals = Entry('get_withdrawals', 'private', 'GET', {'cost': 1})
    private_get_submit_transfer_to_subaccount = privateGetSubmitTransferToSubaccount = Entry('submit_transfer_to_subaccount', 'private', 'GET', {'cost': 1})
    private_get_submit_transfer_to_user = privateGetSubmitTransferToUser = Entry('submit_transfer_to_user', 'private', 'GET', {'cost': 1})
    private_get_withdraw = privateGetWithdraw = Entry('withdraw', 'private', 'GET', {'cost': 1})