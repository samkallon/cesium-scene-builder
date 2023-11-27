<script setup >
import {onMounted, ref} from 'vue'
import {useStore} from '@/store'
const store = useStore()
function saveData() {
  store.currentPreview = project.value
  store.currentPop = ''
  store.currentProject = project.value
}

const project = ref('')
const projectOptions = ref([])

onMounted(()=>{
  projectOptions.value = store.projectList.map(e=>{
    return{
      label:e,
      value:e
    }
  })
})
</script>

<template>
  <el-popover
      ref="popover"
      title="请选择演示项目"
      :width="400"
      :visible="store.currentPop === 'preview'"
  >
    <template #reference>
      <el-button style="margin-left:8px" type="primary" @click="store.currentPop = 'preview'">演示</el-button>
    </template>
    <el-icon class="close-btn" @click="store.currentPop = ''">
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