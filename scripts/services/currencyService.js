const currencyService = function(){

    const baseUrl = `http://${globalConstants.ApiAdress}:${globalConstants.ApiPort}/currencies`;

    const getCurrencies = function(){

        const headers = {
            headers: {}
        };

        return requester.get(baseUrl, headers);
    }

    return {
        getCurrencies
    };
}();