<script setup lang="ts">
import {ref} from "vue";
import {
  addDynamicLine,
  addDynamicWaveCircle,
  addWallGeojson,
  load3dtiles,
  locationToGeojson
} from "@/utils/cesiumUtils.ts";
import mockData from '/public/mock.json'
import StyleSelect from "@/components/StyleSelect.vue";
import {ElMessage} from "element-plus";
import * as Cesium from "cesium";

import {useStore} from '@/store'
const store = useStore()

const activeName = ref('3dtiles')
function handleClick() {

}

const tilesUrl = ref('')
const tilesName = ref('')
const geojsonStr = ref('')
const geojsonName = ref('')
const geoserverUrl = ref('')

const showPop = ref(false)

const selectStyle = ref()

function addData() {
  if (!store.currentProject){
    ElMessage.error('请先选择项目!')
    return
  }
  if (activeName.value === '3dtiles'){
    if(!tilesName.value){
      ElMessage.error('名称不能为空!')
      return
    }
    if(!tilesUrl.value){
      ElMessage.error('地址不能为空!')
      return
    }
    // 检测名称不能重复
    if(checkNameRepete(tilesName.value)){
      ElMessage.error('名称不能重复!')
      return
    }
    load3dtiles({url:tilesUrl.value,name:tilesName.value})
    store.resourceList.push({
      type:'3dtiles',
      url:tilesUrl.value,
      name:store.currentProject + '-' + tilesName.value,
      project:store.currentProject,
      show:true
    })

    localStorage.resourceList = JSON.stringify(store.resourceList)
  }else if (activeName.value === 'geojson'){
    if(!geojsonName.value){
      ElMessage.error('名称不能为空!')
      return
    }
    if(!geojsonStr.value){
      ElMessage.error('数据不能为空!')
      return
    }
    // 检测名称不能重复
    if(checkNameRepete(geojsonName.value)){
      ElMessage.error('名称不能重复!')
      return
    }
    const currentStyle = selectStyle.value.currentSelectStyle
    const geojson = JSON.parse(geojsonStr.value)
    if (currentStyle === '点扩散波纹'){
      // 添加动态扩散圆
      if(geojson.features[0].geometry.type !== 'Point'){
        ElMessage.error('当前geojson不是点数据!(feature的geometry的type需为Point)')
        return
      }
      geojson.features.forEach((feature:any)=>{
        addDynamicWaveCircle({
          center: Cesium.Cartesian3.fromDegrees(...feature.geometry.coordinates, 30),
          radius: selectStyle.value.radius,
          type: geojsonName.value,
          color: selectStyle.value.color
        })
      })
    }else if(currentStyle === '动态发光线'){
      if(geojson.features[0].geometry.type !== 'LineString'){
        ElMessage.error('当前geojson不是线数据!(feature的geometry的type需为LineString)')
        return
      }
      geojson.features.forEach((feature:any)=>{
        addDynamicLine(feature.geometry.coordinates,geojsonName.value,selectStyle.value.color)
      })
    }else if (currentStyle === '动态立体围墙'){
      if(geojson.features[0].geometry.type !== 'Polygon'){
        ElMessage.error('当前geojson不是线数据!(feature的geometry的type需为Polygon)')
        return
      }
      geojson.features.forEach((feature:any)=>{
        addWallGeojson({
          wallList:feature.geometry.coordinates,
          type:geojsonName.value,
          color:selectStyle.value.color,
          maximumHeights:selectStyle.value.wallHeight
        })
      })


    }
    locationToGeojson(geojson)
    store.resourceList.push({
      type:'geojson',
      geojson:geojson,
      name:store.currentProject + '-' +geojsonName.value,
      style:{
        name:currentStyle,
        color:selectStyle?.value?.color,
        radius: selectStyle?.value?.radius,
        nameKey:selectStyle?.value?.nameKey,
        wallHeight:selectStyle?.value?.wallHeight
      },
      show:true,
      peoject:store.currentProject
    })
    localStorage.resourceList = JSON.stringify(store.resourceList)
  }
}

function checkNameRepete(name:string) {
  return store.resourceList.find(e=>e.name === name)
}

</script>

<template>
  <div class="add-data">
    <el-popover
        ref="popover"
        title="添加数据"
        :width="400"
        :visible="showPop"
    >
      <template #reference>
        <el-button type="primary" @click="showPop = true">添加数据</el-button>
      </template>
      <el-icon class="close-btn" @click="showPop = false"><CloseBold /></el-icon>
      <el-tabs v-model="activeName" class="demo-tabs" @tab-click="handleClick">
        <el-tab-pane  label="3dtiles" name="3dtiles">
          <el-input class="panel-con"  v-model="tilesUrl" placeholder="请输入3dtile地址" />
          <el-input class="panel-con"  v-model="tilesName" placeholder="请输入3dtile名称,不可重复" />
        </el-tab-pane>
        <el-tab-pane label="geojson" name="geojson">
          <el-link type="primary" href="https://geojson.io/" target="_blank">此网站可生成数据</el-link>
          <div style="display: flex;margin-top:8px">
            <div>模拟数据:</div>
            <el-button @click="geojsonStr = JSON.stringify(mockData.mockPoint)">点</el-button>
            <el-button @click="geojsonStr = JSON.stringify(mockData.mockLine)">线</el-button>
            <el-button @click="geojsonStr = JSON.stringify(mockData.mockPolygon)">面</el-button>
          </div>
          <el-input class="panel-con"  type="textarea" v-model="geojsonStr" placeholder="将geojson数据复制到此(FeatureCollection,仅支持单一类型)" />
          <el-input class="panel-con"  v-model="geojsonName" placeholder="请输入geojson名称,不可重复" />
          <style-select ref="selectStyle"></style-select>
        </el-tab-pane>
        <el-tab-pane label="geoserver" name="geoserver">
          <el-input class="panel-con"  v-model="geoserverUrl" placeholder="请输入geoserver服务地址" />
        </el-tab-pane>
      </el-tabs>
      <el-button @click="addData" style="margin-top: 8px;float: right">确认</el-button>
    </el-popover>
  </div>
</template>

<style scoped lang="scss">
.add-data{

}
.panel-con{
  margin-top: 8px;
}
.close-btn{
  cursor: pointer;
  position: absolute;
  right: 20px;
  top: 15px;
}
</style>