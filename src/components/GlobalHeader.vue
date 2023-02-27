<template>
    <nav class="navbar navbar-dark bg-primary justify-content-between mb-4 px-4">
        <router-link class="navbar-brand" to="/">知乎专栏</router-link>
        <ul v-if="!user.isLogin">
            <li class="list-inline-item"><router-link to="/login" class="btn btn-outline-light my-2">登陆</router-link></li>
            <li class="list-inline-item"><router-link to="/signup" class="btn btn-outline-light my-2">注册</router-link></li>
        </ul>
        <ul v-else class="list-inline mb-0">
          <li class="list-inline-item">
            <Dropdown :title="`你好 ${user.nickName}`">
                <DropdownItem><router-link to="/create" class="dropdown-item">新建文章</router-link></DropdownItem>
                <DropdownItem disabled><a href="" class="dropdown-item">编辑资料</a></DropdownItem>
                <DropdownItem><router-link to="/login" @click="LoginOut" class="dropdown-item">退出登录</router-link></DropdownItem>
            </Dropdown>
          </li>
        </ul>
    </nav>
</template>

<script lang='ts'>
import { defineComponent, DefineComponent, PropType,onUnmounted,computed,onMounted} from 'vue'
import Dropdown from './Dropdown.vue';
import DropdownItem from './DropdownItem.vue';
import {UserProps} from '@/store'
import router from '@/router/router';
import store from '@/store';
import { useRoute } from 'vue-router';
export default defineComponent({
  components:{
    Dropdown,DropdownItem
  },
  name: 'GlobalHeader',
  props: {
    user: {
      type: Object as PropType<UserProps>,
      required: true
    }
  },
  setup(){
    const LoginOut=()=>{
      window.localStorage.clear() 
      router.push('/login')
      setTimeout(() => {
      router.go(0)
      }, 1000);

    }
    return{
      router,LoginOut
    }
  }
})
</script>

<style scoped></style>
