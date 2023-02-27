<template>
    <div class="dropdown" ref="dropdownRef">
        <a href="" class="btn btn-outline-light my-2 dropdown-toggle" @click.prevent="toggleOpen">{{ title }}</a>

    <ul v-if="isOpen" class="dropdown-menu" :style="{display: 'block'}">
      <slot></slot>
  </ul>
</div>
</template>

<script lang='ts'>
import {ref, defineComponent, DefineComponent,onMounted,onUnmounted,watch } from 'vue';
import useClickOutside from '../hooks/useClickOutside'
export default defineComponent({
    name:'Dropdown',
    props:{
        title:{
            type:String,
            required:true
        }
    },
    setup() {
      const isOpen=ref(false)
      const toggleOpen=()=>{
        isOpen.value=!isOpen.value
      }

      //判断是否点击到了外面
      const dropdownRef=ref(null)
      const isClickOutside=useClickOutside(dropdownRef)
      watch(isClickOutside,()=>{
        if(isClickOutside){
          isOpen.value=false
        }
      })

        return {
          toggleOpen,isOpen,dropdownRef
        }
    }
})
</script>

<style  scoped>
</style>
