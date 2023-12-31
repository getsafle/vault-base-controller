var assert = require('assert');
const Web3 = require('web3')
const CryptoJS = require('crypto-js');
const { KeyringController: BaseKeyring, getBalance} = require('../src/index')

const {
    HD_WALLET_12_MNEMONIC,
    HD_WALLET_12_MNEMONIC_TEST_OTHER,
    TESTING_MESSAGE_1,
    TESTING_MESSAGE_2,
    TESTING_MESSAGE_3,
    EXTERNAL_ACCOUNT_PRIVATE_KEY,
    EXTERNAL_ACCOUNT_ADDRESS,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_1,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_2,
    EXTERNAL_ACCOUNT_WRONG_PRIVATE_KEY_3,
   BASE_NETWORK: {
        TESTNET,
        MAINNET
    },
    TRANSFER_BASE: {
       BASE_AMOUNT,
       BASE_RECEIVER
    },
    CONTRACT_TXN: {
       BASE_CONTRACT,
       BASE_AMOUNT_TO_CONTRACT
    },
} = require('./constants');

const CONTRACT_MINT_PARAM = {
    from:BASE_CONTRACT,
    to: '', // this will be the current account 
    amount: 1,
    nonce: 0,
    signature: [72, 0, 101, 0, 108, 0, 108, 0, 111, 0, 220, 122]
}

const opts = {
    encryptor: {
        encrypt(pass, object) {
            const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(object), pass).toString();

            return ciphertext;
        },
        decrypt(pass, encryptedString) {
            const bytes = CryptoJS.AES.decrypt(encryptedString, pass);
            const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));

            return decryptedData;
        },
    },
}

const opts_empty = {}

const PASSWORD = "random_password"

/**
 * Transaction object type
 * {    from: from address,
        to: to address,
        value: amount (in wei),
        data: hex string}
 */

describe('Initialize wallet ', () => {
    const baseKeyring = new BaseKeyring(opts)

    it("Create new vault and keychain", async () => {
        const res = await baseKeyring.createNewVaultAndKeychain(PASSWORD)
        console.log("res ", res)
    })

    it("Create new vault and restore", async () => {
        const res = await baseKeyring.createNewVaultAndRestore(PASSWORD, HD_WALLET_12_MNEMONIC)
        assert(baseKeyring.keyrings[0].mnemonic === HD_WALLET_12_MNEMONIC, "Wrong mnemonic")
    })

    it("Export account (privateKey)", async () => {
        const res = await baseKeyring.getAccounts()
        let account = res[0]
        const accRes = await baseKeyring.exportAccount(account)
        console.log("accRes ", accRes, Buffer.from(accRes, 'hex'))
    })

    it("Get accounts", async () => {
        const acc = await baseKeyring.getAccounts()
        console.log("acc ", acc)
    })

    it("Should import correct account ", async () => {
        const address = await baseKeyring.importWallet(EXTERNAL_ACCOUNT_PRIVATE_KEY)
        console.log("address : ",address);
        assert(address.toLowerCase() === EXTERNAL_ACCOUNT_ADDRESS.toLowerCase(), "Wrong address")
        assert(baseKeyring.importedWallets.length === 1, "Should have 1 imported wallet")
    })

    it("Get address balance", async () => {
        const accounts = await baseKeyring.getAccounts()
        const web3 = new Web3(TESTNET.URL);
        const balance = await getBalance(accounts[0], web3)
        console.log(" get balance ", balance, accounts)
    })
    it("Get Estimated fees for rawTransaction", async () => {
        const accounts = await baseKeyring.getAccounts()
        const web3 = new Web3(TESTNET.URL);
        const baseTx = {
            from: accounts[0],
            to:'0x641BB2596D8c0b32471260712566BF933a2f1a8e',
            value:0,
            data:'0x'
        }
        const fees = await baseKeyring.getFees(baseTx, web3)
        console.log(" fees for the transaction ", fees)

    })
    it("sign Transaction ", async () => {

        const accounts = await baseKeyring.getAccounts()
        const from = accounts[0]
        const web3 = new Web3(TESTNET.URL);

        const count = await web3.eth.getTransactionCount(from);

        const defaultNonce = await web3.utils.toHex(count);
        const to = '0x641BB2596D8c0b32471260712566BF933a2f1a8e' 

        const getFeeEstimate= await baseKeyring.getFees({from,to,
            value: web3.utils.numberToHex(web3.utils.toWei('0.00001', 'ether')),data:"0x00"},web3);
            console.log(getFeeEstimate);

            

        const rawTx = {
            to,
            from,
            value: web3.utils.numberToHex(web3.utils.toWei('0.00001', 'ether')),
            gasLimit: getFeeEstimate.gasLimit,
            maxPriorityFeePerGas: getFeeEstimate.fees.slow.maxPriorityFeePerGas,
            maxFeePerGas: getFeeEstimate.fees.slow.maxFeePerGas,
            nonce: defaultNonce,
            data: '0x',
            type: 2,
            chainId: TESTNET.CHAIN_ID,
        };

        const privateKey = await baseKeyring.exportAccount(accounts[0])
        const signedTX = await baseKeyring.signTransaction(rawTx, privateKey)
        console.log("signedTX ", signedTX)

    })
})
