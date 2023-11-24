<script setup lang="ts">
import AddData from "@/components/AddData.vue";
import SaveScene from "@/components/selectScene.vue";
import NewProject from "@/components/newProject.vue";
import NewScene from "@/components/newScene.vue";
import Preview from "@/components/preview.vue";
</script>

<template>
  <div class="top-left-tool">
    <AddData></AddData>
    <save-scene></save-scene>
    <new-scene></new-scene>
    <new-project></new-project>
    <preview></preview>
  </div>
</template>

<style scoped lang="scss">
.top-left-tool{
  position: absolute;
  z-index: 1;
  margin: 8px;
  width: 80px;
  display: flex;
}
</style>