import request from '@/api/request';

export function getBlockList(params) {
  return request({
    url: '/block/getBlockList',
    method: 'get',
    params,
  });
}

export function getBlock(params) {
  return request({
    url: '/block/getBlock',
    method: 'get',
    params,
  });
}

export function getTransactionList(params) {
  return request({
    url: '/transaction/getTransactionList',
    method: 'get',
    params,
  });
}

export function getTransaction(params) {
  return request({
    url: '/transaction/getTransaction',
    method: 'get',
    params,
  });
}

export function getAddressList(params) {
  return request({
    url: '/address/getAddressList',
    method: 'get',
    params,
  });
}

export function getAddress(params) {
  return request({
    url: '/address/getAddress',
    method: 'get',
    params,
  });
}

export function getTransactionListByAddress(params) {
  return request({
    url: '/address/getTransactionListByAddress',
    method: 'get',
    params,
  });
}


// ERC721
export function getTransferListByAddress(params) {
  return request({
    url: '/address/getTransferListByAddress',
    method: 'get',
    params,
  });
}


export function uploadAbi(data) {
  return request({
    url: '/contract/uploadAbi',
    method: 'post',
    data,
  });
}

