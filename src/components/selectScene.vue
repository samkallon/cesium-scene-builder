<script setup >
import {ref, onMounted, watch} from 'vue'

import {useStore} from '@/store'
import bus from "vue3-eventbus";
const store = useStore()

bus.on('newSceneAdded',()=>{
  // 新的场景添加后 需要刷新当前的 场景列表
  updateSceneOptions()
})
function saveData() {
  // 将当前场景的显示的entity 名称list 存到对应的scene中
  const scene = getCurScene()
  scene.showEntityNames = store.resourceList.filter(r=>r.show).map(e=>e.name)
  // 保存当前相机视角
  scene.cameraConfig = {
    position: JSON.parse(JSON.stringify(window.viewer.camera.position)),
    heading:window.viewer.camera.heading,
    pitch:window.viewer.camera.pitch,
    roll:window.viewer.camera.roll
  }
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
  scene.value = ''
},{
  deep:true
})

</script>

<template>
  <el-popover
      ref="popover"
      title="选择项目和场景"
      :width="400"
      :visible="store.currentPop === 'selectScene'"
  >
    <template #reference>
      <el-button style="margin-left:8px" type="primary" @click="store.currentPop = 'selectScene'">当前项目: {{project}}</el-button>
    </template>
    <el-icon class="close-btn" @click="store.currentPop = ''">
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