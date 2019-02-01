
  <template>
    <div class="layout" id="Team">
      <layout v-if="data" :model="data" :relation="relation"></layout>
      <h1 v-else class="h-6">Team page</h1>
    </div>
  </template>
  <script>
    import config from '@/config.json'
    import layout from '@/layoutBlock/layout'
    export default {
      name: 'Team',
      props: { },
      data() {
        return {
          data: (config.layout && config.layout.Team) ? config.layout.Team : '',
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
