import axios, { AxiosRequestConfig } from 'axios';
import { createStore, Commit } from 'vuex'
import { arrToObj, objToArr } from '@/hooks/helper'
// 测试数据
// import { testData,testPosts} from './testData'
// export {ColumnProps,PostProps} from './testData'

interface ListProps<P> {
    [id: string]: P
}


export interface ResponseType<P = {}> {
    code: number;
    msg: string;
    data: P;
}

export interface ImageProps {
    fitUrl?: string,
    _id?: string;
    url?: string;
    createdAt?: string;
}
export interface ColumnProps {
    _id: string;
    title: string;
    avatar?: ImageProps;
    description: string;
}
export interface PostProps {
    // 修改_id
    _id?: string;
    title: string;
    excerpt?: string;
    content?: string;
    image?: ImageProps | string;
    createdAt?: string;
    column: string;
    author?: string | UserProps;
}
export interface UserProps {
    isLogin: boolean;
    nickName?: string;
    _id?: string;
    column?: string;
    email?: string;
    avatar?: ImageProps;
    description?: string;

}
// 全局错误信息
export interface GlobalErrorProps {
    status: boolean;
    message?: string;
}
//全局字段
export interface GlobalDataProps {
    loading: boolean;
    columns: { data: ListProps<ColumnProps>; isLoaded: boolean }
    posts: { data: ListProps<PostProps>; loadedColumns: string[] };
    user: UserProps;
    token: string;
    // 全局错误信息
    error: GlobalErrorProps;
}

interface GlobalColumns {
    data: ListProps<ColumnProps>
    isLoaded: boolean
}
interface GlobalPosts {
    data: ListProps<PostProps>;
    loadedColumns: string[];
}
const getAndCommit = async (url: string, mutationName: string, commit: Commit) => {
    // commit('setLoading',true)
    const { data } = await axios.get(url)
    // await new Promise(resolve=>setTimeout(resolve,3000))
    commit(mutationName, data)
    return data
    // commit('setLoading',false)
}

// post方法的axios,
const PostAndCommit = async (url: string, mutationName: string, commit: Commit, payload: any) => {
    const { data } = await axios.post(url, payload)
    commit(mutationName, data)
    return data
}

const asyncAndCommit = async (url: string, mutationName: string, commit: Commit, config: AxiosRequestConfig = { method: 'get' }, extraData?: any) => {
    const { data } = await axios(url, config)
    if (extraData) {
        commit(mutationName, { data, extraData })
    } else {
        commit(mutationName, data)

    }
    return data
}

const store = createStore<GlobalDataProps>({
    state: {
        error: { status: false },
        // 初始化从localstore中取值
        token: localStorage.getItem('token') || '',
        loading: false,
        columns: { data: {}, isLoaded: false },
        posts: { data: {}, loadedColumns: [] },
        user: { isLogin: false }
    },
    mutations: {
        // login(state){
        //     state.user={...state.user,isLogin:true,name:'韩信'}
        // },

        // action的异步函数返回一个mutation的可以调用函数，store的数据只能通过外部调用mutation中的方法修改
        login(state, rawData) {
            // 获取返回的token赋值到store的state中
            const { token } = rawData.data
            state.token = token
            localStorage.setItem('token', token)
            axios.defaults.headers.common.Authorization = `Bearer ${token}`
        },
        // 退出登录，清除token 状态
        loginOut(state) {
            state.token = ''
            localStorage.removeItem('token')
            delete axios.defaults.headers.common.Authorization
        },
        // 创建新文章
        createPost(state, newPost) {
            state.posts.data[newPost._id] = newPost
        },
        fetchColumns(state, rawData) {
            state.columns.data = arrToObj(rawData.data.list)
            state.columns.isLoaded = true

        },
        fetchColumn(state, rawData) {
            state.columns.data[rawData.data._id] = rawData.data
        },
        // fetchPosts(state, rawData) {
        //     state.posts = rawData.data.list
        // },
        fetchPosts(state, rawData) {
            state.posts.data = arrToObj(rawData.data.list)
        },
        fetchPost(state, rawData) {
            // state.posts = [rawData.data]
            state.posts.data[rawData.data._id] = rawData.data
        },
        setLoading(state, status) {
            state.loading = status
        },
        // 添加对应的mutation
        fetchCurrentUser(state, rawData) {
            state.user = { isLogin: true, ...rawData.data }
        },
        // 修改错误信息
        setError(state, e: GlobalErrorProps) {
            state.error = e
        },
        updatePost(state, { data }) {
            // state.posts=state.posts.map(post=>{
            //     if(post._id==data._id){
            //         return data
            //     }else{
            //         return post
            //     }
            // })
            state.posts.data[data._id] = data
        },
        deletePost(state, { data }) {
            // 过滤现有的post 删除对应的文章
            // state.posts=state.posts.filter(post=>post._id!==data._id)
            delete state.posts.data[data._id]
        }

    },
    getters: {
        // biggerColumnLen(state){
        //     return state.columns.filter(c=>c._id>2).length
        // },
        // 返回一个函数
        getColumnById: (state) => (id: string) => {
            // return state.columns.find(c => c._id == id)
            return state.columns.data[id]
        },
        getPostsByCid: (state) => (cid: string) => {
            // return state.posts.filter(post => post.column == cid)
            return objToArr(state.posts.data).filter(post => post.column == cid)
        },
        getCurrentPost: (state) => (id: string) => {
            // return state.posts.find(post => post._id === id)
            return state.posts.data[id]
        },
        getColumns: (state) => {
            return objToArr(state.columns)
        }
    },
    // 异步请求
    actions: {
        fetchColumns({ state, commit }) {
            if (state.columns.isLoaded) {
                return getAndCommit('/columns', 'fetchColumns', commit)
            }
        },
        // async fetchColumns({commit}){
        //     // await直接取出data
        //     const {data}=await axios.get('/columns')
        //     commit('fetchColumns',data)
        // },
        fetchColumn({ state, commit }, cid) {
            if (state.columns.data[cid]) {
                axios.get(`/columns/${cid}`).then(resp => {
                    commit('fetchColumn', resp.data)
                    return resp.data
                })
            }
        },
        fetchPost({ commit }, id) {
            return getAndCommit(`/posts/${id}`, 'fetchPost', commit)
        },
        fetchPosts({ commit }, cid) {
            axios.get(`/columns/${cid}/posts`).then(resp => {
                commit('fetchPosts', resp.data)
                console.log(resp.data)
                return resp.data

            })
        },
        login({ commit }, payload) {
            return PostAndCommit('/user/login', 'login', commit, payload)
        },
        // 获取用户信息
        fetchCurrentUser({ commit }) {
            return getAndCommit('/user/current', 'fetchCurrentUser', commit)
        },
        // 组合action
        loginAndFetch({ dispatch }, loginData) {
            return dispatch('login', loginData).then(() => {
                return dispatch('fetchCurrentUser')
            })
        },
        createPost({ commit }, payload) {
            return PostAndCommit('/posts', 'createPost', commit, payload)
        },
        updatePost({ commit }, { id, payload }) {
            return asyncAndCommit(`/posts/${id}`, 'updatePost', commit, {
                method: 'patch',
                data: payload
            })
        },
        deletePost({ commit }, id) {
            return asyncAndCommit(`/posts/${id}`, 'deletePost', commit, { method: 'delete' })
        },
    }
})
export default store