import { Message } from 'element-ui';
import config from '~/config/app'
export default function ({ $axios, redirect, store }, inject) {

  $axios.setBaseURL(config.baseUrl + '/api')
  $axios.onRequest(config => {
    config.headers.token = store.state.token
    
  })
  $axios.onResponse((response) => {
    const {
      code,
      show,
      msg
    } = response.data;
    console.log(response.data)
    if (code == 0 && show && msg) {
      Message({
        message: msg,
        type: 'error'
      })
    }else if(code == -1){
      store.commit('logout')
      redirect('/account/login')
    }
  })
  $axios.onError(error => {
    Message({
      message: '系统错误',
      type: 'error'
    })
  })
  inject('get', $axios.$get)
  inject('post', $axios.$post)
}