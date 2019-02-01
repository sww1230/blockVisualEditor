<template>
  <div class="posF flex">
    <Main v-if="showMain" @setRoot="setRoot"/>
    <Directory  v-if="!showMain" @setRoot="setRoot"/>
  </div>
</template>

<script>
import projectInitInfo from '@/projectInitInfo.json'  // 项目初始数据
import Main from "@/components/main";
import Directory from "@/components/directory";
let countNum = 1;
export default {
  name: 'app',
  data () {
    return {
      productInfo: projectInitInfo,
      showMain: ''
    }
  },
  components: {
    Main,
    Directory
  },
  created(){
    this.showMain = !!this.productInfo.projectPath
  },
  mounted () {
  },
  methods: {
    setRoot(path){
      this.showMain = !!path
    }
  }
}
</script>

<style>
.posF{ position: fixed; top:0; right:0; bottom:0; left:0;}
#mainContent{ background: -webkit-linear-gradient(top, transparent 4px, #333 5px),-webkit-linear-gradient(left, transparent 4px, #333 5px);
    background-size: 5px 5px; background-color:#000;transition: all 1s ease; z-index: 1;}
#mainEditorArea{ transition: marginRight 1s ease;}
.leftTriangle{margin-right:2px;  border:10px solid #222; border-top-width:7px; border-bottom-width:7px; border-left:0px; border-right-color:#ccc;}
.rightTriangle{margin-right:2px; border:10px solid #222; border-top-width:7px; border-bottom-width:7px; border-right:0px; border-left-color:#ccc;}
.w50{ width: 50px;}
.w80{ width: 80px;}
.w100{ width: 100px;}
.editorTitle{ line-height: 25px; color:#ccc; font-weight: bold; background-color: #22292F; border-radius: 5px; padding:0 10px;}
.compList:hover{ background-color: #222; color:#ffd04b; }
.layout{ border:1px dashed #eee; padding:5px;}
.layout:hover{box-shadow: 0 0px 8px #324157 inset;}
.layout.layoutActive{box-shadow: 0 0px 8px red inset;}






*{ padding:0; margin:0;    outline: none;}
body {
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  background-color: #fff;
  color: rgba(0,0,0,.65);
  font-family: Chinese Quote,-apple-system,BlinkMacSystemFont,Segoe UI,PingFang SC,Hiragino Sans GB,Microsoft YaHei,Helvetica Neue,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol;
  font-size: 12px;
  font-variant: tabular-nums;
  line-height: 1.5;
}
.posF{ position: fixed; top:0; right:0; bottom:0; left:0;}
.cor9{color: #999; text-align: center; padding-top: 100px;}
.f12{font-size: 12px;}
.f18{font-size: 18px;}
.opa7{ opacity: .8;}
.h50{height:50px;}
.menuTop{ background:#324157; color:#fff;}
.topNav{padding:0 15px; line-height:50px;opacity:.8}
.active{ background: #283446; color:#fff; font-weight: bold;opacity:1}
.leftMenu{ min-width: 210px; background:#324157; border-top:1px solid #283446; overflow-y: auto;}


.CodeMirror {
  height: auto !important;
  width:100%;
  font-size: 14px !important;
  font-family:Verdana, Geneva, Tahoma, sans-serif !important;
}
.CodeMirror-scroll{margin-right: 0px !important;}

#webpack-dev-server-client-overlay{ width:600px !important; top:10px !important;; right:inherit !important;; bottom: 10px !important; left:10px !important;}
</style>
