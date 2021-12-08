import request from './request';

export function sendLoginCode(params) {
  return request({
    url: '/baas/common/sendLoginCode',
    method: 'post',
    params,
  });
}

export function sendRegisterCode(params) {
  return request({
    url: '/baas/common/sendRegisterCode',
    method: 'post',
    params,
  });
}

export function uploadFile(data, params) {
  return request({
    url: '/baas/common/uploadFile',
    method: 'post',
    data,
    params,
  });
}

export function updateFile(data, params) {
  return request({
    url: '/baas/common/updateFile',
    method: 'post',
    data,
    params,
  });
}

export function getTools(params) {
  return request({
    url: '/baas/common/getTools',
    method: 'get',
    params,
  });
}
