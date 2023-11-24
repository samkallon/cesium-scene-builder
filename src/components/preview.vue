<script setup lang="ts">
import { ref } from 'vue'
const showPop = ref(false)
function saveData() {

}

const project = ref('')
const scene = ref('')
const projectOptions = ref([])
const sceneOptions = ref([])
</script>

<template>
  <el-popover
      ref="popover"
      title="请选择演示项目"
      :width="400"
      :visible="showPop"
  >
    <template #reference>
      <el-button style="margin-left:8px" type="primary" @click="showPop = true">演示</el-button>
    </template>
    <el-icon class="close-btn" @click="showPop = false">
      <CloseBold/>
    </el-icon>
    <el-select v-model="project" class="m-2" placeholder="选择项目">
      <el-option
          v-for="item in projectOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
      />
    </el-select>
    <el-button @click="saveData" style="margin-top: 8px;float: right">确认</el-button>
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