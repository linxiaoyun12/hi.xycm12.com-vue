<template>    
    <div id="about">    
        <h2>关于hi.xycm12.com/vue</h2>
       <p>hi.xycm12.com/vue是利用Vue.js和Element-UI框架编写的一个导航网站（Beta版），页面风格延续了hi.xycm12.com，增加了修改链接的功能。部分功能暂不支持在IE浏览器上使用。
           
       </p>
        <p>特点：</p>
        <ul>
            <li>1、响应式布局，排版适配移动端和电脑端</li>
            <li>2、支持链接编辑，修改的保存基于浏览器的本地存储中，除非手动清除数据链接会一直保持在修改后的状态</li>
            <li>3、记录最后一次使用的搜索引擎习惯</li>
            <li>4、Safari浏览器和Edge浏览器，支持保存链接到书签/收藏/主屏幕时的icon</li>
            <li>5、支持百度搜索、搜狗搜索、360搜索、必应搜索的搜索建议显示，并带有缓存机制避免重复请求</li>
        </ul>
    </div>

</template>


<script>

    export default{
        data(){
            return {               
                       
            }
        }
    }

</script>

<style lang="scss" scoped>
   
</style>