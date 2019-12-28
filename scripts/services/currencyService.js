const currencyService = function(){

    const baseUrl = "http://localhost:5000/currencies";

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