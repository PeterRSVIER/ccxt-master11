<?php

namespace ccxt;

// PLEASE DO NOT EDIT THIS FILE, IT IS GENERATED AND WILL BE OVERWRITTEN:
// https://github.com/ccxt/ccxt/blob/master/CONTRIBUTING.md#how-to-contribute-code

use Exception; // a common import
use ccxt\abstract\bequant as hitbtc;

class bequant extends hitbtc {

    public function describe() {
        return $this->deep_extend(parent::describe(), array(
            'id' => 'bequant',
            'name' => 'Bequant',
            'countries' => array( 'MT' ), // Malta
            'pro' => true,
            'urls' => array(
                'logo' => 'https://github.com/user-attachments/assets/0583ef1f-29fe-4b7c-8189-63565a0e2867',
                'api' => array(
                    'public' => 'https://api.bequant.io/api/3',
                    'private' => 'https://api.bequant.io/api/3',
                ),
                'www' => 'https://bequant.io',
                'doc' => array(
                    'https://api.bequant.io/',
                ),
                'fees' => array(
                    'https://bequant.io/fees-and-limits',
                ),
                'referral' => 'https://bequant.io/referral/dd104e3bee7634ec',
            ),
        ));
    }
}