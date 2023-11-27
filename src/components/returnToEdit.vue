<script setup>
import {useStore} from '@/store'
import {ref, watch} from "vue";
const store = useStore()
const sceneList = ref([])
watch(()=>store.currentPreview,()=>{
  sceneList.value = store.sceneList.filter(e=>e.project === store.currentPreview)
})
function handlerSceneChange(item) {
  store.currentScene = item.name
}
</script>

<template>
  <div class="top-left-tool">
    <el-button @click="store.currentPreview = ''">退出演示</el-button>
    <el-button v-for="item in sceneList" @click="handlerSceneChange(item)">{{item.name}}</el-button>
  </div>

</template>

<style scoped lang="scss">
.top-left-tool{
  position: absolute;
  z-index: 1;
  margin: 8px;
  width: 80px;
  display: flex;
}
</style>