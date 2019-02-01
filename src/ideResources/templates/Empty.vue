<template>
  <div id="contentMain" class="flex flex-1" style="-webkit-app-region: drag;">
      <div v-if="!projectData.template" class="flex-1 text-center leading-loose flex cor9 p-4 bg-white">  
        创建一个空白单页面，不需要模板。{{$route.name}}
      </div>
      <router-view v-else class="flex-1 flex p-4 bg-white"></router-view>
  </div>
</template>

<script>

export default {
  name: 'empty',
  data () {
    return {
      projectData:{}
    }
  },
  created(){
    if(!this.projectData.template){
      this.projectData = require('../../projectInitInfo.json')
    }
  },
  components: {},
  mounted () {
    console.log(this.projectData, 88)
  },
  methods: {
  }
}
</script>