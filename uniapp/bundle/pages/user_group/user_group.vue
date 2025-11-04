<template>
    <view class="user-group">
        <tabs :active="active" @change="changeShow" :isScroll="false">
            <tab v-for="(item, index) in group" :key="index" :name="item.name">
                <group-list v-if="item.isShow" :ref="'group' + item.type" :groupType="item.type"></group-list>
            </tab>
        </tabs>
    </view>
</template>

<script>
    import {groupType} from "@/utils/type";

    export default {
        data() {
            return {
                active: "",
                group: [{
                    name: '全部',
                    type: groupType.ALL,
                    isShow: true
                }, {
                    name: '拼团中',
                    type: groupType.PROGESS,
                    isShow: false
                }, {
                    name: '拼团成功',
                    type: groupType.SUCCESS,
                    isShow: false
                }, {
                    name: '拼团失败',
                    type: groupType.FAIL,
                    isShow: false
                }]
            };
        },

        onLoad: function(options) {
            const {
                group
            } = this
            let type = options.type || groupType.ALL;
            let index = group.findIndex(item => item.type == type)
            this.changeShow(index);
        },

        methods: {
            changeShow(index) {
                if (index != -1) {
                    this.active = index
                    this.group[index].isShow = true
                }
            },
        }
    };
</script>
<style>

</style>
