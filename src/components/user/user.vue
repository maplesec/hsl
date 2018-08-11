<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-input v-model="searchValue" style="width: 200px;"></el-input>
      <el-button class="filter-item" @click="initTable(true)" type="promary">搜索</el-button>
      <el-button class="filter-item" @click="handleCreate(true)" type="primary" icon="el-icon-edit">{{$t('common.add')}}</el-button>
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
        prop="account"
        :label="$t('user.account')"
        sortable="custom"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('user.name')"
        sortable="custom"
        width="180">
      </el-table-column>
      <el-table-column :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">{{$t('common.delete')}}</el-button>
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

    <el-dialog :title="$t('common.add') + $t('common.space') + $t('user.user')" :visible.sync="dialog.dialogVisible" @open="dialog.contentVisible = true" @closed="dialog.contentVisible = false">
      <create-user v-if="dialog.contentVisible" :status="dialog.status" :id="dialog.id" @close="handleClose"></create-user>
    </el-dialog>
  </div>
</template>

<script>

import * as api from '@/services/user'
import * as api2 from '@/services/role'
import createUser from './modal/createUser.vue'

export default {
  components: {
    createUser
  },
  data () {
    return {
      searchValue: '',
      dialog: {
        dialogVisible: false,
        contentVisible: false,
        status: 'create',
        id: ''
      },
    }
  },
  computed: {
    tableData(){
      return this.$store.state.user.list.data;
    },
    loading(){
      return this.$store.state.user.list.loading;
    },
    pagination() {
      return this.$store.state.user.list.pagination;
    }
  },
  created () {
    this.initTable()
  },
  asyncData({store}){
    return store.dispatch('user/getList', {
        page: 1,
        pageSize: 5,
        filter: '',
        sortBy: '',
        sort: ''
    })
  },
  methods: {
    initTable (isSearch) {
      if (isSearch) {
        this.$store.dispatch('user/setPagination', {page: 1});
      }
      const query = {
        page: this.pagination.page,
        pageSize: this.pagination.pageSize,
        filter: this.searchValue,
        sortBy: this.pagination.sortBy,
        sort: this.pagination.sort
      }
      this.$store.dispatch('user/getList', query).then((e)=>{
        //TODO: 出错的提示
        this.$formatMessage(e, '获取用户列表', 'none');
      })
    },
    handleSizeChange (val) {
      this.$store.dispatch('user/setPagination', {pageSize: val});
      this.initTable()
    },
    handleCurrentChange (val) {
      this.$store.dispatch('user/setPagination', {page: val});
      this.initTable()
    },
    handleSortChange (val) {
      this.$store.dispatch('user/setPagination', {sortBy: val.prop});
      if (val.order) {
        this.$store.dispatch('user/setPagination', {sort: val.order === 'ascending' ? 'asc' : 'desc'});
      } else {
        this.$store.dispatch('user/setPagination', {sort: null});
      }
      this.initTable()
    },
    handleCreate () {
      this.dialog.status = 'create';
      this.dialog.id = '';
      this.dialog.dialogVisible = true
    },
    handleEdit (id) {
      this.dialog.status = 'edit';
      this.dialog.id = id;
      this.dialog.dialogVisible = true
    },
    handleClose (fresh) {
      if (fresh) {
        this.initTable();
      }
      this.dialog.dialogVisible = false
    },
    handleDelete (id, row) {
      this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$doRequest(api.deleteUser(id), '删除用户').then(() => {
            this.initTable()
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
          })
          
        }).catch(() => {
          // 取消删除       
        });
    }
  }
}
</script>
