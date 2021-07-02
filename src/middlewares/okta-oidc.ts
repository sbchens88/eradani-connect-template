import { ExpressOIDC } from '@okta/oidc-middleware';
import { NextFunction } from 'express';
import configService from 'config';

const config = configService.get();

export const oidc = new ExpressOIDC({
    issuer: `${config.okta.domain}/oauth2/default`,
    client_id: config.okta.client_id,
    client_secret: config.okta.client_secret,
    appBaseUrl: config.okta.appBaseUrl,
    scope: config.okta.scope,
    routes: {
        login: {
            path: config.okta.routes.login.path
        }
    }
});

export function isAuthenticated(req: any, res: any, next:NextFunction ) {
    const isAuthenticated = req.isAuthenticated && req.isAuthenticated();
    if ( isAuthenticated ) {
      return next();
    }
    else {
        res.sendStatus(401);
    }
}

// TODO: improve logout flow + bug
export function oktaLogout(req: any, res:any, next: NextFunction) {
    if (req.userContext) {
        const id_token = req.userContext.tokens.id_token;
        const to = encodeURI(config.okta.appBaseUrl);
        const params = `id_token_hint=${id_token}&post_logout_redirect_uri=${to}`;
        req.logout();
        res.redirect(`${config.okta.domain}/oauth2/default/v1/logout?${params}`);
      } else {
        res.redirect(config.okta.appBaseUrl);
    }
    return next();
}