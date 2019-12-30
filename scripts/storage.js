const storage = function(){
    const saveData  = function(key, value){
        localStorage.setItem(key, JSON.stringify(value));
    }

    const getData = function(key){
        return localStorage.getItem(key);
    }

    const deleteData = function(key){
        localStorage.removeItem(key);
    }


    return {
        saveData,
        getData,
        deleteData,
    };
}();