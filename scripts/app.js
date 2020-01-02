const app = Sammy('#main', function(){

    this.use('Handlebars', 'hbs');

    //Home
    this.get('#/home', homeController.getHome);

    //Dashboard
    this.get('#/dashboard', dashboardController.getDashboard);

    //Timeline
    this.get('#/timeline', timelineController.getTimeline);
    this.post('#/timeline', timelineController.getStats);

    //Login
    this.get('#/login', userController.getLogin);
    this.post('#/login', userController.postLogin);

    //Register
    this.get('#/register', userController.getRegister);
    this.post('#/register', userController.postRegister);

    //Logout
    this.get('#/logout', userController.getLogout);

    //Incomes
    this.get('#/incomes/register', incomeController.getRegister);
    this.post('#/incomes/register', incomeController.postRegister);

    //Payments
    this.get('#/payments/register', paymentController.getRegister);
    this.post('#/payments/register', paymentController.postRegister);


    this.get('#/transactions/payment/:id', transactionController.getTransactionDetails);
    this.get('#/transactions/income/:id', transactionController.getTransactionDetails);

    this.get('#/transactions/payment/:id/delete', transactionController.getDelete);
    this.get('#/transactions/income/:id/delete', transactionController.getDelete);

    this.get('#/transactions/:id/edit', transactionController.getEdit);
});

(() => {
    app.run('#/home');
})();