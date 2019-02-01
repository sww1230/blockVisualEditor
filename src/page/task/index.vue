
  <template>
    <div class="layout" id="Task">
      <layout v-if="data" :model="data" :relation="relation"></layout>
      <h1 v-else class="h-6">Task page</h1>
    </div>
  </template>
  <script>
    import config from '@/config.json'
    import layout from '@/layoutBlock/layout'
    export default {
      name: 'Task',
      props: { },
      data() {
        return {
          data: (config.layout && config.layout.Task) ? config.layout.Task : '',
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
