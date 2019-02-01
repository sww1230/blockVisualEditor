<template>
  <div class="flex flex-col">

    <div class="editorTitle flex items-center">
      <div class="flex-1">基本信息</div>
      <div @click="show = !show" class="cursor-pointer">
        <i v-if="show" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
      </div>
    </div>

    <div v-if="show">
      <div class="flex items-center mt-4">
        <div class="text-white pr-4 w80 text-right corA">项目模板</div>
        <div class="flex-1 text-yellow-dark font-bold">{{projectData.template.name}}</div>
      </div>
      <div class="flex items-center mt-4">
        <div class="text-white pr-4 w80 text-right corA">系统名称</div>
        <div class="flex-1"><el-input v-model="systemName" size="mini" placeholder="后台系统"></el-input></div>
      </div>
      <div class="flex items-center mt-4">
        <div class="text-white pr-4 w80 text-right corA">接口项目ID</div>
        <div class="flex-1"><el-input v-model="mockApi" size="mini" placeholder="38"></el-input></div>
      </div>
      <div class="flex items-center mt-4">
        <div class="text-white pr-4 w80 text-right corA">仓库地址</div>
        <div class="flex-1"><el-input v-model="git" size="mini" placeholder="https://git.xx.com/xxx.git"></el-input></div>
      </div>
      <div class="flex mt-4" v-if="projectData.template.components && projectData.template.name != '单页面无模板'">
        <div class="text-white pr-4 w80 text-right corA">菜单数据</div>
        <div class="flex-1">
          <div>
            <el-radio v-model="menuType" label="1"><span class="text-white">静态</span></el-radio>
            <el-radio v-model="menuType" label="2"><span class="text-white">动态</span></el-radio>
            <el-radio v-model="menuType" label="3"><span class="text-white">测试</span></el-radio>
          </div>
          <el-input v-if="menuType == 1" class="mt-4" v-model="menuData" size="mini" type="textarea" :rows="10" placeholder="静态数据"></el-input>
          <el-input v-if="menuType == 2" class="mt-4" v-model="menuData" size="mini" placeholder="接口地址：/menuList"></el-input>
          <el-input v-if="menuType == 3" class="mt-4" v-model="menuData" size="mini" type="textarea" :rows="10" ></el-input>
        </div>
      </div>
      <div class="flex mt-4 items-center"  v-if="projectData.template.components">
        <div class="text-white pr-4 w80 text-right corA">用户数据接口</div>
        <div class="flex-1">
          <el-input v-model="userInfo" size="mini" placeholder="接口地址：/menuList"></el-input>
        </div>
      </div>
      <div class="flex mt-4 items-center"  v-if="projectData.template.components">
        <div class="text-white pr-4 w80 text-right corA">注销接口</div>
        <div class="flex-1">
          <el-input v-model="logout" size="mini" placeholder="接口地址：/menuList"></el-input>
        </div>
      </div>
    </div>
    
  </div>
</template>

<script>
import Api from '@/api/fetch'
export default {
  name: 'app',
  props: {
    projectData: {
      type: Object,
      required: true
    },
    show: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      systemName: '商户分析系统',
      mockApi: '19',
      git: '',
      menuType: '1',
      menuData: '',
      userInfo: '/getUserInfo',
      logout: '/logout'
    }
  },
  watch: {
    menuType (val) {
      if (val == '3') {

        this.menuData = `{
          menuLink: [{
              "name": "工作台",
              "children": [{
                "name": "我的任务",
                "url": "/task"
              }, {
                "name": "我的审批",
                "url": "/approval"
              }],
            }, {
              name: '需求池',
              url: '/demand'
            }, {
              name: '项目',
              url: '/project'
            }, {
              name: '配置管理',
              url: '/config'
            }, {
              name: '团队',
              url: '/team'
            }, {
              name: '统计',
              children: [{
                name: '概览',
                url: '/overview'
              }, {
                name: '周报',
                url: '/weekly'
              }]
            }]
        }`

      } else if (val == '2') {
        this.menuData = '/getMenuList'
      }else {
        this.menuData = ''
      }
    }
  },
  methods: {
    setProjectData (data) {
      if(!this.mockApi){
         this.$message({
          message: '请输入接口项目的ID',
          type: 'warning'
        })
        return
      }
      if (!this.menuData && this.projectData.template.components && this.projectData.template.name != '单页面无模板') {
        this.$message({
          message: '请输入菜单导航数据',
          type: 'warning'
        })
        return
      }
      data.systemName = this.systemName
      data.mockApi = 'http://mock.nixin8.com/app/mock/'+this.mockApi+'/'

      let apiList = []
      Api.get('http://mock.nixin8.com/repository/get?id='+this.mockApi, {}, (data) => {
        data.data.modules.map(r=>{
          let a = []
          r.interfaces.map(c => {
            a.push({
              name: c.name,
              url: c.url, //'http://mock.nixin8.com/app/mock/'+this.mockApi+'/'+c.method+'/'+
              method: c.method
            })
          })
          apiList.push({
            name: r.name,
            children: a
          })
        })
        window.ipcSaveMockApi(apiList, this.mockApi)
      })

      data.git = this.git
      if(this.projectData.template.components){
          this.menuData && (data.menuList.menuData = (this.menuType == '1' || this.menuType == '3') ? eval('('+this.menuData.replace(/\s/g, '')+')') : {})
          
          data.api = Object.assign(data.api, {logout:this.logout})
          data.api.getMenuData = this.menuType == '2' ? this.menuData : ''

          if (this.userInfo) {
            data.api.getUserInfo = this.userInfo
            data.userInfo.userName = ''
          }
      }
      return true
    }
  }
}
</script>
