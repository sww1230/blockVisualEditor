
  <template>
    <div class="layout" id="Approval">
      <layout v-if="data" :model="data" :relation="relation"></layout>
      <h1 v-else class="h-6">Approval page</h1>
    </div>
  </template>
  <script>
    import config from '@/config.json'
    import layout from '@/layoutBlock/layout'
    export default {
      name: 'Approval',
      props: { },
      data() {
        return {
          data: (config.layout && config.layout.Approval) ? config.layout.Approval : '',
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
