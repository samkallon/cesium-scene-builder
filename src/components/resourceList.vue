<script setup >

import {useStore} from '@/store'
import {removeEntitiesAndPrimitivesByName, showOrHideEntitiesByName,removeAllPrimitive} from "@/utils/cesiumUtils.js";
import {commonAddData} from '@/utils/utils'
import {ref, watch} from "vue";
const store = useStore()


function changeVisible(item) {
  console.log(store.resourceList)
  showOrHideEntitiesByName(item.name,item.show)
}
function removeData(item) {
  const index = store.resourceList.findIndex(e=>e.name === item.name)
  store.resourceList.splice(index,1)
  localStorage.resourceList = JSON.stringify(store.resourceList)
  removeEntitiesAndPrimitivesByName(item.name)
}

let resourceList = ref([])
// 选择项目切换， 切换资源树
watch(()=>store.currentProject,(value, oldValue, onCleanup)=>{
  resourceList.value = store.resourceList.filter(e=>e.project === value)
  // 先移除之前的数据
  removeAllPrimitive()
  // 需要将数据全部加载到地图上并隐藏
  commonAddData(resourceList.value)
})
// 新建资源时， 调整资源树
watch(()=>store.resourceList,()=>{
  resourceList.value = store.resourceList.filter(e=>e.project === store.currentProject)
},{
  deep:true
})
// 切换场景时， 调整资源树勾选
watch(()=>store.currentScene,()=>{
  const scene = getCurScene()
  if (scene.showEntityNames){
    resourceList.value.forEach(r=>{
      if (scene.showEntityNames.includes(r.name)){
        r.show = true
        changeVisible(r)
      }else{
        r.show = false
        changeVisible(r)
      }
    })
  }
})

function getCurScene() {
  return store.sceneList.filter(e=>e.project === store.currentProject).find(e=>e.name === store.currentScene)
}
</script>

<template>
    <div class="resource-list">
      <el-collapse>
        <el-collapse-item title="  资源列表" name="1">
          <el-scrollbar height="100%">
            <div class="resource-list-item" v-for="item in resourceList">
              <input type="checkbox" v-model="item.show" @change="()=>changeVisible(item)"/>
              <div class="resource-list-item-name">{{item.name}}</div>
              <el-icon style="cursor: pointer" @click="removeData(item)"><CloseBold /></el-icon>
            </div>
          </el-scrollbar>
        </el-collapse-item>
      </el-collapse>
    </div>
</template>

<style scoped lang="scss">
.resource-list{
  padding: 8px;
  position: absolute;
  z-index: 1;
  top: 60px;
  right: 20px;
  width: 10rem;
  background: white;
  border-radius: 4px;
  &-item{
    display: flex;
    align-items: center;
    margin: 8px;
    &-name{
      flex-grow: 2;
    }
  }
}
</style>