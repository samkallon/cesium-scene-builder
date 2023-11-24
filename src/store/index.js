import { defineStore } from 'pinia'

// 第一个参数必须是全局唯一，可以是哟
export const useStore = defineStore('resourceList', {
    state: () => ({
        resourceList: [],
        currentProject:'',
        currentScene:'',
        projectList:[],
        sceneList:[]

    })
})