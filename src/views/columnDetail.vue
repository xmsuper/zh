<template>
  <div class="column-detail-page w-75 mx-auto">
    <div class="column-info row mb-4 border-bottom pb-4 align-items-center" v-if="column">
      <div class="col-3 text-center">
        <img :src="column.avatar&&column.avatar.fitUrl" :alt="column.title" class="rounded-circle border w-100">
      </div>
      <div class="col-9">
       <h4>{{column.title}}</h4>
        <p class="text-muted">{{column.description}}</p>
      </div>
    </div>
    <Postlist :list="list"></Postlist>
  </div>
</template>

<script lang='ts'>
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Postlist from '@/components/Postlist.vue';
import { defineComponent, DefineComponent,computed,onMounted } from 'vue';
import { GlobalDataProps,ColumnProps } from '@/store';
import { addColumnAvatar } from '@/hooks/helper';
export default defineComponent({
components:{Postlist},
setup(){
const route=useRoute()
const store=useStore<GlobalDataProps>()
const currentId=route.params.id

onMounted(()=>{
  store.dispatch('fetchColumn',currentId)
  store.dispatch('fetchPosts',currentId)

})
// 每一项称之为C，找出C的id=等于当前的id 的一项
const column=computed(()=>{
  const selectColumn=store.getters.getColumnById(currentId) as ColumnProps|undefined
  if(selectColumn){
    addColumnAvatar(selectColumn,100,100)
  }
  return selectColumn
})


const list=computed(()=>store.getters.getPostsByCid(currentId))

  return{
    route,column,list
   }

  }
})
</script>

<style lang="scss" scoped></style>
