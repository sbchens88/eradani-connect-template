import { Router } from 'express';
import validate from '../../middlewares/validate';
import respond from '../../middlewares/respond';
import requireAuth from '../../middlewares/require-auth';
import * as validators from './validators';
import * as user from '../../controllers/user';

export default function mountAuth(router: Router) {
    router.post(
        '/',
        validate(validators.login),
        respond((req: any) => user.login(req.body.username, req.body.password))
    );

    router.post(
        '/verify-jwt',
        requireAuth,
        respond(() => ({ valid: true }))
    );
}
