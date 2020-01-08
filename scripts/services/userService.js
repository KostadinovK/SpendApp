const userService = function(){

    const baseUrl = `http://${globalConstants.ApiAdress}:${globalConstants.ApiPort}/users`;

    const register = function(params){
        const url = baseUrl;

        let user = {
            username: params.username,
            password: params.password,
            confirmPassword: params.confirmPassword,
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

    const getUser = function(userId){
        const url = baseUrl + '/' + userId;

        const request = {
            headers: {}
        };

        return requester.get(url, request);
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
        getUser,
        logout
    };
}();