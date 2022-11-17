import { Base64 } from 'js-base64';

export function serialize(json) {
  return Base64.encodeURI(JSON.stringify(json));
}

export function deserialize(base64, defaultValue) {
  try {
    return JSON.parse(Base64.decode(base64));
  } catch (error) {
    if (defaultValue === undefined) {
      throw error;
    }
    return defaultValue;
  }
}
