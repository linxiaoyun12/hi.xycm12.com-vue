<template>
  <el-row :gutter="0">
    <el-tabs v-model="activeName">
      <el-tab-pane label="百度" name="first" class="123">
        <el-input
          placeholder="百度一下"
          v-model="searchInput"
          @keyup.enter.native="search('baidu',searchInput)"
          id="input_search"
          @input="selectSuggestions('baidu',searchInput)"
          @keydown.down.native="changeDown();"
          @keydown.up.native="changeUp();"
          @focus="suggestions.dis = true,suggestions.from = 'baidu'"
          @blur="suggestions.dis = false"
        >
          <el-button slot="append" icon="el-icon-search" @click="search('baidu',searchInput)">搜索</el-button>
        </el-input>
      </el-tab-pane>
      <el-tab-pane label="搜狗" name="second">
        <el-input
          placeholder="搜狗搜索"
          v-model="searchInput"
          @keyup.enter.native="search('sogou',searchInput)"
          @input="selectSuggestions('sogou',searchInput)"
          @keydown.down.native="changeDown();"
          @keydown.up.native="changeUp();"
          @focus="suggestions.dis = true,suggestions.from = 'sogou'"
          @blur="suggestions.dis = false"
        >
          <el-button slot="append" icon="el-icon-search" @click="search('sogou',searchInput)">搜索</el-button>
        </el-input>
      </el-tab-pane>
      <el-tab-pane label="360搜索" name="third">
        <el-input
          placeholder="360搜索"
          v-model="searchInput"
          @keyup.enter.native="search('qh360',searchInput)"
          @input="selectSuggestions('qh360',searchInput)"
          @keydown.down.native="changeDown();"
          @keydown.up.native="changeUp();"
          @focus="suggestions.dis = true,suggestions.from = 'qh360'"
          @blur="suggestions.dis = false"
        >
          <el-button slot="append" icon="el-icon-search" @click="search('qh360',searchInput)">搜索</el-button>
        </el-input>
      </el-tab-pane>
      <el-tab-pane label="Bing" name="fourth">
        <el-input
          placeholder="必应搜索"
          v-model="searchInput"
          @keyup.enter.native="search('bing',searchInput)"
          @input="selectSuggestions('bing',searchInput)"
          @keydown.down.native="changeDown();"
          @keydown.up.native="changeUp();"
          @focus="suggestions.dis = true,suggestions.from = 'bing'"
          @blur="suggestions.dis = false"
        >
          <el-button slot="append" icon="el-icon-search" @click="search('bing',searchInput)">搜索</el-button>
        </el-input>
      </el-tab-pane>
      <el-tab-pane label="Google" name="fifth">
        <el-input
          placeholder="谷歌搜索"
          v-model="searchInput"
          @keyup.enter.native="search('google',searchInput)"
        >
          <el-button slot="append" icon="el-icon-search" @click="search('google',searchInput)">搜索</el-button>
        </el-input>
      </el-tab-pane>
    </el-tabs>
    <div class="suggestion" v-if="suggestions.data.length != 0 && suggestions.dis">
      <template v-for="item,key in suggestions.data">
        <div @mousedown="search(suggestions.from,item)">{{item}}</div>
      </template>
    </div>
  </el-row>
</template>

<script>
import storage from "@/model/storage.js";
import { my_axios, jsonp } from "@/model/http.js";

export default {
  data() {
    return {
      searchInput: "", //搜索内容暂存
      suggestions: { dis: false, data: [] }, //搜索建议暂存
      index: -1, //被上下方向键选中的搜索建议项目
      activeName: "first", //活动tag
      catchSuggestions: {
        baidu: [
          //   {
          //       keyword:'', //每条来源于用户输入过的关键词，先判断是否存在再save
          //       suggestions:[] //用来存储对应的搜索建议数组
          //   }
        ],
        sogou: [],
        qh360: [],
        bing: []
      }
    };
  },
  methods: {
    search(e, text) {
      //搜索处理
      var searchText = encodeURIComponent(text);
      if (e === "baidu") {
        this.saveActive("first");
        window.open("https://www.baidu.com/s?wd=" + searchText);
      } else if (e === "sogou") {
        this.saveActive("second");
        window.open("https://www.sogou.com/web?query=" + searchText);
      } else if (e === "qh360") {
        this.saveActive("third");
        window.open(
          "https://www.so.com/s?ie=utf-8&fr=none&src=360sou_newhome&q=" +
            searchText
        );
      } else if (e === "bing") {
        this.saveActive("fourth");
        window.open("https://www4.bing.com/search?q=" + searchText);
      } else if (e === "google") {
        this.saveActive("fifth");
        window.open("https://www.google.com/search?q=" + searchText);
      }
    },
    saveActive(name) {
      // 维持用户最后一次使用的搜索框活动
      storage.set("active", name);
    },
    getSuggestion(searchType, strdomin) {
      // 获取搜索建议
      if (searchType === "baidu") {
        const api = "https://sp0.baidu.com/5a1Fazu8AA54nxGko9WTAnF6hhy/su";
        const qsData = { wd: strdomin, p: "3" };
        jsonp(api, qsData, { param: "cb" })
          .then(response => {
            this.suggestions = { dis: true, from: "baidu", data: response.s };
            this.catchSuggestionsList(searchType, response.s); //缓存关键词及对应关键词数组
          })
          .catch(error => {
            console.log(error);
          });
      } else if (searchType === "qh360") {
        const api = "https://sug.so.360.cn/suggest";
        const qsData = { word: strdomin, encodeout: "utf-8", fields: "word" };
        jsonp(api, qsData)
          .then(response => {
            this.suggestions = { dis: true, from: "qh360", data: response.s };
            this.catchSuggestionsList(searchType, response.s); //缓存关键词及对应关键词数组
          })
          .catch(error => {
            console.log(error);
          });
      } else if (searchType === "sogou") {
        const api = "https://www.sogou.com/suggnew/ajajjson";
        const qsData = { key: strdomin, type: "web" };
        jsonp(api, qsData, { timeout: 0 })
          .then(response => {
            //搜狗的搜索建议接口好像必须使用window.sogou.sug作为回调函数
          })
          .catch(error => {
            console.log(error);
          });
        window.sogou = {
          sug: response => {
            this.suggestions = { dis: true, from: "sogou", data: response[1] };
            this.catchSuggestionsList(searchType, response[1]); //缓存关键词及对应关键词数组
          }
        };
      } else if (searchType === "bing") {
        const api = "https://api.bing.com/qsonhs.aspx";
        const qsData = { q: strdomin, type: "cb" };
        //JSONP 的说明https://github.com/webmodules/jsonp
        jsonp(api, qsData, { param: "cb" })
          .then(response => {
            let res = [];
            const resArray =
              response.AS.Results === undefined
                ? []
                : response.AS.Results[0].Suggests;
            for (let item of resArray) {
              res.push(item.Txt);
            }
            this.suggestions = { dis: true, from: "bing", data: res };
            this.catchSuggestionsList(searchType, res); //缓存关键词及对应关键词数组
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    changeDown() {
      //按下下方向键
      this.index++;
      if (this.index >= this.suggestions.data.length) {
        this.index = 0;
      }
      this.searchInput = this.suggestions.data[this.index];
      // console.log(this.index)
    },
    changeUp() {
      // 按下上方向键
      this.index--;
      if (this.index == -1) {
        this.index = this.suggestions.data.length - 1;
      }
      this.searchInput = this.suggestions.data[this.index];
      // console.log(this.index)
    },
    selectSuggestions(searchType, strdomin) {
      if (strdomin === "") {
        this.suggestions.data = [];
        return;
      }
      //获取缓存的from对应数组，其中保存的对象解构是{keyword:'',suggestions:[]}
      const result = this.catchSuggestions[searchType].some(
        (item, index, array) => {
          //ES6数组some的方法
          if (item.keyword === strdomin) {
            //关键词存在时获取缓存
            this.suggestions = {
              dis: true,
              from: searchType,
              data: array[index].suggestions
            };
            return true;
          }
        }
      );
      if (!result) {
        //缓存不存在，请求接口并缓存
        this.getSuggestion(searchType, strdomin);
      }
    },
    catchSuggestionsList(from, suggestionArray) {
      //缓存搜索建议条目
      let data = { keyword: this.searchInput, suggestions: suggestionArray };
      this.catchSuggestions[from].push(data);
    }
  },
  mounted() {
    if (storage.get("active") !== null) {
      //获取上次使用的搜索tag
      this.activeName = storage.get("active");
    }
    else{
      this.activeName = "first";
      storage.set("active","first");
    }
  },
  watch: {
    // searchInput: function(val, oldVal) {
    //   console.log("new: %s, old: %s", val, oldVal);
    // }
  }
};
</script>

<style lang="scss">
</style>