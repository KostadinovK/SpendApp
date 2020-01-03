const currencyService = function(){

    const baseUrl = `http://${globalConstants.ApiAdress}:${globalConstants.ApiPort}/currencies`;

    const getCurrencies = function(){
        const url = baseUrl;

        const headers = {
            headers: {}
        };

        return requester.get(url, headers);
    }

    const getCurrencyById = function(currencyId){
        const url = baseUrl + `/${currencyId}`;

        const headers = {
            headers: {}
        };

        return requester.get(url, headers);
    }

    return {
        getCurrencies,
        getCurrencyById
    };
}();