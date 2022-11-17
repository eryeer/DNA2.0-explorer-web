export const RETURN_CODE_MAP = {
  12010: 'parameter failed 参数校验失败',
  12011: 'token failed 令牌校验失败',
  12013: '登录状态已失效，请重新登录',
  12015: '登录状态已失效，请重新登录',
  14030: '接口熔断打回',
  16010: 'session timeout 会话超时',
  16020: 'token expired token过期',
  17000: 'success 请求成功',
  17010: 'failed 请求失败',
  18010: 'upload failed 文件上传失败',
  18011: '文件大小超出限制',
  18012: '文件格式错误',
  18020: 'download failed 文件下载失败',
  19001: '用户未注册',
  19002: '用户未登录',
  19003: '用户不存在',
  19004: '用户已存在',
  19005: '手机号已经注册',
  19006: '用户名不存在',
  19007: '用户名或密码错误',
  19008: '用户角色权限错误',
  19010: '用户已停用',
  19011: '用户访问地址或角色错误',
  19012: '用户手机号或角色不满足注册条件',
  19013: '原密码错误',
  19101: '登录验证码错误',
  19102: '注册验证码错误',
  19103: '注册授权码错误',
  19104: '用户验证码发送间隔太短',
  19105: '用户验证码发送失败',
  30101: 'JSON格式有误',
  30102: '数据尚未上链',
  30103: 'Hash和原数据不匹配',
  30104: '存证编号不存在',
  30105: '存证类型不能修改',
  30106: 'JSON字段有误',
  30107: '详情字段缺失',
  30108: '接口验证信息出错',
  30109: '公司名称重复',
  99999: '最大错误码',
};

export const RETURN_CODE_SUCC = 17000;
export const RETURN_CODE_TOKEN_EXPIRED = 16020;
export const RETURN_CODE_NEED_LOGOUT = [12013, 12015, 19006, 19010];

export const tokenWhitelist = ['user/refreshToken', 'user/login', 'user/register'];

export const approveStatus = {
  Pending: '待认证',
  Approved: '已认证',
  Rejected: '已拒绝',
};

export const fileType = {
  正面: 'IDA',
  反面: 'IDB',
  正本: 'BL',
  副本: 'BLC',
};

export const contactTemplateType = {
  PROOF: '存证',
  VOTE: '投票',
  CUSTOM: '自定义',
};

export const contactStatus = {
  0: '未部署',
  1: '已部署',
};

export const dstChain = {
  KOVAN_TESTNET: 'Ethereum Testnet (Kovan)',
  FABRIC: 'Fabric',
  DNA_V_ONE: 'DNA 1.0',
  RNA: 'RNA',
  POLY_TESTNET: 'Poly Enterprise',
};

export const networkStatus = {
  UNCONNECTED: 0,
  CONNECT_ERROR: 1,
  CONNECT_NORMAL: 2,
};
