const budgetService = function(){

    const baseUrl = `http://${globalConstants.ApiAdress}:${globalConstants.ApiPort}/budgets`;

    const addBudget = function(userId, amount, year, month){
        const url = baseUrl;

        const budget = {
            userId,
            budgetAmount: amount,
            year,
            month
        };

        const headers = {
            headers: {},
            body: JSON.stringify(budget)
        };

        return requester.post(url, headers);
    }

    const getBudgetByUserIdYearAndMonth = function(userId, year, month){
        const url = baseUrl + `/${userId}/${year}/${month}`;

        const headers = {
            headers: {}
        };

        return requester.get(url, headers);
    }

    const editBudget = function(userId, amount, year, month){
        const url = baseUrl + `/${userId}/${year}/${month}`;
        
        const budget = {
            userId,
            budgetAmount: amount,
            year,
            month
        };
        
        const headers = {
            headers: {},
            body: JSON.stringify(budget)
        };

        return requester.put(url, headers);
    }

    return {
        addBudget,
        getBudgetByUserIdYearAndMonth,
        editBudget
    };
}();