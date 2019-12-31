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

    return {
        addBudget
    };
}();