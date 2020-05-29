/**
 * Structure for RedirectResponse outputs from login process
 */
export interface RedirectResponse {
    responseIsRedirect: true;
    redirectTo: string;
}
