
  <template>
    <div class="layout" id="Config">
      <layout v-if="data" :model="data" :relation="relation"></layout>
      <h1 v-else class="h-6">Config page</h1>
    </div>
  </template>
  <script>
    import config from '@/config.json'
    import layout from '@/layoutBlock/layout'
    export default {
      name: 'Config',
      props: { },
      data() {
        return {
          data: (config.layout && config.layout.Config) ? config.layout.Config : '',
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
