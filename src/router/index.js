import Vue from 'vue'
import Router from 'vue-router'
import Layout from '@/views/layout/layout'
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
                component: resolve => require(['@/views/login/index'], resolve)
            },
            {
                path: '/admin',
                name: 'layout',
                component: Layout,
                redirect: { name: 'user' },
                children: [
                    {
                        path: 'role',
                        name: 'role',
                        component: resolve => require(['@/views/role/role'], resolve),
                        meta: {
                            title: '角色'
                        }
                    },
                    {
                        path: 'user',
                        name: 'user',
                        component: resolve => require(['@/views/user/user'], resolve),
                        meta: {
                            title: '用户'
                        }
                    },

                    {
                        path: 'resource',
                        name: 'resource',
                        component: resolve => require(['@/views/resource/resource'], resolve),
                        meta: {
                            title: '资源'
                        }
                    },
                    {
                        path: 'draft',
                        name: 'draft',
                        component: resolve => require(['@/views/draft/draft'], resolve),
                        meta: {
                            title: '草稿'
                        }
                    }
                ]
            },
            {
                path: '/',
                name: 'root',
                redirect: { name: 'article'}
            },
            {
                path: '/article',
                name: 'article',
                component: resolve => require(['@/views/article/list'], resolve),
                meta: {
                    title: '文章'
                }
            },
            {
                path: '/article/:id',
                name: 'article-detail',
                component: resolve => require(['@/views/article/detail'], resolve),
                meta: {
                    title: '文章详情'
                }
            }
        ]
    })

    return router;
}
