#!/bin/bash

# Koala 云付测试脚本
# 请在使用前设置 HOST 变量，例如：
# HOST="http://127.0.0.1:8787" # ThinkPHP 内置服务默认端口
# 或者在命令行中执行：
# HOST="http://your.domain.com" sh koala_test.sh

HOST=${HOST:-"http://127.0.0.1:80"} # 默认指向 127.0.0.1:8787，请根据需要修改

MCH_ORDER_NO="KOALA_$(date +%Y%m%d%H%M%S)_$$"
MCH_REFUND_NO="REFUND_$(date +%Y%m%d%H%M%S)_$$"

echo "============================================="
echo "Koala Pay API Test Suite"
echo "Host: $HOST"
echo "Merchant Order No (for this run): $MCH_ORDER_NO"
echo "Merchant Refund No (for this run): $MCH_REFUND_NO"
echo "============================================="

echo "\n[1] Testing: Unified Order (GET) - wayCode=WX_JSAPI (with required params)"
# 必填参数：mchOrderNo, amount(分), subject, payWay, notifyUrl
curl "$HOST/api/koala/unifiedorder?mchOrderNo=$MCH_ORDER_NO&amount=1&subject=Koala%20Test%20Pay&body=Koala%20Test%20Body&wayCode=WX_JSAPI&notifyUrl=http%3A%2F%2Fnatapp.sodair.top%2Fapi%2Fkoala%2FnotifyPay&reqTime=$(date +%Y%m%d%H%M%S)&channelExtra=%7B%22openid%22%3A%22o6BcIwvSiRpfS8e_UyfQNrYuk2LI%22%7D&currency=cny&appId=68b150fde4b023b6991825f9"
echo "\n"

# echo "\n[2] Testing: Unified Order (POST as JSON) - payWay=ali_wap"
# curl -X POST "$HOST/api/koala/unifiedorder" \
#      -H "Content-Type: application/json" \
#      -H "Accept: application/json" \
#      -d "{\"mchOrderNo\":\"${MCH_ORDER_NO}_POST\",\"amount\":1,\"subject\":\"Koala Test Pay POST\",\"payWay\":\"ali_wap\"}"
# echo "\n"

# echo "\n[3] Testing: Order Query (GET - by mchOrderNo)"
# curl "$HOST/api/koala/orderQuery?mchOrderNo=$MCH_ORDER_NO"
# echo "\n"

# echo "\n[4] Testing: Refund (POST as JSON)"
# curl -X POST "$HOST/api/koala/refund" \
#      -H "Content-Type: application/json" \
#      -H "Accept: application/json" \
#      -d "{\"mchRefundNo\":\"$MCH_REFUND_NO\",\"amount\":1,\"reason\":\"Koala Test Refund\",\"mchOrderNo\":\"$MCH_ORDER_NO\"}"
# echo "\n"

# echo "\n[5] Testing: Pay Notify (Simulating callback with INVALID signature)"
# # 注意：此处的 sign 是无效的，仅用于测试验签失败的场景（应返回 'fail'）。
# # 真实场景中，sign 由 Koala 云付服务端计算并发送。
# curl -X POST "$HOST/api/koala/notifyPay" \
#      -H "Content-Type: application/json" \
#      -d '{"mchOrderNo":"'$MCH_ORDER_NO'","payOrderId":"DUMMY_PAY_ID","amount":1,"status":"SUCCESS","sign":"INVALID_SIGNATURE"}'
# echo "\n"

# echo "\n[6] Testing: Refund Notify (Simulating callback with INVALID signature)"
# # 注意：此处的 sign 是无效的，仅用于测试验签失败的场景（应返回 'fail'）。
# curl -X POST "$HOST/api/koala/refundNotify" \
#      -H "Content-Type: application/json" \
#      -d '{"mchRefundNo":"'$MCH_REFUND_NO'","refundId":"DUMMY_REFUND_ID","amount":1,"status":"SUCCESS","sign":"INVALID_SIGNATURE"}'
# echo "\n"

echo "============================================="
echo "Test script finished."
echo "============================================="