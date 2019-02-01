
  <template>
    <div class="layout" id="Weekly">
      <layout v-if="data" :model="data" :relation="relation"></layout>
      <h1 v-else class="h-6">Weekly page</h1>
    </div>
  </template>
  <script>
    import config from '@/config.json'
    import layout from '@/layoutBlock/layout'
    export default {
      name: 'Weekly',
      props: { },
      data() {
        return {
          data: (config.layout && config.layout.Weekly) ? config.layout.Weekly : '',
          relation:''
        }
      },
      components: {
        layout
      },
      mounted() { },
      watch: { },
      created() { },
      methods: { }
    }
  </script>
