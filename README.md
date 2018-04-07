# windows配置mongodb

1. 新建 mongo.config 文件如下
`
dbpath=C:\data\db
logpath=C:\data\log\mongo.log
auth=false
`
2. 管理员启动cmd, 输入命令
`mongod.exe --config mongo.config --install --serviceName "mongo"`

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