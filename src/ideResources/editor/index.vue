<script>
/**
 * 编辑区域的文件
 */
import BaseInfo from '@/ideResources/editor/BaseInfo'
import Layout from '@/ideResources/editor/Layout'
import Block from '@/ideResources/editor/Block'
export default [
    {
      name: '项目基本信息', components: [BaseInfo], title: 'BaseInfo'
    },
    {
      name: '布局拆分及样式设置', components: [Layout], title: 'Layout'
    },
    {
      name: '区块编辑： Contrl+S 保存', components: [Block], title: 'Block'
    }
]
</script>