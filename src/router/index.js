
    import Vue from 'vue';
    import Router from 'vue-router';
    Vue.use(Router);
    
    import Approval from "@/page/approval/index.vue"
  
    import Demand from "@/page/demand/index.vue"
  
    import Project from "@/page/project/index.vue"
  
    import Config from "@/page/config/index.vue"
  
    import Team from "@/page/team/index.vue"
  
    import Overview from "@/page/overview/index.vue"
  
    import Weekly from "@/page/weekly/index.vue"
  
    import Task from "@/page/task/index.vue"
  
    export default new Router({
      routes: [{path: '/', name: 'Approval', component: Approval},{path: '/approval', name: 'Approval', component: Approval},{path: '/demand', name: 'Demand', component: Demand},{path: '/project', name: 'Project', component: Project},{path: '/config', name: 'Config', component: Config},{path: '/team', name: 'Team', component: Team},{path: '/overview', name: 'Overview', component: Overview},{path: '/weekly', name: 'Weekly', component: Weekly},{path: '/task', name: 'Task', component: Task}]
    })
  