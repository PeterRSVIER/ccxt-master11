<?php
namespace ccxt;

// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -----------------------------------------------------------------------------
include_once PATH_TO_CCXT . '/test/exchange/base/test_shared_methods.php';
include_once __DIR__ . '/test_trade.php';

function test_order($exchange, $skipped_properties, $method, $entry, $symbol, $now) {
    $format = array(
        'info' => array(),
        'id' => '123',
        'clientOrderId' => '1234',
        'timestamp' => 1649373600000,
        'datetime' => '2022-04-07T23:20:00.000Z',
        'lastTradeTimestamp' => 1649373610000,
        'symbol' => 'XYZ/USDT',
        'type' => 'limit',
        'timeInForce' => 'GTC',
        'postOnly' => true,
        'side' => 'sell',
        'price' => $exchange->parse_number('1.23456'),
        'stopPrice' => $exchange->parse_number('1.1111'),
        'amount' => $exchange->parse_number('1.23'),
        'cost' => $exchange->parse_number('2.34'),
        'average' => $exchange->parse_number('1.234'),
        'filled' => $exchange->parse_number('1.23'),
        'remaining' => $exchange->parse_number('0.123'),
        'status' => 'ok',
        'fee' => array(),
        'trades' => [],
    );
    $empty_allowed_for = ['clientOrderId', 'stopPrice', 'trades', 'timestamp', 'datetime', 'lastTradeTimestamp', 'average', 'type', 'timeInForce', 'postOnly', 'side', 'price', 'amount', 'cost', 'filled', 'remaining', 'status', 'fee']; // there are exchanges that return only order id, so we don't need to strictly requite all props to be set.
    assert_structure($exchange, $skipped_properties, $method, $entry, $format, $empty_allowed_for);
    assert_timestamp_and_datetime($exchange, $skipped_properties, $method, $entry, $now);
    //
    assert_in_array($exchange, $skipped_properties, $method, $entry, 'timeInForce', ['GTC', 'GTK', 'IOC', 'FOK', 'PO']);
    assert_in_array($exchange, $skipped_properties, $method, $entry, 'status', ['open', 'closed', 'canceled']);
    assert_in_array($exchange, $skipped_properties, $method, $entry, 'side', ['buy', 'sell']);
    assert_in_array($exchange, $skipped_properties, $method, $entry, 'postOnly', [true, false]);
    assert_symbol($exchange, $skipped_properties, $method, $entry, 'symbol', $symbol);
    assert_greater($exchange, $skipped_properties, $method, $entry, 'price', '0');
    assert_greater($exchange, $skipped_properties, $method, $entry, 'stopPrice', '0');
    assert_greater_or_equal($exchange, $skipped_properties, $method, $entry, 'cost', '0');
    assert_greater($exchange, $skipped_properties, $method, $entry, 'average', '0');
    assert_greater_or_equal($exchange, $skipped_properties, $method, $entry, 'filled', '0');
    assert_greater_or_equal($exchange, $skipped_properties, $method, $entry, 'remaining', '0');
    assert_greater_or_equal($exchange, $skipped_properties, $method, $entry, 'amount', '0');
    assert_greater_or_equal($exchange, $skipped_properties, $method, $entry, 'amount', $exchange->safe_string($entry, 'remaining'));
    assert_greater_or_equal($exchange, $skipped_properties, $method, $entry, 'amount', $exchange->safe_string($entry, 'filled'));
    if (!(is_array($skipped_properties) && array_key_exists('trades', $skipped_properties))) {
        if ($entry['trades'] !== null) {
            for ($i = 0; $i < count($entry['trades']); $i++) {
                test_trade($exchange, $skipped_properties, $method, $entry['trades'][$i], $symbol, $now);
            }
        }
    }
    assert_fee_structure($exchange, $skipped_properties, $method, $entry, 'fee');
}