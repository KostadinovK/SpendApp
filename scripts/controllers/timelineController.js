const timelineController = function(){

    let getTimeline = function(context){
        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/timeline/timeline.hbs');
        });
    };

    let getStats = function(context){
        context.loadPartials({
            header: './views/common/header.hbs',
            transactions: './views/transaction/transactions.hbs',
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
                
                let paymentsMonthlyCtx = document.getElementById('payments-stats-monthly');
                let incomesMonthlyCtx = document.getElementById('incomes-stats-monthly');

                let paymentsDailyCtx = document.getElementById('payments-stats-daily');
                let incomesDailyCtx = document.getElementById('incomes-stats-daily');

                //let diffCtx = document.getElementById('incomes-payments-diff');
                

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

                let paymentsYearlyChart = new Chart(paymentsDailyCtx, {
                    type: 'pie',
                    data: paymentsData,
                    options: options 
                });

                let incomesYearlyChart = new Chart(incomesDailyCtx, {
                    type: 'pie',
                    data: incomesData,
                    options: options 
                });
            });
        });
    }

    return {
        getTimeline,
        getStats
    };
}();