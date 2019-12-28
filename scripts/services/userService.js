const userService = function(){

    const baseUrl = `http://${globalConstants.ApiAdress}:${globalConstants.ApiPort}/users`;

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
    }

    return {
        register
    };
}();