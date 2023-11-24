<script setup lang="ts">
import { ref } from 'vue'
const showPop = ref(false)
function saveData() {
  window.localStorage.setItem('')
}

const projectName = ref('')

</script>

<template>
  <el-popover
      ref="popover"
      title="请输入项目名称"
      :width="400"
      :visible="showPop"
  >
    <template #reference>
      <el-button style="margin-left:8px" type="primary" @click="showPop = true">新建项目</el-button>
    </template>
    <el-icon class="close-btn" @click="showPop = false">
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