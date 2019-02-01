<template>
<!--区块模板必须block属性 值为index.vue name的值-->
<div class="flex flex-1 flex-col">
  {{empty}}
</div>
</template>

  <script>
    import mixin from '@/store/mixin.js'
    export default {
      mixins: [mixin("Demand")],
      data() {
        return {
          empty:'空区块'
        }
      }
    }
  </script>