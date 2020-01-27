const homeController = function() {
    
    const getHome = function(context){
        let loggedIn = globalConstants.IsLoggedIn();

        if(loggedIn){
            context.redirect('#/dashboard');
            return;
        }

        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function() {
            this.partial('./views/home/cta.hbs');
        });
    }

    return {
        getHome
    };
}();