<template>
<!--区块模板必须block属性 值为index.vue name的值-->
<div class="flex flex-1 flex-col bg-orange text-white p-5" block="empty">
  {{empty}}
</div>
</template>

  <script>
    import mixin from '@/store/mixin.js'
    export default {
      mixins: [mixin()],
      data() {
        return {
          empty:'空区块'
        }
      }
    }
  </script>