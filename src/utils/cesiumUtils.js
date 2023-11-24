import {bbox, buffer, center} from '@turf/turf'
import {getAssetsFile} from "./utils.js";

import * as Cesium from "cesium";
import {set} from "lodash";

/**
 * 加载3dtiles
 * @param url  http://124.70.11.35/model/changde/d3dtiles/no5-3dtiles/merge_tile.json
 * @param name
 */
export async function load3dtiles({url,name}) {
    const tileset = await Cesium.Cesium3DTileset.fromUrl(
        url,
        {
            maximumScreenSpaceError: 16, //越小 同等距离下 越精细
            dynamicScreenSpaceError: true,
            skipLevels: 5,
            skipLevelOfDetail: true,  //让cesium在遍历请求tile.json的时候可以加载图块
            skipScreenSpaceErrorFactor: 128,//这三个skip的配置可以让模型立即加载
            cullRequestsWhileMovingMultiplier: 10
        }
    );
    if (name){
        tileset.name = name
    }
    window.viewer.scene.primitives.add(tileset)
    window.viewer.flyTo(tileset,{
        offset: new Cesium.HeadingPitchRange(0.0, Cesium.Math.toRadians(-45.0), 0),
        duration:2
    })
    return tileset
}

export function getEntitiesByName(name) {
    const entityList = window.viewer.entities._entities._array
    return entityList.filter(e => e.name === name)
}

/**
 *  设置实体的显隐
 * @param name
 * @param show
 * @param setStyle  设置实体的样式, 入驻企业和路径漫游展示相同实体,但是样式不同
 */
export function showOrHideEntitiesByName(name, show, setStyle) {
    const entities = getEntitiesByName(name)
    entities.forEach(e => {
        e.show = show
    })
    if (setStyle) {
        entities.forEach(e => {
            Object.keys(setStyle).forEach(key => {
                set(e, key, setStyle[key])
            })
        })
    }
    window.viewer.scene.primitives._primitives.filter(e => e.name === name).forEach(e => {
        e.show = show
    })
    window.viewer.scene.groundPrimitives._primitives.filter(e => e.name === name).forEach(e => {
        e.show = show
    })
}

/**
 * 添加动态墙体
 * @param wallList   cartesian3 list
 * @param maximumHeights 最大高度
 * @param minimumHeights 最小高度
 * @param type
 * @param color
 */
export function addWallGeojson({
                                 wallList,
                                 maximumHeights = 0,
                                 minimumHeights = 1000,
                                 type, color
                               }) {
  const geometryInstances = wallList.map(positions => {
    positions.push(positions[0])
    return new Cesium.GeometryInstance({
      geometry: new Cesium.WallGeometry({
        positions: Cesium.Cartesian3.fromDegreesArray(positions.flat(3)),
        maximumHeights: positions.map(e => maximumHeights),
        minimumHeights: positions.map(e => minimumHeights),
        vertexFormat: Cesium.MaterialAppearance.VERTEX_FORMAT
      })
    })
  })
  const wall = new Cesium.Primitive({
    show: true,
    geometryInstances,
    appearance: new Cesium.MaterialAppearance({
      material: new Cesium.Material({
        fabric: {
          type: 'DynamicWall',
          uniforms: {
            image: getAssetsFile('imgs/materialImg/wall.png'),
            color: new Cesium.Color.fromCssColorString(color || '#00d0ff'),
            speed: 2
          },
          source: `
              czm_material czm_getMaterial(czm_materialInput materialInput) {
                  czm_material material = czm_getDefaultMaterial(materialInput);
                  vec2 st = materialInput.st;
                  vec4 colorImage = texture(image, vec2((1. - fract(st.t - speed * czm_frameNumber * 0.005)), st.t));
                  vec4 fragColor;
                  fragColor.rgb = color.rgb / 1.0;
                  fragColor = czm_gammaCorrect(fragColor); // 伽马校正
                  material.alpha = colorImage.a * color.a * .5;
                  material.diffuse = color.rgb;
                  material.emission = fragColor.rgb;
                  return material;
              }
          `
        },
        // translucent: function () {
        //   return true
        // },
      })
    })
  })
  wall.name = type
  window.viewer.scene.primitives.add(wall)
}

/**
 * 添加动态线
 * @param positions  flat到一维的经纬度
 * @param type
 * @param color
 */
export function addDynamicLine(positions, type, color) {
    window.viewer.entities.add({
        name: type,
        polyline: {
            positions: Cesium.Cartesian3.fromDegreesArray(positions.flat(3)),
            width: 150,
            material: new Cesium.PolylineGlowMaterialProperty({
                glowPower: 0.02,
                taperPower: 1,
                color: Cesium.Color.fromCssColorString(color || '#ff850a')
            }),
            clampToGround: true,
        },
    });
    const linePrimitive = new Cesium.GroundPolylinePrimitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.GroundPolylineGeometry({
                positions:Cesium.Cartesian3.fromDegreesArray(positions.flat(3)),
                width: 6.0,
                vertexFormat: Cesium.PolylineMaterialAppearance.VERTEX_FORMAT,
            }),
        }),
        appearance: new Cesium.PolylineMaterialAppearance({
            material: new Cesium.Material({
                fabric: {
                    type: 'DynamicColor',
                    // type: Cesium.Material.PolylineGlowType,
                    uniforms: {
                        u_image: getAssetsFile('imgs/materialImg/wall-1.png'),
                        u_color: Cesium.Color.fromCssColorString(color||'#ff850a'),
                        u_speed: 2,
                    },
                    source: `
            czm_material czm_getMaterial(czm_materialInput materialInput) {
                czm_material material = czm_getDefaultMaterial(materialInput);
                vec2 st = materialInput.st;
                vec4 colorImage = texture(u_image, vec2((1. - fract(st.s - u_speed * czm_frameNumber * 0.01)), st.t));
                vec4 fragColor;
                fragColor.rgb = u_color.rgb / 1.0;
                fragColor = czm_gammaCorrect(fragColor); // 伽马校正
                material.alpha = colorImage.a * u_color.a;
                material.diffuse = u_color.rgb;
                material.emission = fragColor.rgb;
                return material;
            }
        `,
                },
            }),
        }),
    })
    linePrimitive.name = type;
    window.viewer.scene.groundPrimitives.add(linePrimitive);
}
//
export function addDynamicWaveCircle({center, radius, type, color}) {
    const circlePrimitive = new Cesium.Primitive({
        geometryInstances: new Cesium.GeometryInstance({
            geometry: new Cesium.CircleGeometry({
                center,
                radius,
                height: 20,
                vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT,
            })
        }),
        appearance: new Cesium.EllipsoidSurfaceAppearance({
            aboveGround: true,
            material: new Cesium.Material({
                fabric: {
                    type: 'DynamicCircleWave',
                    uniforms: {
                        u_color: Cesium.Color.fromCssColorString(color || '#f5dc23'),
                        u_speed: 0.4,
                        u_gradient: 5.0,
                        u_count: 2
                    },
                    source: `
            czm_material czm_getMaterial(czm_materialInput materialInput) {
              czm_material material = czm_getDefaultMaterial(materialInput);
              material.diffuse = 2.5 * u_color.rgb;
              vec2 st = materialInput.st;
              vec3 str = materialInput.str;
              float dis = distance(st, vec2(0.5, 0.5));
              float per = fract(u_speed * czm_frameNumber * 0.01);
              if (abs(str.z) > 0.001) {
                discard;
              }
              if (dis > 0.5) {
                discard;
              } else {
                float perDis = 0.5 / u_count;
                float disNum;
                float bl = .0;
                for (int i = 0; i <= 9; i++) {
                  if (float(i) <= u_count) {
                    disNum = perDis *float(i) - dis + per / u_count;
                    if (disNum > 0.0) {
                      if (disNum < perDis) {
                        bl = 1.0 - disNum / perDis;
                      } else if(disNum - perDis < perDis) {
                        bl = 1.0 - abs(1.0 - disNum / perDis);
                      }
                      material.alpha = pow(bl, u_gradient);
                    }
                  }
                }
              }
              return material;
            }
            `,
                },
            }),
        }),
    })
    circlePrimitive.name = type
    window.viewer.scene.primitives.add(circlePrimitive)
}


//
export function removeEntitiesAndPrimitivesByName(name) {
    const entities = getEntitiesByName(name)
    entities.forEach(e => {
        window.viewer.entities.remove(e)
    })
    const primitives = window.viewer.scene.primitives._primitives.filter(e => e.name === name)
    primitives.forEach(e => {
        window.viewer.scene.primitives.remove(e)
    })
}
//
/**
 *
 * @param geojson featureCollection中单个feature
 * @param showGeo 是否展示相关的实体 如墙体,标签 默认展示 也可以只缩放到位置,不展示
 * @returns {Promise<void>}
 */
export async function locationToGeojson(geojson, showGeo = false) {
    removeEntitiesAndPrimitivesByName('location')
    let rec
    if (geojson.features.length === 1 && geojson.features[0].geometry.type === 'Point'){
        const geo = buffer(geojson, 100, {units: 'meters', steps: 4})
        rec = bbox(geo)
    }else{
        rec = bbox(geojson)
    }
    const loactionTectEntity = window.viewer.entities.add({
        name: 'location',
        rectangle: {
            coordinates: Cesium.Rectangle.fromDegrees(...rec),
            material: Cesium.Color.GREEN.withAlpha(0.0),
            height: 10.0,
            outline: false
        }
    })
    window.viewer.flyTo(loactionTectEntity, {
        offset: new Cesium.HeadingPitchRange(0.0, Cesium.Math.toRadians(-45.0), 0),
        duration:2
    })
}

export function removeAllPrimitive() {
    window.viewer.scene.primitives._primitives.forEach(e=>window.viewer.scene.primitives.remove(e))
    window.viewer.scene.groundPrimitives._primitives.forEach(e=>window.viewer.scene.primitives.remove(e))
}
//
// /**
//  *
//  * @param featureCollection
//  * @param show
//  * @param type  该图层是什么类型 可能是园区配套, 周边设施 标准化厂房
//  * @returns {Promise<void>}
//  */
// export async function addPolygonCenterLabel(featureCollection, type, defaultShow = false, labelOptions) {
//   let imgType = imgTypeDic[type] || type
//   for (let i = 0; i < featureCollection.features.length; i++) {
//     const f = featureCollection.features[i];
//     const centerPoint = f.properties.centerPoint || center(f.geometry)
//
//     if (!f.properties.hideLabel) {
//       // 求中心点
//       const textLength = f.properties['企业名称'].length
//       if (f.properties.imgType) {
//         // 决定了用那张图片做文字的背景图片
//         imgType = f.properties.imgType
//       }
//       const img = textLength > 4 ? getAssetsFile(`imgs/marker/${imgType}long.png`) : getAssetsFile(`imgs/marker/${imgType}.png`)
//       const width = textLength * 27
//       const text = f.properties['企业名称']
//       const canvas = await getBillbordCanvas(
//         {
//           img,
//           text,
//           textFontSize: '24px',
//           textPositionY: 26,
//           textPositionX: textLength * 2,
//           ratio: 1,
//           width, height: 35
//         })
//       const entity = window.viewer.entities.add({
//         show: defaultShow,
//         name: type,
//         position: Cesium.Cartesian3.fromDegrees(...centerPoint.geometry.coordinates, f?.properties?.labelHeight || labelOptions?.height || 60),
//         billboard: {
//           image: canvas,
//           disableDepthTestDistance: Number.POSITIVE_INFINITY,
//           scale: 0.8,
//         },
//         qymc: f.properties['企业名称']
//       })
//     }
//
//     if (!f.properties.hidePyramid) {
//       // 添加旋转锥子
//       paramsloadPyramid({
//         viewer: window.viewer,
//         modelUrl: '/glb/pyramid.glb',
//         code: f.properties['企业名称'],
//         color: f.properties.pyramidColor || typeColorDic[type],
//         type,
//         pyramidPosition: {
//           lon: centerPoint.geometry.coordinates[0],
//           lat: centerPoint.geometry.coordinates[1],
//           height: f.properties.pyramidHeight || 50,
//           properties: {}
//         }
//       })
//     }
//
//     if (type !== 'zbss') {
//       addWallGeojson(getWallDataFromGeojson(featureCollection), f.properties?.maxWallHeight || 35, 10, type, defaultShow)
//     }
//
//     // 添加路径线
//     if (type === 'zbss') {
//       if (f.properties.path) {
//         addDynamicLine(Cesium.Cartesian3.fromDegreesArray(f.properties.path), 'zbss', f.properties['企业名称'])
//       }
//       if (!f.properties.hideDynamicCircle) {
//         // 添加动态扩散圆
//         addDynamicWaveCircle({
//           center: Cesium.Cartesian3.fromDegrees(...centerPoint.geometry.coordinates, 30),
//           radius: f.properties.dynamicCircleRadius || 1200,
//           type: 'zbss',
//           color: f.properties.dynamicCircleColor || '#d59408'
//         })
//       }
//     }
//   }
//   return Promise.resolve(true)
// }
//
// export async function addPointLabel(featureCollection, type) {
//   for (let i = 0; i < featureCollection.features.length; i++) {
//     const f = featureCollection.features[i];
//     if (!f.geometry) {
//       continue
//     }
//     if (f.geometry.type === 'MultiPolygon') {
//       addPolygonCenterLabel({ type: 'FeatureCollection', features: [f] }, '入驻企业')
//       continue
//     }
//     const img = getAssetsFile('imgs/marker/pointMarker.png')
//     const text = f.properties['qymc']
//     const canvas = await getBillbordCanvas({ img, text, ratio: 1, width: 465, height: 60 })
//     const entity = window.viewer.entities.add({
//       show: false,
//       name: type,
//       position: Cesium.Cartesian3.fromDegrees(...f.geometry.coordinates, 40),
//       billboard: {
//         image: canvas,
//         disableDepthTestDistance: Number.POSITIVE_INFINITY,
//         // scale: 0.6,
//         scaleByDistance: new Cesium.NearFarScalar(1800, 0.6, 3000, 0.4),
//         // translucencyByDistance: new Cesium.NearFarScalar(1800, 1, 3000, 0.1)
//       }
//     })
//   }
// }
//
// /**
//  * 加载锥子
//  * @param viewer
//  * @param options
//  */
// export async function paramsloadPyramid({viewer, modelUrl, pyramidPosition, code, color, properties, type}) {
//   if (!modelUrl) {
//     return
//   }
//   let toRadians = Cesium.Math.toRadians;
//   // 模型颜色
//   let position = Cesium.Cartesian3.fromDegrees(pyramidPosition.lon, pyramidPosition.lat, pyramidPosition.height);
//   let heading = 3.76
//   let hpr = new Cesium.HeadingPitchRoll(
//     toRadians(heading),
//     toRadians(0),
//     toRadians(0)
//   );
//   const timeNow = new Date().getTime()
//   let modelMatrix = Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr);
//   let model = await Cesium.Model.fromGltfAsync({
//     id: `pyramid-${code}`,
//     url: getAssetsFile("glb/pyramid.glb"),
//     scale: 30,
//     modelMatrix,
//     show: false,
//     color: Cesium.Color.fromCssColorString(color),
//     colorBlendMode: Cesium.ColorBlendMode.REPLACE,
//     maximumScale: 5000,
//     minimumPixelSize: 30, // 模型最小像素
//     scene: viewer.scene,
//     heightReference: Cesium.HeightReference.RELATIVE_TO_GROUND,
//   })
//   model.name = type
//   viewer.scene.primitives.add(model);
//
//   // setInterval(() => {
//   //   model.modelMatrix = getNewMatrix()
//   // }, 100)
//
//   function getNewMatrix() {
//     const heightChangeV = Math.sin((new Date().getTime() - timeNow) / 1000) * 20
//     let position = Cesium.Cartesian3.fromDegrees(pyramidPosition.lon, pyramidPosition.lat, pyramidPosition.height);
//     let hpr = new Cesium.HeadingPitchRoll(
//       toRadians(heading += 3.76),
//       toRadians(0),
//       toRadians(0)
//     );
//     return Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr);
//   }
// }
//
// /**
//  * 生成billbodr 的canvas
//  * @param img
//  * @param text
//  */
// async function getBillbordCanvas({
//   img,
//   ratio,
//   width,
//   height,
//   text,
//   textFontSize = '36px',
//   textPositionX = width / 10 + 10,
//   textPositionY = height / 2 + 15
// }) {
//   return new Promise(resolve => {
//     const canvas = document.createElement("canvas"); //创建canvas标签
//     const ctx = canvas.getContext("2d");
//
//     canvas.style.opacity = 1;
//     canvas.width = width * ratio;
//     canvas.height = height * ratio;
//
//     //然后将画布缩放，将图像放大ratio倍画到画布上 目的 使图片文字更加清晰
//     ctx.scale(ratio, ratio);
//     const image = new Image();
//     image.src = img;
//     // 图片创建是异步操作，需要在图片完成之后，再写入文字，能保证文字在图片上方。
//     // 如果不在里面，会出现图片覆盖文字
//     image.onload = function () {
//       ctx.drawImage(image, 0, 0, width, height);
//       // 名称文字
//       ctx.font = `bold ${textFontSize} YouSheBiaoTiHei`;
//       const gradient = ctx.createLinearGradient(0, 5, 0, canvas.height - 45);
//       gradient.addColorStop(0, "#FFFFFF");
//       gradient.addColorStop(1, "#ffffff");
//       ctx.fillStyle = gradient;
//       ctx.fillText(text, textPositionX, textPositionY);
//       resolve(canvas)
//     };
//   })
// }
//
// /**
//  * 平移3dtile  东北上
//  * @param tileset
//  * @param x
//  * @param y
//  * @param z
//  */
// export function moveTileset({ tileset, x, y, z }) {
//   const tileset_center = tileset.boundingSphere.center;
//   let frompoint_to_world_matrix = Cesium.Transforms.eastNorthUpToFixedFrame(tileset_center)
//   let local_translation = new Cesium.Cartesian3(x, y, z)
//   const result = new Cesium.Cartesian3(0, 0, 0);
//   // 转换矩阵左乘局部平移向量，结果存储在 result 中，结果是世界坐标下的平移终点向量
//   Cesium.Matrix4.multiplyByPoint(frompoint_to_world_matrix, local_translation, result);
//   const targetpoint_to_world_matrix = Cesium.Transforms.eastNorthUpToFixedFrame(result);
//   // 向量相减，得到世界坐标下的平移向量
//   const world_translation = new Cesium.Cartesian3(
//     targetpoint_to_world_matrix[12] - frompoint_to_world_matrix[12],
//     targetpoint_to_world_matrix[13] - frompoint_to_world_matrix[13],
//     targetpoint_to_world_matrix[14] - frompoint_to_world_matrix[14],
//   );
//   // 构造平移矩阵
//   tileset.modelMatrix = Cesium.Matrix4.fromTranslation(world_translation)
// }
//
// export function addWaterRange(data) {
//   const waterPrimitive = new Cesium.Primitive({
//     allowPicking: false,
//     geometryInstances: new Cesium.GeometryInstance({
//       geometry: new Cesium.PolygonGeometry({
//         polygonHierarchy: new Cesium.PolygonHierarchy(
//           Cesium.Cartesian3.fromDegreesArrayHeights(data.map(e => [e.lng, e.lat, 500]).flat())
//         ),
//         height: 10.1,
//         vertexFormat: Cesium.EllipsoidSurfaceAppearance.VERTEX_FORMAT
//       })
//     }),
//     appearance: new Cesium.EllipsoidSurfaceAppearance({
//       aboveGround: true,
//       material: new Cesium.Material({
//         fabric: {
//           type: 'Water',
//           uniforms: {
//             baseWaterColor: new Cesium.Color.fromCssColorString('rgba(17,43,32,0.82)'),
//             blendColor: new Cesium.Color.fromCssColorString('#a8a191'),
//             normalMap: buildModuleUrl('Assets/Textures/waterNormalsSmall.jpg'),
//             frequency: 200.0,
//             animationSpeed: 0.01,
//             amplitude: 5.0
//           }
//         }
//       })
//     })
//   })
//   window.viewer.scene.primitives.add(waterPrimitive)
//   return waterPrimitive
// }
//
// const distinationDic = {
//   '高铁站': '12公里',
//   '常德桃花源机场': '25公里',
//   '常德港': '24公里',
// }
// const labelIndexDic = {
//   '高铁站': 60,
//   '常德桃花源机场': 60,
//   '常德港': 180,
// }

//
// export function getWallDataFromGeojson(geojson) {
//   return geojson.features.map(f => {
//     const degreesArray = f.geometry.coordinates[0][0].flat()
//     degreesArray.pop()
//     degreesArray.pop()
//     const wallPositions = Cesium.Cartesian3.fromDegreesArray(degreesArray)
//     return wallPositions
//   })
// }
//


//
// /**
//  * 生成曲线
//  * @param twoPoints [lon1,lat1,lon2,lat2]
//  * @returns {Cartesian3[]}
//  */
// export function parabola(twoPoints) {  //抛物线绘制
//   let s = []
//   let startPoint = [twoPoints[0], twoPoints[1], 0]; //起点的经度、纬度
//   s = s.concat(startPoint)
//   let step = 40;  //线的多少，越多则越平滑(但过多浏览器缓存也会占用越多)
//   let heightProportion = 0.125; //最高点和总距离的比值
//   let dLon = (twoPoints[2] - startPoint[0]) / step;  //经度差值
//   let dLat = (twoPoints[3] - startPoint[1]) / step;  //纬度差值
//   let deltaLon = dLon * Math.abs(111000 * Math.cos(twoPoints[1]));  //经度差(米级)
//   let deltaLat = dLat * 111000;  //纬度差(米),1纬度相差约111000米
//   let endPoint = [0, 0, 0];  //定义一个端点（后面将进行startPoint和endPoint两点画线）
//   let heigh = (step * Math.sqrt(deltaLon * deltaLon + deltaLat * deltaLat) * heightProportion).toFixed(0) * 2;
//   let x2 = (10000 * Math.sqrt(dLon * dLon + dLat * dLat)); //小数点扩大10000倍，提高精确度
//   let a = (heigh / (x2 * x2));
//
//   function y(x, height) {
//     return height - a * x * x;
//   }
//
//   for (let i = 1; i <= step; i++) {  //逐“帧”画线
//     endPoint[0] = startPoint[0] + dLon; //更新end点经度
//     endPoint[1] = startPoint[1] + dLat; //更新end点纬度
//     let x = x2 * (2 * i / step - 1);  //求抛物线函数x
//     endPoint[2] = (y(x, heigh)).toFixed(0) * 1;  //求end点高度
//     s = s.concat(endPoint)
//
//     // end点变为start点
//     startPoint[0] = endPoint[0];
//     startPoint[1] = endPoint[1];
//     startPoint[2] = endPoint[2];
//   }
//   return Cesium.Cartesian3.fromDegreesArrayHeights(s)
// }
//
// /**
//  *  三个参数都可以在 window.viewer.camera中复制到
//  * @param positon
//  * @param direction
//  * @param up
//  */
// export function setCameraView(positon, direction, up, callback) {
//   window.viewer.camera.flyTo({
//     destination: new Cesium.Cartesian3(positon.x, positon.y, positon.z),
//     orientation: {
//       direction: new Cesium.Cartesian3(direction.x, direction.y, direction.z),
//       up: new Cesium.Cartesian3(up.x, up.y, up.z)
//     },
//     complete: () => {
//       if (callback)
//         callback()
//     }
//   })
// }
//
// /**
//  *  添加点列表实体 用于调试飞行路径
//  * @param list
//  */
// export function addPointList(list) {
//   list.forEach((e, i) => {
//     const entity = window.viewer.entities.add({
//       position: Cesium.Cartesian3.fromDegrees(e.lng, e.lat, e.height),
//       point: {
//         pixelSize: 20
//       },
//       label: {
//         text: i + 1 + '',
//         pixelOffset: new Cesium.Cartesian2(0, -20),
//         showBackground: true,
//         backgroundColor: Cesium.Color.BLACK
//       }
//     })
//   })
// }
