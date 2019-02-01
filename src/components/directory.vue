<template>
  <div class="directory bg-grey-darkest fixed pin  flex flex-col" 
    v-loading="loading"
    element-loading-text="等待中，请稍候..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">
    <div class="flex-1"  style="-webkit-app-region: drag;">
      <p class="bg-black  pt-8 pl-8 pb-3 text-grey-darker border-b border-t-0 border-l-0 border-r-0 border-solid border-grey-darker">
        <b class="text-4xl text-white">BlockVisualEditor</b>
        <span class="text-2xl pl-3">区块可视化编辑器</span>
      </p>
    </div>
    <div class="flex items-center">
      <div class="flex-1"></div>

      <div class="text-center">
        <el-button size="mini" round @click="createProject">创建项目</el-button>
        <div class="text-white mt-6 leading-loose">
          1. 颗粒化代码编辑，改动最少的代码<br />
          2. 区块模板可视化快速拖拽拼装页面<br />
          3. 高效率完成中后台管理系统的开发
        </div>
      </div>
      <div class="bg-white w-1/3 ml-20 flex flex-col">
        <div class="text-white bg-black pt-2 pl-2 pb-2 pr-2">项目列表</div>
        <div class="flex-1 pl-2 pr-2 proBox overflow-y-scroll">

          <div v-if="!projectList.length" class="flex flex-col items-center pt-16">
            还没有创建项目
          </div>
          <div v-else v-for="(pro, i) in projectList" :key="i" class="flex items-center border-0 border-b border-solid border-grey-lighter pb-2 pt-2 pl-2 pr-2 proList">
            <div class="flex-1 text-xs font-bold">{{pro.systemName}}</div>

            <el-button type="success" icon="el-icon-caret-right" size="mini" circle @click="runProjcet(pro.path)"></el-button>
            <el-button type="warning" icon="el-icon-edit" size="mini" circle @click="openProject(pro.path)"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" circle @click="delProject(pro.path, i)"></el-button>
          </div>

        </div>
      </div>

      <div class="flex-1"></div>
    </div>
    <div class="flex-1"></div>
    <div v-if="cmd.length" class="fixed pin-r pin-l pin-b bg-black text-yellow-dark p-5 overflow-y-scroll" style="height:100px;">
        <div class="absolute pin-r pin-l pin-b">
          <p v-for="(c, i) in cmd" :key="i">{{c}}</p>
        </div>
    </div>
  </div>
</template>

<script>
const projectList = require('@/allProject.json')
export default {
  name: 'directory',
  data () {
    return {
      loading: false,
      projectList: projectList,
      cmd: []
    }
  },
  props: {
  },
  mounted () {
    this.isExist()
  },
  methods: {
    isExist () {
      // 获取已存在的项目列表
      this.projectList.length && window.ipcProjectList(this.projectList)
    },
    createProject () {
      this.$emit('setRoot', window.ipcCreateProject())
    },
    // 运行项目
    runProjcet (path) {
      window.ipcRunProjcet(path, this.stdoutCmd)
    },
    // 编辑项目
    openProject (path) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000);
      window.ipcOpenProject(path)
    },
    // 删除项目
    delProject (path, index) {
      this.loading = true
      setTimeout(() => {
        this.loading = false
      }, 1000);
      window.ipcDelProject(path, index)
    },
    stdoutCmd (cmd) {
      this.cmd.push(cmd)
      if (/http:\/\/localhost/.test(cmd)) {
        const href = cmd.substr(cmd.indexOf('http://localhost'), 21)
        window.open(href, { width: 1000, height: 600, titleBarStyle: 'hidden' })
        setTimeout(() => {
          this.cmd = []
        }, 500);
      }
      
    }
  }
}
</script>

<style scope>
.proBox{ max-height: 410px; min-height: 123px;}
.proList:hover{ background-color: #f5f5f5;}
</style>
