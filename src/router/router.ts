import {createRouter,createWebHistory} from 'vue-router'
import Home from '@/views/home.vue'
import Login from '@/views/login.vue'
import columnDetail from '@/views/columnDetail.vue'
import CreatePost from '@/views/CreatePost.vue'
import Signup from '@/views/Signup.vue'
import store from '@/store'
import axios from 'axios'
import PostDetail from '@/views/PostDetail.vue'
const routerHistory =createWebHistory()
const router=createRouter({
    history:routerHistory,
    routes:[
        {
        path:'/',
        name:'home',
        component:Home
        },
        {
            path:'/login',
            name:'login',
            component:Login,
            // 给路由添加源信息
            meta:{redirectLogin:true}
        },
        {
            // 动态路由匹配
            path:'/column/:id',
            name:'column',
            component:columnDetail
        },
        {
            path:'/create',
            name:'create',
            component:CreatePost,
            // 路由源信息
            meta:{requiredLogin:true}
        },
        {
            path:'/signup',
            name:'signup',
            component:Signup
        },
        {
            path:'/posts/:id',
            name:'post',
            component:PostDetail
        }
    ]
})
router.beforeEach((to,from,next)=>{
    const {user,token}=store.state
    const {requiredLogin,redirectLogin}=to.meta
    if(!user.isLogin){
        if(token){
            axios.defaults.headers.common.Authorization=`Bearer ${token}`
            store.dispatch('fetchCurrentUser').then(()=>{
                if(redirectLogin){
                    next('/')
                }else{
                    next()
                }
            }).catch(e=>{
                console.log(e)
                localStorage.removeItem('token')
                next('login')
            })
        }else{
            if(requiredLogin){
                next('login')
            }else{
                next()
            }
        }
    }else{
        if(redirectLogin){
            next('/')
        }else{
            next()
        }
    }
})
export default router