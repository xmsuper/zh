<template>
    <form action="">
        <slot name="default"></slot>
        <div class="submit-area" @click.prevent="submitForm">
            <slot name="submit">
                <button type="submit" class="btn btn-primary">提交</button>
            </slot>
        </div>
    </form>
</template>

<script lang='ts'>
import { defineComponent, DefineComponent, onUnmounted } from 'vue';
import mitt from 'mitt'
// 定义一个events类型，这个定义是让事件和对应的callback一一对应
type Events = {
    'form-item-created': ValidateFunc
}
// 实例化mitt时候，作为泛型传递进去
export const emitter = mitt<Events>()

type ValidateFunc = () => boolean

export default defineComponent({
    // 子传父emit
    // 发送自定义事件的名称,发送给父组件APP，父组件创建函数监听结果
    emit: ['form-submit'],
    setup(props, context) {
        // 存放一组函数
        let funcArr: ValidateFunc[] = []
        const submitForm = () => {
            // 测试时发送的是个boolean
            const result = funcArr.map(func => func()).every(result => result)
            context.emit('form-submit', result)
        }
        const callback = (func: ValidateFunc) => {
            funcArr.push(func)
        }
        // 监听器设置完毕,监听子组件validateInput的结果
        emitter.on('form-item-created', callback)
        onUnmounted(() => {
            emitter.off('form-item-created', callback)
            funcArr = []
        })


        return {
            submitForm,
        }

    }

})
</script>

<style lang="scss" scoped></style>
