<template>
  <div :class="['flex flex-1', {'flex-col':!(!model.rows && model.cols)}]">

    <div v-if="model.rows && !model.cols" v-for="(r,i) in model.rows" :key="i" :class="[{'flex-1': !(model['r'+i] ? model['r'+i].minHeight : false)}, 'flex bg-white layout']" :style="[model['r'+i] || {}]" :data-relation="relation+'_'+'r'+i">
      <layout v-if="model.children && model.children['r'+i]" :model="model.children['r'+i]" :relation="relation+'_'+'r'+i"></layout>
      <component v-if="model['Block'+relation+'_'+'r'+i]" v-bind:is="getBlock('Block'+relation+'_'+'r'+i)"></component>
    </div>

    <div v-if="!model.rows && model.cols" v-for="(c,i) in model.cols" :key="i" :class="[{'flex-1': !(model['c'+i] ? model['c'+i].minWidth : false)}, 'flex bg-white layout']" :style="[model['c'+i] || {}]" :data-relation="relation+'_'+'c'+i">
       <layout v-if="model.children && model.children['c'+i]" :model="model.children['c'+i]" :relation="relation+'_'+'c'+i"></layout>
       <component v-if="model['Block'+relation+'_'+'c'+i]" v-bind:is="getBlock('Block'+relation+'_'+'c'+i)"></component>
    </div>

  </div>
</template>

<script>
import blocks from '@/blocks/index'
export default {
  name: 'layout',
  props: ['model', 'relation'],
  data () {
    return {
    }
  },
  components: {},
  created(){},
  mounted () {
  },
  methods: {
    getBlock (key) {
      if (blocks[this.$route.name] && blocks[this.$route.name][key]) {
        return blocks[this.$route.name][key]
      }else {
        return ''
      }
    }
  }
}
</script>