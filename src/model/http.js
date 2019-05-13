/** * 此文件对axios 于 json请求服务器进行了封装 
 * https://github.com/axios/axios 
 * * https://github.com/webmodules/jsonp */


import axios from 'axios';
import JSONP from 'jsonp';
import qs from 'qs';

let my_axios_fn = axios.create({
	baseURL: "",
	headers: {
		'Content-Type': 'application/x-www-form-urlencoded; '
	},
	withCredentials: false
});



//  axios二次封装(使用方法与axios的对象调用模式一致)
//  @param obj
//  @returns {Promise}


export function my_axios(obj) {
	let ajax_url = obj['url'];
	let ajax_method = obj['method'];
	let ajax_data = obj['data'] ? obj['data'] : '';
	if (typeof ajax_data != 'string') {
		ajax_data = form_json(obj['data']);
	}
	if (ajax_url && ajax_method) {
		return new Promise((resolve, reject) => {
			my_axios_fn({
				url: ajax_url,
				method: ajax_method,
				data: qs.stringify(ajax_data)
			}).then((res) => {
				let self = this;
				let data = res.data;
				if (data.status) {
					resolve(data);
				} else {
					reject.call(self, data)
				}
			}).catch(function(err) {
				console.error('触发了.catch()请查找原因', err);
			})
		})
	} else {
		console.error("url和method参数为必填项");
	}
}
/** * 对JSONP进行二次封装 * 
 * url  =>  www.xxx.com 
 * data =>  键值对 
 * option => 
 * */


export function jsonp(url, data, option) {
	//  url中可能出现没有?的情况
	  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
	//   console.info('jsonp', url);
	//  使用promise方法进行回调
	  return new Promise((resolve, reject) => {
		//JSONP 的官方说明https://github.com/webmodules/jsonp
		JSONP(url, option, (err, data) => {
		  if (!err) {
			resolve(data)
		  } else {
			reject(err)
		  }
		})
	  })
	}


// POST数据序列化 
// @param json 
// @returns {Array} 

export function form_json(json) {
	if (json) {
		let attr = [];
		for (let item of Object.entries(json)) {
			if (item[1]) {
				attr.push(item.join("="));
			}
		}
		attr = attr.join("&");
		return attr;
	}
} 
// 拼接url方法
// @param data * @returns {string}
export function param(data) {
	let url = '';
	for (var k in data) {
		let value = data[k] !== undefined ? data[k] : '';
		url += '&' + k + '=' + encodeURIComponent(value);
	}
	return url ? url.substring(1) : '';
}

