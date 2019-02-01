<template>
  <div class="posF flex" 
    v-loading="loading"
    element-loading-text="等待中，请稍候..."
    element-loading-spinner="el-icon-loading"
    element-loading-background="rgba(0, 0, 0, 0.8)">

    <!--左侧菜单栏-->
    <div v-if="currentEditor.title != 'Block'" class="flex flex-col bg-grey-darkest">
      <!--logo-->
      <div class="bg-black" style="-webkit-app-region: drag; color:#555; font-weight:bold; line-height:40px; padding:7px 15px 0; font-size:22px;">BlockVisual</div>
      <!--页面列表-->
      <!--模板列表-->
      <div class="bg-grey-darkest flex-1 text-white" v-if="!projectData.template">
        <div class="bg-grey-darker text-grey p-2 pl-3">选择模板</div>
        <el-menu
          default-active="0"
          style="border-right:none; width:100%; padding:0;"
          background-color="#3D4852"
          text-color="#fff"
          active-text-color="#ffd04b">
            <el-menu-item v-for="(row,i) in templateList" :key="i" @click="renderTemplate(i)" :index="i.toString()">{{row.name}}</el-menu-item>
        </el-menu>
      </div>
      <!--区块列表-->
      <div v-if="projectData.layout && projectData.layout[$route.name]" class="bg-grey-darkest flex-1 text-white">
        <div class="bg-grey-darker text-grey p-2 pl-3">区块列表</div>
        <div class="compList p-3 flex items-center" v-for="(row,i) in componentFiles" :key="i" @mouseenter="setEnterComp($event,row)">
          <div class="flex-1 cursor-move" draggable="true">{{row.name}}</div>
          <i class="el-icon-view cursor-pointer text-grey" @click="blockViewDialog = true"></i>
        </div>
      </div>
      <div v-else class="bg-grey-darkest flex-1 text-white"></div>

      <!-- 对话框预览展示 -->
      <el-dialog
        :modal="false"
        :title="currentBlock.name"
        :visible.sync="blockViewDialog"
        width="60%">
        <component style="margin-top:-25px;" v-bind:is="currentBlock.components"></component>
      </el-dialog>

      <!--全屏按钮-->
      <el-button size="mini" round @click="backProjectList" style="margin:10px 10px 0;">返回项目列表</el-button>
      <el-button size="mini" round @click="screen" style="z-index:9999; margin:10px;">全屏效果预览</el-button>
    </div>
    
    <!--效果展示区域-->
    <div class="flex-1 flex flex-col">
      <div id="mainContent" class="flex-1 flex p-3" :key="time" @click="setRelationEditor">
        <component v-bind:is="currentTpl.components"></component>
      </div>
    </div>

    <!--右侧编辑区-->
    <!-- <div style="cursor: ew-resize; width:3px; background:#fff;"></div>  v-if="currentEditor"-->
    <div class="bg-grey-darkest flex flex-col" id="mainEditorArea" :style="{width:currentEditor.title == 'Block' ? '500px' : '330px'}" >
      <!--编辑区顶部 折叠 当前编辑区名称-->
      <div class="flex pR10 bg-black items-center">
        <div class="flex cursor-pointer pt-4 pb-4" @click="folding">
          <div class="leftTriangle"></div>
          <div class="rightTriangle"></div>
        </div>
        <div class="text-white">{{currentEditor.name}}</div>
        <div class="flex-1"></div>
        <div class="text-white pr-2" v-if="currentEditor.title == 'Block' && blockName">
          <div class="cursor-pointer" @click="apiDocument = !apiDocument">api接口列表</div>
        </div>
      </div>
      <!--编辑组列表内容展示-->
      <div class="flex-1 flex flex-col pb-3 overflow-y-scroll">
        <div v-for="(row,index) in currentEditor.components" :key="index" class="pl-3 pr-3 flex flex-1 flex-col">
          <component v-bind:is="row" ref="subChildComp" :blockName="blockName" :projectData="projectData.template ?  projectData : {template: currentTpl}" class="mt-3 flex flex-1"></component>
        </div>
      </div>
      <!--保存按钮 预览按钮-->
      <div class="p-3 flex bg-black" v-if="currentEditor.title != 'Block'">
        <el-button size="mini" round class="flex-1 ml-3" @click="save(false)">预览</el-button>
        <el-button size="mini" round class="flex-1 ml-3" @click="save(true)">{{projectData.template ? '保存' : '保存项目模板'}}</el-button>
      </div>
    </div>



    <div v-if="apiDocument" class="fixed pin-t pin-b pin-l bg-black text-white p-5 overflow-scroll" style="width:500px; z-index:9;">
      <div class="mt-3 bg-grey-darkest text-white p-2">区块使用</div>
      <div>引用：import Api from '@/api/index.js'</div>
      <div>调用：Api.name({}, (data) => {})</div>
      <div v-for="(r, i) in apiCode" :key="i">
        <div class="mt-3 bg-grey-darkest text-white p-2">{{r.name}}:</div>
        <div v-for="(s, x) in r.children" :key="x" class="border-solid border-grey-darkest border-0 border-b">
          <p>接口：{{s.name}}</p>
          <p>name：{{s.url.split('/')[s.url.split('/').length-1]}}</p>
          <p>url：{{s.url}}</p>
          <p>method：{{s.method}}</p>
        </div>
      </div>
    </div>

    

  </div>
</template>

<script>
import Vue from 'vue'
import projectInitInfo from '@/projectInitInfo.json'  // 项目初始数据
import templateList from '@/ideResources/templates/index' // 模板文件
import editorAreaFiles from '@/ideResources/editor/index'  // 编辑区文件
import componentFiles from '@/ideResources/blocks/index'  // 主内容区 展示的组件文件
import Api from '@/api/fetch'
import config from '@/config.json'
let countNum = 1;
export default {
  name: 'app',
  data () {
    const _this = this
    return {
      apiDocument: false,
      apiCode:'',
      blockViewDialog: false,
      relation: '',
      time: new Date().getTime(),     // 渲染页面的KEY
      projectData: projectInitInfo,   // 项目数据
      currentTpl: {},                 // 当前的模板操作对象
      templateList: templateList,     // 模板列表
      componentFiles: componentFiles, // 组件菜单列表
      currentEditor: '',              // 当前编辑区域
      currentBlock: '',               // 当前操作的区块
      loading: false,
      blockName: '',
    }
  },
  components: {
  },
  created(){
  },
  mounted () {
    /**
     * 检测是否创建过项目
     * 如果项目存在时
     * 替换projectData
     */
    if(Object.keys(config).length){
      this.projectData = config
    }
    // 设置模板
    this.setTemplate()

    // 延迟100毫秒 等待模板页面加载完成
    let _this = this
    // setTimeout(() => {
      _this.drop()
    // }, 3000);

  },
  watch:{
    apiDocument(val){
      val && (this.apiCode = JSON.parse(window.ipcGetApiList()))
    }
  },
  methods: {
    /**
     * 根据CLASS样式
     * 点击时 设置右侧关联的编辑区域
     */
    setRelationEditor (event) {
      const layoutActive = document.body.querySelectorAll('.layout.layoutActive')
      
      if(layoutActive && layoutActive.length){
        let classStr = layoutActive[0].getAttribute('class')
        layoutActive[0].setAttribute('class', classStr.replace(/layoutActive/, ''))
      }

      this.relation = ''
      let classStr = event.target.getAttribute('class')
      if(classStr && classStr.includes('layout')) {
        this.currentBlock = ''
        // 设置当前正在拆分的布局
        this.relation = event.target.getAttribute('data-relation')
        editorAreaFiles.some(r => {
          if (r.title == 'Layout') {
            this.currentEditor = r
            event.target.setAttribute('class', classStr + ' layoutActive')
            document.getElementById('mainEditorArea').style.width="330px"
            return true
          }
        })
      } else if (!this.projectData.template) {
        this.currentEditor = editorAreaFiles[0]
      } else {
        let blockName = ''
        let nodeParentElement
        let eachParent = (node) => {
          if(node){
            blockName = node.getAttribute('block')
            if(!blockName){
              eachParent(node.parentElement)
            }else{
              nodeParentElement = node.parentElement
              blockName = '@/blocks/'+this.$route.name+'/Block'+node.parentElement.getAttribute('data-relation')+'_'+blockName+'.vue'
            }
          }
        }
        eachParent(event.target)
        if(blockName){
          this.blockName = blockName
          editorAreaFiles.some(r=>{
            if(r.title == 'Block'){
              this.currentEditor = r
              document.getElementById('mainEditorArea').style.width="500px"
              nodeParentElement.setAttribute('class', nodeParentElement.getAttribute('class') + ' layoutActive')
              return true
            }
          })
        }else{
          this.currentBlock = ''
          this.currentEditor = ''
          document.getElementById('mainEditorArea').style.width="12px"
        }
      }
    },
    /**
     * 效果区域拖动放下时触发
     */
    drop() {
      let _this = this
      document.addEventListener("drop", function(event) { 
        let classStr = event.target.getAttribute('class')
        if(classStr && classStr.includes('layout') && classStr.includes('layoutActive') && !event.target.children.length) {
           const relationAttr = event.target.getAttribute('data-relation')
           const rela = relationAttr.split('_')
           const loc = rela.splice(1,rela.length-2)
            
            if(loc.length){
                let obj = Object.keys(_this.projectData.layout[_this.$route.name]).includes('children') ? _this.projectData.layout[_this.$route.name].children : _this.projectData.layout[_this.$route.name]
                loc.map(r=>{
                  obj = obj[r] ? obj[r] : obj.children[r]
                })
                 obj['Block'+relationAttr] = {
                  name: _this.currentBlock.name,
                  editorTitle: _this.currentBlock.editorTitle,
                  filePath: '@/blocks/' + _this.$route.name + '/' + 'Block'+relationAttr + '_' + _this.currentBlock.name + '.vue'
                }
              }else{
                 _this.projectData.layout[_this.$route.name]['Block'+relationAttr] = {
                  name: _this.currentBlock.name,
                  editorTitle: _this.currentBlock.editorTitle,
                  filePath: '@/blocks/' + _this.$route.name + '/' + 'Block'+relationAttr + '_' + _this.currentBlock.name + '.vue'
                }
              }

              _this.blockName = '@/blocks/' + _this.$route.name + '/' + 'Block'+relationAttr + '_' + _this.currentBlock.name + '.vue'

            _this.loading = true
            window.ipcCreateBlock(_this.projectData, _this.currentBlock, _this.$route.name, 'Block'+relationAttr, () => {
              _this.loading = false
              // _this.time = new Date().getTime()
              // editorAreaFiles.some(r => {
              //   if (r.title == _this.currentBlock.editorTitle) {
              //     _this.currentEditor = r
              //     return true
              //   }
              // })
              window.ipcSaveLayout(_this.projectData,()=>{})
            })
            
        }
      })
      document.addEventListener("dragover", function(event) { 
        let classStr = event.target.getAttribute('class')
        if(classStr && classStr.includes('layout') && !classStr.includes('layoutActive') && !event.target.children.length) {
          event.target.setAttribute('class', classStr+ ' layoutActive')
        }
        event.preventDefault();
      })
      document.addEventListener("dragleave", function(event) { 
        let classStr = event.target.getAttribute('class')
        if(classStr && classStr.includes('layout') && classStr.includes('layoutActive') && !event.target.children.length) {
          event.target.setAttribute('class', classStr.replace(/layoutActive/, ''))
        }
        event.preventDefault();
      })
      document.addEventListener("dragstart", function(event) { 
        _this.currentEditor = ''
        document.getElementById('mainEditorArea').style.width="12px"
      });
      document.addEventListener("dragend", function(event) { 
      });
    },
    setEnterComp (event, row) { // 在组件列表上 浮动时触发
      this.currentBlock = row
    },
    save (save){
      this.$refs.subChildComp.map(r => {
        // 更新projectData的数据
        let result = save || r.setProjectData(this.projectData, this.relation)
        if (result) {
          // 保存模板
          if(!this.projectData.template){
            this.saveTemplate(save) 
          }
          if(this.currentEditor.title == 'Layout'){
            this.time = new Date().getTime()
            save && window.ipcSaveLayout(this.projectData)
          }
          if (this.currentEditor.title == 'Block'){
            // this.time = new Date().getTime()
            if(save){
              // window.ipcSaveBlockCode({
              //   path:this.blockName,
              //   code:r.saveCode(),
              //   root: this.projectData.projectPath
              // })
            }
          }
        }
      })
    },
    /**
     * 保存模板编辑后的项目数据
     * 参数save true保存 false预览
     */
    saveTemplate (save) { // 保存 | 预览
            // 更新视图当前区块模板的数据
            // if (this.currentBlock && this.currentBlock.dependData) {
            //   this.currentBlock.dependData(this.currentBlock.components, this.projectData)
            // } else if (!this.currentBlock) {
              // 保存模板
              this.templateList.some((menu, index) => {
                if (menu.name == this.currentTpl.name) {
                  if(save && !this.projectData.template){
                    this.loading = true
                    this.projectData.template = {
                      name: this.currentTpl.name,
                      file_path: this.currentTpl.file_path
                    }
                    // 请求导航数据
                    if (!Object.keys(this.projectData.menuList.menuData).length) {
                      Api.post(this.projectData.mockApi+this.projectData.api.getMenuData, {}, function (data) {
                        this.projectData.menuList.menuData = data.data
                        window.ipcSaveBaseInfo(this.projectData, () => {
                          this.loading = false
                        })
                      }.bind(this))
                    } else {
                     window.ipcSaveBaseInfo(this.projectData, () => {
                       this.loading = false
                     })
                    }
                  }
                  this.renderTemplate(index)
                  this.time = new Date().getTime()
                  return true
                }
              })
        
    },
    /**
     * 设置右侧编辑区
     * 当前区块存在时 获取区块的编辑项
     * 项目已创建时   设置空
     * 项目初始时     设置BaseInfo
     */
    setEditorArea () {
      if (this.currentBlock) { // 当前区块存在时
        editorAreaFiles.some(r=>{
          if(r.title == this.currentBlock.editorTitle){
            this.currentEditor = r
            document.getElementById('mainEditorArea').style.width="500px"
          }
        })
      } else if (this.projectData.template) { // 项目已创建时
        this.currentEditor = ''
        document.getElementById('mainEditorArea').style.width="12px"
      }else{ // 项目初始时
        this.currentEditor = editorAreaFiles[0]
        document.getElementById('mainEditorArea').style.width="300px"
      }
    },
    /**
     * 折叠 编辑区域
     */
    folding () {
      let dom = document.getElementById('mainEditorArea')
      if(this.currentEditor.title == 'Block'){
        dom.style.marginRight = (dom.style.marginRight ? '' : '-488px')
      }else{
        dom.style.marginRight = (dom.style.marginRight ? '' : '-318px')
      }
      this.time = new Date().getTime()
    },
    /**
     * 全屏预览
     */
    screen () {
      let dom = document.getElementById('mainContent')
      let classStr = dom.getAttribute('class')
      if (classStr.indexOf('posF') > 1) {
        dom.setAttribute('class', "flex-1 flex p-3")
      } else {
        dom.setAttribute('class', "flex-1 flex posF")
      }
    },
    /**
     * 设置模板
     * 已配置：遍历获取对应的模板数据
     * 无配置：获取第一个作为模板
     */    
    setTemplate () {
        if (this.projectData.template) {
          this.templateList.some((menu, index) => {
           if (menu.name == this.projectData.template.name) {
             this.renderTemplate(index)
             return true
           }
          })
        } else {
          this.renderTemplate(0) 
        }
    },
    /**
     * 渲染模板
     * 执行dependData方法
     * 给模板添加依赖数据
     */
    renderTemplate (i) { // 渲染模板 模板列表切换时 保存模板信息时 初始时
      this.currentTpl = this.templateList[i]
      this.currentTpl.dependData && this.currentTpl.dependData(this.currentTpl.components, this.projectData)
      console.log(this.currentTpl.components.data(), '999')
      this.time = new Date().getTime()
      // 设置右侧编辑区
      this.setEditorArea()
    },
    // 返回项目列表
    backProjectList () {
      this.loading = true
      setTimeout(() => {
        this.loading = false
        this.$emit('setRoot', '')
      }, 1500);
      window.ipcResetProjectPath()
    }
  }
}
</script>

<style>
</style>
