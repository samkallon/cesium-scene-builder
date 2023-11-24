<script setup >
import {ref, onMounted, watch} from 'vue'

import {useStore} from '@/store'
const store = useStore()

const showPop = ref(false)
function saveData() {
  // 将当前场景的显示的entity 名称list 存到对应的scene中
  const scene = getCurScene()
  scene.showEntityNames = store.resourceList.filter(r=>r.show).map(e=>e.name)
  window.localStorage.sceneList = JSON.stringify(store.sceneList)
}
function getCurScene() {
  return store.sceneList.filter(e=>e.project === store.currentProject).find(e=>e.name === store.currentScene)
}

const project = ref('')
const scene = ref('')
const projectOptions = ref([])
const sceneOptions = ref([])

onMounted(()=>{
  projectOptions.value = store.projectList.map((e)=>{
    return {
      label:e,
      value:e
    }
  })
})
function updateSceneOptions() {
  store.currentProject = project.value
  sceneOptions.value = store.sceneList.filter((e)=>e.project === project.value).map((e)=>{
    return {
      label:e.name,
      value:e.name
    }
  })
}

function loadScene() {
  store.currentScene = scene.value
}

watch(()=>store.projectList,()=>{
  projectOptions.value = store.projectList.map(e=>{
    return{
      label:e,
      value:e
    }
  })
},{
  deep:true
})

</script>

<template>
  <el-popover
      ref="popover"
      title="选择项目和场景"
      :width="400"
      :visible="showPop"
  >
    <template #reference>
      <el-button style="margin-left:8px" type="primary" @click="showPop = true">当前项目: {{project}}</el-button>
    </template>
    <el-icon class="close-btn" @click="showPop = false">
      <CloseBold/>
    </el-icon>
    <el-select v-model="project" class="m-2" placeholder="选择项目" @change="updateSceneOptions">
      <el-option
          v-for="item in projectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
    <el-select v-model="scene" class="m-2" placeholder="选择场景" @change="loadScene">
      <el-option
          v-for="item in sceneOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
    <el-button @click="saveData" style="margin-top: 8px;float: right">保存当前场景</el-button>
  </el-popover>
</template>

<style scoped lang="scss">

.close-btn{
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 15px;
}
</style>