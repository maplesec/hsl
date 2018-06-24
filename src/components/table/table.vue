<template>
  <div class="app-container calendar-list-container">
    <div class="filter-container">
      <el-button class="filter-item" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('common.add')}}</el-button>
    </div>

    <el-dialog :title="$t('common.add') + $t('common.space') + $t('user.user')" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="form" label-position="left" label-width="70px" >
        <el-form-item :label="$t('user.account')" :label-width="formLabelWidth" prop="account">
          <el-input v-model="form.account" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.name')" :label-width="formLabelWidth" prop="name">
          <el-input v-model="form.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.password')" :label-width="formLabelWidth" prop="password">
          <el-input v-model="form.password" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item :label="$t('user.checkPass')" :label-width="formLabelWidth" prop="checkPass">
          <el-input v-model="form.checkPass" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('common.cancel')}}</el-button>
        <el-button type="primary" v-if="dialogStatus==='create'" @click="createUser">{{$t('common.confirm')}}</el-button>
        <el-button type="primary" v-if="dialogStatus==='edit'" @click="editUser">{{$t('common.confirm')}}</el-button>
      </div>
    </el-dialog>

    <el-table
      :data="tableData"
      style="width: 100%">
      <el-table-column
        prop="id"
        label="ID"
        width="180">
      </el-table-column>
      <el-table-column
        prop="account"
        :label="$t('user.account')"
        width="180">
      </el-table-column>
      <el-table-column
        prop="name"
        :label="$t('user.name')"
        width="180">
      </el-table-column>
      <el-table-column :label="$t('common.operation')">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row.id)">{{$t('common.edit')}}</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">{{$t('common.delete')}}</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>

</template>

<script>

import * as api from '@/services/user'
export default {
  data () {
    const validatePass = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validation.pass') + this.$t(rule.field)))
      } else {
        if (this.form.checkPass !== '') {
          this.$refs.dataForm.validateField('checkPass')
        }
        callback()
      }
    }
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error(this.$t('validation.checkPass')))
      } else if (value !== this.form.password) {
        callback(new Error(this.$t('validation.passDiff')))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      dialogFormVisible: false,
      dialogStatus: '',
      form: {
        account: '',
        name: '',
        password: '',
        checkPass: ''
      },
      rules: {
        account: [
          {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('user.account')},
          {min: 3, max: 12, message: '3-12' + this.$t('validation.characters')}
        ],
        name: [
          {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('user.name')},
          {min: 3, max: 12, message: '3-12' + this.$t('validation.characters')}
        ],
        password: [
          {validator: validatePass, trigger: 'blur'}
        ],
        checkPass: [
          {validator: validatePass2, trigger: 'blur'}
        ]
      },
      formLabelWidth: '120px'
    }
  },
  created () {
    this.initTable()
  },
  methods: {
    initTable () {
      let service = api.getUserList()
      service.then((res) => {
        this.tableData = res.data
      })
    },
    resetForm () {
      this.form = {
        name: '',
        account: ''
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
    createUser () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form.name,
            account: this.form.account,
            password: this.form.password
          }
          api.addUser(params).then(() => {
            this.initTable()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleEdit (id) {
      api.getUser(id).then((res) => {
        this.form = res.data || {}
        this.dialogStatus = 'edit'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      })
    },
    editUser () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const params = {
            name: this.form.name,
            account: this.form.account,
            password: this.form.password
          }
          api.editUser(this.form.id, params).then(() => {
            this.initTable()
            this.dialogFormVisible = false
          })
        }
      })
    },
    handleDelete (id, row) {
      console.log('delete', id, row)
      api.deleteUser(id).then(() => {
        this.initTable()
      })
    }
  }
}
</script>
