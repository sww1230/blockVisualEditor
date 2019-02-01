<template>
  <div class="flex flex-1 flex-col">
    <!-- <div class="editorTitle flex items-center">
      <div class="flex-1">区块{{projectData.blockName}}编辑</div>
      <div @click="show = !show"  class="cursor-pointer">
        <i v-if="show" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
      </div>
    </div> -->
    <div class="bg-black text-white flex text-center cursor-pointer">
      <div class="flex-1 p-1 bg-grey-darker" @click="getCode">区块</div>
      <div class="flex-1 p-1" @click="getStoreCode">公共数据</div>
    </div>
    <div class="flex flex-1 flex-col">
      <codemirror v-model="code" class="flex flex-1" :options="cmOption"></codemirror>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'app',
  props: {
    projectData: {
      type: Object,
      required: true
    },
    blockName: {
      type: String
    }
  },
  data () {
    const _this = this
    return {
      codeType: '',
      code: '',
cmOption: {
   tabSize: 2,
    theme: 'base16-dark',
    lineNumbers: true,
    line: true,
    connect: 'align',

    styleActiveLine: true,
    foldGutter: true,
    styleSelectedText: true,
    mode:  '',
    // keyMap: "sublime",
    matchBrackets: true,
    showCursorWhenSelecting: true,
    // theme: "monokai",
    // extraKeys: { "Ctrl": "autocomplete" },
    hintOptions: {
      completeSingle: false
    },
    lineWrapping: true,
    cursorHeight:0.85,
    viewportMargin: 100,
    // keyMap: "sublime",
          extraKeys: {
            'Esc'(cm) {
              if (cm.getOption("fullScreen")) cm.setOption("fullScreen", false)
            },
            "Ctrl-S":function () {_this.saveCode()},
            "Cmd-S":function () {_this.saveCode()},
            "Ctrl": "autocomplete"
          }
        }
    }
  },
  mounted(){
    this.codeType = true
    this.getCode()
  },
  watch:{
    blockName(){
      this.getCode()
    },
    codeType(val){
      this.cmOption.mode = val ? 'text/x-vue' : 'text/javascript'
    }
  },
  methods: {
    setProjectData (data, relation) {
      return true
    },
    getCode () {
      this.codeType = true
      this.code = window.ipcGetBlockCode(this.blockName)
    },
    getStoreCode(){
      this.codeType = false
      this.code = window.ipcGetStoreCode('./src/store/modules/'+this.$route.name+'.js')
    },
    saveCode(){
       this.codeType && window.ipcSaveBlockCode({
                path:this.blockName,
                code:this.code,
                root: this.projectData.projectPath
              })
        !this.codeType && window.ipcSaveStoreCode({
                path:'./src/store/modules/'+this.$route.name+'.js',
                code:this.code,
                root: this.projectData.projectPath+'/src/store/modules/'+this.$route.name+'.js'
                })
    }
  }
}
</script>
