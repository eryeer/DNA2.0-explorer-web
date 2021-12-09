import request from './request';

export function getTotalSummary() {
  return request({
    url: '/summary/getTotalSummary',
    method: 'get',
  });
}

export function getAddressSummary(params) {
  return request({
    url: '/summary/getAddressSummary',
    method: 'get',
    params,
  });
}

export function getBlockSummary(params) {
  return request({
    url: '/summary/getBlockSummary',
    method: 'get',
    params,
  });
}

export function getTransactionSummary(params) {
  return request({
    url: '/summary/getTransactionSummary',
    method: 'get',
    params,
  });
}
