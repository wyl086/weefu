import request from '@/utils/request'

// 关联商品
export function getCommunityGoods(params) {
    return request.get("community/goods", {params})
}

// 关联店铺
export function getCommunityShop(params) {
    return request.get("community/shop", {params})
}

// 推荐话题
export function getCommunityRecommendTopic() {
    return request.get("community/recommendTopic")
}

// 话题列表
export function getCommunityTopicLists(params) {
    return request.get("community/topicLists", {params})
}

// 发布文章
export function apiCommunityAdd(params) {
    return request.post("community/addArticle", params)
}

// 编辑文章
export function apiCommunityEdit(params) {
    return request.post("community/editArticle", params)
}

// 个人中心
export function getCommunityUserCenter(params) {
    return request.get("community_user/center", {params})
}

// 分类
export function getCommunityCate() {
    return request.get("community/cate")
}

// 发现页文章列表
export function getCommunityArticleLists(params) {
    return request.get("community/articleLists", {params})
}

// 关注/取消
export function apiCommunityFollow(params) {
    return request.post("community/follow", params)
}

// 获取设置
export function getCommunitySetting() {
    return request.get("community_user/getSetting")
}

// 提交设置
export function apiCommunitySetSetting(params) {
    return request.post("community_user/setSetting", params)
}

// 关注页-数据
export function getCommunityFollow(params) {
    return request.get("community/followArticle", { params })
}

// 个人页-作品列表
export function getCommunityWorksLists(params) {
    return request.get("community/worksLists", { params })
}

// 个人页-点赞列表
export function getCommunityLikeLists(params) {
    return request.get("community/likeLists", { params })
}

// 相关话题
export function getCommunityTopicArticle(params) {
    return request.get("community/topicArticle", { params })
}

// 文章详情
export function getCommunityDetail(params) {
    return request.get("community/detail", { params })
}

// 文章中的关联商品
export function getCommunityGoodsLists(params) {
    return request.get("community/relationGoods", { params })
}

// 文章中的关联店铺
export function getCommunityShopLists(params) {
    return request.get("community/relationShop", { params })
}

// 删除文章
export function apiCommunityDel(params) {
    return request.post("community/delArticle", params)
}

// 添加评论
export function apiCommunityCommentAdd(params) {
    return request.post("community_comment/add", params)
}

// 文章评论
export function getCommunityCommentLists(params) {
    return request.get("community_comment/lists", { params })
}

// 文章子级评论
export function getCommunityCommentChildLists(params) {
    return request.get("community_comment/commentChild", { params })
}

// 点赞 ｜ 取消 ｜ 作品点赞 ｜ 评论点赞
export function apiCommunityCommentLike(params) {
    return request.post("community/giveLike", params)
}

// 搜索记录
export function getCommunitySearchHistory() {
    return request.get("community_search/lists")
}

// 清空搜索记录
export function apiCommunityClearSearchHistory() {
    return request.post("community_search/clear")
}