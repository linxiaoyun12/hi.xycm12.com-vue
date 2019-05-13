//封装操作一些常用操作的方法   模块化的文件

var use={
    query(e){
        return document.querySelector(e);
    },
    queryAll(e){
        return document.querySelectorAll(e);
    },
    createEl(e){
        return document.createElement(e);
    }
}

export default use;


