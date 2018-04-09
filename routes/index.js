'use strict';

import user from './user';
import address from './address';

export default app => {
    app.use('/user', user);
    app.use('/address', address);
}
