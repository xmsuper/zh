<template>
  <div class="create-post-page">
    <h4>{{ isEditMode?'编辑文章':'新建文章' }}</h4>
    <!-- 上传文件 -->
    <Uploader :uploaded="uploadedData" :beforUpload="uploadCheck" @file-uploaded="handleFileUpload" action="/upload"
      class="d-flex align-items-center justify-content-center bg-light text-secondary w-100 my-4 ">
      <h2>点击上传头像</h2>

      <template #loading>
        <div class="d-flex">
          <div class="spinner-border text-secondary" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        <h2>正在上传</h2>
      </template>

      <template #uploaded="dataProps">
        <img :src="dataProps.uploadedData.data.url" alt="">

      </template>
    </Uploader>
    <validate-form @form-submit="onFormSubmit">
      <div class="mb-3">
        <label class="form-label">文章标题：</label>
        <!-- <textarea ref="textarea"></textarea> -->
        <validate-input :rules="titleRules" v-model="titleVal" placeholder="请输入文章标题" type="text" />
      </div>
      <div class="mb-3">
        <label class="form-label">文章详情：</label>
        <validate-input rows="10" type="text" tag="textarea" placeholder="请输入文章详情" :rules="contentRules"
          v-model="contentVal" />
      </div>
      <template #submit>
        <button class="btn btn-primary btn-large">{{isEditMode?"更新文章":"发表文章"}}</button>
      </template>
    </validate-form>
  </div>
</template>
  
<script lang="ts">
import { beforeUploadCheck } from '@/hooks/helper'
import { defineComponent, ref, onMounted, watch } from 'vue'
import { useStore, } from 'vuex'
import { useRouter, useRoute } from 'vue-router'
import axios from 'axios'
import createMessage from '@/hooks/createMessage'
import { GlobalDataProps, PostProps, ResponseType, ImageProps } from '@/store'
import ValidateInput, { RulesProp } from '../components/ValidateInput.vue'
import ValidateForm from '../components/ValidateForm.vue'
import { UserProps } from '@/store'
import Uploader from '@/components/Uploader.vue'
import { file } from '@babel/types'
import EasyMDE from 'easymde'
export default defineComponent({
  name: 'Login',
  components: {
    ValidateInput,
    ValidateForm, Uploader
  },
  setup() {
    const textarea=ref<null|HTMLTextAreaElement>(null)
    const route = useRoute()
    const isEditMode = !!route.query.id
    const titleVal = ref('')
    const router = useRouter()
    const store = useStore<GlobalDataProps>()
    const titleRules: RulesProp = [
      { type: 'required', message: '文章标题不能为空' }
    ]
    const contentVal = ref('')
    const contentRules: RulesProp = [
      { type: 'required', message: '文章详情不能为空' }
    ]
    const onFormSubmit = (result: boolean) => {
      if (result) {
        const { column, _id } = store.state.user
        if (column) {
          const newPost: PostProps = {
            // _id:new Date().getTime().toString(),
            title: titleVal.value,
            content: contentVal.value,
            column: column.toString(),
            // createdAt: new Date().toLocaleString(),
            author: _id
          }
          if (imageId) {
            newPost.image = imageId
          }

          const actionName = isEditMode ? 'updatePost' : 'createPost'
          const sendData = isEditMode ? {
            id: route.query.id,
            payload: newPost
          } : newPost



          store.dispatch('createPost', newPost).then(() => {
            createMessage('发变成功 ，2秒后跳转到文章', 'success', 2000)
            setTimeout(() => {
              router.push({ name: 'column', params: { id: column } })
            })
          })
        }
      }
    }

    const handleFileChange = (e: Event) => {
      const target = e.target as HTMLInputElement
      const files = target.files
      if (files) {
        const uploadedFile = files[0]
        const formData = new FormData()
        // 拿到表单的数据
        formData.append(uploadedFile.name, uploadedFile)
        // 添加额外的header
        axios.post('/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((resp: any) => {
          console.log(resp)
        })
      }
    }

    // 上传验证
    const uploadCheck = (file: File) => {
      const result = beforeUploadCheck(file, { format: ['Image/jpeg', 'image/png'], size: 1 })
      const { passed, error } = result
      if (error == 'format') {
        createMessage('格式错误', 'error')
      }
      if (error == 'size') {
        createMessage('图片不能超过1M', 'error')
      }
      // createMessage('上传成功','success')
      return passed
    }


    let imageId = ''
    const handleFileUpload = (rawData: ResponseType<ImageProps>) => {
      if (rawData.data._id) {
        imageId = rawData.data._id
      }
    }

    const uploadedData = ref()

    onMounted(() => {
      if(textarea.value){
        const easyMDEInstance=new EasyMDE({element:textarea.value})
      }
      if (isEditMode) {
        store.dispatch('fetchPost', route.query.id).then((rawData: ResponseType<PostProps>) => {
          const currentPost = rawData.data
          if (currentPost.image) {
            uploadedData.value = { data: currentPost.image }
          }
          titleVal.value = currentPost.title
          contentVal.value = currentPost.content || ''
        })
      }
    })


    return {
      titleRules,
      titleVal,
      contentVal,
      contentRules,
      onFormSubmit, uploadedData,textarea,
      handleFileChange, uploadCheck, handleFileUpload,isEditMode
    }
  }
})
</script>

<style>
.create-post-page .file-upload-container {
  height: 200px;
  cursor: pointer;
}

.create-post-page .file-upload-container img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
</style>