
  <template>
    <div class="layout" id="Project">
      <layout v-if="data" :model="data" :relation="relation"></layout>
      <h1 v-else class="h-6">Project page</h1>
    </div>
  </template>
  <script>
    import config from '@/config.json'
    import layout from '@/layoutBlock/layout'
    export default {
      name: 'Project',
      props: { },
      data() {
        return {
          data: (config.layout && config.layout.Project) ? config.layout.Project : '',
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
