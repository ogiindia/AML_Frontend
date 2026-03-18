import { api } from '@ais/api';
import { hash } from '@ais/crypto';

const CommonAPI = {
  Login(username, password) {
    return api.post('/app/v1/login', { username, keyword: password });

    // return axiosApi({
    //   method: "get",
    //   url: `/LoginResponse.json`,
    // })
  },

  updatePassword(oldPassword, newPassword) {
    return api.post('/app/v1/users/update-password', {
      currentkeyword: oldPassword,
      keyword: newPassword,
    });
  },

  changePassword(username, newpassword, oldpassword) {
    return api.post('/app/rest/v1.0/service/changepassword', {
      newpassword: hash(newpassword),
      oldpassword: hash(oldpassword),
      userId: username,
    });
  },
};

export { CommonAPI };
