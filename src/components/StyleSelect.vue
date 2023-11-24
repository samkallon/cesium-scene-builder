<script setup >
import {ref} from "vue";

const activeName = ref('')

const currentSelectStyle = ref('')
const color = ref('rgba(102,245,30,0.94)')
const nameKey = ref('')

const radius = ref(1500)

const wallHeight = ref(5000)

defineExpose({
  currentSelectStyle,color,nameKey,wallHeight,radius
})
</script>

<template>
  <div class="style-select">
    <div>样式选择</div>
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="点" name="点">
        <el-radio label="点扩散波纹" type="radio" v-model="currentSelectStyle"></el-radio>
        <el-radio label="点标签" type="radio" v-model="currentSelectStyle"></el-radio>
        <el-input v-if="currentSelectStyle === '点标签'" placeholder="请输入名称字段" v-model="nameKey"></el-input>
        <el-input v-if="currentSelectStyle === '点扩散波纹'" placeholder="请输入扩散波纹半径" v-model="radius"></el-input>
        <el-color-picker show-alpha v-model="color"></el-color-picker>
      </el-collapse-item>
      <el-collapse-item title="线" name="线">
        <el-radio label="动态发光线" type="radio" v-model="currentSelectStyle"></el-radio>
        <el-radio label="普通线"  type="radio" v-model="currentSelectStyle"></el-radio>
        <el-config-provider locale="zh-cn">
          <el-color-picker v-model="color" show-alpha></el-color-picker>
        </el-config-provider>
      </el-collapse-item>
      <el-collapse-item title="面" name="面">
        <el-radio label="动态立体围墙"  type="radio" v-model="currentSelectStyle"></el-radio>
        <el-input v-if="currentSelectStyle === '动态立体围墙'" placeholder="请输入墙体高度" v-model="wallHeight"></el-input>

        <el-radio label="填充面"  type="radio" v-model="currentSelectStyle"></el-radio>
        <el-color-picker v-model="color" show-alpha></el-color-picker>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<style scoped lang="scss">
.style-select{
  padding: 12px;
}
</style>