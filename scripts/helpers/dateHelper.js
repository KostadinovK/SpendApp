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

    const getMonthName = function(month){
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        if(month <= 0 || month == null){
            return null;
        }

        return months[month - 1];
    };

    return {
        getYearFromTimestamp,
        getMonthFromTimestamp,
        getMonthName
    };
}();