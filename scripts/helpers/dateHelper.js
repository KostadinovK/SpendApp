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

    const getDayFromTimestamp = function(timestamp) {
        if(timestamp === null || timestamp === ""){
            return null;
        }
        
        return timestamp.split('-')[2].split('T')[0];
    };

    const getMonthName = function(month){
        let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        
        if(month <= 0 || month == null){
            return null;
        }

        return months[month - 1];
    };

    const getMonthShortName = function(month){
        let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        
        if(month <= 0 || month == null){
            return null;
        }

        return months[month - 1];
    };

    return {
        getYearFromTimestamp,
        getMonthFromTimestamp,
        getDayFromTimestamp,
        getMonthName,
        getMonthShortName
    };
}();