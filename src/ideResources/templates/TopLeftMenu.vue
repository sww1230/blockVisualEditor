<template>
  <div class="flex flex-col flex-1"  style="-webkit-app-region: drag;">

    <!--顶部内容-->
    <div class="flex menuTop">
      <!--LOGO 系统名称-->
      <div class="bg-black flex items-center pl-4 pr-4" style="width:186px;">
        <img src="@/assets/logo1.png" class="opa7 h-8">
        <div class="pl-4 f18 opa7 font-bold">{{projectData.systemName}}</div>
      </div>
      <!--一级导航-->
      <div class="flex-1 flex pl-4 pr-4">
          <div v-if="projectData.menuList.menuData && projectData.menuList.menuData.menuLink" :class="['topNav cursor-pointer',{active: i == projectData.menuList.active[0]}]" @click="row=>{projectData.menuList.submenuAcitve = ['0'];projectData.menuList.active = [i, 0]; select(i,i)}"  v-for="(row, i) in projectData.menuList.menuData.menuLink" :key="i" :index="i">{{row.name}}</div>
      </div>
      <!--用户名 注销-->
      <div class="flex items-center pl-4 pr-4">
        <div v-if="projectData.userInfo.userName" class="opa7 cursor-pointer mr-4">{{projectData.userInfo.userName}}</div>
        <a v-if="projectData.api.logout" :href="projectData.api.logout"><el-button round class="opa7 cursor-pointer" style="font-size:12px;" size="mini">注销</el-button></a>
      </div>
    </div>

    <!--左侧导航 及 页面内容区-->
    <div class="flex-1 flex">
      <!--左侧导航-->
      <div class="leftMenu" v-if="projectData.menuList.menuData && projectData.menuList.menuData.menuLink && projectData.menuList.menuData.menuLink[projectData.menuList.active[0]].children">
        <el-menu
          :default-active="projectData.menuList.submenuAcitve.toString()"
          style="border-right:none;"
          @select="select"
          background-color="#324157"
          text-color="#fff"
          active-text-color="#ffd04b">
            <div v-if="projectData.menuList.menuData && projectData.menuList.menuData.menuLink" v-for="(row, i) in projectData.menuList.menuData.menuLink[projectData.menuList.active[0]].children" :key="i">
              <div v-if="row.children">
                <el-submenu :index="i.toString()">
                  <template slot="title">
                    <i class="el-icon-location"></i>
                    <span>{{row.name}}</span>
                  </template>
                  <div v-for="(r, x) in row.children" :key="x">
                    <el-menu-item v-if="!r.children" :index="i+'-'+x">{{r.name}}</el-menu-item>
                    <el-submenu v-else :index="i+'-'+x" >
                      <template slot="title">
                        <span>{{r.name}}</span>
                      </template>
                      <div v-for="(r1, x1) in r.children" :key="x1">
                        <el-menu-item v-if="!r1.children" :index="i+'-'+x+'-'+x1">{{r1.name}}</el-menu-item>
                        <el-submenu v-else :index="i+'-'+x+'-'+x1">
                          <template slot="title">
                            <span>{{r1.name}}</span>
                          </template>
                          <el-menu-item v-for="(z1, y1) in r1.children" :key="y1" :index="i+'-'+x+'-'+x1+'-'+y1">{{z1.name}}</el-menu-item>
                        </el-submenu>
                      </div>
                    </el-submenu>
                  </div>
                </el-submenu>
              </div>
              <div v-else>
                <el-menu-item :index="i.toString()">
                  <i class="el-icon-setting"></i>
                  <span slot="title">{{row.name}}</span>
                </el-menu-item>
              </div>
            </div>
        </el-menu>
      </div>

      <!--页面内容区-->
      <div id="contentMain" class="flex-1 flex">
        <div v-if="!projectData.template" class="flex-1 flex cor9 p-4 bg-white">
          <div>内容区域：</div>
          <div>{{projectData.menuList.active[0]}}</div>
          <div>,{{projectData.menuList.submenuAcitve}}</div>
        </div>
        <router-view v-else class="flex-1 flex p-4 bg-white"></router-view>
      </div>
    </div>

  </div>
</template>

<script>
import Api from '@/api/index.js'
export default {
  name: 'topleftmenu',
  data () {
    return {
      projectData:{}
    }
  },
  components: {},
  created(){
    if(!this.projectData.template){
      this.projectData = require('../../projectInitInfo.json')
    }
  },
  mounted () {
    // /**
    //  * 没有菜单数据时，发放请求
    //  */
    if (!Object.keys(this.projectData.menuList.menuData).length && Api.getMenuList) {
      Api.getMenuList({}, (data) => {
        this.projectData.menuList.menuData = data.data
      })
    }
    /**
     * 没有用户信息时，发放请求
     */
    if (!this.projectData.userInfo.userName && Api.getUserInfo) {
      Api.getUserInfo({}, (data) => {
        this.projectData.userInfo = data.data
      })
    }
    /**
     * 初始菜单选中的状态
     */
    this.projectData.menuList.submenuAcitve = ['0']
  },
  methods: {
    /**
     * 菜单切换时，改变选中状态
     */
    select(index, indexPath) {
      let len = index.split ? index.split('-') : [0]
      var router = this.projectData.menuList.menuData.menuLink[this.projectData.menuList.active[0]]
      if(router.children) {
        for (let i = 0; i < len.length; i++) {
          router = router.children[len[i]]
        }
      }
      this.projectData.menuList.submenuAcitve = len.length === 1 ? [0] : [index]
      this.$router.push({path: router.url})
    }
  }
}
</script>