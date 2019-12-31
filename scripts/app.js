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

    this.get('#/transactions/:id', transactionController.getTransactionDetails);
    this.get('#/transactions/:id/edit', transactionController.getEdit);
});

(() => {
    app.run('#/home');
})();