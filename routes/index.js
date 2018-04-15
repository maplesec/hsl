'use strict';

import user from './user';
import address from './address';
import acL_resource from './acl_resource';
import acl_role from './acl_role';
import acl_user from './acl_user';

export default app => {
    app.use('/user', user);
    app.use('/address', address);
    app.use('/acL_resource', acL_resource);
    app.use('/acl_role', acl_role);
    app.use('/acl_user', acl_user);
}
