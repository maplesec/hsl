function authorize (permissions) {
    return function (req, res, next){
        // TODO: 增加接口权限校验
        console.log('check:' + permissions)
        if (!req.session.user_id && false) {
            res.send({
                status: 2,
                type: 'ERROR_SESSION',
                message: '没有登录',
            })
        } else {
            const user_id = req.session.user_id;
            global.acl.isAllowed(user_id, '3', 'test1', function(err, res){
                console.log(err, res);
                next()
            })
        }
    }
}
export default authorize