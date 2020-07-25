import 'font-awesome/css/font-awesome.css'
import Vue from 'vue'
import store from './config/store';
import App from './App'
import './config/bootstrap';
import router from './config/router';
import './config/msgs';
import './config/axios';
import './config/mq';

Vue.config.productionTip = false

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount('#app')