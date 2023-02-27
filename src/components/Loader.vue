<template>
  <Teleport to="#back">
    <!-- //全局组件，加载等待 -->
    <div class="d-flex justify-content-center align-items-center h-100 w-100 loading-container"
      :style="{ backgroundColor: background || '' }">
      <div class="loading-content">
        <div class="spinner-border text-primary" role="status">
          <!-- <span class="sr-only">{{ text || 'loading'}}</span> -->
        </div>
        <p v-if="text" class="text-primary small">{{ text }}</p>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
import useDOMCreate from '@/hooks/useDOMCreate'
import { defineComponent, onMounted } from 'vue'
export default defineComponent({
  props: {
    text: {
      type: String
    },
    background: {
      type: String
    }
  },
  setup() {
    // 在结点挂载之前,创建一个结点
    //     const node=document.createElement('div')
    //     node.id='back'
    //     document.body.appendChild(node)
    //     onMounted(()=>{
    //       document.body.removeChild(node)
    //     })
    useDOMCreate('back')

  }
}
)

</script>

<style>
.loading-container {
  background: rgba(255, 255, 255, .5);
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
}

.loading-container {
  text-align: center;
}
</style>