
  <template>
    <div class="layout" id="Demand">
      <layout v-if="data" :model="data" :relation="relation"></layout>
      <h1 v-else class="h-6">Demand page</h1>
    </div>
  </template>
  <script>
    import config from '@/config.json'
    import layout from '@/layoutBlock/layout'
    export default {
      name: 'Demand',
      props: { },
      data() {
        return {
          data: (config.layout && config.layout.Demand) ? config.layout.Demand : '',
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
