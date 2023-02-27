<template>
    <div class="signup-page mx-auto p-3 w-330">
        <h5 class="my-4 text-center">注册者也账户</h5>
        <validate-form @form-submit="onFormSubmit">
            <div class="mb-3">
                <label class="form-label">邮箱地址</label>
                <validate-input v-model="formData.email" :rules="emailRules" placeholder="请输入邮箱地址" type="text" />
            </div>
            <div class="mb-3">
                <label class="form-label">昵称</label>
                <validate-input v-model="formData.nickName" :rules="nameRules" placeholder="请输入昵称" type="text" />
            </div>
            <div class="mb-3">
                <label class="form-label">密码</label>
                <validate-input v-model="formData.password" :rules="passwordRules" type="password" placeholder="请输入密码" />
            </div>
            <div class="mb-3">
                <label class="form-label">重复密码</label>
                <validate-input v-model="formData.repeatPassword" :rules="repeatPasswordRules" type="password"
                    placeholder="请再次密码" />
            </div>
            <template #submit>
                <button type="submit" class="btn btn-primary btn-block btn-large">注册新用户</button>
            </template>
        </validate-form>
    </div>
</template>

<script lang="ts">
import createMessage from '@/hooks/createMessage'
import { defineComponent, reactive } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import ValidateInput, { RulesProp } from '@/components/ValidateInput.vue'
import ValidateForm from '@/components/ValidateForm.vue'
export default defineComponent({
    name: 'Signup',
    components: {
        ValidateForm, ValidateInput
    },
    setup() {
        const formData = reactive({
            email: '',
            nickName: '',
            password: '',
            repeatPassword: ''
        })
        const router = useRouter()
        const emailRules: RulesProp = [
            { type: 'required', message: '电子邮箱地址不能为空' },
            { type: 'email', message: '请输入正确的电子邮箱' },
        ]
        const nameRules: RulesProp = [
            { type: 'required', message: '昵称不能为空' }
        ]
        const passwordRules: RulesProp = [
            { type: 'required', message: '密码不能为空' }
        ]
        const repeatPasswordRules: RulesProp = [
            { type: 'required', message: '重置密码不能为空' },
            {
                type: 'custom',
                validator: () => {
                    return formData.password === formData.repeatPassword
                },
                message: '两次密码不相同'
            }
        ]
        const onFormSubmit = (result: boolean) => {
            if (result) {
                const payload = {
                    email: formData.email,
                    password: formData.password,
                    nickName: formData.nickName
                }
                axios.post('/users/', payload).then(data => {
                    console.log(data.data)
                    createMessage('注册成功 正在跳转登录页面', 'success')
                    setTimeout(() => {
                        router.push('/login')
                    }, 2000)
                }).then(e => {
                    console.log(e)
                });
            }
        }
        return {
            onFormSubmit, formData, router, emailRules, nameRules, passwordRules, repeatPasswordRules
        }
    }
})
</script>
<style>
.w-330 {
    max-width: 330px;
}
</style>
