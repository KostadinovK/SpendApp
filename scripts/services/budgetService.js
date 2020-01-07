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

    const getUserLastBudgetBeforeDate = async function(userId, year, month){
        let budgets = await getUserBudgets(userId).then(response => response.json()).catch(err => console.log(err));

        budgets = budgets.filter(b => {
            if(b.Year < year) return true;
            if(b.Year === year && b.Month < month) return true;
            return false;
        });

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

    const getAllBudgetsForEdit = async function (userId, year, month) {
        let budget = await budgetService.getBudgetByUserIdYearAndMonth(userId, year, month).then(response => response.json()).catch(err => console.log(err));

        let startYear;
        let startMonth;
        if (budget.error) {
            let lastBudget = await budgetService.getUserLastBudgetBeforeDate(userId, year, month);

            if (lastBudget === null) {
                await budgetService.addBudget(userId, 0, year, month).then(response => response.json()).catch(error => console.log(error));

            } else {
                await budgetService.addBudget(userId, Number(lastBudget.BudgetAmount), year, month).then(response => response.json()).catch(error => console.log(error));
            }

            startYear = year;
            startMonth = month;

        } else {
            startYear = budget.Year;
            startMonth = budget.Month;
        }

        let startDate = new Date(startYear, startMonth - 1);

        let budgets = await budgetService.getUserBudgets(userId).then(response => response.json()).catch(err => console.log(err));

        budgets = budgets.filter(b => {
            let budgetDate = new Date(b.Year, b.Month - 1);

            return budgetDate.getTime() >= startDate.getTime();
        });

        return budgets;
    }

    return {
        addBudget,
        getBudgetByUserIdYearAndMonth,
        editBudget,
        getUserBudgets,
        getUserLastBudget,
        getUserLastBudgetBeforeDate,
        getAllBudgetsForEdit
    };
}();