import { App } from 'antd';

let message;
let notification;
let modal;

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const fn = App.useApp();
  message = fn.message;
  notification = fn.notification;
  modal = fn.modal;
  return null;
};
export { message, modal, notification };

