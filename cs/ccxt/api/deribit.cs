// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

namespace ccxt;

public partial class deribit : Exchange
{
    public deribit (object args = null): base(args) {}

    public async Task<object> publicGetAuth (object parameters = null)
    {
        return await this.callAsync ("publicGetAuth",parameters);
    }

    public async Task<object> publicGetExchangeToken (object parameters = null)
    {
        return await this.callAsync ("publicGetExchangeToken",parameters);
    }

    public async Task<object> publicGetForkToken (object parameters = null)
    {
        return await this.callAsync ("publicGetForkToken",parameters);
    }

    public async Task<object> publicGetSetHeartbeat (object parameters = null)
    {
        return await this.callAsync ("publicGetSetHeartbeat",parameters);
    }

    public async Task<object> publicGetDisableHeartbeat (object parameters = null)
    {
        return await this.callAsync ("publicGetDisableHeartbeat",parameters);
    }

    public async Task<object> publicGetGetTime (object parameters = null)
    {
        return await this.callAsync ("publicGetGetTime",parameters);
    }

    public async Task<object> publicGetHello (object parameters = null)
    {
        return await this.callAsync ("publicGetHello",parameters);
    }

    public async Task<object> publicGetStatus (object parameters = null)
    {
        return await this.callAsync ("publicGetStatus",parameters);
    }

    public async Task<object> publicGetTest (object parameters = null)
    {
        return await this.callAsync ("publicGetTest",parameters);
    }

    public async Task<object> publicGetSubscribe (object parameters = null)
    {
        return await this.callAsync ("publicGetSubscribe",parameters);
    }

    public async Task<object> publicGetUnsubscribe (object parameters = null)
    {
        return await this.callAsync ("publicGetUnsubscribe",parameters);
    }

    public async Task<object> publicGetUnsubscribeAll (object parameters = null)
    {
        return await this.callAsync ("publicGetUnsubscribeAll",parameters);
    }

    public async Task<object> publicGetGetAnnouncements (object parameters = null)
    {
        return await this.callAsync ("publicGetGetAnnouncements",parameters);
    }

    public async Task<object> publicGetGetBookSummaryByCurrency (object parameters = null)
    {
        return await this.callAsync ("publicGetGetBookSummaryByCurrency",parameters);
    }

    public async Task<object> publicGetGetBookSummaryByInstrument (object parameters = null)
    {
        return await this.callAsync ("publicGetGetBookSummaryByInstrument",parameters);
    }

    public async Task<object> publicGetGetContractSize (object parameters = null)
    {
        return await this.callAsync ("publicGetGetContractSize",parameters);
    }

    public async Task<object> publicGetGetCurrencies (object parameters = null)
    {
        return await this.callAsync ("publicGetGetCurrencies",parameters);
    }

    public async Task<object> publicGetGetDeliveryPrices (object parameters = null)
    {
        return await this.callAsync ("publicGetGetDeliveryPrices",parameters);
    }

    public async Task<object> publicGetGetFundingChartData (object parameters = null)
    {
        return await this.callAsync ("publicGetGetFundingChartData",parameters);
    }

    public async Task<object> publicGetGetFundingRateHistory (object parameters = null)
    {
        return await this.callAsync ("publicGetGetFundingRateHistory",parameters);
    }

    public async Task<object> publicGetGetFundingRateValue (object parameters = null)
    {
        return await this.callAsync ("publicGetGetFundingRateValue",parameters);
    }

    public async Task<object> publicGetGetHistoricalVolatility (object parameters = null)
    {
        return await this.callAsync ("publicGetGetHistoricalVolatility",parameters);
    }

    public async Task<object> publicGetGetIndex (object parameters = null)
    {
        return await this.callAsync ("publicGetGetIndex",parameters);
    }

    public async Task<object> publicGetGetIndexPrice (object parameters = null)
    {
        return await this.callAsync ("publicGetGetIndexPrice",parameters);
    }

    public async Task<object> publicGetGetIndexPriceNames (object parameters = null)
    {
        return await this.callAsync ("publicGetGetIndexPriceNames",parameters);
    }

    public async Task<object> publicGetGetInstrument (object parameters = null)
    {
        return await this.callAsync ("publicGetGetInstrument",parameters);
    }

    public async Task<object> publicGetGetInstruments (object parameters = null)
    {
        return await this.callAsync ("publicGetGetInstruments",parameters);
    }

    public async Task<object> publicGetGetLastSettlementsByCurrency (object parameters = null)
    {
        return await this.callAsync ("publicGetGetLastSettlementsByCurrency",parameters);
    }

    public async Task<object> publicGetGetLastSettlementsByInstrument (object parameters = null)
    {
        return await this.callAsync ("publicGetGetLastSettlementsByInstrument",parameters);
    }

    public async Task<object> publicGetGetLastTradesByCurrency (object parameters = null)
    {
        return await this.callAsync ("publicGetGetLastTradesByCurrency",parameters);
    }

    public async Task<object> publicGetGetLastTradesByCurrencyAndTime (object parameters = null)
    {
        return await this.callAsync ("publicGetGetLastTradesByCurrencyAndTime",parameters);
    }

    public async Task<object> publicGetGetLastTradesByInstrument (object parameters = null)
    {
        return await this.callAsync ("publicGetGetLastTradesByInstrument",parameters);
    }

    public async Task<object> publicGetGetLastTradesByInstrumentAndTime (object parameters = null)
    {
        return await this.callAsync ("publicGetGetLastTradesByInstrumentAndTime",parameters);
    }

    public async Task<object> publicGetGetMarkPriceHistory (object parameters = null)
    {
        return await this.callAsync ("publicGetGetMarkPriceHistory",parameters);
    }

    public async Task<object> publicGetGetOrderBook (object parameters = null)
    {
        return await this.callAsync ("publicGetGetOrderBook",parameters);
    }

    public async Task<object> publicGetGetTradeVolumes (object parameters = null)
    {
        return await this.callAsync ("publicGetGetTradeVolumes",parameters);
    }

    public async Task<object> publicGetGetTradingviewChartData (object parameters = null)
    {
        return await this.callAsync ("publicGetGetTradingviewChartData",parameters);
    }

    public async Task<object> publicGetGetVolatilityIndexData (object parameters = null)
    {
        return await this.callAsync ("publicGetGetVolatilityIndexData",parameters);
    }

    public async Task<object> publicGetTicker (object parameters = null)
    {
        return await this.callAsync ("publicGetTicker",parameters);
    }

    public async Task<object> privateGetLogout (object parameters = null)
    {
        return await this.callAsync ("privateGetLogout",parameters);
    }

    public async Task<object> privateGetEnableCancelOnDisconnect (object parameters = null)
    {
        return await this.callAsync ("privateGetEnableCancelOnDisconnect",parameters);
    }

    public async Task<object> privateGetDisableCancelOnDisconnect (object parameters = null)
    {
        return await this.callAsync ("privateGetDisableCancelOnDisconnect",parameters);
    }

    public async Task<object> privateGetGetCancelOnDisconnect (object parameters = null)
    {
        return await this.callAsync ("privateGetGetCancelOnDisconnect",parameters);
    }

    public async Task<object> privateGetSubscribe (object parameters = null)
    {
        return await this.callAsync ("privateGetSubscribe",parameters);
    }

    public async Task<object> privateGetUnsubscribe (object parameters = null)
    {
        return await this.callAsync ("privateGetUnsubscribe",parameters);
    }

    public async Task<object> privateGetUnsubscribeAll (object parameters = null)
    {
        return await this.callAsync ("privateGetUnsubscribeAll",parameters);
    }

    public async Task<object> privateGetChangeApiKeyName (object parameters = null)
    {
        return await this.callAsync ("privateGetChangeApiKeyName",parameters);
    }

    public async Task<object> privateGetChangeScopeInApiKey (object parameters = null)
    {
        return await this.callAsync ("privateGetChangeScopeInApiKey",parameters);
    }

    public async Task<object> privateGetChangeSubaccountName (object parameters = null)
    {
        return await this.callAsync ("privateGetChangeSubaccountName",parameters);
    }

    public async Task<object> privateGetCreateApiKey (object parameters = null)
    {
        return await this.callAsync ("privateGetCreateApiKey",parameters);
    }

    public async Task<object> privateGetCreateSubaccount (object parameters = null)
    {
        return await this.callAsync ("privateGetCreateSubaccount",parameters);
    }

    public async Task<object> privateGetDisableApiKey (object parameters = null)
    {
        return await this.callAsync ("privateGetDisableApiKey",parameters);
    }

    public async Task<object> privateGetDisableTfaForSubaccount (object parameters = null)
    {
        return await this.callAsync ("privateGetDisableTfaForSubaccount",parameters);
    }

    public async Task<object> privateGetEnableAffiliateProgram (object parameters = null)
    {
        return await this.callAsync ("privateGetEnableAffiliateProgram",parameters);
    }

    public async Task<object> privateGetEnableApiKey (object parameters = null)
    {
        return await this.callAsync ("privateGetEnableApiKey",parameters);
    }

    public async Task<object> privateGetGetAccessLog (object parameters = null)
    {
        return await this.callAsync ("privateGetGetAccessLog",parameters);
    }

    public async Task<object> privateGetGetAccountSummary (object parameters = null)
    {
        return await this.callAsync ("privateGetGetAccountSummary",parameters);
    }

    public async Task<object> privateGetGetAffiliateProgramInfo (object parameters = null)
    {
        return await this.callAsync ("privateGetGetAffiliateProgramInfo",parameters);
    }

    public async Task<object> privateGetGetEmailLanguage (object parameters = null)
    {
        return await this.callAsync ("privateGetGetEmailLanguage",parameters);
    }

    public async Task<object> privateGetGetNewAnnouncements (object parameters = null)
    {
        return await this.callAsync ("privateGetGetNewAnnouncements",parameters);
    }

    public async Task<object> privateGetGetPortfolioMargins (object parameters = null)
    {
        return await this.callAsync ("privateGetGetPortfolioMargins",parameters);
    }

    public async Task<object> privateGetGetPosition (object parameters = null)
    {
        return await this.callAsync ("privateGetGetPosition",parameters);
    }

    public async Task<object> privateGetGetPositions (object parameters = null)
    {
        return await this.callAsync ("privateGetGetPositions",parameters);
    }

    public async Task<object> privateGetGetSubaccounts (object parameters = null)
    {
        return await this.callAsync ("privateGetGetSubaccounts",parameters);
    }

    public async Task<object> privateGetGetSubaccountsDetails (object parameters = null)
    {
        return await this.callAsync ("privateGetGetSubaccountsDetails",parameters);
    }

    public async Task<object> privateGetGetTransactionLog (object parameters = null)
    {
        return await this.callAsync ("privateGetGetTransactionLog",parameters);
    }

    public async Task<object> privateGetListApiKeys (object parameters = null)
    {
        return await this.callAsync ("privateGetListApiKeys",parameters);
    }

    public async Task<object> privateGetRemoveApiKey (object parameters = null)
    {
        return await this.callAsync ("privateGetRemoveApiKey",parameters);
    }

    public async Task<object> privateGetRemoveSubaccount (object parameters = null)
    {
        return await this.callAsync ("privateGetRemoveSubaccount",parameters);
    }

    public async Task<object> privateGetResetApiKey (object parameters = null)
    {
        return await this.callAsync ("privateGetResetApiKey",parameters);
    }

    public async Task<object> privateGetSetAnnouncementAsRead (object parameters = null)
    {
        return await this.callAsync ("privateGetSetAnnouncementAsRead",parameters);
    }

    public async Task<object> privateGetSetApiKeyAsDefault (object parameters = null)
    {
        return await this.callAsync ("privateGetSetApiKeyAsDefault",parameters);
    }

    public async Task<object> privateGetSetEmailForSubaccount (object parameters = null)
    {
        return await this.callAsync ("privateGetSetEmailForSubaccount",parameters);
    }

    public async Task<object> privateGetSetEmailLanguage (object parameters = null)
    {
        return await this.callAsync ("privateGetSetEmailLanguage",parameters);
    }

    public async Task<object> privateGetSetPasswordForSubaccount (object parameters = null)
    {
        return await this.callAsync ("privateGetSetPasswordForSubaccount",parameters);
    }

    public async Task<object> privateGetToggleNotificationsFromSubaccount (object parameters = null)
    {
        return await this.callAsync ("privateGetToggleNotificationsFromSubaccount",parameters);
    }

    public async Task<object> privateGetToggleSubaccountLogin (object parameters = null)
    {
        return await this.callAsync ("privateGetToggleSubaccountLogin",parameters);
    }

    public async Task<object> privateGetExecuteBlockTrade (object parameters = null)
    {
        return await this.callAsync ("privateGetExecuteBlockTrade",parameters);
    }

    public async Task<object> privateGetGetBlockTrade (object parameters = null)
    {
        return await this.callAsync ("privateGetGetBlockTrade",parameters);
    }

    public async Task<object> privateGetGetLastBlockTradesByCurrency (object parameters = null)
    {
        return await this.callAsync ("privateGetGetLastBlockTradesByCurrency",parameters);
    }

    public async Task<object> privateGetInvalidateBlockTradeSignature (object parameters = null)
    {
        return await this.callAsync ("privateGetInvalidateBlockTradeSignature",parameters);
    }

    public async Task<object> privateGetVerifyBlockTrade (object parameters = null)
    {
        return await this.callAsync ("privateGetVerifyBlockTrade",parameters);
    }

    public async Task<object> privateGetBuy (object parameters = null)
    {
        return await this.callAsync ("privateGetBuy",parameters);
    }

    public async Task<object> privateGetSell (object parameters = null)
    {
        return await this.callAsync ("privateGetSell",parameters);
    }

    public async Task<object> privateGetEdit (object parameters = null)
    {
        return await this.callAsync ("privateGetEdit",parameters);
    }

    public async Task<object> privateGetEditByLabel (object parameters = null)
    {
        return await this.callAsync ("privateGetEditByLabel",parameters);
    }

    public async Task<object> privateGetCancel (object parameters = null)
    {
        return await this.callAsync ("privateGetCancel",parameters);
    }

    public async Task<object> privateGetCancelAll (object parameters = null)
    {
        return await this.callAsync ("privateGetCancelAll",parameters);
    }

    public async Task<object> privateGetCancelAllByCurrency (object parameters = null)
    {
        return await this.callAsync ("privateGetCancelAllByCurrency",parameters);
    }

    public async Task<object> privateGetCancelAllByInstrument (object parameters = null)
    {
        return await this.callAsync ("privateGetCancelAllByInstrument",parameters);
    }

    public async Task<object> privateGetCancelByLabel (object parameters = null)
    {
        return await this.callAsync ("privateGetCancelByLabel",parameters);
    }

    public async Task<object> privateGetClosePosition (object parameters = null)
    {
        return await this.callAsync ("privateGetClosePosition",parameters);
    }

    public async Task<object> privateGetGetMargins (object parameters = null)
    {
        return await this.callAsync ("privateGetGetMargins",parameters);
    }

    public async Task<object> privateGetGetMmpConfig (object parameters = null)
    {
        return await this.callAsync ("privateGetGetMmpConfig",parameters);
    }

    public async Task<object> privateGetGetOpenOrdersByCurrency (object parameters = null)
    {
        return await this.callAsync ("privateGetGetOpenOrdersByCurrency",parameters);
    }

    public async Task<object> privateGetGetOpenOrdersByInstrument (object parameters = null)
    {
        return await this.callAsync ("privateGetGetOpenOrdersByInstrument",parameters);
    }

    public async Task<object> privateGetGetOrderHistoryByCurrency (object parameters = null)
    {
        return await this.callAsync ("privateGetGetOrderHistoryByCurrency",parameters);
    }

    public async Task<object> privateGetGetOrderHistoryByInstrument (object parameters = null)
    {
        return await this.callAsync ("privateGetGetOrderHistoryByInstrument",parameters);
    }

    public async Task<object> privateGetGetOrderMarginByIds (object parameters = null)
    {
        return await this.callAsync ("privateGetGetOrderMarginByIds",parameters);
    }

    public async Task<object> privateGetGetOrderState (object parameters = null)
    {
        return await this.callAsync ("privateGetGetOrderState",parameters);
    }

    public async Task<object> privateGetGetStopOrderHistory (object parameters = null)
    {
        return await this.callAsync ("privateGetGetStopOrderHistory",parameters);
    }

    public async Task<object> privateGetGetTriggerOrderHistory (object parameters = null)
    {
        return await this.callAsync ("privateGetGetTriggerOrderHistory",parameters);
    }

    public async Task<object> privateGetGetUserTradesByCurrency (object parameters = null)
    {
        return await this.callAsync ("privateGetGetUserTradesByCurrency",parameters);
    }

    public async Task<object> privateGetGetUserTradesByCurrencyAndTime (object parameters = null)
    {
        return await this.callAsync ("privateGetGetUserTradesByCurrencyAndTime",parameters);
    }

    public async Task<object> privateGetGetUserTradesByInstrument (object parameters = null)
    {
        return await this.callAsync ("privateGetGetUserTradesByInstrument",parameters);
    }

    public async Task<object> privateGetGetUserTradesByInstrumentAndTime (object parameters = null)
    {
        return await this.callAsync ("privateGetGetUserTradesByInstrumentAndTime",parameters);
    }

    public async Task<object> privateGetGetUserTradesByOrder (object parameters = null)
    {
        return await this.callAsync ("privateGetGetUserTradesByOrder",parameters);
    }

    public async Task<object> privateGetResetMmp (object parameters = null)
    {
        return await this.callAsync ("privateGetResetMmp",parameters);
    }

    public async Task<object> privateGetSetMmpConfig (object parameters = null)
    {
        return await this.callAsync ("privateGetSetMmpConfig",parameters);
    }

    public async Task<object> privateGetGetSettlementHistoryByInstrument (object parameters = null)
    {
        return await this.callAsync ("privateGetGetSettlementHistoryByInstrument",parameters);
    }

    public async Task<object> privateGetGetSettlementHistoryByCurrency (object parameters = null)
    {
        return await this.callAsync ("privateGetGetSettlementHistoryByCurrency",parameters);
    }

    public async Task<object> privateGetCancelTransferById (object parameters = null)
    {
        return await this.callAsync ("privateGetCancelTransferById",parameters);
    }

    public async Task<object> privateGetCancelWithdrawal (object parameters = null)
    {
        return await this.callAsync ("privateGetCancelWithdrawal",parameters);
    }

    public async Task<object> privateGetCreateDepositAddress (object parameters = null)
    {
        return await this.callAsync ("privateGetCreateDepositAddress",parameters);
    }

    public async Task<object> privateGetGetCurrentDepositAddress (object parameters = null)
    {
        return await this.callAsync ("privateGetGetCurrentDepositAddress",parameters);
    }

    public async Task<object> privateGetGetDeposits (object parameters = null)
    {
        return await this.callAsync ("privateGetGetDeposits",parameters);
    }

    public async Task<object> privateGetGetTransfers (object parameters = null)
    {
        return await this.callAsync ("privateGetGetTransfers",parameters);
    }

    public async Task<object> privateGetGetWithdrawals (object parameters = null)
    {
        return await this.callAsync ("privateGetGetWithdrawals",parameters);
    }

    public async Task<object> privateGetSubmitTransferToSubaccount (object parameters = null)
    {
        return await this.callAsync ("privateGetSubmitTransferToSubaccount",parameters);
    }

    public async Task<object> privateGetSubmitTransferToUser (object parameters = null)
    {
        return await this.callAsync ("privateGetSubmitTransferToUser",parameters);
    }

    public async Task<object> privateGetWithdraw (object parameters = null)
    {
        return await this.callAsync ("privateGetWithdraw",parameters);
    }

}