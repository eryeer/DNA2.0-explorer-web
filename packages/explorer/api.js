import request from '@/api/request';

export function getBlockList(params) {
  return request({
    url: `${process.env.VUE_APP_EXPLORER_API}/block/getBlockList`,
    method: 'get',
    params
  });
}

export function getBlock(params) {
  return request({
    url: `${process.env.VUE_APP_EXPLORER_API}/block/getBlock`,
    method: 'get',
    params
  });
}

export function getTransactionList(params) {
  return request({
    url: `${process.env.VUE_APP_EXPLORER_API}/transaction/getTransactionList`,
    method: 'get',
    params
  });
}


export function getTransaction(params) {
  return request({
    url: `${process.env.VUE_APP_EXPLORER_API}/transaction/getTransaction`,
    method: 'get',
    params
  });
}

export function getAddressList(params) {
  return request({
    url: `${process.env.VUE_APP_EXPLORER_API}/address/getAddressList`,
    method: 'get',
    params
  });
}

export function getAddress(params) {
  return request({
    url: `${process.env.VUE_APP_EXPLORER_API}/address/getAddress`,
    method: 'get',
    params
  });
}


export function getTransactionListByAddress(params) {
  return request({
    url: `${process.env.VUE_APP_EXPLORER_API}/address/getTransactionListByAddress`,
    method: 'get',
    params
  });
}

