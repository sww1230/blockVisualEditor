import axios from 'axios'
let head = {
  'X-Requested-With': 'XMLHttpRequest'
}
const $ = axios.create({
  headers: head,
  withCredentials: true
});

$.interceptors.request.use(function (config) {
  console.log('request &&', config)
  return config
}, function (error) {
  return Promise.reject(error)
});

$.interceptors.response.use(function (response) {
  console.log('response &&', response)
  return response
}, function (error) {
  return Promise.reject(error)
});

export default {
  get(url, params, callback, projectID) {
    if (process.env.NODE_ENV != 'production' && !url.includes('http')) {
      url = url + '?projectid=' + projectID
    }
    this.handler($.get(url, params), callback)
  },

  post(url, data, callback, projectID) {
    if (process.env.NODE_ENV != 'production' && !url.includes('http')) {
      url = url + '?projectid=' + projectID
    }
    this.handler($.post(url, data), callback)
  },
  handler(promiseObj, callback) {
    promiseObj.then((response) => {
      if (callback) callback(response.data);
    }).catch((e) => {
      alert('网络似乎有点问题,请稍后重试');
    })
  }
}
