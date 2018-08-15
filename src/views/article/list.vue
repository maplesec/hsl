<template>
    <div class="app-container calendar-list-container bg-grey">

        <header id="header" class="header bg-white">
            <div class="navbar-container">
                <a class="navbar-logo" href="/">
                    <img src="/static/img/logo.jpg"  alt="Leaf Blog"/>
                    <span>Leaf Blog</span>
                </a>
                <div>
                    <el-input placeholder="Search..." v-model="searchValue" style="width:200px" class="input-with-select">
                        <el-button slot="append" icon="el-icon-search" @click="initTable" :loading="loading"></el-button>
                    </el-input>
                </div>
            </div>
        </header>


        <!--<div class="filter-container">-->

        <!--</div>-->

        <div class="main-content">
            <div class="post-lists">
                <div class="post-lists-body">
                    <div class="post-list-item" v-for="(item, index) in tableData" :key="item.id">
                        <div class="post-list-item-container">
                            <div class="item-thumb bg-deepgrey" style="background-image:url('/static/img/2.jpg');"></div>
                            <a style="cursor: pointer;" v-on:click="goDetailPage(item.id)">
                                <div class="item-desc">
                                    <p>{{ item.content }}</p>
                                </div>
                            </a>
                            <div class="item-slant reverse-slant bg-deepgrey"></div>
                            <div class="item-slant"></div>
                            <div class="item-label">
                                <div class="item-title"><a v-on:click="goDetailPage(item.id)">{{ item.title }}</a>
                                </div>
                                <div class="item-meta clearfix">
                                    <div class="item-meta-ico bg-ico-link"
                                         style="background: url('/static/img/bg-ico.png') no-repeat;background-size: 40px auto;"></div>
                                    <div class="item-meta-cat">
                                        <a>this is category</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pagination.page"
                    :page-sizes="[2, 5, 10, 20]"
                    :page-size="pagination.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="pagination.totalCount">
            </el-pagination>
        </div>


        <footer id="footer" class="footer bg-white">
            <div class="footer-meta">
                <div class="footer-container">
                    <div class="meta-item meta-copyright">
                        <div class="meta-copyright-info">
                            <a href="/" class="info-logo">
                                <img src="/static/img/logo.jpg" alt="maple's blog">
                            </a>
                            <div class="info-text">
                                <p>Powered by <a href="https://github.com/maplesec/hsl" target="_blank" rel="nofollow">leaf-blog</a>
                                </p>
                                <p>&copy; 2018 <a href="https://github.com/maplesec">maplesec</a></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>


    </div>

</template>

<script>

    import * as api from '@/services/draft'

    export default {
        data () {
            return {
                tableData: [],
                pagination: {
                    totalCount: 0,
                    page: 1,
                    pageSize: 12,
                    sortBy: '',
                    sort: ''
                },
                searchValue: '',
                loading: true,
            }
        },
        created () {
            this.initTable()
        },
        methods: {
            initTable (isSearch) {
                this.loading = true
                if (isSearch) {
                    this.pagination.page = 1
                }
                const query = {
                    page: this.pagination.page,
                    pageSize: this.pagination.pageSize,
                    filter: this.searchValue,
                    sortBy: this.pagination.sortBy,
                    sort: this.pagination.sort
                }
                this.$doRequest(api.getDraftList(query), '获取文章列表', this.$showErrorType.none).then((res) => {
                    setTimeout(() => {
                        this.loading = false
                    }, 200)
                    this.tableData = res.result
                    this.pagination.totalCount = res.totalCount
                }, (err) => {
                    if (err) {
                        console.log(err)
                    }
                    setTimeout(() => {
                        this.loading = false
                    }, 200)
                })
            },
            handleSizeChange (val) {
                this.pagination.pageSize = val
                this.initTable()
            },
            handleCurrentChange (val) {
                this.pagination.page = val
                this.initTable()
            },
            handleSortChange (val) {
                this.pagination.sortBy = val.prop
                if (val.order) {
                    this.pagination.sort = val.order === 'ascending' ? 'asc' : 'desc'
                } else {
                    this.pagination.sort = null
                }
                this.initTable()
            },
            goDetailPage(id){
                this.$router.push(`article/${id}`);
            }
        }
    }
</script>
<style>
    .index-page .post-list-item-container .item-label {
        padding: 10px 20px 40px
    }

    .post-lists {
        position: relative;
        display: block;
        overflow: hidden
    }

    .post-lists-body {
        display: block
    }

    .post-list-item {
        float: left;
        width: 33.3333%;
        height: auto;
        padding: 15px;
        align-items: center
    }

    .post-list-item-container {
        position: relative;
        overflow: hidden;
        width: 100%;
        padding: 0;
        border-radius: 3px;
        background-color: #fff;
        -webkit-box-shadow: 0 1px 4px rgba(0,0,0,.04);
        box-shadow: 0 1px 4px rgba(0,0,0,.04)
    }

    .post-list-item-container:hover {
        -webkit-box-shadow: 2px 2px 4px rgba(0,0,0,.1);
        box-shadow: 2px 2px 4px rgba(0,0,0,.1)
    }

    .post-list-item-container .item-thumb {
        position: relative;
        display: inherit;
        min-height: 250px;
        -webkit-transition: -webkit-transform .5s ease,filter .5s ease;
        -moz-transition: -moz-transform .5s ease,filter .5s ease;
        transition: transform .5s ease,filter .5s ease;
        background-position: 50% 50%;
        background-size: cover
    }

    .post-list-item-container .item-desc {
        position: absolute;
        top: 0;
        overflow: hidden;
        width: 100%;
        height: 100%;
        padding: 40px 28px
    }

    .post-list-item-container .item-desc p {
        font-size: 14px;
        margin: 0;
        padding: 0;
        word-break: break-all;
        opacity: 0;
        color: #fff
    }

    .post-list-item-container:hover .item-thumb {
        -webkit-transform: scale(1.1);
        -moz-transform: scale(1.1);
        transform: scale(1.1);
        -webkit-filter: blur(3px);
        -moz-filter: blur(3px);
        filter: blur(3px)
    }

    .post-list-item-container:hover .item-desc {
        background-color: rgba(0,0,0,.5)
    }

    .post-list-item-container:hover .item-desc p {
        -webkit-animation: fade-in .5s;
        animation: fade-in;
        animation-duration: .5s;
        opacity: 1
    }

    .post-list-item-container .item-slant {
        position: absolute;
        z-index: 0;
        right: 0;
        bottom: 50px;
        left: 0;
        width: 110%;
        min-height: 100px;
        -webkit-transform: rotate(7deg) translate(-10px,0);
        -ms-transform: rotate(7deg) translate(-10px,0);
        transform: rotate(7deg) translate(-10px,0);
        background-color: #fff
    }

    .post-list-item-container .item-slant.reverse-slant {
        -webkit-transform: rotate(-10deg) translate(10px,-10px);
        -ms-transform: rotate(-10deg) translate(10px,-10px);
        transform: rotate(-10deg) translate(10px,-10px);
        opacity: .7;
        background-color: #f68e5f;
        -webkit-box-shadow: none;
        box-shadow: none
    }

    .post-list-item-container .item-label {
        position: relative;
        height: 130px;
        padding: 25px 20px 40px;
        background-color: #fff
    }

    .post-list-item-container .item-label .item-title a {
        font-size: 17px;
        line-height: 17px;
        word-break: break-all;
        color: #313131
    }

    .post-list-item-container .item-label .item-meta {
        position: absolute;
        right: 0;
        bottom: 0;
        width: 100%;
        padding: 0 15px 15px;
        text-align: right
    }

    .post-list-item-container .item-label .item-meta .item-meta-cat a {
        font-size: 13px;
        position: relative;
        float: right;
        margin-right: 10px;
        padding: 10px 0;
        text-align: right;
        text-transform: none;
        color: #5f5f5f
    }

    .post-list-item-container .item-label .item-meta .item-meta-date {
        font-size: 12px;
        position: relative;
        float: left;
        padding-top: 9px;
        padding-left: 9px;
        text-align: right;
        text-transform: none;
        color: #f1f1f1
    }

    .post-list-item-container .item-label .item-meta .item-meta-ico {
        display: inline-block;
        float: right;
        width: 42px;
        height: 42px;
        border: 1px solid #eaeaea;
        border-radius: 50%
    }

    .bg-ico-link {
        background-position: 0 -280px!important;
    }

    .onelist-page {
        max-width: 100%;
        margin: 0;
        padding: 70px 0 0
    }

    .post-onelist-item {
        display: inline-block;
        width: 100%;
        margin: 0
    }

    .bg-deepgrey {
        background-color: rgba(0,0,0,.5)!important;
    }

    .bg-grey {
        background-color: #f7f7f7 !important;
    }

    .el-pagination {
        text-align: center;
    }

    .bg-white {
        background-color: #fff!important;
    }

    .main-content {
        position:relative;
        max-width:940px;
        margin: 0 auto;
        padding: 120px 20px 30px;
    }

    *, :after, :before {
        -webkit-box-sizing: border-box;
        -moz-box-sizing: border-box;
        box-sizing: border-box;
    }

    /*header*/
    .header {
        line-height: 68px;
        position: fixed;
        z-index: 10;
        top: 0;
        display: block;
        width: 100%;
        height: 70px;
        padding: 0;
        text-align: right;
        -webkit-box-shadow: 0 1px 5px rgba(0,0,0,.1);
        -moz-box-shadow: 0 1px 5px rgba(0,0,0,.1);
        box-shadow: 0 1px 5px rgba(0,0,0,.1);
    }

    .navbar-container {
        position: relative;
        width: 1040px;
        max-width: 100%;
        height: 70px;
        margin: 0 auto;
    }

    .navbar-logo {
        font-size: 22px;
        line-height: 22px;
        position: absolute;
        top: 50%;
        left: 0;
        display: block;
        width: auto;
        max-width: 50%;
        height: 22px;
        margin-top: -15px;
        margin-left: 25px;
        text-decoration: none;
    }

    .navbar-logo img {
        width: auto;
        height: 32px;
        outline: 0;
        border-radius: 16px;
    }

    .navbar-logo span {
        color: #8c939d;
        font-size: 16px;
        position: relative;
        top: -7px;
    }

    /*foot*/
    .footer {
        position: relative;
        z-index: 1;
        margin-top: 0;
        padding-bottom: 50px;
        background-color: #fff;
    }

    .footer-meta {
        padding: 50px 0 0;
        list-style: none;
    }

    .footer-meta .footer-container {
        width: 100%;
        max-width: 960px;
        /*height: 250px;*/
        margin: 0 auto;
        padding: 0 80px;
        text-align: center;
    }

    .footer-meta .meta-item {
        position: relative;
        /*width: 33.3333333%;*/
        min-height: 1px;
        padding: 0 30px;
        text-align: center;
    }

    .footer-meta .meta-copyright .info-logo img {
        height: 32px;
        margin-bottom: 12px;
        border-radius: 16px;
    }

    .info-text {
        font-size: 12px;
        color: #6f7180;
        text-decoration: none;
    }
</style>
