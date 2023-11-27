<script setup >
import {onMounted} from 'vue'
import { Viewer } from 'cesium'
import * as Cesium from "cesium";
import TopLeftTool from "@/components/TopLeftTool.vue";
import ResourceList from "@/components/resourceList.vue";
import ReturnToEdit from "@/components/returnToEdit.vue";
import {useStore} from '@/store'
const store = useStore()
window.Cesium = Cesium

Cesium.Camera.DEFAULT_VIEW_RECTANGLE = Cesium.Rectangle.fromDegrees(
    75.0, // 西经
    0.0, // 南纬
    140.0, // 东经
    60.0 // 北纬
);
onMounted(()=>{
  window.viewer = new Viewer('cesiumContainer',{
    animation:false,
    timeline:false,
    navigationHelpButton:false,
    sceneModePicker:false,
    scene3DOnly:true,
    infoBox:false
  })

})

</script>

<template>
  <div id="cesiumContainer" ref="viewerDivRef">
    <top-left-tool v-show="!store.currentPreview"></top-left-tool>
    <resource-list v-show="!store.currentPreview"></resource-list>
    <return-to-edit v-show="store.currentPreview"></return-to-edit>
  </div>
</template>

<style scoped>
#cesiumContainer {
  width: 100%;
  height: 100%;
  position: relative;
}
</style>
