<template>
    <div>
        <el-form :rules="rules" ref="dataForm" :model="form" label-position="left" label-width="120px">
            <el-form-item :label="$t('role.name')" prop="name">
                <el-input v-model="form.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item
                    v-for="(resource, index) in form.allows"
                    :label="'资源' + index"
                    :key="resource.key"
            >
                <el-col :span="8">
                    <el-form-item
                            :prop="'allows.' + index + '.resources'"
                            :rules="{
                required: true, message: '资源不能为空', trigger: 'blur'
              }">
                        <el-select v-model="resource.resources" placeholder="选择资源">
                            <el-option
                                    v-for="item in resourceOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="1">
                    -
                </el-col>
                <el-col :span="8">
                    <el-form-item
                            :prop="'allows.' + index + '.permissions'"
                            :rules="{
                required: true, message: '操作不能为空', trigger: 'blur'
              }">
                        <el-select v-model="resource.permissions" multiple  placeholder="选择权限">
                            <el-option
                                    v-for="item in operationOptions"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="3">
                    -
                </el-col>
                <el-col :span="4">
                    <el-form-item>
                        <el-button @click.prevent="removeResource(resource)" style="float:right">删除</el-button>
                    </el-form-item>
                </el-col>
            </el-form-item>
            <el-form-item>
                <el-button @click="addResource">新增资源</el-button>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="close(false)">{{$t('common.cancel')}}</el-button>
            <el-button type="primary" v-if="status==='create'" @click="createRole">{{$t('common.confirm')}}</el-button>
            <el-button type="primary" v-if="status==='edit'" @click="editRole">{{$t('common.confirm')}}</el-button>
        </div>
    </div>
</template>

<script>
    import * as api from '@/services/role'
    import * as api2 from '@/services/resource'
    export default {
        props: {
            id: String | Number,
            status: String
        },
        data () {
            return {
                form: {
                    name: '',
                    allows: []
                },
                resourceOptions: [],
                operationOptions: [{
                    value: 'show',
                    label: '查看'
                }, {
                    value: 'operate',
                    label: '操作'
                }],
                rules: {
                    name: [
                        {required: true, message: this.$t('validation.require') + this.$t('common.space') + this.$t('role.name')},
                        {min: 3, max: 12, message: '3-12' + this.$t('validation.characters')}
                    ]
                },
                formLabelWidth: '120px'
            }
        },
        created(){
            this.resetForm();
            // 判断类型
            if(this.status === 'edit'){
                this.getForm(this.id).then(() => {
                    this.getResourceList();
                })
            }else{
                this.getResourceList();
            }
        },
        methods: {
            resetForm () {
                this.form = {
                    name: '',
                    allows: []
                }
            },
            getResourceList(){
                this.$doRequest(api2.getResourceAll(), '获取资源列表', this.$showErrorType.none).then((res) => {
                    this.resourceOptions = []
                    res.result.forEach((item) => {
                        this.resourceOptions.push({
                            value: item.id,
                            label: item.name
                        })
                    })
                })
            },
            getForm (id) {
                this.$doRequest(api.getRole(id), '获取指定角色', this.$showErrorType.none).then((res) => {
                    let allows = []
                    for (let allow in res.allows) {
                        allows.push({
                            resources: allow,
                            permissions: res.allows[allow],
                            key: this.$uuid()
                        })
                    }
                    res.allows = allows
                    this.form = res || {}
                    this.$nextTick(() => {
                        this.$refs['dataForm'].clearValidate()
                    })
                })
            },
            removeResource (item) {
                var index = this.form.allows.indexOf(item)
                if (index !== -1) {
                    this.form.allows.splice(index, 1)
                }
            },
            addResource () {
                this.form.allows.push({
                    resources: '',
                    permissions: [],
                    key: this.$uuid()
                })
            },
            createRole () {
                this.$refs['dataForm'].validate((valid) => {
                    if (valid) {
                        const params = {
                            name: this.form.name,
                            allows: this.form.allows
                        }
                        this.$doRequest(api.addRole(params), '增加角色').then(() => {

                            this.close(true);
                        })
                    }
                })
            },
            editRole () {
                console.log('click')
                this.$refs['dataForm'].validate((valid) => {
                    console.log('valid')
                    if (valid) {
                        const params = {
                            name: this.form.name,
                            allows: this.form.allows
                        }
                        this.$doRequest(api.editRole(this.form.id, params), '编辑角色').then(() => {

                            this.close(true);
                        })
                    }
                })
            },
            close (fresh) {
                this.$emit('close', fresh)
            }
        }
    }
</script>