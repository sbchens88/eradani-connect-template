import { Router } from 'express';
import validate from 'src/middlewares/validate';
import respond from 'src/middlewares/respond';
import requireAuth from 'src/middlewares/require-auth';
import * as validators from './validators';
import * as user from 'src/controllers/user';
import { oktaLogout, isAuthenticated }  from 'src/middlewares/okta-oidc';

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

    router.get(
        '/authenticatedUser',
        isAuthenticated,
        respond((req:any)=> ({'message': `Authenticated User: ${req.userContext.userinfo.name}`}))
    );

    router.get('/logout',
        oktaLogout,
        respond(()=> ({}))
    );
}
