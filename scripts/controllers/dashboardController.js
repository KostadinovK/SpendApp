const dashboardController = function(){
    
    const getDashboard = function(context){
        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/dashboard/dashboard.hbs')
        });
    }

    return {
        getDashboard
    }
}();