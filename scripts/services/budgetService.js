const budgetService = function(){

    const baseUrl = `https://${globalConstants.ApiAdress}:${globalConstants.ApiPort}/budgets`;

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
    };

    const getUserBudgets = function(userId){
        const url = baseUrl + `/${userId}`;

        const headers = {
            headers: {}
        };

        return requester.get(url, headers);
    };

    const getUserLastBudget = async function(userId){
        let budgets = await getUserBudgets(userId).then(response => response.json()).catch(err => console.log(err));

        if(budgets.length === 0){
            return null;
        }

        budgets = budgets.sort((a, b) => {
            if(a.Year > b.Year){
                return -1;
            }else if(a.Year < b.Year){
                return 1;
            }else{
                if(a.Month > b.Month){
                    return -1;
                }else{
                    return 1;
                }
            }
        });

        return budgets[0];
    }

    return {
        addBudget,
        getBudgetByUserIdYearAndMonth,
        editBudget,
        getUserBudgets,
        getUserLastBudget
    };
}();