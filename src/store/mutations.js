const mutations = {
    setToken(state, token) {
        state.token = token
    },
    setIsRoot(state, isRoot) {
        state.isRoot = isRoot
    },
    setUsername(state, username) {
        state.username = username
    },
    setConfig(state, config) {
      state.config = config
    }
}

export default mutations
