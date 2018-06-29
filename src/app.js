import Vue from 'vue';
import App from './App.vue'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import { createRouter } from './router'
import axios from './services/axios'
import prototypeFunc from './utils/prototypeFunc'
import { createStore } from './store'
import i18n from './lang'
import { sync } from 'vuex-router-sync'
import ElementUI from 'element-ui';

Vue.use(ElementUI)
Vue.use(prototypeFunc)

export function createApp(){
    const router = createRouter()
    const store = createStore()
    // 同步路由状态(route state)到 store
    sync(store, router)

    // axios功能未稳定, 暂不使用路由守卫

    router.beforeEach(function(to, from, next) {
        // TODO: 判断页面是否需要权限,再执行以下代码
        // 首次打开网页,根据接口判断是否免登陆
        if(store.getters['app/profile'].needCheckLogin){
            const profile_api = axios.get('/acl_user/profile');
            (profile_api).then(res => {
                console.log(JSON.stringify(res))
                if (res.data && res.data && res.data.status === 1) {
                    store.dispatch('app/setProfile', res.data.response);
                    next();
                } else {
                    console.log('next1')
                    next('/login');
                }
            }, err => {
                console.log('next2')
                next('/login');
            })
            store.dispatch('app/checkLogin')
        }else{
            next();
        }
    })


    const app = new Vue({
        render: h => h(App),
        i18n,
        router,
        store,
        axios,
    })
    return { app, router, store }
}
