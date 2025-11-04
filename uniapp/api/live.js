import request from '@/utils/request'

// 直播间列表
export function getLiveLists(params) {
    return request.get("live/lists", {params})
}
// 店铺直播间列表
export function getShopLive(params) {
    return request.get("live/shopLive", {params})
}
