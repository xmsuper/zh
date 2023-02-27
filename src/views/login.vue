<template>
  <div class="login-page">
    <!-- form-submit是子组件的传来的自定义事件 -->
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">邮箱地址</label>
        <validate-input :rules="emailRules" v-model="emailVal" placeholder="请输入邮箱地址" type="text" ref="inputRef" />
      </div>
      <div class="mb-3">
        <label class="form-label">密码</label>
        <validate-input type="password" placeholder="请输入密码" :rules="passwordRules" v-model="passwordVal" />
      </div>
    </validate-form>
  </div>
</template>
  
<script lang="ts">
import { useRouter } from 'vue-router'
import { defineComponent, ref } from 'vue'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import store from '@/store'
import createMessage from '@/hooks/createMessage'

export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm
  },
  setup() {
    const router = useRouter()
    const emailVal = ref('')
    const emailRules: RulesProp = [
      { type: 'required', message: '电子邮箱地址不能为空' },
      { type: 'email', message: '请输入正确的电子邮箱格式' }
    ]
    const passwordVal = ref('')
    const passwordRules: RulesProp = [
      { type: 'required', message: '密码不能为空' }
    ]
        // 难题--获取form表单的验证结果  引用事件监听器vue3已经删除，改用mitt
    //父组件监听子组件validateForm，emit传来的自定义事件，结果接收的是个boolean型
    const onFormSubmit = (result: boolean) => {
            // 接收到了
      // console.log(result)
      // 直接打印validateForm的组件实例,此方法可能跟行不通，因为validateInput组件里可能不止一个input输入框
      // console.log('result', result)
      // 如果所有的正则都验证通过,
      if (result) {
        const payload={
          email:emailVal.value,
          password:passwordVal.value,
        }
        // 异步请求组合组件,
        store.dispatch('loginAndFetch',payload).then(data=>{
          // console.log(data)
          // createMessage('登录成功 2秒后跳转首页','success')
          setTimeout(()=>{
            router.push('/')
          },2000)
        }).catch(e=>{
          // 回收promise错误
          // router.push('/')
          console.log(e)
        })

      }
    }
    return {
      emailRules,
      emailVal,
      passwordVal,
      passwordRules,
      onFormSubmit,
    }
  }
})
</script>