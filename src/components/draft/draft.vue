<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('common.add')}}</el-button>
      <el-input v-model="searchValue" style="width:200px;"></el-input>
      <el-button class="filter-item" @click="initTable" type="promary">搜索</el-button>
    </div>

    <el-dialog :title="$t('common.add') + $t('common.space') + $t('draft.draft')" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="form" label-position="left" label-width="120px" class="demo-dynamic">
        <el-form-item :label="$t('draft.title')" prop="title">
          <el-input v-model="form.title" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="textarea"
            placeholder="请输入内容"
            v-model="form.content">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" v-if="dialogStatus==='create'" @click="createDraft">{{$t('common.confirm')}}</el-button>
        <el-button type="primary" v-if="dialogStatus==='edit'" @click="editDraft">{{$t('common.confirm')}}</el-button>
      </div>
    </el-dialog>

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
      dialogFormVisible: false,
      dialogStatus: '',
      form: {
        title: '',
        content: ''
      },
      rules: {
        title: [
          {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('draft.title')},
          {min: 3, max: 12, message: '3-12' + this.$t('validation.characters')}
        ]
      },
      formLabelWidth: '120px'
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
    resetForm () {
      this.form = {
        title: '',
        content: ''
      }
    },
    handleCreate () {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createDraft () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            title: this.form.title,
            content: this.form.content
          }
          this.$doRequest(api.addDraft(params), '增加文章').then(() => {
            this.initTable()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleEdit (id) {
      this.$doRequest(api.getDraft(id), '获取指定文章', this.$showErrorType.none).then((res) => {
        this.form = res || {}
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    editDraft () {
      console.log('click')
      this.$refs['dataForm'].validate((valid) => {
        console.log('valid')
        if (valid) {
          const params = {
            title: this.form.title,
            content: this.form.content
          }
          this.$doRequest(api.editDraft(this.form.id, params), '编辑文章').then(() => {
            this.initTable()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete (id, row) {
      console.log('delete', id, row)
      api.deleteDraft(id).then(() => {
        this.initTable()
      })
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
