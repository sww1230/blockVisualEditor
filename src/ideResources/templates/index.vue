<script>
/**
 * 项目模板文件
 */
import LeftMenu from '@/ideResources/templates/LeftMenu'
import TopLeftMenu from '@/ideResources/templates/TopLeftMenu'
import TopMenu from '@/ideResources/templates/TopMenu'
import Empty from '@/ideResources/templates/Empty'

/**
 * 模板所需数据
 * 
 * props:
 * projectData    项目数据
 */

 // 依赖数据
const dependData = function(component, projectData){
    component.data = () => {
      return {
        projectData: projectData
      }
    }
}

export default [
    {
      name: '左侧菜单模板', 
      file_path: '/ideResources/templates/LeftMenu.vue',
      components: LeftMenu,
      dependData: dependData
    },
    {
      name: '顶部及左侧', 
      file_path: '/ideResources/templates/TopLeftMenu.vue',
      components: TopLeftMenu,
      dependData: dependData
    },
    {
      name: '顶部菜单模板', 
      file_path: '/ideResources/templates/TopMenu.vue',
      components: TopMenu,
      dependData: dependData
    },
    {
      name: '单页面无模板',
      file_path: '/ideResources/templates/Empty.vue',
      components: Empty,
      dependData: dependData
    }
]
</script>