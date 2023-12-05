# Vault-base-controller <code><a href="https://www.docker.com/" target="_blank"><img height="50" src="https://docs.base.org/img/logo_dark.svg"></a></code>

[![npm version](https://badge.fury.io/js/@getsafle%2Fvault-base-controller.svg)](https://badge.fury.io/js/@getsafle%2Fvault-base-controller)    <img alt="Static Badge" src="https://img.shields.io/badge/License-MIT-green">   [![Discussions][discussions-badge]][discussions-link]
 <img alt="Static Badge" src="https://img.shields.io/badge/Base_controller-documentation-purple">   

A Module written in javascript for managing various keyrings of Base accounts, encrypting them, and using them.

- [Installation](#installation)
- [Initialize the Base Controller class](#initialize-the-base-controller-class)
- [Methods](#methods)
  - [Generate Keyring with 1 account and encrypt](#generate-keyring-with-1-account-and-encrypt)
  - [Restore a keyring with the first account using a mnemonic](#restore-a-keyring-with-the-first-account-using-a-mnemonic)
  - [Add a new account to the keyring object](#add-a-new-account-to-the-keyring-object)
  - [Export the private key of an address present in the keyring](#export-the-private-key-of-an-address-present-in-the-keyring)
  - [Sign a transaction](#sign-a-transaction)
  - [Sign a message](#sign-a-message)
  - [Get balance](#get-balance)

## Installation
```
npm install --save @getsafle/vault-base-controller
```
## Initialize the Base Controller class

```
const { KeyringController, getBalance } = require('@getsafle/vault-base-controller');

const baseController = new KeyringController({
  encryptor: {
    // An optional object for defining encryption schemes:
    // Defaults to Browser-native SubtleCrypto.
    encrypt(password, object) {
      return new Promise('encrypted!');
    },
    decrypt(password, encryptedString) {
      return new Promise({ foo: 'bar' });
    },
  },
});
```

## Methods

### Generate Keyring with 1 account and encrypt

```
const keyringState = await baseController.createNewVaultAndKeychain(password);
```

### Restore a keyring with the first account using a mnemonic

```
const keyringState = await baseController.createNewVaultAndRestore(password, mnemonic);
```

### Add a new account to the keyring object

```
const keyringState = await baseController.addNewAccount(keyringObject);
```

### Export the private key of an address present in the keyring

```
const privateKey = await baseController.exportAccount(address);
```

### Sign a transaction

```
const signedTx = await baseController.signTransaction(baseTx, privateKey);
```

### Sign a message

```
const signedMsg = await baseController.signMessage(msgParams);
```

### Sign a message

```
const signedObj = await baseController.sign(msgParams, pvtKey, web3Obj);
```

### Sign Typed Data (EIP-712)

```
const signedData = await baseController.signTypedMessage(msgParams);
```

### Get balance

```
const balance = await getBalance(address, web3);
```
[discussions-badge]: https://github.com/getsafle/vault-base-controller
[discussions-link]: https://github.com/getsafle/vault-base-controller/actions
