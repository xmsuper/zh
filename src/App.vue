<template>
  <div class="container">
    <!-- //遮罩层 -->
    <Loader v-if="isLoading" text="拼命加载中" background="rgba(0,0,0,0.8)"></Loader>
    <GlobalHeader :user="currentUser"></GlobalHeader>

    <router-view></router-view>

    <footer class="text-center py-4 text-secondary bg-light mt-6">
      <small>
        <ul class="list-inline mb-0">
          <li class="list-inline-item">© 2020 者也专栏</li>
          <li class="list-inline-item">课程</li>
          <li class="list-inline-item">文档</li>
          <li class="list-inline-item">联系</li>
          <li class="list-inline-item">更多</li>
        </ul>
      </small>
    </footer>
  </div>
</template>

<script lang="ts">

import { defineComponent,ref,reactive,computed,onMounted,watch } from 'vue'
import 'bootstrap/dist/css/bootstrap.min.css'
// 那个地方使用vuex的数据，那个地方引入useStore
import { useStore } from 'vuex'
import Loader from '@/components/Loader.vue'
import GlobalHeader from './components/GlobalHeader.vue'
import { UserProps } from '@/store'
import Home from '../src/views/home.vue'
import { GlobalDataProps } from './store'
import Message from '@/components/message.vue'
import createMessage from '@/hooks/createMessage'
import axios from 'axios'

const currentUser: UserProps = {
  isLogin: false
}
export default defineComponent({
  name: 'App',
  components: {
    GlobalHeader,Home,Loader,
    // Message
  },
  setup () {
    const store=useStore<GlobalDataProps>()
    const currentUser=computed(()=>store.state.user)
    const isLoading=computed(()=>store.state.loading)
    const token=computed(()=>store.state.token)
    const error=computed(()=>store.state.error)
    onMounted(()=>{
     const message= createMessage('登录成功','success')
     setTimeout(() => {
        message.destroyed()
     },2000);
    })
    // 监听error值得变化
    watch(()=>error.value.status,()=>{
      const {status,message}=error.value
      if(status&&message){
        createMessage(message,'error')
      }
    })
    // onMounted(()=>{
    //   // 第一次加载。判断token是否存在，并且用户还未登录
    //   if(!currentUser.value.isLogin&&token.value){
    //     // 设置请求头，并且发送fetchCurrentUser请求
    //     axios.defaults.headers.common.Authorization=`Bearer ${token.value}`
    //     // 请求用户信息
    //     store.dispatch('fetchCurrentUser')
    //   }
    // })
    return {
      currentUser,isLoading,token,error,
    }
  }

})
</script>
