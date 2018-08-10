# windows配置mongodb

1. 新建 mongo.config 文件如下
`
dbpath=C:\data\db
logpath=C:\data\log\mongo.log
auth=false
`
2. 管理员启动cmd, 输入命令
`mongod.exe --config mongo.config --install --serviceName "mongo"`

移除

`mongod.exe --remove --serviceName "mongo"`

# 启动mongo

`net start mongo`

# 添加管理员

mongo命令行
`
use admin
db.createUser({user:"root",pwd:"root",roles:["root"]})
`

# 添加数据库用户

`
use test
db.createUser({user:"test",pwd:"test",roles:[{role:"dbOwner",db:"test"}]})
use admin
db.system.users.find()
`

# 开启认证
mongo.config 中auth设置为true
数据库连接改为 mongodb://test:test@localhost/test

# node_acl

与mongoose配合, 必须使用mongoose中的db实例

node_acl的实质是处理user-role-resource之间的关系, 但是不直接管理他们本身


结果返回格式
{
    status: 0,
    type: 'ERROR_PARAMS',
    message: '错误详细描述'
    response: {
        totalCount: 100,
        result: []
    }
}
status:
1. 请求成功
2. 登录超时
0. 一般错误


 直接使用name作为/resource 的id

 TODAY TODO:
 规范返回格式
 规范报错内容
 查询增加分页
 增加查重接口
 完善接口聚合
 字段长度限制


 参考Monkvo
 mongoose 跨表查询
 jwt用户认证
 blog基本内容
 apicache高并发
 前后端整合
 区分admin以及client
 client不用登陆



 代码重构：
 1. global.acl 统一封装Promise
 2. controller只做函数，不做接口返回。 router做接口返回，以及catch errors
 3. web密码加密,写数据库密码再加密
 4. 初始化数据库脚本
 5. 密码错误多次，禁用账户


分层
# server 纯后端服务
controller, models, mongodb,  prototype, routes, server.js
# admin 纯前端服务
build, config, src : dev prod
# client SSR服务
build, config, src : dev server client
# dist
admin-dist
client-dist

文件上传
markdown编辑与展示

重构：
1. 封装数据校验
2. router做数据校验, 及请求返回
3. controller只做业务
4. get请求, 返回的字段做约束


