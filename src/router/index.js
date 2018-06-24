import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/layout'
import NavComponent from '@/components/NavComponent'
import store from '@/store'
import axios from '@/services/axios'

Vue.use(Router)

export function createRouter(){
    const router = new Router({
        routes: [
            {
                path: '/login',
                name: 'login',
                component: resolve => require(['@/components/login/index'], resolve)
            },
            {
                path: '/table',
                name: 'table',
                component: resolve => require(['@/components/table/table'], resolve)
            },
            {
                path: '/',
                name: 'layout',
                component: Layout,
                redirect: { name: 'user' },
                children: [
                    {
                        path: '/user',
                        name: 'user',
                        component: resolve => require(['@/components/user/user'], resolve),
                        meta: {
                            title: '用户'
                        }
                    },
                    {
                        path: '/role',
                        name: 'role',
                        component: resolve => require(['@/components/role/role'], resolve),
                        meta: {
                            title: '角色'
                        }
                    },
                    {
                        path: '/resource',
                        name: 'resource',
                        component: resolve => require(['@/components/resource/resource'], resolve),
                        meta: {
                            title: '资源'
                        }
                    }
                ]
            },
            {
                path: '/nav',
                name: 'NavComponent',
                component: NavComponent
            }
        ]
    })

    router.beforeEach(function(to, from, next) {
        // TODO: 判断页面是否需要权限,再执行以下代码
        // 首次打开网页,根据接口判断是否免登陆
        if(store.getters['app/profile'].needCheckLogin){
            const profile_api = axios.get('/acl_user/profile');
            (profile_api).then(res => {
                if (res.data && res.data && res.data.status === 1) {
                    store.dispatch('app/setProfile', res.data.response);
                    next();
                } else {
                    next('/login');
                }
            }, err => {
                next('/login');
            })
            store.dispatch('app/checkLogin')
        }else{
            next();
        }
    })
    return router;
}
