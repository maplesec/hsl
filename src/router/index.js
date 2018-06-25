import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/layout'
import NavComponent from '@/components/NavComponent'
import store from '@/store'
import axios from '@/services/axios'

Vue.use(Router)

export function createRouter(){
    const router = new Router({
        mode: 'history',
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

    return router;
}
