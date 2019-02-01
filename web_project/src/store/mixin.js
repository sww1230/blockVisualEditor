import {
  createNamespacedHelpers
} from 'vuex'

export default (pageName) => {
  let data = require('./modules/' + pageName + '.js').default
  const {
    mapState,
    mapActions,
    mapMutations
  } = createNamespacedHelpers(pageName + '/')
  return {
    computed: {
      ...mapState(Object.keys(data.state))
    },
    methods: {
      ...mapMutations(Object.keys(data.mutations)),
      ...mapActions(Object.keys(data.actions))
    }
  }
}