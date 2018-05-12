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
db.createUser({user:"test",pwd:"test",roles:[{role:"dbOwnder",db:"test"}]})
use admin
db.system.users.find()
`

# 开启认证
mongo.config 中auth设置为true


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