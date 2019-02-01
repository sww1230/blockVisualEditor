
import API from './fetch'

const all = [
    {
        "name": "项目所需测试接口",
        "children": [
            {
                "name": "菜单列表",
                "url": "/getMenuList",
                "method": "POST"
            },
            {
                "name": "获取用户信息",
                "url": "/getUserInfo",
                "method": "POST"
            },
            {
                "name": "获取表格数据列表",
                "url": "/getTableList",
                "method": "POST"
            },
            {
                "name": "获取产品列表",
                "url": "/getProductList",
                "method": "POST"
            }
        ]
    }
] 

let Apis = {}
all.map(mode => {
  mode.children.map( r => {
    Apis[r.url.split('/')[r.url.split('/').length - 1]] = (params = {}, callback) => {
      API[r.method.toLowerCase()](r.url, params, callback, 19)
    }
  })
})

export default Apis
