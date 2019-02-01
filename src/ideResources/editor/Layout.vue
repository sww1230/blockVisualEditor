<template>
  <div class="flex flex-1 flex-col">

    <div class="editorTitle flex items-center">
      <div class="flex-1">拆分区域</div>
      <div @click="show = !show"  class="cursor-pointer">
        <i v-if="show" class="el-icon-arrow-down"></i>
        <i v-else class="el-icon-arrow-up"></i>
      </div>
    </div>

    <div v-if="show">
      <div class="flex mt-4 items-center">

        <div class="text-white pr-3 w-32 text-right">行数</div>
          <el-input v-model="rows" @focus="setInfo" size="mini" placeholder="2"></el-input>
        <div class="text-white pr-3 w-32 pl-3 text-right">列数</div>
          <el-input v-model="cols" @focus="setInfo" size="mini" placeholder="2"></el-input>
      </div>


      <div class="mt-12 text-white p-2 border-solid border-grey-darkest border-0 border-b">样式设置</div>
      <div class="flex mt-4 items-center">
        <div class="text-white pr-3 w-32 text-right">边框</div>
        <div class="flex-1">
          <el-input v-model="border" @focus="setRowCol" size="mini" style="width:250px;" placeholder="1px solid red"></el-input>
        </div>
      </div>
      <div class="flex mt-4 items-center">
        <div class="text-white pr-3 w-32 text-right">背景</div>
        <div class="flex-1">
          <el-input v-model="background" @focus="setRowCol" size="mini" style="width:250px;" placeholder="orange"></el-input>
        </div>
      </div>
      <div class="flex mt-4 items-center">
        <div class="text-white pr-3 w-32 text-right">内间距</div>
        <div class="flex-1">
          <el-input v-model="padding" @focus="setRowCol" size="mini" style="width:250px;" placeholder="10px 10px 10px 10px"></el-input>
        </div>
      </div>
      <div class="flex mt-4 items-center">
        <div class="text-white pr-3 w-32 pl-3 text-right">外间距</div>
        <div class="flex-1">
          <el-input v-model="margin" @focus="setRowCol" size="mini" style="width:250px;" placeholder="10px 10px 10px 10px"></el-input>
        </div>
      </div>
      
      <div class="flex mt-4 items-center">
        <div class="text-white pr-3 w-32 text-right">最小宽</div>
        <div class="flex-1">
          <el-input v-model="minWidth" @focus="setRowCol" size="mini" style="width:250px;" placeholder="2px"></el-input>
        </div>
      </div>

      <div class="flex mt-4 items-center">
        <div class="text-white pr-3 w-32 pl-3 text-right">最小高</div>
        <div class="flex-1">
          <el-input v-model="minHeight" @focus="setRowCol" size="mini" style="width:250px;" placeholder="2px"></el-input>
        </div>
      </div>



    </div>
    
  </div>
</template>

<script>
export default {
  name: 'app',
  props: {
    show: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      rows: '',
      cols: '',
      border: '',
      background: '',
      padding: '',
      margin: '',
      minWidth: '',
      minHeight: ''
    }
  },
  watch:{
    rows (val){
      val && (this.cols = '')
    },
    cols (val){
      val && (this.rows = '')
    }, 
    minWidth (val) {
      val && (this.minHeight = '')
    },
    minHeight (val) {
      val && (this.minWidth = '')
    }
  },
  methods: {
    setRowCol () {
        this.rows = ''
        this.cols = ''
    },
    setInfo () {
        this.border = ''
        this.background = ''
        this.padding = ''
        this.margin = ''
        this.minWidth = ''
        this.minHeight = ''
    },
    setProjectData (data, relation) {

      if(!this.rows && !this.cols && !this.border && !this.background && !this.padding && !this.margin && !this.minWidth && !this.minHeight){
        this.$message({
          message: '请输入拆分的行列信息',
          type: 'warning'
        })
        return
      }

      let o = {}
      if(this.rows || this.cols){
        o.rows = Number(this.rows)
        o.cols = Number(this.cols)
      }

      if (this.border || this.background || this.padding || this.margin || this.minWidth || this.minHeight){
        o.css = {}
      }

      this.border && (o.css.border = this.border)
      this.background && (o.css.background = this.background)
      this.padding && (o.css.padding = this.padding)
      this.margin && (o.css.margin = this.margin)


      this.minWidth && (o.css.minWidth = this.minWidth)
      this.minHeight && (o.css.minHeight = this.minHeight)

      if(!data.layout) {
        data.layout = {}
      }


      if (!relation) {
        data.layout[this.$route.name] = o
        return true
      }else{
        const rela = relation.split('_')
        const loc = rela.splice(1,rela.length-2)
        if(loc.length){
          let obj = data.layout[this.$route.name].children
          loc.map(r=>{
            obj = obj[r] ? obj[r] : obj.children[r]
            // obj = obj[r]
          })

          if(o.css){
              if(rela[1].substr(0,1) == 'r' && o.css.minWidth){
                this.$message({
                  message: '当前"行"请设置"高"的值',
                  type: 'warning'
                })
                return
              }
              if(rela[1].substr(0,1) == 'c' && o.css.minHeight){
                this.$message({
                  message: '当前"列"请设置"宽"的值',
                  type: 'warning'
                })
                return
              }
            obj[rela[1]] = o.css
          }else{
            if(!obj.children){
              obj.children = {}
            }
            obj.children[rela[1]] = o
          }

        }else{
            if(o.css){
                if(rela[1].substr(0,1) == 'r' && o.css.minWidth){
                  this.$message({
                    message: '当前"行"请设置"高"的值',
                    type: 'warning'
                  })
                  return
                }
                if(rela[1].substr(0,1) == 'c' && o.css.minHeight){
                  this.$message({
                    message: '当前"列"请设置"宽"的值',
                    type: 'warning'
                  })
                  return
                }
              data.layout[this.$route.name][rela[1]] = o.css
            }else{
              if(!data.layout[this.$route.name].children){
                data.layout[this.$route.name].children = {}
              }
              data.layout[this.$route.name].children[rela[1]] = o
            }
        }
      }
      return true
    }
  }
}
</script>
