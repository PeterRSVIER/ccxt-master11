<?php
namespace ccxt;

// ----------------------------------------------------------------------------

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

// -----------------------------------------------------------------------------
include_once PATH_TO_CCXT . '/test/exchange/base/test_shared_methods.php';

function test_open_interest($exchange, $skipped_properties, $method, $entry) {
    $format = array(
        'symbol' => 'BTC/USDT',
        'openInterestAmount' => $exchange->parse_number('3544581864.598'),
        'openInterestValue' => $exchange->parse_number('3544581864.598'),
        'timestamp' => 1649373600000,
        'datetime' => '2022-04-07T23:20:00.000Z',
        'info' => array(),
    );
    $empty_allowed_for = ['symbol', 'timestamp', 'openInterestAmount', 'openInterestValue', 'datetime'];
    assert_structure($exchange, $skipped_properties, $method, $entry, $format, $empty_allowed_for);
    assert_symbol($exchange, $skipped_properties, $method, $entry, 'symbol');
    assert_timestamp_and_datetime($exchange, $skipped_properties, $method, $entry);
    //
    assert_greater($exchange, $skipped_properties, $method, $entry, 'openInterestAmount', '0');
    assert_greater($exchange, $skipped_properties, $method, $entry, 'openInterestValue', '0');
}