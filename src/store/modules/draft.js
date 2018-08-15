import * as api from '@/services/draft'
import $doRequest from '@/utils/formatFetch'

const draft = {
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
                sort: '',
                filter: ''
            }
        },
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
        getList({ commit, state }){
            commit('LOADING_lIST');
            return $doRequest(api.getDraftList(state.list.pagination), (formatResponse)=>{
                // TODO: 存入store
                commit('SET_lIST', formatResponse);
            })
        },
        setPagination({ commit }, pagination){
            commit('SET_PAGINATION', pagination);
        },
        getDetail({commit}, id){
            return $doRequest(api.getDraft(id))
        },
        create({commit}, params){
            return $doRequest(api.addDraft(params))
        },
        update({commit}, {id, params}){
            return $doRequest(api.editDraft(id, params))
        },
        delete({commit}, id){
            return $doRequest(api.deleteDraft(id))
        }
    }
}

export default draft
