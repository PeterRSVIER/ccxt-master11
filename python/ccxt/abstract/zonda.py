from ccxt.base.types import Entry


class ImplicitAPI:
    public_get_id_all = publicGetIdAll = Entry('{id}/all', 'public', 'GET', {})
    public_get_id_market = publicGetIdMarket = Entry('{id}/market', 'public', 'GET', {})
    public_get_id_orderbook = publicGetIdOrderbook = Entry('{id}/orderbook', 'public', 'GET', {})
    public_get_id_ticker = publicGetIdTicker = Entry('{id}/ticker', 'public', 'GET', {})
    public_get_id_trades = publicGetIdTrades = Entry('{id}/trades', 'public', 'GET', {})
    private_post_info = privatePostInfo = Entry('info', 'private', 'POST', {})
    private_post_trade = privatePostTrade = Entry('trade', 'private', 'POST', {})
    private_post_cancel = privatePostCancel = Entry('cancel', 'private', 'POST', {})
    private_post_orderbook = privatePostOrderbook = Entry('orderbook', 'private', 'POST', {})
    private_post_orders = privatePostOrders = Entry('orders', 'private', 'POST', {})
    private_post_transfer = privatePostTransfer = Entry('transfer', 'private', 'POST', {})
    private_post_withdraw = privatePostWithdraw = Entry('withdraw', 'private', 'POST', {})
    private_post_history = privatePostHistory = Entry('history', 'private', 'POST', {})
    private_post_transactions = privatePostTransactions = Entry('transactions', 'private', 'POST', {})
    v1_01public_get_trading_ticker = v1_01PublicGetTradingTicker = Entry('trading/ticker', 'v1_01Public', 'GET', {})
    v1_01public_get_trading_ticker_symbol = v1_01PublicGetTradingTickerSymbol = Entry('trading/ticker/{symbol}', 'v1_01Public', 'GET', {})
    v1_01public_get_trading_stats = v1_01PublicGetTradingStats = Entry('trading/stats', 'v1_01Public', 'GET', {})
    v1_01public_get_trading_stats_symbol = v1_01PublicGetTradingStatsSymbol = Entry('trading/stats/{symbol}', 'v1_01Public', 'GET', {})
    v1_01public_get_trading_orderbook_symbol = v1_01PublicGetTradingOrderbookSymbol = Entry('trading/orderbook/{symbol}', 'v1_01Public', 'GET', {})
    v1_01public_get_trading_transactions_symbol = v1_01PublicGetTradingTransactionsSymbol = Entry('trading/transactions/{symbol}', 'v1_01Public', 'GET', {})
    v1_01public_get_trading_candle_history_symbol_resolution = v1_01PublicGetTradingCandleHistorySymbolResolution = Entry('trading/candle/history/{symbol}/{resolution}', 'v1_01Public', 'GET', {})
    v1_01private_get_api_payments_deposits_crypto_addresses = v1_01PrivateGetApiPaymentsDepositsCryptoAddresses = Entry('api_payments/deposits/crypto/addresses', 'v1_01Private', 'GET', {})
    v1_01private_get_payments_withdrawal_detailid = v1_01PrivateGetPaymentsWithdrawalDetailId = Entry('payments/withdrawal/{detailId}', 'v1_01Private', 'GET', {})
    v1_01private_get_payments_deposit_detailid = v1_01PrivateGetPaymentsDepositDetailId = Entry('payments/deposit/{detailId}', 'v1_01Private', 'GET', {})
    v1_01private_get_trading_offer = v1_01PrivateGetTradingOffer = Entry('trading/offer', 'v1_01Private', 'GET', {})
    v1_01private_get_trading_stop_offer = v1_01PrivateGetTradingStopOffer = Entry('trading/stop/offer', 'v1_01Private', 'GET', {})
    v1_01private_get_trading_config_symbol = v1_01PrivateGetTradingConfigSymbol = Entry('trading/config/{symbol}', 'v1_01Private', 'GET', {})
    v1_01private_get_trading_history_transactions = v1_01PrivateGetTradingHistoryTransactions = Entry('trading/history/transactions', 'v1_01Private', 'GET', {})
    v1_01private_get_balances_bitbay_history = v1_01PrivateGetBalancesBITBAYHistory = Entry('balances/BITBAY/history', 'v1_01Private', 'GET', {})
    v1_01private_get_balances_bitbay_balance = v1_01PrivateGetBalancesBITBAYBalance = Entry('balances/BITBAY/balance', 'v1_01Private', 'GET', {})
    v1_01private_get_fiat_cantor_rate_baseid_quoteid = v1_01PrivateGetFiatCantorRateBaseIdQuoteId = Entry('fiat_cantor/rate/{baseId}/{quoteId}', 'v1_01Private', 'GET', {})
    v1_01private_get_fiat_cantor_history = v1_01PrivateGetFiatCantorHistory = Entry('fiat_cantor/history', 'v1_01Private', 'GET', {})
    v1_01private_get_client_payments_v2_customer_crypto_currency_channels_deposit = v1_01PrivateGetClientPaymentsV2CustomerCryptoCurrencyChannelsDeposit = Entry('client_payments/v2/customer/crypto/{currency}/channels/deposit', 'v1_01Private', 'GET', {})
    v1_01private_get_client_payments_v2_customer_crypto_currency_channels_withdrawal = v1_01PrivateGetClientPaymentsV2CustomerCryptoCurrencyChannelsWithdrawal = Entry('client_payments/v2/customer/crypto/{currency}/channels/withdrawal', 'v1_01Private', 'GET', {})
    v1_01private_get_client_payments_v2_customer_crypto_deposit_fee = v1_01PrivateGetClientPaymentsV2CustomerCryptoDepositFee = Entry('client_payments/v2/customer/crypto/deposit/fee', 'v1_01Private', 'GET', {})
    v1_01private_get_client_payments_v2_customer_crypto_withdrawal_fee = v1_01PrivateGetClientPaymentsV2CustomerCryptoWithdrawalFee = Entry('client_payments/v2/customer/crypto/withdrawal/fee', 'v1_01Private', 'GET', {})
    v1_01private_post_trading_offer_symbol = v1_01PrivatePostTradingOfferSymbol = Entry('trading/offer/{symbol}', 'v1_01Private', 'POST', {})
    v1_01private_post_trading_stop_offer_symbol = v1_01PrivatePostTradingStopOfferSymbol = Entry('trading/stop/offer/{symbol}', 'v1_01Private', 'POST', {})
    v1_01private_post_trading_config_symbol = v1_01PrivatePostTradingConfigSymbol = Entry('trading/config/{symbol}', 'v1_01Private', 'POST', {})
    v1_01private_post_balances_bitbay_balance = v1_01PrivatePostBalancesBITBAYBalance = Entry('balances/BITBAY/balance', 'v1_01Private', 'POST', {})
    v1_01private_post_balances_bitbay_balance_transfer_source_destination = v1_01PrivatePostBalancesBITBAYBalanceTransferSourceDestination = Entry('balances/BITBAY/balance/transfer/{source}/{destination}', 'v1_01Private', 'POST', {})
    v1_01private_post_fiat_cantor_exchange = v1_01PrivatePostFiatCantorExchange = Entry('fiat_cantor/exchange', 'v1_01Private', 'POST', {})
    v1_01private_post_api_payments_withdrawals_crypto = v1_01PrivatePostApiPaymentsWithdrawalsCrypto = Entry('api_payments/withdrawals/crypto', 'v1_01Private', 'POST', {})
    v1_01private_post_api_payments_withdrawals_fiat = v1_01PrivatePostApiPaymentsWithdrawalsFiat = Entry('api_payments/withdrawals/fiat', 'v1_01Private', 'POST', {})
    v1_01private_post_client_payments_v2_customer_crypto_deposit = v1_01PrivatePostClientPaymentsV2CustomerCryptoDeposit = Entry('client_payments/v2/customer/crypto/deposit', 'v1_01Private', 'POST', {})
    v1_01private_post_client_payments_v2_customer_crypto_withdrawal = v1_01PrivatePostClientPaymentsV2CustomerCryptoWithdrawal = Entry('client_payments/v2/customer/crypto/withdrawal', 'v1_01Private', 'POST', {})
    v1_01private_delete_trading_offer_symbol_id_side_price = v1_01PrivateDeleteTradingOfferSymbolIdSidePrice = Entry('trading/offer/{symbol}/{id}/{side}/{price}', 'v1_01Private', 'DELETE', {})
    v1_01private_delete_trading_stop_offer_symbol_id_side_price = v1_01PrivateDeleteTradingStopOfferSymbolIdSidePrice = Entry('trading/stop/offer/{symbol}/{id}/{side}/{price}', 'v1_01Private', 'DELETE', {})
    v1_01private_put_balances_bitbay_balance_id = v1_01PrivatePutBalancesBITBAYBalanceId = Entry('balances/BITBAY/balance/{id}', 'v1_01Private', 'PUT', {})