<template>
  <div class="validate-input-container pb-3">
    <input v-if="tag != 'textarea'" class="form-control" :class="{ 'is-invalid': inputRef.error }" 
      @blur="validateInput"  v-bind="$attrs" v-model="inputRef.val">
    <textarea v-else  class="form-control" :class="{ 'is-invalid': inputRef.error }" 
      @blur="validateInput" v-bind="$attrs" v-model="inputRef.val"></textarea>
    <span v-if="inputRef.error" class="invalid-feedback">{{ inputRef.message }}</span>
  </div>
</template>
  
<script lang="ts">
// 导入监听器
import { emitter } from './ValidateForm.vue'
import { defineComponent, reactive, PropType, onMounted,computed} from 'vue'
const emailReg = /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
const passwordReg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/
interface RuleProp {
  type: 'required' | 'email' | 'password'|'custom';
  message: string;
  validator?:()=>boolean;
}
export type RulesProp = RuleProp[]

export type TagType = 'input' | 'textarea'
export default defineComponent({
  props: {
    rules: Array as PropType<RulesProp>,
    modelValue: String,
    tag: {
      type: String as PropType<TagType>,
      default: 'input'
    }
  },
  // 如果不希望非props的属性继承到父元素上，比如给validateInput添加placeholder，class属性会
  // 添加到父元素上
  inheritAttrs: false,

  setup(props, context) {
    // console.log(context.attrs)
    const inputRef = reactive({
      val:computed({
        get:()=>props.modelValue||'',
        set:val=>{
          context.emit('update:modelValue',val)
        }
      }),
      error: false,
      message: ''
    })
    const validateInput = () => {
      if (props.rules) {
        const allPassed = props.rules.every(rule => {
          let passed = true
          inputRef.message = rule.message
          switch (rule.type) {
            case 'required':
              passed = (inputRef.val.trim() !== '')
              break
            case 'email':
              passed = emailReg.test(inputRef.val)
              break
            case 'password':
              passed = passwordReg.test(inputRef.val)
            default:
            case 'custom':
              passed=rule.validator?rule.validator():true
              break
          }
          return passed
        })
        inputRef.error = !allPassed
        return allPassed
      }
      return true
    }
    const updateValue = (e: KeyboardEvent) => {
      //取到键盘输入的值
      const targetValue = (e.target as HTMLInputElement).value
      inputRef.val = targetValue
      context.emit('update:modelValue', targetValue)
    }

    onMounted(() => {
      // 向父组件validateForm发送数据
      emitter.emit('form-item-created', validateInput)
    })
    return {
      inputRef,
      validateInput, updateValue
    }
  }
})
</script>
  