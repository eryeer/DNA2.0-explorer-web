import request from './request';

export function getTotalSummary() {
  return request({
    url: '/explorer/summary/getTotalSummary',
    method: 'get',
  });
}

export function getAddressSummary(params) {
  return request({
    url: '/explorer/summary/getAddressSummary',
    method: 'get',
    params,
  });
}

export function getBlockSummary(params) {
  return request({
    url: '/explorer/summary/getBlockSummary',
    method: 'get',
    params,
  });
}

export function getTransactionSummary(params) {
  return request({
    url: '/explorer/summary/getTransactionSummary',
    method: 'get',
    params,
  });
}
