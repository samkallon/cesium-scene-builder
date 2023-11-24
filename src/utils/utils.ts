// 获取assets静态资源
export function getAssetsFile(url:string) {
    return new URL(`../assets/${url}`, import.meta.url).href;
};
