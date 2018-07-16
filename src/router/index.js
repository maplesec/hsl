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
                    },
                    {
                        path: '/draft',
                        name: 'draft',
                        component: resolve => require(['@/components/draft/draft'], resolve),
                        meta: {
                            title: '草稿'
                        }
                    }
                ]
            },
            {
                path: '/nav',
                name: 'NavComponent',
                component: NavComponent
            },
            {
                path: '/article',
                name: 'article',
                component: resolve => require(['@/components/article/list'], resolve),
                meta: {
                    title: '文章'
                }
            },
            {
                path: '/article/:id',
                name: 'article-detail',
                component: resolve => require(['@/components/article/detail'], resolve),
                meta: {
                    title: '文章详情'
                }
            }
        ]
    })

    return router;
}
