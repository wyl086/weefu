import request from '@/utils/request'
import {client} from '@/utils/tools'




//获取首页数据接口
export function getHome(params) {
	return request.get('index/index', { params })
}

// 通过首页分类id获取数据
export function getIndexCategory(params) {
	return request.get('index/indexCategory', {params})
}
//获取菜单
export function getMenu(data) {
	return request.get('menu/lists', {
		params: data,
	});
}

//商品栏目
export function getGoodsColumn() {
	return request.get('goods_column/getGoodsColumnList');
}

//栏目商品
export function getGoodsListColumn(params) {
	return request.get('goods/getGoodsListByColumnId', {params});
}

//平台一级分类
export function getLevelOneList() {
	return request.get('goods_category/getLevelOneList');
}

// 一级分类的后代分类
export function getListByLevelOne(params) {
	return request.get('goods_category/getListByLevelOne', {params});
}


//品牌列表
export function getBrandList() {
	return request.get('goods_brand/getGoodsBrandList');
}

//文章分类
export function getCategoryList(data) {
    let {type} = data
    let url = type ? 'help/category' : 'article/category'
    delete data.type
    return request.get(url)
}

//文章列表
export function getArticleList(data) {
    let {type} = data
    let url = type ? 'help/lists' : 'article/lists'
    delete data.type
    return request.get(url, {
        params: data
    })
}

// 文章详情
export function getArticleDetail(data) {
    let {type} = data
    let url = type ? 'help/detail' : 'article/detail'
    delete data.type
    return request.get(url, {
        params: { id: data.id }
    })
}

//购物车
export function getCartList() {
	return request.get('cart/lists')
}

//商品详情
export function getGoodsDetail(data) {
	return request.get('goods/getGoodsDetail', {
		params: data
	});
}


//加入购物车

export function addCart(data) {
  return request.post('cart/add', data);
} 

 //购物车数量

export function getCartNum(params) {
  return request.get("cart/num", {params});
}


// 购物车数量更改
export function changeGoodsCount(data) {
	return request.post("cart/change", data)
}

// 单选/全选/店铺选择
export function selectedOpt(data) {
	return request.post("cart/selected", data)
}

// 删除商品
export function deleteGoods(data) {
	return request.post("cart/del", data);
}

//购物车选中状态
export function changeCartSelect(data) {
	return request.post('cart/selected', data)
}

//广告位
export function getAdList(data) {
	return request.get('ad_content/lists', {
		params: data
	});
}


// 商品分类
export function getCatrgory() {
	return request.get('goods_category/lists');
}


// 商品搜索

export function getGoodsList(data) {
	return request.get('goods/getGoodsList', {
		params: data
	});
}

//评价列表
export function getCommentList(data) {
	return request.get("goods_comment/lists", {
		params: data
	})
}

//评价分类
export function getCommentCategory(id) {
	return request.get("goods_comment/category", {
		params: {
			goods_id: id
		}
	})
}

//搜索页,热门搜索列表,和历史搜索列表
export function getSearchpage() {
	return request.get('search_record/lists');
}

// 清空历史搜索
export function clearSearch() {
	return request.post('search_record/clear');
}




//商品海报

export function getPoster(data) {
	return request.get("share/sharegoods", {
		params: data
	});
}

// 消息中心首页
export function getMessageLists() {
	return request.get("notice/index")
}

// 消息通知
export function getNoticeLists(params) {
	return request.get("notice/lists", {params})
}

// 城市列表
export function getCityLists() {
	return request.get("index/city")
}

// 逆解析定位地址
export function getGeocoder(params) {
	return request.get("index/geocoder", {params})
}