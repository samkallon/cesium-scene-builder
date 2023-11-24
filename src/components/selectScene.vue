<script setup lang="ts">
import { ref, onMounted } from 'vue'

import {useStore} from '@/store'
const store = useStore()

const showPop = ref(false)
function saveData() {

}

const project = ref('')
const scene = ref('')
type options = Array<{
  label:string
  value:string
}>
const projectOptions = ref<options>([])
const sceneOptions = ref<options>([])

onMounted(()=>{
  projectOptions.value = store.projectList.map((e:any)=>{
    return {
      label:e,
      value:e
    }
  })
})
function updateSceneOptions() {
  store.currentProject = project.value
  sceneOptions.value = store.sceneList.filter((e:any)=>e.project === project.value).map((e:any)=>{
    return {
      label:e.name,
      value:e.name
    }
  })
}

function loadScene() {
  store.currentScene = scene.value
}

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