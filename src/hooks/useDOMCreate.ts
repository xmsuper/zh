import { onUnmounted } from "vue";
// 封装创建DOM结点
function useDOMCreate(nodeId:string){
    const node=document.createElement('div')
    node.id=nodeId
    document.body.appendChild(node)
    onUnmounted(()=>{
        document.body.removeChild(node)
    })
}
export default useDOMCreate