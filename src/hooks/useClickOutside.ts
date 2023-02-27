import {ref,onMounted,onUnmounted,Ref} from 'vue'
const useClickOutside=(ElementRef:Ref<null|HTMLElement>)=>{
// 是否点击DOM元素的外面
    const isClickOutside=ref(false)
    const handler=(e:MouseEvent)=>{
        if(ElementRef.value){
            if(ElementRef.value.contains(e.target as HTMLElement)){
                isClickOutside.value=false
            }else{
                isClickOutside.value=true
            }
        }
    }
    onMounted(()=>{
        document.addEventListener('click',handler)
      })
      onUnmounted(()=>{
        document.addEventListener('click',handler)
      })

    return isClickOutside
}

export default useClickOutside