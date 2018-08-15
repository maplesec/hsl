import * as api from '@/services/draft'
import $doRequest from '@/utils/formatFetch'

const article = {
    namespaced: true,
    state: {
        list: {
            loading: false,
            data: [],
            pagination: {
                totalCount: 0,
                page: 1,
                pageSize: 12,
                sortBy: '',
                sort: '',
                filter: ''
            }
        },
        detail: {
            id: 0,
            title: '',
            createTime: '',
            lastEditTime: '',
            excerpt: '',
            content: ''
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
        },
        SET_DETAIL: (state, formatResponse) => {
            state.detail = { ...formatResponse }
        }
    },
    actions: {
        getList({ commit, state }){
            commit('LOADING_lIST');
            return $doRequest(api.getDraftList(state.list.pagination), (formatResponse)=>{
                commit('SET_lIST', formatResponse);
            })
        },
        setPagination({ commit }, pagination){
            commit('SET_PAGINATION', pagination);
        },
        getArticle({commit}, id){
            return $doRequest(api.getArticle(id), (formatResponse) => {
                console.log('formatResponse', formatResponse)
                commit('SET_DETAIL',formatResponse);
            });
        }
    }
}

export default article