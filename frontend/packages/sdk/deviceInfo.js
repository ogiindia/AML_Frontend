import { convertHASHData } from '@ais/crypto';
import { UAParser } from 'ua-parser-js';

export const getDeviceFingerPrint = async () => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  ctx.textBaseline = 'top';
  ctx.font = '14px arial';
  ctx.fillText(`Device Fingerprinting`, 2, 2);

  const deviceDetails = [
    navigator.userAgent,
    navigator.language,
    screen.width,
    screen.height,
    navigator.platform,
    canvas.toDataURL(),
  ].join('||');

  const data = await convertHASHData(deviceDetails);
  return data;
};

export function getDeviceInfo() {
  return UAParser();
}

export const getCurrentDateTime = (now = new Date()) => {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}${month}${day}${hours}${minutes}${seconds}`;
};
