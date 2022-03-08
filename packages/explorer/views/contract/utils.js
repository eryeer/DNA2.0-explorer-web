import {
    ethers
} from 'ethers';

import abi from  "./mock"
const {
    utils,
    Contract
} = ethers
export const WEB3_ENDPOINT = process.env.VUE_APP_WEB3_ENDPOINT;
const provider = new ethers.providers.JsonRpcProvider('https://mainnet.infura.io/v3/793eb9a906a34a85801ce0be0db6362b');


export const getBalance = async function(address) {
    try {
        utils.getAddress(address)
    } catch (error) {
        return '0'
    }
    const balance = await provider.getBalance(address);
    return utils.formatEther(balance);
};


export const getContract =  function(address) {
    address = '0xb6916bc20cae34de64af39b8534d1459d8bb4128'
    return new Contract(address, abi, provider);
};

export const getInterface = function() {
    return new utils.Interface(abi);
};


