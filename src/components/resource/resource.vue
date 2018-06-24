<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('common.add')}}</el-button>
      <el-input v-model="searchValue"></el-input>
      <el-button class="filter-item" @click="initTable" type="promary">搜索</el-button>
      <el-button class="filter-item" @click="login" type="promary">登录</el-button>
      <el-button class="filter-item" @click="logout" type="promary">登出</el-button>
    </div>

    <el-dialog :title="$t('common.add') + $t('common.space') + $t('resource.resource')" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="form" label-position="left" label-width="70px" >
        <el-form-item :label="$t('resource.id')" :label-width="formLabelWidth" prop="id">
          <el-input v-model="form.id" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('resource.name')" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" v-if="dialogStatus==='create'" @click="createResource">{{$t('common.confirm')}}</el-button>
        <el-button type="primary" v-if="dialogStatus==='edit'" @click="editResource">{{$t('common.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-table
      v-loading="loading"
      :data="tableData"
      @sort-change="handleSortChange"
      style="width: 100%">
      <el-table-column
        prop="id"
        :label="$t('resource.id')"
        sortable="custom"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('resource.name')"
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

import * as api from '@/services/resource'
import * as api2 from '@/services/user'
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
        id: '',
        name: ''
      },
      rules: {
        id: [
          {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('resource.id')},
          {min: 3, max: 12, message: '3-12' + this.$t('validation.characters')}
        ],
        name: [
          {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('resource.name')},
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
      this.$doRequest(api.getResourceList(query), '获取资源列表', this.$showErrorType.none).then((res) => {
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
        name: '',
        id: ''
      }
    },
    login () {
      api2.login().then((res) => {
        console.log(res)
      })
    },
    logout () {
      api2.logout().then((res) => {
        console.log(res)
      })
    },
    handleCreate () {
      this.resetForm()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createResource () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form.name,
            id: this.form.id
          }
          console.log('params', params)
          this.$doRequest(api.addResource(params), '增加资源', this.$showErrorType.none).then((res) => {
            this.initTable()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleEdit (id) {
      this.$doRequest(api.getResource(id), '获取用户', this.$showErrorType.none).then((res) => {
        this.form = res || {}
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    editResource () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form.name,
            id: this.form.id
          }
          this.$doRequest(api.editResource(this.form.id, params), '编辑资源').then(() => {
            this.initTable()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete (id, row) {
      console.log('delete', id, row)
      api.deleteResource(id).then(() => {
        this.initTable()
      })
    }
  }
}
</script>
