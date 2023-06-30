import axios from 'axios';

export const baseURL = 'https://facebank.store/api/';
export const instance = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'multipart/form-data'
  },
  validateStatus: function (status) {
    return status >= 200 && status < 500;
  },
});

export const thumbImgUrl = (uuid) => {
  return `${baseURL}photos/thumbnail/${uuid}.png`
};
export const fullImgUrl = (uuid, withoutWatermark = false) => {
  return `${baseURL}photos/fullsize/${uuid}.png${withoutWatermark ? '?style=mobile' : ''}`
}

export const compressedImgUrl = (uuid, withoutWatermark = false) => {
  return `${baseURL}mb/photos/fullsize/${uuid}.png${withoutWatermark ? '?style=mobile' : ''}`
}

export const eventLogoImgUrl = (id) => {
  return `${baseURL}event/logotype/${id}`
}
export const albumImgUrl = (thumbnail) => {
  return `${baseURL}photos/thumbnail/${thumbnail}.png`
}

export const mobilePaymentUrl = (id, email) => `https://facebank.store/mobile-payment?paymentId=${id}&email=${email}`;
export const packUrl = (uuid) => `https://facebank.store/pack?id=${uuid}`;

