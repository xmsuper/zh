import { ColumnProps, ImageProps, UserProps } from '@/store'
export function generateFitUrl(data: ImageProps, width: number, height: number, format = ['m_pad']) {
    if (data && data.url) {
      const formatStr = format.reduce((prev, current) => {
        return current + ',' + prev
      }, '')
      data.fitUrl = data.url + `?x-oss-process=image/resize,${formatStr}h_${height},w_${width}`
    }
  }
  
  export function addColumnAvatar(data: ColumnProps | UserProps, width: number, height: number) {
    if (data.avatar) {
      generateFitUrl(data.avatar, width, height)
    } else {
      const parseCol = data as ColumnProps
      data.avatar = {
        fitUrl: require(parseCol.title ? '@/assets/column.jpg' : '@/assets/avatar.jpg')
      }
    }
  }
// 通用验证
// 1检查那个文件  2条件
interface CheckCondition{
    format?:string[];
    size?:number;
}
type ErrorType='size'|'format'|null
export function beforeUploadCheck(file:File,condition:CheckCondition){
    const {format,size} =condition
    // 文件是否包含这个类型
    const isValidFormat=format?format.includes(file.type):true
    const isValidSize=size?(file.size/1024/1024<size):true
    let error:ErrorType=null
    // 判断有没有出错
    if(!isValidFormat){
        error='format'
    }
    if(!isValidSize){
        error='size'
    }
    return {
        passed:isValidFormat&&isValidSize,
        error
    }
}

// export const arrToObj = <T extends { _id?: string }>(arr: Array<T>) => {
//   return arr.reduce((prev, current) => {
//     if (current._id) {
//       prev[current._id] = current
//     }
//     return prev
//   }, {} as { [key: string]: T })
// }

// export const objToArr = <V>(obj: {[key: string]: V}) => {
//   return Object.keys(obj).map(key => obj[key])
// }

interface TestProps{
  _id:string;
  name:string;
}
const testData:TestProps[]=[{_id:'1',name:'张珊'},{_id:'2',name:'李白'}]

// key是不确定的可变的可以用[]表示
const testData2:{[key:string]:TestProps}={
  1:{_id:'1',name:'王伟'},
  2:{_id:'2',name:'韩信'}
}

// extends可以约束泛型
export const arrToObj =<T extends {_id?:string}> (arr:Array<T>)=>{
    return arr.reduce((prev,current)=>{
      if(current._id){
        // 上一个值pre是个数组，数组的当前值【current】
        prev[current._id]=current
      }
      return prev
    },{} as {[key:string]:T}) 
}

export const objToArr=<T>(obj:{[key:string]:T})=>{
  return Object.keys(obj).map(key=>obj[key])
}