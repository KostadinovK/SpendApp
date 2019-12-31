const incomeService = function(){

    const baseUrl = `http://${globalConstants.ApiAdress}:${globalConstants.ApiPort}`;

    const getAllIncomeCategories = function(){
        const url = baseUrl + '/incomeCategories';

        const request = {
            headers: {}
        };

        return requester.get(url, request);
    };

    return {
        getAllIncomeCategories
    };
}();