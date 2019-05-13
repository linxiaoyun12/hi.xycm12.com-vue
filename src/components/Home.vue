<template>
  <el-container>
    <el-row :gutter="0">
      <!-- :xs 移动端竖屏 :sm移动端横屏（对于iphone6横屏不起作用），ipad竖屏 :md在ipad横屏时 -->
      <div class="logo">Xy导航</div>
      <el-button
        class="success"
        type="success"
        icon="el-icon-check"
        circle
        @click="visible = false"
        v-if="visible"
      ></el-button>
      <div class="menu">
        <el-dropdown trigger="click">
          <span class="el-dropdown-link">
            <i class="el-icon-more"></i>
          </span>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-edit-outline">
              <span @click="linkEdit()">更改链接</span>
            </el-dropdown-item>
            <el-dropdown-item icon="el-icon-refresh">
              <span @click="open({key:'resetData'})">重设为默认</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </el-row>

    <v-search></v-search>

    <!-- 工具类 -->
    <template v-for="(item,key) in linkInfo">
      <div class="tools" v-if="item.cate_gory === '工具类'">
        <div v-for="(list,key2) in item.link_list" :key="key2" class="link1">
          <!-- 修改按钮 -->
          <span
            class="change_button el-icon-edit"
            @click="editDialogVisible = true,changeLink(key,key2)"
            v-if="visible && list.dis"
          ></span>
          <!-- 删除按钮 -->
          <span
            class="delete_button el-icon-delete"
            @click="open({key,key2})"
            v-if="visible && list.dis"
          ></span>
          <a
            :href="list.url"
            :title="list.title"
            target="_blank"
            rel="noopener noreferrer nofollow"
          >
            <span class="link_name">{{list.name}}</span>
          </a>
          <!-- 添加按钮 -->
          <span
            class="el-icon-circle-plus add_link"
            v-if="!list.dis"
            @click="editDialogVisible = true,addLink(key,key2)"
          ></span>
        </div>
      </div>
    </template>
    <!-- 非工具类 -->
    <el-row :gutter="10">
      <template v-for="(item,key) in linkInfo">
        <el-col v-if="item.cate_gory !== '工具类'" :xs="24" :sm="12" :md="8" :lg="8" class="link2_box">
          <el-card class="box-card">
            <div slot="header" class="clearfix">
              <span>{{item.cate_gory}}</span>
            </div>
            <div v-for="(list,key2) in item.link_list" class="link2">
              <!-- 修改按钮 -->
              <span
                class="change_button el-icon-edit"
                @click="editDialogVisible = true,changeLink(key,key2)"
                v-if="visible && list.dis"
              ></span>
              <!-- 删除按钮 -->
              <span
                class="delete_button el-icon-delete"
                @click="open({key,key2})"
                v-if="visible && list.dis"
              ></span>
              <a
                :href="list.url"
                :title="list.title"
                target="_blank"
                rel="noopener noreferrer nofollow"
              >
                <span class="link_name">{{list.name}}</span>
              </a>
              <!-- 添加按钮 -->
              <span
                class="el-icon-circle-plus add_link"
                v-if="!list.dis"
                @click="editDialogVisible = true,addLink(key,key2)"
              ></span>
            </div>
          </el-card>
        </el-col>
      </template>
    </el-row>
    <!-- 修改链接弹窗 -->

    <el-dialog
      title="提示"
      :visible.sync="editDialogVisible"
      :before-close="handleClose"
      class="edit_dialog"
    >
      <span v-if="tempInfo.dis">当前修改（{{tempInfo.name}}）</span>
      <!-- <span v-if="!tempInfo.dis">填写</span> -->
      <div class="el-input el-input-group el-input-group--prepend">
        <div class="el-input-group__prepend">名称</div>
        <input
          class="el-input__inner"
          type="text"
          placeholder="链接文字"
          :value="tempInfo.name"
          id="input_link_name"
        >
      </div>

      <div class="el-input el-input-group el-input-group--prepend">
        <div class="el-input-group__prepend">网址</div>
        <input
          class="el-input__inner"
          type="text"
          placeholder="网址，如 https://www.baidu.com"
          :value="tempInfo.url"
          id="input_link_url"
        >
      </div>

      <div class="el-input el-input-group el-input-group--prepend">
        <div class="el-input-group__prepend">标题</div>
        <input
          class="el-input__inner"
          type="text"
          placeholder="鼠标悬浮显示的文字"
          :value="tempInfo.title"
          id="input_link_title"
        >
      </div>

      <div class="el-input el-input-group el-input-group--prepend">
        <div class="el-input-group__prepend">备注</div>
        <input
          type="text"
          autocomplete="off"
          placeholder="备注文字"
          :value="tempInfo.note"
          id="input_link_note"
          class="el-input__inner"
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <!-- 取消操作 -->
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <!-- 确认操作 -->
        <el-button type="primary" @click="editDialogVisible = false,saveList(stepOne,stepTwo)">确 定</el-button>
      </span>
    </el-dialog>

    <el-footer>
      <p>
        如有问题请发邮件到&nbsp;xycm12@hotmail.com (
        <router-link to="/about">关于本站</router-link>)
      </p>
    </el-footer>
  </el-container>
</template>

<script>
import Search from "@/components/Search.vue";
import storage from "@/model/storage.js";
import use from "@/model/query.js";
import data from "@/model/data.js";


export default {
  name: "App",
  data() {
    return {
      visible: false, //编辑状态
      tempInfo: "", //修改链接时的临时数据
      stepOne: "", //要修改的key
      stepTwo: "", ////要修改的key2
      editDialogVisible: false, //修改链接弹窗状态
      linkInfo: data //预制链接数据
    };
  },
  methods: {
    addLink: function(key, key2) {
      //添加链接
      this.temp();
      this.stepOne = key;
      this.stepTwo = key2;
    },
    temp: function() {
      //初始化tempInfo
      const item = {
        name: "",
        url: "",
        note: "",
        title: "",
        dis: false,
        link0_index: ""
      };
      this.tempInfo = item;
    },
    deleteLink: function(key, key2, link_index) {
      //删除数据
      let item = {
        name: "",
        url: "",
        note: "",
        title: "",
        dis: false,
        link0_index: link_index //暂未使用
      };
      this.linkInfo[key].link_list.splice(key2, 1, item); //替换为空数据，非真正删除
      this.saveLink();
    },
    saveLink: function() {
      //更新本地存储
      //这里需要修改成只更新有改变的数据
      storage.set("local_linkInfo", this.linkInfo);
    },
    changeLink: function(key, key2) {
      //点击修改按钮
      this.tempInfo = this.linkInfo[key].link_list[key2];
      this.stepOne = key;
      this.stepTwo = key2;
    },
    saveList(key, key2) {
      //确认保存，仅在点击确认后修改临时数据和实际数据
      if (use.query("#input_link_name").value != "") {
        this.tempInfo.name = use.query("#input_link_name").value;
        this.tempInfo.url = use.query("#input_link_url").value;
        this.tempInfo.note = use.query("#input_link_note").value;
        this.tempInfo.title = use.query("#input_link_title").value;
        this.tempInfo.dis = true;
        this.linkInfo[key].link_list.splice(key2, 1, this.tempInfo);
        this.saveLink();
        this.temp();
      }
    },
    handleClose(done) {
      // 询问是否关闭弹窗
      this.$confirm("确认关闭？")
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
    resetData() {
      // 重设链接的默认数据
      storage.remove("first");
      storage.remove("active");
      window.location.reload();
    },
    linkEdit() {
      this.visible = true;
    },
    open(e) {
      //确认操作
      this.$confirm("确认要操作吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          e.key == "resetData"
            ? this.resetData()
            : this.deleteLink(e.key, e.key2);
          // if (e.key == "resetData") {
          // 	//判断是否是恢复默认操作
          // 	this.resetData();
          // } else {
          // 	this.deleteLink(e.key, e.key2);
          // }
          //暂未验证实际操作是否成功
          this.$message({
            //推出消息
            type: "success",
            message: "操作已执行!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "操作已取消"
          });
        });
    }
  },
  mounted() {
    /*生命周期函数,vue页面刷新就会触发的方法*/
    if (storage.get("first") == null) {
      // 初次访问
      //暂时设计的是初次访问时将所有的链接保存至本地存储，这个设计比较糟糕，
      //改进方向是仅保存更改的项目（比较懒这部分先这样子吧），更合理的设计是这类数据保存在服务器端。
      this.saveLink();
      storage.set("first", 1);
    } else {
      // 非初次访问
      const temp = storage.get("local_linkInfo");
      //当需要更改链接时需要先判断再处理，比较麻烦
      if (temp[2].link_list[8].url === "https://www.xinhuanet.com") {
        temp[2].link_list[8].url = "http://www.xinhuanet.com";
        this.linkInfo = temp;
        this.saveLink();
      } else {
        // 正常读取
        const temp = storage.get("local_linkInfo");
        this.linkInfo = temp;
      }
    }

  },
  components: {
    //绑定Search组件
    'v-search': Search
  }
};
</script>

<style lang="scss">
a {
  display: block;
  width: 100%;
  height: 100%;
  color: #000;
  text-decoration: none;
  font-size: 16px;
}

li {
  list-style-type: none;
}

// 弹窗
.el-dialog {
  width: 50%;
}

.el-message-box {
  width: 30%;
}

.edit_dialog .el-input {
  padding-top: 10px;
}

.el-dialog__body {
  //弹窗内的外元素控制
  padding: 0px 25px;
}

//小于767px
@media screen and (max-width: 767px) {
  .el-dialog {
    width: 90%;
  }

  .el-message-box {
    width: 70%;
  }
  .suggestion {
    position: absolute;
    top: 100px;
    z-index: 10;
    background-color: #fff;
    width: 100%;
    border-bottom: 1px solid #b8b8b8;
  }
  .suggestion div {
    border-top: 1px solid #b8b8b8;
    line-height: 35px;
    padding-left: 17px;
    cursor: pointer;
  }
}

// 大于767px
@media screen and (min-width: 767px) {
  #app {
    width: 92%;
    margin: 0 auto;
  }

  .el-dialog {
    width: 40%;
  }

  .el-message-box {
    width: 30%;
  }
  .suggestion {
    position: absolute;
    top: 94px;
    z-index: 10;
    background-color: #fff;
    width: -webkit-calc(100% - 92px);
    width: -moz-calc(100% - 89px);
    width: calc(100% - 92px);
    border-right: 1px solid #b8b8b8;
    border-bottom: 1px solid #b8b8b8;
    border-left: 1px solid #b8b8b8;
    border-radius: 3px 0 0 0;
  }
  // 搜索建议被选中的颜色
  .suggestion div {
    line-height: 28px;
    padding-left: 17px;
    cursor: pointer;
  }
  .suggestion div:hover {
    background-color: #d3d3d3;
  }
}

// logo
.logo {
  display: inline-block;
  width: 150px;
  height: 30px;
  line-height: 30px;
}

//右侧菜单按钮
.menu {
  display: inline-block;
  height: 30px;
  line-height: 30px;
  position: absolute;
  right: 0px;

  i {
    font-size: 22px;
    line-height: 30px;
  }
}

// 修改和删除按钮
.change_button {
  padding-right: 17px;
}

.cl {
  clear: left;
}

.el-tabs__nav-wrap {
  padding-left: 6px;
}

// 工具类
.link1 {
  width: 16.6%;
  text-align: center;
  // height: 35px;
  // line-height: 35px;
  display: inline-block;
}

.tools .link1 {
  margin-bottom: 20px;
}

.tools .el-row {
  padding-bottom: 18px;
}

// 非工具类
.el-row .link2_box {
  float: none;
  display: inline-block;
}

.link2 {
  display: inline-block;
  width: 33.3%;
  text-align: center;
  // height: 35px;
  // line-height: 35px;
  padding: 5px 0;
  overflow: hidden;
}

// 添加链接按钮
.add_link {
  font-size: 16px;
}

// 栅格
.el-row {
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}

//卡片
.text {
  font-size: 14px;
}

.item {
  margin-bottom: 18px;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}

.el-card__header {
  padding: 10px 15px;
}

.box-card {
  margin-bottom: 15px;
}

//完成图标
.success {
  font-size: 10px;
  position: fixed;
  top: 6px;
  left: calc(50% - 18px);
  z-index: 10;
}

/*底栏*/
.el-footer {
  border-top: 2px solid #bdd2c9;
  a {
    display: inline;
  }
  p {
    text-align: center;
    font-size: 15px;
  }
}
body {
  padding-bottom: env(safe-area-inset-bottom);
  -webkit-text-size-adjust: 100%;
}
.suggestion {
  font-size: 14px;
}
</style>
