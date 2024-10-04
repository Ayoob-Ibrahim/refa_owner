export class authservice {
    isAuthenticatedUser() {
        let isAuthenticated: boolean = sessionStorage["token"];
        return isAuthenticated;
    }

    user_token() {
        let token = sessionStorage["token"];
        return token;
    }
}