const dateHelper = function(){
    const getYearFromTimestamp = function(timestamp) {
        if(timestamp === null || timestamp === ""){
            return null;
        }

        return timestamp.split('-')[0];
    };

    const getMonthFromTimestamp = function(timestamp) {
        if(timestamp === null || timestamp === ""){
            return null;
        }
        
        return timestamp.split('-')[1];
    };

    return {
        getYearFromTimestamp,
        getMonthFromTimestamp
    };
}();