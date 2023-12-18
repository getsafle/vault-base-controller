### 1.0.0 (2023-12-05)

##### Implemented Keyring Controller for Base Chain and Added support for Type-2 transactions

- Added method to generate keyring
- Added method to restore a keyring
- Added method to add a new account to the keyring object
- Added method to export the private key of an address
- Added method to sign a transaction
- Added method to sign a message
- Added method to sign Typed Data (EIP-712)
- Added importWallet() to import account using privateKey.
- Added sign() to sign a message or transaction and get signature along with v,r,s.
- Added getBalance() to fetch the balance in native currency.
- Added getFee() method for gas estimation for the Type-2 transactions.
- Added support for EIP 1559 Type-2 transactions.