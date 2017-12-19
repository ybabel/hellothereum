# hellothereum
Drupal 7 and ethereum Hello world

## Prerequisites
 * install parity https://github.com/paritytech/parity
 * launch parity with something like that : `parity ui --chain=dev --unsafe-expose --jsonrpc-apis=all`
 * enable hellothereum
 * create at least one ethereum account with some ethereum
 * deploy both contracts (/sol) get their addresses
    - EthereumUserRegisterDrupal.sol
    - MyAdvancedToken.sol
 * for the token contract run setPrices with 0.001 eth sell price, 0.001 eth buy price, and 1 conversion unit
 * use mintToken to generate some intials tokens 

## Install
 * install and enable `user_hash` drupal module
 * go to `/admin/people` and generate hash for at least your current account
 * enable `hellothereum`
 * go to `/admin/hellothereum` and copy contract adresses and ABI in the

## Usage
 * go to `/hellothereum/register`
 * enter the ethereum address of the user you want to bind to
 * click the registration link "To use Ethereum features with us, please sign our user registry."
 * go to parity UI (http://localhost:8180) and validate the transaction
 * you should be registered
 * go to `/hellothereum/buy` and you can either
   - leave the password field empty and validate the transaction in parity
   - ~~type your password and the transaction will be automatically validated via JSON-RPC~~
   - type your PRIVATE KEY and the transaction will be signed automatically
