<script setup >
import { ref } from 'vue'
import {ElMessage} from "element-plus";

import {useStore} from '@/store'
const store = useStore()
function saveData() {
  if (store.projectList.includes(projectName.value)){
    ElMessage.error('该项目已存在')
    return
  }
  store.projectList.push(projectName.value)
  localStorage.projectList = JSON.stringify(store.projectList)
}

const projectName = ref('')

</script>

<template>
  <el-popover
      ref="popover"
      title="请输入项目名称"
      :width="400"
      :visible="store.currentPop === 'newProject'"
  >
    <template #reference>
      <el-button style="margin-left:8px" type="primary" @click="store.currentPop = 'newProject'">新建项目</el-button>
    </template>
    <el-icon class="close-btn" @click="store.currentPop = ''">
      <CloseBold/>
    </el-icon>
    <el-input placeholder="请输入项目名称" v-model="projectName"></el-input>
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