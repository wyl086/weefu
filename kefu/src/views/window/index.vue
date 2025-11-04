<template>
    <div class="window-contain">
        <div class="window">
            <!-- Header -->
            <header class="window-header">
                <the-window-header :isStatus="isStatus"></the-window-header>
            </header>

            <section class="window-content">
                <!-- Aside Left -->
                <aside class="window-aside--left">
                    <the-window-aside-left
                        :current="sessionID"
                        @change="changeSession"
                        ref="user"
                    ></the-window-aside-left>
                </aside>

                <!-- Main -->
                <main class="window-main">
                    <the-window-main
                        :to-id="sessionID"
                        :from-id="userInfo.id"
                        ref="chat"
                    ></the-window-main>
                </main>

                <!-- Aside Right -->
                <aside class="window-aside--right">
                    <the-window-aside-right :to-id="sessionID"></the-window-aside-right>
                </aside>
            </section>
        </div>
        <PromptTone ref="promptToneRef" />
    </div>
</template>


<script>
import TheWindowHeader from './components/TheWindowHeader'
import TheWindowMain from './components/TheWindowMain'
import TheWindowAsideLeft from './components/TheWindowAsideLeft'
import TheWindowAsideRight from './components/TheWindowAsideRight'
import PromptTone from '@/components/PromptTone/index'

import Socket from '@/utils/socket'
import config from '@/config'
import { E_Msg, E_MsgEvent } from '@/utils/enum'
import { mapGetters, mapActions } from 'vuex'

export default {
    name: 'Window',

    components: {
        TheWindowHeader,
        TheWindowAsideLeft,
        TheWindowAsideRight,
        TheWindowMain,
        PromptTone
    },

    data() {
        return {
            sessionID: '',
			isStatus: false,
        }
    },

    computed: {
        ...mapGetters(['token', 'shopId', 'userInfo', 'wsUrl']),
    },

    provide() {
        return {
            sendMessage: this.sendMessage,
            send: this.send,
			closeChatServe: this.closeChatServe,
			reChatServe: this.reChatServe,
        }
    },

    async created() {
		
		
        await this.getUserInfo()
        await this.initChatServe()
    },
    beforeDestroy() {
        this.closeChatServe()
    },
    methods: {
        ...mapActions(['getUserInfo']),

        /**
         * 发送消息
         */
        sendMessage(data) {
            this.send(E_MsgEvent['CHAT'], {
                to_type: 'user',
                ...data,
            })
        },

        /**
         * 通用发送
         */
        send(event, data) {
            this.socketServe.send({
                event,
                data: data,
            })
        },
		
		// 关闭连接
		closeChatServe() {
			this.socketServe.close()
		},
		
		// 重新连接
		reChatServe() {
			this.socketServe.init()
		},

        /**
         * 初始化聊天服务
         */
        initChatServe() {
            return new Promise((resolve, reject) => {
                const _this = this
                this.socketServe = new Socket({
                    ws: this.wsUrl,

                    params: {
                        token: this.token,
                        type: 'kefu',
                        client: 5,
                        shop_id: this.shopId,
                    },

                    open() {
						_this.isStatus = true
                        resolve()
                    },

                    message({ data }) {
                        const {event, data: content} = JSON.parse(data) || {}
                        
                        switch(event) {
                            case E_MsgEvent['CHAT']:
                                _this.$refs['chat'].$emit('message', content)
                                _this.$refs['user'].$emit('message', content)
                                _this.$refs.promptToneRef?.play()
                                break
                            case E_MsgEvent['ERROR']:
                                _this.$message.error(content.msg)
                                break
                            case E_MsgEvent['NOTICE']:
                                _this.$message.info(content.msg)
                                break
                            case E_MsgEvent['PING']:
                                console.log('===============心跳============')
                                break
                            case E_MsgEvent['USER_ONLINE']:
                                _this.$refs['user'].$emit('useronline', content)
                                break
                             case E_MsgEvent['TRANSFER']:
                            _this.$refs['user'].$emit('transfer', content)
                                break
                                
                        }
                    },

                    error(e) {
                        reject()
                    },

                    close() {
						_this.isStatus = false
					},
                })
            })
        },

        /**
         * 切换会话
         */
        changeSession(userID) {
            console.log(userID)
            this.sessionID = userID
        },
    }
}
</script>


<style lang="scss" scoped>
.window-contain {
    $--window-width: 1200px;
    $--window-height: 800px;

    $--window-header-height: 60px;
    $--window-aside-l-width: 240px;
    $--window-aside-r-width: 240px;

    display: flex;
    justify-content: center;
    align-items: center;
    padding-top: 50px;
    width: 100vw;
    min-height: 800px;
    min-width: 1200px;
    .window {
        display: flex;
        flex-direction: column;
        width: $--window-width;
        height: $--window-height;
        background-color: #ffffff;

        &-header {
            height: $--window-header-height;
        }

        &-content {
            flex: 1;
            display: flex;
            flex-direction: row;

            .window-aside {
                &--left {
                    width: $--window-aside-l-width;
                    border-right: 1px solid $--border-color-base;
                }

                &--right {
                    width: $--window-aside-r-width;
                    border-left: 1px solid $--border-color-base;
                }
            }

            .window-main {
                flex: 1;
            }
        }
    }
}
</style>
