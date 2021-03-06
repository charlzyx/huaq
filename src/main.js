import Vue from 'vue';
import Vant from 'vant';
import vcolorpicker from 'vcolorpicker';
import 'vant/lib/index.css';
import '@vant/touch-emulator';
import './registerServiceWorker';
import App from './App.vue';

Vue.use(vcolorpicker);
Vue.use(Vant);
Vue.config.productionTip = false;

new Vue({
  render: h => h(App),
}).$mount('#app');
