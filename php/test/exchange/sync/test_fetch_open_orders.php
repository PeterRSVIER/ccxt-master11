<?php
namespace ccxt;

// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -----------------------------------------------------------------------------
include_once PATH_TO_CCXT . '/test/exchange/base/test_order.php';

function test_fetch_open_orders($exchange, $skipped_properties, $symbol) {
    $method = 'fetchOpenOrders';
    $orders = $exchange->fetch_open_orders($symbol);
    assert_non_emtpy_array($exchange, $skipped_properties, $method, $orders, $symbol);
    $now = $exchange->milliseconds();
    for ($i = 0; $i < count($orders); $i++) {
        $order = $orders[$i];
        test_order($exchange, $skipped_properties, $method, $order, $symbol, $now);
        assert_in_array($exchange, $skipped_properties, $method, $order, 'status', ['open']);
    }
    assert_timestamp_order($exchange, $method, $symbol, $orders);
}