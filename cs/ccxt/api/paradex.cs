// -------------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -------------------------------------------------------------------------------

namespace ccxt;

public partial class paradex : Exchange
{
    public paradex (object args = null): base(args) {}

    public async Task<object> publicGetBboMarket (object parameters = null)
    {
        return await this.callAsync ("publicGetBboMarket",parameters);
    }

    public async Task<object> publicGetFundingData (object parameters = null)
    {
        return await this.callAsync ("publicGetFundingData",parameters);
    }

    public async Task<object> publicGetMarkets (object parameters = null)
    {
        return await this.callAsync ("publicGetMarkets",parameters);
    }

    public async Task<object> publicGetMarketsKlines (object parameters = null)
    {
        return await this.callAsync ("publicGetMarketsKlines",parameters);
    }

    public async Task<object> publicGetMarketsSummary (object parameters = null)
    {
        return await this.callAsync ("publicGetMarketsSummary",parameters);
    }

    public async Task<object> publicGetOrderbookMarket (object parameters = null)
    {
        return await this.callAsync ("publicGetOrderbookMarket",parameters);
    }

    public async Task<object> publicGetInsurance (object parameters = null)
    {
        return await this.callAsync ("publicGetInsurance",parameters);
    }

    public async Task<object> publicGetReferralsConfig (object parameters = null)
    {
        return await this.callAsync ("publicGetReferralsConfig",parameters);
    }

    public async Task<object> publicGetSystemConfig (object parameters = null)
    {
        return await this.callAsync ("publicGetSystemConfig",parameters);
    }

    public async Task<object> publicGetSystemState (object parameters = null)
    {
        return await this.callAsync ("publicGetSystemState",parameters);
    }

    public async Task<object> publicGetSystemTime (object parameters = null)
    {
        return await this.callAsync ("publicGetSystemTime",parameters);
    }

    public async Task<object> publicGetTrades (object parameters = null)
    {
        return await this.callAsync ("publicGetTrades",parameters);
    }

    public async Task<object> privateGetAccount (object parameters = null)
    {
        return await this.callAsync ("privateGetAccount",parameters);
    }

    public async Task<object> privateGetAccountProfile (object parameters = null)
    {
        return await this.callAsync ("privateGetAccountProfile",parameters);
    }

    public async Task<object> privateGetBalance (object parameters = null)
    {
        return await this.callAsync ("privateGetBalance",parameters);
    }

    public async Task<object> privateGetFills (object parameters = null)
    {
        return await this.callAsync ("privateGetFills",parameters);
    }

    public async Task<object> privateGetFundingPayments (object parameters = null)
    {
        return await this.callAsync ("privateGetFundingPayments",parameters);
    }

    public async Task<object> privateGetPositions (object parameters = null)
    {
        return await this.callAsync ("privateGetPositions",parameters);
    }

    public async Task<object> privateGetTradebusts (object parameters = null)
    {
        return await this.callAsync ("privateGetTradebusts",parameters);
    }

    public async Task<object> privateGetTransactions (object parameters = null)
    {
        return await this.callAsync ("privateGetTransactions",parameters);
    }

    public async Task<object> privateGetLiquidations (object parameters = null)
    {
        return await this.callAsync ("privateGetLiquidations",parameters);
    }

    public async Task<object> privateGetOrders (object parameters = null)
    {
        return await this.callAsync ("privateGetOrders",parameters);
    }

    public async Task<object> privateGetOrdersHistory (object parameters = null)
    {
        return await this.callAsync ("privateGetOrdersHistory",parameters);
    }

    public async Task<object> privateGetOrdersByClientIdClientId (object parameters = null)
    {
        return await this.callAsync ("privateGetOrdersByClientIdClientId",parameters);
    }

    public async Task<object> privateGetOrdersOrderId (object parameters = null)
    {
        return await this.callAsync ("privateGetOrdersOrderId",parameters);
    }

    public async Task<object> privateGetPointsDataMarketProgram (object parameters = null)
    {
        return await this.callAsync ("privateGetPointsDataMarketProgram",parameters);
    }

    public async Task<object> privateGetReferralsSummary (object parameters = null)
    {
        return await this.callAsync ("privateGetReferralsSummary",parameters);
    }

    public async Task<object> privateGetTransfers (object parameters = null)
    {
        return await this.callAsync ("privateGetTransfers",parameters);
    }

    public async Task<object> privatePostAccountProfileReferralCode (object parameters = null)
    {
        return await this.callAsync ("privatePostAccountProfileReferralCode",parameters);
    }

    public async Task<object> privatePostAccountProfileUsername (object parameters = null)
    {
        return await this.callAsync ("privatePostAccountProfileUsername",parameters);
    }

    public async Task<object> privatePostAuth (object parameters = null)
    {
        return await this.callAsync ("privatePostAuth",parameters);
    }

    public async Task<object> privatePostOnboarding (object parameters = null)
    {
        return await this.callAsync ("privatePostOnboarding",parameters);
    }

    public async Task<object> privatePostOrders (object parameters = null)
    {
        return await this.callAsync ("privatePostOrders",parameters);
    }

    public async Task<object> privateDeleteOrders (object parameters = null)
    {
        return await this.callAsync ("privateDeleteOrders",parameters);
    }

    public async Task<object> privateDeleteOrdersByClientIdClientId (object parameters = null)
    {
        return await this.callAsync ("privateDeleteOrdersByClientIdClientId",parameters);
    }

    public async Task<object> privateDeleteOrdersOrderId (object parameters = null)
    {
        return await this.callAsync ("privateDeleteOrdersOrderId",parameters);
    }

}