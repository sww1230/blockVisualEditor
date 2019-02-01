<script>
          
        import Approval0 from '@/blocks/Approval/Block_r0_table.vue'
        import Demand0 from '@/blocks/Demand/Block_r1_empty.vue'
        import Demand1 from '@/blocks/Demand/Block_r0_table.vue'
        import Demand2 from '@/blocks/Demand/Block_r2_empty.vue'
        import Project0 from '@/blocks/Project/Block_r0_empty.vue'
        import Project1 from '@/blocks/Project/Block_r1_empty.vue'
          export default {
            
      Approval:{
          
        Block_r0: Approval0,
      },
    
      Demand:{
          
        Block_r1: Demand0,
        Block_r0: Demand1,
        Block_r2: Demand2,
      },
    
      Project:{
          
        Block_r0: Project0,
        Block_r1: Project1,
      },
    
          }
      </script>