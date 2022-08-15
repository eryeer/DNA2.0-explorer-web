import { ethers } from 'ethers';

const { utils, Contract } = ethers;

const IN_PRODUCTIOIN = process.env.NODE_ENV === 'production';
const WEB3_ENDPOINT = IN_PRODUCTIOIN ? 'https://node.lingjing-eco.com.cn' : 'https://test-node.lingjing-eco.com.cn';
const provider = new ethers.providers.JsonRpcProvider(WEB3_ENDPOINT);

export const getBalance = async function (address) {
  try {
    utils.getAddress(address);
  } catch (error) {
    return '0';
  }
  const balance = await provider.getBalance(address);
  return utils.formatEther(balance);
};

export const getContract = function ({ address, abi }) {
  return new Contract(address, abi, provider);
};

export const getInterface = function (abi) {
  // console.log("new utils.Interface(abi):", new utils.Interface(abi))
  return new utils.Interface(abi);
};

export const getNetworkParams = function () {
  return !IN_PRODUCTIOIN
    ? {
        chainId: '0x440',
        chainName: 'Lingjing Testnet Network',
        nativeCurrency: {
          name: 'eth',
          symbol: 'eth',
          decimals: 18,
        },
        rpcUrls: ['https://test-node.lingjing-eco.com.cn/'],
        blockExplorerUrls: ['https://test-explorer.lingjing-eco.com.cn/'],
      }
    : {
        chainId: '0x828',
        chainName: 'Lingjing Network',
        nativeCurrency: {
          name: 'eth',
          symbol: 'eth',
          decimals: 18,
        },
        rpcUrls: ['https://node.lingjing-eco.com.cn/'],
        blockExplorerUrls: ['https://explorer.lingjing-eco.com.cn/'],
      };
};

export const switchNetwork = async function () {
  return window.ethereum.request({
    method: 'wallet_addEthereumChain',
    params: [getNetworkParams()],
  });
};

export const hashTypedData =  function (...args) {
  return utils._TypedDataEncoder.hash(...args)
};
