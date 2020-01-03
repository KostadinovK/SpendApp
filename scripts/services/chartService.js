const chartService = function(){
    const getCategoriesData = function(categories){
        let res = [];

        for (const category of categories) {
            let data = {};
            data.name = category.Name;
            data.id = category.Id;
            data.count = 0;
            res.push(data);
        }

        return res;
    };

    const getPieChart = function(context, labels, data, options){

        if(data.length === 0){

            let parent = context.parentElement;
            let header = document.createElement('h2');
            header.textContent = 'No transactions yet';

            parent.removeChild(context);
            parent.appendChild(header);
            return;
        }

        let chartData = {
            labels,
            datasets: [{
              data,
              backgroundColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(33, 121, 92)',
                'rgb(89, 122, 92)',
                'rgb(125, 155, 88)',
                'rgb(78, 217, 111)',
                'rgb(88, 134, 200)',
                'rgb(100, 220, 155)'
              ],
              borderColor: [
                'rgb(255, 99, 132)',
                'rgb(54, 162, 235)',
                'rgb(255, 206, 86)',
                'rgb(75, 192, 192)',
                'rgb(33, 121, 92)',
                'rgb(89, 122, 92)',
                'rgb(125, 155, 88)',
                'rgb(78, 217, 111)',
                'rgb(88, 134, 200)',
                'rgb(100, 220, 155)'
              ],
              borderWidth: 1
            }]
        };

        let chart = new Chart(context, {
            type: 'pie',
            data: chartData,
            options 
        });
    };

    const getPaymentsChart = async function (userId, options, filter = null, domElementId) {

        let paymentsCategories = await paymentService.getAllPaymentCategories().then(r => r.json()).catch(err => console.log(err));

        let categoriesData = getCategoriesData(paymentsCategories);

        let payments = await paymentService.getAllByUserId(userId).then(r => r.json()).catch(err => console.log(err));

        if(filter !== null){
            payments = payments.filter(filter);
        }

        let ctx = document.getElementById(domElementId);

        for (const payment of payments) {
            for (const category of categoriesData) {
                if(payment.CategoryId === category.id){
                    category.count++;
                }
            }
        }
        
        let labels = [];
        let data = [];

        for (const category of categoriesData) {
            if(category.count > 0){
                labels.push(category.name);
                data.push(category.count);
            }
        }

        getPieChart(ctx, labels, data, options);
    }

    const getIncomesChart = async function (userId, options, filter = null, domElementId) {

        let incomesCategories = await incomeService.getAllIncomeCategories().then(r => r.json()).catch(err => console.log(err));

        let categoriesData = getCategoriesData(incomesCategories);

        let incomes = await incomeService.getAllByUserId(userId).then(r => r.json()).catch(err => console.log(err));

        if(filter !== null){
            incomes = incomes.filter(filter);
        }

        let ctx = document.getElementById(domElementId);

        for (const income of incomes) {
            for (const category of categoriesData) {
                if(income.CategoryId === category.id){
                    category.count++;
                }
            }
        }
        
        let labels = [];
        let data = [];

        for (const category of categoriesData) {
            if(category.count > 0){
                labels.push(category.name);
                data.push(category.count);
            }
        }

        getPieChart(ctx, labels, data, options);
    };

    const getBalanceChart = async function (userId) {

        let budgets = await budgetService.getUserBudgets(userId).then(resp => resp.json()).catch(err => console.log(err));

        budgets = budgets.sort((a, b) => {
            if(a.Year > b.Year){
                return 1;
            }else if(a.Year < b.Year){
                return -1;
            }else{
                if(a.Month > b.Month){
                    return 1;
                }else{
                    return -1;
                }
            }
        });

        let labels = [];
        let data = [];

        for (const budget of budgets) {
            let monthName = dateHelper.getMonthName(budget.Month);

            labels.push(`${monthName} ${budget.Year}`);
            data.push(Number(budget.BudgetAmount));
        }

        let balanceContext = document.getElementById("balance-chart");

        let balanceData = {
            labels,
            datasets: [{
                data,
                label: "Balance",
                borderColor: "rgb(76, 161, 144)",
                fill: false
            }]
        };

        let options = {
            responsive: false
        };
        
        let lineChart = new Chart(balanceContext, {
            type: 'line',
            data: balanceData,
            options
        });
    };

    return {
        getCategoriesData,
        getPieChart,
        getPaymentsChart,
        getIncomesChart,
        getBalanceChart,
    };
}();