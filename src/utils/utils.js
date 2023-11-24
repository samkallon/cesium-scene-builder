// 获取assets静态资源
import {addDynamicLine, addDynamicWaveCircle, addWallGeojson, load3dtiles} from "@/utils/cesiumUtils.js";
import * as Cesium from "cesium";

export function getAssetsFile(url) {
    return new URL(`../assets/${url}`, import.meta.url).href;
};
export function commonAddData(resourceList) {
    resourceList.forEach(r=>{
        if (r.type === '3dtiles'){
            load3dtiles({url:r.url,name:r.name})
        }else if (r.type === 'geojson'){
            const geojson = r.geojson
            const currentStyle = r.style.name
            if (currentStyle === '点扩散波纹'){
                geojson.features.forEach((feature)=>{
                    addDynamicWaveCircle({
                        center: Cesium.Cartesian3.fromDegrees(...feature.geometry.coordinates, 30),
                        radius: r.style.radius,
                        type: r.name,
                        color: r.style.color
                    })
                })
            }else if(currentStyle === '动态发光线'){
                geojson.features.forEach((feature)=>{
                    addDynamicLine(feature.geometry.coordinates,r.name,r.style.color)
                })
            }else if (currentStyle === '动态立体围墙'){
                geojson.features.forEach((feature)=>{
                    addWallGeojson({
                        wallList:feature.geometry.coordinates,
                        type:r.name,
                        color:r.style.color,
                        maximumHeights:r.style.wallHeight
                    })
                })
            }
        }
    })
}