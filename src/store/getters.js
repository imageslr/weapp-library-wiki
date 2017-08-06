const getters = {
  id: state => state.user.id,
  type: state => state.user.type,
  nickname: state => state.user.nickname,
  token: state => state.user.token,
  isAdmin: state => state.user.isAdmin,
};
export default getters
