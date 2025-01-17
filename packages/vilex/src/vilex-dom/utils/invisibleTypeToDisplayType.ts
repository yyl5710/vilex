import { isPromise } from "../../utils/isPromise"
import { VnItem } from "../vn"
import { isCssKey } from "./isCssKey"

export function invisibleTypeToDisplayType( options:VnItem[]) {
  const list: VnItem[] = []
  options.forEach(option => {
    // string, array, object
    if (typeof option === 'function') {
      option = option()
    }
    if (typeof option === 'string') {
      list.push(option)
    } else if (Array.isArray(option)) {

      const isChildren = option.some(item => {
        return isPromise(item) || (item.$ && item.$.type)
      })
      if (isChildren) {
        list.push(...option)
      } else {
        const obj = { $dataType: 'class'}
        option.forEach(item => {
          if (typeof item === 'string') {
            // @ts-ignore
            obj[item] = true
          } else {
            Object.assign(obj, item)
          }
        })
        list.push(obj)
      }
     
    } else {
      // attr， style
      // object
      
      let isCss = true
      for(const key in option) {
        if (!isCssKey(key)) {
          isCss = false
          break
        }
      }

      if (isCss) {
        list.push({
          $dataType: 'style',
          ...option
        })
      } else {
        // event, props
        let isEvents = true
        for(const key in option) {
          if (!key.startsWith('on')) {
            isEvents = false
            break
          }
        }

        if (isEvents) {
          list.push({
            $dataType: 'event',
            ...option
          })
        } else {
          list.push({
            $dataType: 'props',
            ...option
          })
        }
        
      }
    }
  })
  return list
}