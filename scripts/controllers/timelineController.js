const timelineController = function(){

    const getTimeline = function(context){
        context.loggedIn = globalConstants.IsLoggedIn();
        
        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/timeline/timeline.hbs');
        });
    };

    const postTimeline = function(context){
        storage.deleteData('date');
        storage.saveData('date', context.params.date);
        context.redirect('#/timeline/stats');
    }

    const getTransactionsOnDay = async function(context, userId, currencyId){

        let currency = await currencyService.getCurrencyById(currencyId).then(resp => resp.json()).catch(err => console.log(err));
        let payments = await paymentService.getAllByUserId(userId).then(resp => resp.json()).catch(err => console.log(err));
        
        let incomes = await incomeService.getAllByUserId(userId).then(resp => resp.json()).catch(err => console.log(err));

        let transactions = payments.concat(incomes).sort((a, b) => {
            if(a.Date > b.Date){
                return -1;
            }else{
                return 1;
            }
        });

        transactions = transactions.filter(t => {
            let year = Number(dateHelper.getYearFromTimestamp(t.Date));
            let month = Number(dateHelper.getMonthFromTimestamp(t.Date));
            let day = Number(dateHelper.getDayFromTimestamp(t.Date));
            
            return year === context.year && month === context.month && day === context.day;
        });

        for (const transaction of transactions) {

            let day = dateHelper.getDayFromTimestamp(transaction.Date);
            let month = dateHelper.getMonthFromTimestamp(transaction.Date);
            let year = dateHelper.getYearFromTimestamp(transaction.Date);

            transaction.date = `${dateHelper.getMonthShortName(month)} ${day}, ${year}`;

            if(currency.Symbol === null || currency.Symbol === ""){
                transaction.symbol = currency.Code;
            }else{
                transaction.symbol = currency.Symbol;
            }

            if(transaction.IncomeCategory){
                transaction.icon = transaction.IncomeCategory.IconClass;
            }else{
                transaction.icon = transaction.PaymentCategory.IconClass;
            }   
        }

        context.transactions = transactions.slice(0, 20);
    }

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
    }

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
    }

    const getStats = async function(context){
        context.loggedIn = globalConstants.IsLoggedIn();

        let date = storage.getData('date');
        let userId = storage.getData('userId');
        let currencyId = storage.getData('currencyId');

        context.year = Number(dateHelper.getYearFromTimestamp(date));
        context.month = Number(dateHelper.getMonthFromTimestamp(date));
        context.monthStr = dateHelper.getMonthName(context.month);
        context.day = Number(dateHelper.getDayFromTimestamp(date));

        await getTransactionsOnDay(context, userId, currencyId);

        if(context.params.date === null || context.params.date === ''){
            context.loadPartials({
                header: './views/common/header.hbs',
                footer: './views/common/footer.hbs'
            }).then(function(){
                this.partial('./views/timeline/noDataFound.hbs');
            });
            return;
        }

        context.loadPartials({
            header: './views/common/header.hbs',
            transactions: './views/transaction/transactions.hbs',
            transaction: './views/transaction/transaction.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/timeline/stats.hbs')
            .then(function(){
                let options = {
                    responsive: false,
                    cutoutPercentage: 40
                };
                let date = storage.getData('date');

                let year = Number(dateHelper.getYearFromTimestamp(date));
                let month = Number(dateHelper.getMonthFromTimestamp(date));
                let day = Number(dateHelper.getDayFromTimestamp(date));

                let dailyFilter = t => {
                    let tYear = Number(dateHelper.getYearFromTimestamp(t.Date));
                    let tMonth = Number(dateHelper.getMonthFromTimestamp(t.Date));
                    let tDay = Number(dateHelper.getDayFromTimestamp(t.Date));
                    
                    return year === tYear && month === tMonth && day === tDay;
                };

                let monthlyFilter = t => {
                    let tYear = Number(dateHelper.getYearFromTimestamp(t.Date));
                    let tMonth = Number(dateHelper.getMonthFromTimestamp(t.Date));
                    
                    return year === tYear && month === tMonth;
                };

                let yearlyFilter = t => {
                    let tYear = Number(dateHelper.getYearFromTimestamp(t.Date));
                    
                    return year === tYear;
                };

                getPaymentsChart(userId, options, dailyFilter, 'payments-stats-daily');
                getIncomesChart(userId, options, dailyFilter, 'incomes-stats-daily');

                getPaymentsChart(userId, options, monthlyFilter, 'payments-stats-monthly');
                getIncomesChart(userId, options, monthlyFilter, 'incomes-stats-monthly');

                getPaymentsChart(userId, options, yearlyFilter, 'payments-stats-yearly');
                getIncomesChart(userId, options, yearlyFilter, 'incomes-stats-yearly');
            });
        });
    }

    return {
        getTimeline,
        postTimeline,
        getStats
    };
}();