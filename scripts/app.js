const app = Sammy('#main', function(){
    this.use('Handlebars', 'hbs');

    this.get('#/home', (context) => 
    {
        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function() {
            this.partial('./views/home/cta.hbs');
        });
    });

    this.get('#/login', (context) => {
        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/user/login.hbs');
        });
    });

});

(() => {
    app.run('#/home');
})();