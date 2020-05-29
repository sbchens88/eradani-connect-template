/**
 * Structure for JWTUserData outputs from login process
 */
export interface JWTUserData {
    username: string;
    validUser: boolean;
    coicd: string;
    masterAgent: string;
    agentNumber: string;
}
