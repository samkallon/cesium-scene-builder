<script setup lang="ts">

import {useStore} from '@/store'
import {removaEntitiesAndPrimitivesByName, showOrHideEntitiesByName} from "@/utils/cesiumUtils.ts";
const store = useStore()


function changeVisible(item) {
  console.log(store.resourceList)
  showOrHideEntitiesByName(item.name,item.show)
}
function removeData(item) {
  const index = store.resourceList.findIndex(e=>e.name === item.name)
  store.resourceList.splice(index,1)
  removaEntitiesAndPrimitivesByName(item.name)
}



</script>

<template>
    <div class="resource-list">
      <el-collapse>
        <el-collapse-item title="  资源列表" name="1">
          <el-scrollbar height="100%">
            <div class="resource-list-item" v-for="item in store.resourceList.filter((e:any)=>e.project === store.currentProject)">
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