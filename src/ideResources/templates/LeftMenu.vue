<template>
  <div class="flex flex-1"  style="-webkit-app-region: drag;">

    <!--左侧菜单-->
    <div class="flex flex-col">
      <!--logo 系统名称-->
      <div class="flex pr-4 pl-4 h50 items-center menuTop bg-black">
        <img src="@/assets/logo1.png" class="opa7 h-8">
        <div class="pl-4 f18 opa7 font-bold">{{projectData.systemName}}</div>
      </div>
      <!--菜单列表-->
      <div class="leftMenu flex-1" v-if="projectData.menuList.menuData && projectData.menuList.menuData.menuLink && projectData.menuList.menuData.menuLink.length">
        <el-menu
          :default-active="projectData.menuList.submenuAcitve[projectData.menuList.submenuAcitve.length-1]"
          style="border-right:none;"
          @select="select"
          background-color="#324157"
          text-color="#fff"
          active-text-color="#ffd04b">
            <div v-if="projectData.menuList.menuData && projectData.menuList.menuData.menuLink" v-for="(row, i) in projectData.menuList.menuData.menuLink" :key="i">
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
    </div>

    <!--右侧主内容区-->
    <div class="flex-1 flex flex-col">
      <!--右侧顶部栏 用户名 注销-->
      <div class="flex pr-4 pl-4 h50 items-center bg-white" style="border-bottom:1px solid #ddd;">
        <div class="flex-1"></div>
        <div v-if="projectData.userInfo.userName" class="opa7 cursor-pointer mr-4">{{projectData.userInfo.userName}}</div>
        <a v-if="projectData.api.logout" :href="projectData.api.logout"><el-button round class="opa7 cursor-pointer" style="font-size:12px;" size="mini">注销</el-button></a>
      </div>
      <!--页面内容区-->
      <div id="contentMain" ref="contentMain" class="flex-1 flex">
        <div v-if="!projectData.template" class="flex-1 flex cor9 p-4 bg-white">
          <div>内容区域：</div>
          <div>{{projectData.menuList.submenuAcitve}}</div>
        </div>
        <router-view  v-else class="flex-1 flex p-4 bg-white"></router-view>
      </div>
    </div>

  </div>
</template>

<script>
import Api from '@/api/index.js'
export default {
  name: 'leftmenu',
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
    // if (!Object.keys(this.projectData.menuList.menuData).length && Api) {
    if (Api.getMenuList && !Object.keys(this.projectData.menuList.menuData).length) {
      Api.getMenuList({}, (data) => {
        this.projectData.menuList.menuData = data.data
      })
    }
    /**
     * 没有用户信息时，发放请求
     */
    // if (!this.projectData.userInfo.userName && Api) {
    if (Api.getUserInfo && !this.projectData.userInfo.userName) {
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
      let len = index.split('-')
      var router = this.projectData.menuList.menuData.menuLink
      for (let i = 0; i < len.length; i++) {
        router = i ? router.children[len[i]] : router[len[i]]
      }
      this.projectData.menuList.submenuAcitve = indexPath
      this.$router.push({path: router.url})
    }
  }
}
</script>

<style>



</style>
