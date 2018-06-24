import * as api from '@/services/role'
import $doRequest from '@/utils/formatFetch'

const role = {
  namespaced: true,
  state: {
    list: {
      loading: false,
      data: [],
      pagination: {
        totalCount: 0,
        page: 1,
        pageSize: 5,
        sortBy: '',
        sort: ''
      }
    }
  },
  getters: {},
  mutations: {
    SET_lIST: (state, formatResponse) => {
      state.list.data = formatResponse.result;
      state.list.loading = false;
      state.list.pagination.totalCount = formatResponse.totalCount;
    },
    LOADING_lIST: (state) => {
      state.list.loading = true;
    },
    SET_PAGINATION: (state, pagination) => {
      state.list.pagination = { ...state.list.pagination, ...pagination };
    }
  },
  actions: {
    getList({ commit }, query ){
      commit('LOADING_lIST');
      return $doRequest(api.getRoleList(query), (formatResponse)=>{
        // TODO: 存入store
        commit('SET_lIST', formatResponse);
      })
    },
    setPagination({ commit }, pagination){
      commit('SET_PAGINATION', pagination);
    },
    getListAll({commit}){
      return $doRequest(api.getRoleAll())
    }
  }
}

export default role
