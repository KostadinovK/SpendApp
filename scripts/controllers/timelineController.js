const timelineController = function(){

    let getTimeline = function(context){
        context.loadPartials({
            header: './views/common/header.hbs',
            footer: './views/common/footer.hbs'
        }).then(function(){
            this.partial('./views/timeline/timeline.hbs');
        });
    }

    return {
        getTimeline
    };
}();