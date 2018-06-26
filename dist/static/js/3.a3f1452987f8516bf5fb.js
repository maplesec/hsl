webpackJsonp([3],{"2YEX":function(e,t,a){"use strict";var i={render:function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container calendar-list-container"},[a("div",{staticClass:"filter-container"},[a("el-button",{staticClass:"filter-item",attrs:{type:"primary",icon:"el-icon-edit"},on:{click:e.handleCreate}},[e._v(e._s(e.$t("common.add")))]),e._v(" "),a("el-input",{model:{value:e.searchValue,callback:function(t){e.searchValue=t},expression:"searchValue"}}),e._v(" "),a("el-button",{staticClass:"filter-item",attrs:{type:"promary"},on:{click:e.initTable}},[e._v("搜索")]),e._v(" "),a("el-button",{staticClass:"filter-item",attrs:{type:"promary"},on:{click:e.login}},[e._v("登录")]),e._v(" "),a("el-button",{staticClass:"filter-item",attrs:{type:"promary"},on:{click:e.logout}},[e._v("登出")])],1),e._v(" "),a("el-dialog",{attrs:{title:e.$t("common.add")+e.$t("common.space")+e.$t("resource.resource"),visible:e.dialogFormVisible},on:{"update:visible":function(t){e.dialogFormVisible=t}}},[a("el-form",{ref:"dataForm",attrs:{rules:e.rules,model:e.form,"label-position":"left","label-width":"70px"}},[a("el-form-item",{attrs:{label:e.$t("resource.id"),"label-width":e.formLabelWidth,prop:"id"}},[a("el-input",{attrs:{"auto-complete":"off"},model:{value:e.form.id,callback:function(t){e.$set(e.form,"id",t)},expression:"form.id"}})],1),e._v(" "),a("el-form-item",{attrs:{label:e.$t("resource.name"),"label-width":e.formLabelWidth,prop:"name"}},[a("el-input",{attrs:{"auto-complete":"off"},model:{value:e.form.name,callback:function(t){e.$set(e.form,"name",t)},expression:"form.name"}})],1)],1),e._v(" "),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.dialogFormVisible=!1}}},[e._v(e._s(e.$t("common.cancel")))]),e._v(" "),"create"===e.dialogStatus?a("el-button",{attrs:{type:"primary"},on:{click:e.createResource}},[e._v(e._s(e.$t("common.confirm")))]):e._e(),e._v(" "),"edit"===e.dialogStatus?a("el-button",{attrs:{type:"primary"},on:{click:e.editResource}},[e._v(e._s(e.$t("common.confirm")))]):e._e()],1)],1),e._v(" "),a("el-table",{directives:[{name:"loading",rawName:"v-loading",value:e.loading,expression:"loading"}],staticStyle:{width:"100%"},attrs:{data:e.tableData},on:{"sort-change":e.handleSortChange}},[a("el-table-column",{attrs:{prop:"id",label:e.$t("resource.id"),sortable:"custom",width:"180"}}),e._v(" "),a("el-table-column",{attrs:{prop:"name",label:e.$t("resource.name"),sortable:"custom",width:"180"}}),e._v(" "),a("el-table-column",{attrs:{label:e.$t("common.operation")},scopedSlots:e._u([{key:"default",fn:function(t){return[a("el-button",{attrs:{size:"mini"},on:{click:function(a){e.handleEdit(t.row.id)}}},[e._v(e._s(e.$t("common.edit")))]),e._v(" "),a("el-button",{attrs:{size:"mini",type:"danger"},on:{click:function(a){e.handleDelete(t.row.id)}}},[e._v(e._s(e.$t("common.delete")))])]}}])})],1),e._v(" "),a("el-pagination",{attrs:{"current-page":e.pagination.page,"page-sizes":[2,5,10,20],"page-size":e.pagination.pageSize,layout:"total, sizes, prev, pager, next, jumper",total:e.pagination.totalCount},on:{"size-change":e.handleSizeChange,"current-change":e.handleCurrentChange}})],1)},staticRenderFns:[]};t.a=i},"D+Dq":function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),t.getResource=t.editResource=t.deleteResource=t.addResource=t.getResourceAll=t.getResourceList=void 0;var i,o=a("dTAI"),s=(i=o)&&i.__esModule?i:{default:i};t.getResourceList=(e=>s.default.get(`/acl_resource?page=${e.page}&pageSize=${e.pageSize}&filter=${e.filter}&sortBy=${e.sortBy}&sort=${e.sort}`)),t.getResourceAll=(()=>s.default.get("/acl_resource")),t.addResource=(e=>s.default.post("./acl_resource",e)),t.deleteResource=(e=>s.default.delete("./acl_resource/"+e)),t.editResource=((e,t)=>s.default.put("./acl_resource/"+e,t)),t.getResource=(e=>s.default.get("/acl_resource/"+e))},NqKP:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=a("TXKF"),o=a.n(i);for(var s in i)"default"!==s&&function(e){a.d(t,e,function(){return i[e]})}(s);var r=a("2YEX"),l=a("vSla")(o.a,r.a,!1,null,null,null);t.default=l.exports},TXKF:function(e,t,a){"use strict";Object.defineProperty(t,"__esModule",{value:!0});var i=s(a("D+Dq")),o=s(a("ye8Q"));function s(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&(t[a]=e[a]);return t.default=e,t}t.default={data(){return{tableData:[],pagination:{totalCount:0,page:1,pageSize:5,sortBy:"",sort:""},searchValue:"",loading:!0,dialogFormVisible:!1,dialogStatus:"",form:{id:"",name:""},rules:{id:[{required:!0,message:this.$t("validation.require")+this.$t("common.space")+this.$t("resource.id")},{min:3,max:12,message:"3-12"+this.$t("validation.characters")}],name:[{required:!0,message:this.$t("validation.require")+this.$t("common.space")+this.$t("resource.name")},{min:3,max:12,message:"3-12"+this.$t("validation.characters")}]},formLabelWidth:"120px"}},created(){this.initTable()},methods:{initTable(e){this.loading=!0,e&&(this.pagination.page=1);const t={page:this.pagination.page,pageSize:this.pagination.pageSize,filter:this.searchValue,sortBy:this.pagination.sortBy,sort:this.pagination.sort};this.$doRequest(i.getResourceList(t),"获取资源列表",this.$showErrorType.none).then(e=>{setTimeout(()=>{this.loading=!1},200),this.tableData=e.result,this.pagination.totalCount=e.totalCount},e=>{e&&console.log(e),setTimeout(()=>{this.loading=!1},200)})},handleSizeChange(e){this.pagination.pageSize=e,this.initTable()},handleCurrentChange(e){this.pagination.page=e,this.initTable()},handleSortChange(e){this.pagination.sortBy=e.prop,e.order?this.pagination.sort="ascending"===e.order?"asc":"desc":this.pagination.sort=null,this.initTable()},resetForm(){this.form={name:"",id:""}},login(){o.login().then(e=>{console.log(e)})},logout(){o.logout().then(e=>{console.log(e)})},handleCreate(){this.resetForm(),this.dialogStatus="create",this.dialogFormVisible=!0,this.$nextTick(()=>{this.$refs.dataForm.clearValidate()})},createResource(){this.$refs.dataForm.validate(e=>{if(e){const e={name:this.form.name,id:this.form.id};console.log("params",e),this.$doRequest(i.addResource(e),"增加资源",this.$showErrorType.none).then(e=>{this.initTable(),this.dialogFormVisible=!1})}})},handleEdit(e){this.$doRequest(i.getResource(e),"获取用户",this.$showErrorType.none).then(e=>{this.form=e||{},this.dialogStatus="edit",this.dialogFormVisible=!0,this.$nextTick(()=>{this.$refs.dataForm.clearValidate()})})},editResource(){this.$refs.dataForm.validate(e=>{if(e){const e={name:this.form.name,id:this.form.id};this.$doRequest(i.editResource(this.form.id,e),"编辑资源").then(()=>{this.initTable(),this.dialogFormVisible=!1})}})},handleDelete(e,t){console.log("delete",e,t),i.deleteResource(e).then(()=>{this.initTable()})}}}}});
//# sourceMappingURL=3.a3f1452987f8516bf5fb.js.map