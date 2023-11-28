<script setup >
import {ref} from "vue";
import * as Cesium from "cesium";

const activeName = ref('')

const currentSelectStyle = ref('')


// 扩散点 参数
const kuoSanPointStyle = ref({
  color:'#d32828',
  radius:1500
})
// 文字标签参数
const labelStyle = ref({
  textKey:'',
  showBackground:false,
  backgroundColor:'#999',
  backgroundPadding: 6,
  pixelOffsetX:0,
  pixelOffsetY:-20,
  font:'14px  sans-serif',
  fillColor:'#ffffff',
  labelHeight:200
})
// 动态线参数
const dynamicLineStyle = ref({
  color:'#d32828'
})
// 动态墙体
const dynamicWallStyle = ref({
  color:'#d32828',
  height:1500
})


defineExpose({
  currentSelectStyle,kuoSanPointStyle,labelStyle,dynamicLineStyle,dynamicWallStyle
})
</script>

<template>
  <div class="style-select">
    <div>样式选择</div>
    <el-scrollbar :max-height="350">
      <el-collapse v-model="activeName" accordion>
        <el-collapse-item title="点" name="点">
          <el-radio label="点扩散波纹" type="radio" v-model="currentSelectStyle"></el-radio>
          <el-radio label="点标签" type="radio" v-model="currentSelectStyle"></el-radio>
          <el-divider></el-divider>
          <div v-if="currentSelectStyle === '点扩散波纹'">
            <div class="single-config">选择颜色: <el-color-picker show-alpha v-model="kuoSanPointStyle.color"></el-color-picker></div>
            <div class="single-config">选择扩散半径: <el-input placeholder="请输入扩散波纹半径" v-model="kuoSanPointStyle.radius"></el-input></div>
          </div>
          <div v-if="currentSelectStyle === '点标签'">
            <div class="single-config">标签文本key值: <el-input v-model="labelStyle.textKey"></el-input></div>
            <div class="single-config">字体: <el-input v-model="labelStyle.font"></el-input></div>
            <div class="single-config">字体颜色: <el-color-picker show-alpha v-model="labelStyle.fillColor"></el-color-picker></div>
            <div class="single-config">标签高度: <el-input-number v-model="labelStyle.labelHeight"></el-input-number></div>
            <div class="single-config">是否展示背景: <el-switch v-model="labelStyle.showBackground"></el-switch></div>
            <div class="single-config">背景颜色: <el-color-picker show-alpha v-model="labelStyle.backgroundColor"></el-color-picker></div>
            <div class="single-config">背景边距: <el-input-number v-model="labelStyle.backgroundPadding"></el-input-number></div>
            <div class="single-config">像素偏移X: <el-input-number v-model="labelStyle.pixelOffsetX"></el-input-number></div>
            <div class="single-config">像素偏移Y: <el-input-number v-model="labelStyle.pixelOffsetY"></el-input-number></div>

          </div>
        </el-collapse-item>
        <el-collapse-item title="线" name="线">
          <el-radio label="动态发光线" type="radio" v-model="currentSelectStyle"></el-radio>
          <el-radio label="普通线"  type="radio" v-model="currentSelectStyle"></el-radio>
          <el-divider></el-divider>
          <div v-if="currentSelectStyle === '动态发光线'">
            <div class="single-config">选择颜色: <el-color-picker show-alpha v-model="dynamicLineStyle.color"></el-color-picker></div>
          </div>
        </el-collapse-item>
        <el-collapse-item title="面" name="面">
          <el-radio label="动态立体围墙"  type="radio" v-model="currentSelectStyle"></el-radio>
          <el-radio label="填充面"  type="radio" v-model="currentSelectStyle"></el-radio>

          <el-divider></el-divider>
          <div v-if="currentSelectStyle === '动态立体围墙'">
            <div class="single-config">选择颜色: <el-color-picker show-alpha v-model="dynamicWallStyle.color"></el-color-picker></div>
            <div class="single-config">选择颜色: <el-input placeholder="请输入墙体高度" v-model="dynamicWallStyle.Height"></el-input></div>
          </div>
        </el-collapse-item>
      </el-collapse>
    </el-scrollbar>

  </div>
</template>

<style scoped lang="scss">
.style-select{
  padding: 12px;
  .single-config{
    display: flex;
    justify-content: space-between;
    .el-input{
      width: 50%;
    }
  }
}
</style>