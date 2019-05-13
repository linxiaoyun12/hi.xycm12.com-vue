//封装操作localstorage本地存储的方法   模块化的文件


// nodejs  基础



var storage={

    set(key,value){ //ES6写法，相当于ES5的set:function(key,value){}

        window.localStorage.setItem(key, JSON.stringify(value));
    },
    get(key){

        return JSON.parse(window.localStorage.getItem(key));
    },remove(key){
        window.localStorage.removeItem(key);
    },
    clear(){
        window.localStorage.clear();
    }

}

export default storage;


