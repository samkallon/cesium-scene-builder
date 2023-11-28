<script setup >
import {onMounted, ref, watch} from 'vue'
import {useStore} from '@/store'
import {ElMessage} from "element-plus";
import bus from 'vue3-eventbus'
const store = useStore()

const scene = ref()
function saveData() {
  if (!project.value){
    ElMessage.error('请选择项目')
    return
  }
  if (!scene.value){
    ElMessage.error('场景名称不能为空')
    return
  }
  store.sceneList.push({
    name:scene.value,
    project:project.value,
    showEntityNames:[]
  })
  localStorage.sceneList = JSON.stringify(store.sceneList)
  // 需要让场景选择那边 更新选择的场景列表
  bus.emit('newSceneAdded')
  ElMessage.success('保存成功!')
}

watch(()=>store.projectList,()=>{
  projectOptions.value = store.projectList.map(e=>{
    return {
      label:e,
      value:e
    }
  })
},{
  deep:true
})

onMounted(()=>{
  projectOptions.value = store.projectList.map(e=>{
    return {
      label:e,
      value:e
    }
  })
})

const project = ref('')
const projectOptions = ref([])
</script>

<template>
  <el-popover
      ref="popover"
      title="选择项目和场景"
      :width="400"
      :visible="store.currentPop === 'newScene'"
  >
    <template #reference>
      <el-button style="margin-left:8px" type="primary" @click="store.currentPop = 'newScene'">新建场景</el-button>
    </template>
    <el-icon class="close-btn" @click="store.currentPop = ''">
      <CloseBold/>
    </el-icon>
    <el-input placeholder="请输入场景名称" v-model="scene"></el-input>
    <el-select v-model="project" class="m-2" placeholder="选择所属项目">
      <el-option
          v-for="item in projectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
    <el-button @click="saveData" style="margin-top: 8px;float: right">保存</el-button>
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