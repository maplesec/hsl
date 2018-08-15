<template>
    <header id="header" class="header bg-white">
        <div class="navbar-container">
            <a class="navbar-logo" href="/">
                <img src="/static/img/logo.jpg"  alt="Leaf Blog"/>
                <span>Leaf Blog</span>
            </a>
            <div>
                <el-input placeholder="Search..." v-model="searchValue" style="width:200px" class="input-with-select">
                    <el-button slot="append" icon="el-icon-search" @click="handleSearch()" :loading="loading"></el-button>
                </el-input>
            </div>
        </div>
    </header>
</template>

<script>
    export default {
        data () {
            return {
                searchValue: '',
                module: 'draft'
            }
        },
        computed: {
            loading(){
                return this.$store.state[this.module].list.loading;
            }
        },
        methods: {
            handleSearch () {
                this.$store.dispatch(`${this.module}/setPagination`, {filter: this.searchValue});
                this.initTable();
            },
            initTable (isSearch) {
                this.$store.dispatch(`${this.module}/getList`).then((e) => {
                    //TODO: 出错的提示
                    this.$formatMessage(e, '获取用户列表', 'none');
                })
            },
        }
    }
</script>