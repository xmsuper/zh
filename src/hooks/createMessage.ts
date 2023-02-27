import { createApp, h, render } from 'vue'
import Message from '@/components/message.vue'
import { def } from '@vue/shared'
export type MessageType = 'success' | 'error' | 'default'

const createMessage = (message: string, type: MessageType, timeout?: number) => {
    // 利用组件的函数CreateApp创建一个组件,creatApp接收到参数Message,和props
    const messageVnode = h(Message, {
        message,
        type
    })
    // 新建一个结点，以便message实例挂载上去
    const mountNode = document.createElement('div')
    // 加入body中
    document.body.appendChild(mountNode)
    // 挂载
    render(messageVnode, mountNode)
    const destroyed = () => {
        render(null, mountNode)
        document.body.removeChild(mountNode)
    }
    if (timeout) {
        // 错误信息果两秒后自动化卸载,并删除创建的node,新版vue,unmount不需要传入参数了
        setTimeout(() => {
            destroyed()
        }, timeout)
    }
    return{
        destroyed
    }
}

export default createMessage