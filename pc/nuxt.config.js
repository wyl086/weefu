export default {
    // Global page headers: https://go.nuxtjs.dev/config-head
    head: {
        title: '',
        htmlAttrs: {
            lang: 'zh'
        },
        meta: [
            {charset: 'utf-8'},
            {name: 'viewport', content: 'width=device-width, initial-scale=1'},
            {hid: 'description', name: 'description', content: ''},
            {name: 'format-detection', content: 'telephone=no'}
        ],
        link: [
            {rel: 'icon', type: 'image/x-icon', href: '/favicon.ico'}
        ]
    },
    ssr: false,
    // Global CSS: https://go.nuxtjs.dev/config-css
    css: [
        '@/assets/css/element-variables.scss',
        '@/assets/css/common.scss',
        '@/assets/css/reset.scss',
        'swiper/css/swiper.css',
        '@/assets/css/element.scss',
        '@/assets/fonts/iconfont.css'
    ],

    // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
    plugins: [
        '@/plugins/element-ui',
        {src: '@/plugins/vue-awesome-swiper', mode: 'client'},
        '@/plugins/axios',
        '@/plugins/init',
    ],

    // Auto import components: https://go.nuxtjs.dev/config-components
    components: true,

    // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
    buildModules: [],

    // Modules: https://go.nuxtjs.dev/config-modules
    modules: [
        // https://go.nuxtjs.dev/axios
        '@nuxtjs/axios',
        '@nuxtjs/style-resources',
        ['cookie-universal-nuxt', { parseJSON: true }]
    ],

    // Axios module configuration: https://go.nuxtjs.dev/config-axios
    axios: {},

    // Build Configuration: https://go.nuxtjs.dev/config-build
    build: {
        transpile: [/^element-ui/],
    },

    router: {
        middleware: 'route',  // 即每次路由跳转会调用该中间件
        base: '/pc/'
        //多个中间件写法
        // middleware: ['route']
    },

    styleResources: {
        scss: "./assets/css/variables.scss"
    },
}
