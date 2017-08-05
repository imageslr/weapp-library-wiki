const getters = {
  id: state => state.user.id,
  type: state => state.user.type,
  nickname: state => state.user.nickname,
  token: state => state.user.token,
};
export default getters
