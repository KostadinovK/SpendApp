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
                let paymentsData = {
                    labels: ['Car', 'Food', 'Home', 'Shopping'],
                    datasets: [{
                      data: [12, 19, 3, 5],
                      backgroundColor: [
                        'rgb(255, 99, 132)',
                        'rgb(54, 162, 235)',
                        'rgb(255, 206, 86)',
                        'rgb(75, 192, 192)'
                      ],
                      borderColor: [
                        'rgb(255,99,132,1)',
                        'rgb(54, 162, 235, 1)',
                        'rgb(255, 206, 86, 1)',
                        'rgb(75, 192, 192, 1)'
                      ],
                      borderWidth: 1
                    }]
                };

                let incomesData = {
                    labels: ['Salary', 'Gifts', 'Rents', 'Other'],
                    datasets: [{
                      data: [5, 9, 13, 15],
                      backgroundColor: [
                        'rgb(255, 123, 142)',
                        'rgb(154, 123, 200)',
                        'rgb(255, 222, 123)',
                        'rgb(175, 92, 192)'
                      ],
                      borderColor: [
                        'rgb(255, 123, 142)',
                        'rgb(154, 123, 200)',
                        'rgb(255, 222, 123)',
                        'rgb(175, 92, 192)'
                      ],
                      borderWidth: 1
                    }]
                };

                let options = {
                    responsive: false,
                    cutoutPercentage: 40
                };
                let paymentYearlyCtx = document.getElementById('payments-stats-yearly');
                let incomesYearlyCtx = document.getElementById('incomes-stats-yearly');

                let paymentsMonthlyCtx = document.getElementById('payments-stats-monthly');
                let incomesMonthlyCtx = document.getElementById('incomes-stats-monthly');

                let paymentsDailyCtx = document.getElementById('payments-stats-daily');
                let incomesDailyCtx = document.getElementById('incomes-stats-daily');

                let paymentsYearlyChart = new Chart(paymentYearlyCtx, {
                    type: 'pie',
                    data: paymentsData,
                    options: options 
                });

                let incomesYearlyChart = new Chart(incomesYearlyCtx, {
                    type: 'pie',
                    data: incomesData,
                    options: options 
                });

                let paymentsMonthlyChart = new Chart(paymentsMonthlyCtx, {
                    type: 'pie',
                    data: paymentsData,
                    options: options 
                });

                let incomesMonthlyChart = new Chart(incomesMonthlyCtx, {
                    type: 'pie',
                    data: incomesData,
                    options: options 
                });

                let paymentsDailyChart = new Chart(paymentsDailyCtx, {
                    type: 'pie',
                    data: paymentsData,
                    options: options 
                });

                let incomesDailyChart = new Chart(incomesDailyCtx, {
                    type: 'pie',
                    data: incomesData,
                    options: options 
                });
            });
        });
    }

    return {
        getTimeline,
        postTimeline,
        getStats
    };
}();