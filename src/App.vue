<script setup >
import CesiumViewer from './components/CesiumViewer.vue'
import {useStore} from '@/store'
const store = useStore()
// 初始化读取本地缓存数据
if (!window.localStorage.projectList){
  const projectList = ['默认项目']
  const sceneList = [{
    name:'默认场景',
    project:'默认项目',
    showEntityNames:[]
  }]
  window.localStorage.setItem('projectList',JSON.stringify(projectList))
  window.localStorage.setItem('sceneList',JSON.stringify(sceneList))
  window.localStorage.setItem('resourceList',JSON.stringify([]))
}
store.projectList = JSON.parse(localStorage.projectList)
store.sceneList = JSON.parse(localStorage.sceneList)
store.resourceList = JSON.parse(localStorage.resourceList)
</script>

<template>
  <el-config-provider
      locale="zh-cn"
      size="small"
  >
    <CesiumViewer></CesiumViewer>
  </el-config-provider>
</template>

<style scoped>

</style>
