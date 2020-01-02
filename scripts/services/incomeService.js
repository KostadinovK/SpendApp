const incomeService = function(){

    const baseUrl = `http://${globalConstants.ApiAdress}:${globalConstants.ApiPort}`;

    const getAllIncomeCategories = function(){
        const url = baseUrl + '/incomeCategories';

        const request = {
            headers: {}
        };

        return requester.get(url, request);
    };

    const registerIncome = function(params){
        const url = baseUrl + '/incomes';
        
        const income = {
            amount: params.money,
            date: params.date,
            name: params.name,
            categoryId: params.category,
            userId: params.userId
        };

        const request = {
            headers: {},
            body: JSON.stringify(income)
        };

        return requester.post(url, request);
    };

    const getAllByUserId = function(userId){
        const url = baseUrl + `/incomes/user/${userId}`;

        const request = {
            headers: {}
        };

        return requester.get(url, request);
    };

    return {
        getAllIncomeCategories,
        registerIncome,
        getAllByUserId
    };
}();