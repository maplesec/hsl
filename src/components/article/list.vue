<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="searchValue" style="width:200px;"></el-input>
      <el-button class="filter-item" @click="initTable" type="promary">搜索</el-button>
    </div>

    <el-table
      v-loading="loading"
      :data="tableData"
      @sort-change="handleSortChange"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="title"
        :label="$t('draft.title')"
        sortable="custom"
        width="180">
        <template slot-scope="scope">
          <a style="cursor: pointer;" v-on:click="goDetailPage(scope.row.id)">{{ scope.row.title }}</a>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagination.page"
      :page-sizes="[2, 5, 10, 20]"
      :page-size="pagination.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.totalCount">
    </el-pagination>
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
        pageSize: 5,
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
  .demo-dynamic .el-input {
    /*margin-right: 10px;*/
    /*width: 270px;*/
    /*vertical-align: top;*/
  }
</style>
