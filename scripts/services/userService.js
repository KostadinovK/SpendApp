const userService = function(){

    const baseUrl = `https://${globalConstants.ApiAdress}:${globalConstants.ApiPort}/users`;

    const register = function(params){
        const url = baseUrl;

        let user = {
            username: params.username,
            password: params.password,
            confirmPassword: params.confirmPassword,
            budget: params.budget,
            currency: params.currency
        };

        const request = {
            headers: {},
            body: JSON.stringify(user)
        };

        return requester.post(url, request);
    };

    const login = function(params){
        const url = baseUrl + '/login';

        let user = {
            username: params.username,
            password: params.password,
        };

        const request = {
            headers: {},
            body: JSON.stringify(user)
        };

        return requester.post(url, request);
    }

    const logout = function(){
        const url = baseUrl + '/logout';

        const request = {
            headers: {}
        };

        return requester.get(url, request);
    }

    return {
        register,
        login,
        logout
    };
}();