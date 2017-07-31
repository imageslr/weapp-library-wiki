import { login, getUserInfo } from '../../api/index';
import { getToken, setToken, removeToken } from '../../utils/auth';

const user = {
  state: {
    id: '',
    nickname: '',
    type: '',
    token: getToken(),
  },

  mutations: {
    SET_ID: (state, id) => {
      state.id = id;
    },
    SET_TYPE: (state, type) => {
      state.type = type;
    },
    SET_NICKNAME: (state, nickname) => {
      state.nickname = nickname;
    },
    SET_TOKEN: (state, token) => {
      state.token = token;
    },
  },

  actions: {
    // 登录
    LOGIN({ commit }, userInfo) {
      const username = userInfo.username.trim();
      return new Promise((resolve, reject) => {
        login(username, userInfo.password, userInfo.type).then(response => {
          commit('SET_ID', response.id);
          commit('SET_NICKNAME', response.nickname);
          commit('SET_TYPE', response.type);
          commit('SET_TOKEN', response.token);
          setToken(response.token);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 获取用户信息
    GET_INFO({ commit, state }) {
      return new Promise((resolve, reject) => {
        getUserInfo(state.token).then(response => {
          commit('SET_ID', response.id);
          commit('SET_NICKNAME', response.nickname);
          commit('SET_TYPE', response.type);
          resolve();
        }).catch(error => {
          reject(error);
        });
      });
    },

    // 前端 登出
    LOGOUT({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '');
        removeToken();
        resolve();
      });
    },
  }
};

export default user;
