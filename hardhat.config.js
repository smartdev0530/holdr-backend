require('@nomicfoundation/hardhat-toolbox');

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

/** @type import('hardhat/config').HardhatUserConfig */
const defaultPrivateKey = process.env.DEPLOYER_PRIVATE_KEY ?? '';

const defaultMnemonicWallet =
  'boost puppy expect economy clock minimum wash couple verb door rude glimpse';

module.exports = {
  networks: {
    hardhat: {
      accounts: { mnemonic: defaultMnemonicWallet },
      chainId: 5353,
      allowUnlimitedContractSize: true,
    },
    localhost: {
      url: 'http://127.0.0.1:8545',
      accounts: { mnemonic: defaultMnemonicWallet },
      chainId: 5353,
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      accounts: [defaultPrivateKey],
      chainId: 11155111,
      gas: 'auto',
      // gasPrice: 50000000000, // 30 [GWei]
      gasPrice: 'auto', // auto
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: {
      sepolia: process.env.ETHERSCAN_API_KEY ?? '',
    },
  },
  solidity: '0.8.24',
};
