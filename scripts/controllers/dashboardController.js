const dashboardController = function(){
    
    const getDashboard = async function(context){

        context.loadPartials({
            header: './views/common/header.hbs',
            transactions: './views/dashboard/transactions.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/dashboard/dashboard.hbs').then(function(){

                let balanceContext = document.getElementById("balance-chart");
               
                let balanceData = {
                    labels: ['January 2019','February 2019','March 2019','April 2019','May 2019','June 2019','July 2019','August 2019','September 2019','Octomber 2019', 'November 2019', 'December 2019'],
                    datasets: [{ 
                        data: [86,114,106,106,107,111,133,221,783,2478],
                        label: "Balance",
                        borderColor: "rgb(76, 161, 144)",
                        fill: false
                    }]
                };

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
                
                let lineChart = new Chart(balanceContext, {
                    type: 'line',
                    data: balanceData,
                    options: options
                });

                let paymentsCtx = document.getElementById('payments-chart');
                let incomesCtx = document.getElementById('incomes-chart');

                let paymentsChart = new Chart(paymentsCtx, {
                    type: 'pie',
                    data: paymentsData,
                    options: options 
                });

                let incomesChart = new Chart(incomesCtx, {
                    type: 'pie',
                    data: incomesData,
                    options: options 
                });
            })
        });
    }

    return {
        getDashboard
    }
}();