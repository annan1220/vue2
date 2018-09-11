// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
// 1.定义路由组件
import goods from './components/goods/goods';
import ratings from './components/ratings/ratings';
import seller from './components/seller/seller';
import './common/stylus/index.styl';

Vue.use(VueRouter);
Vue.use(VueResource);

// 2.定义路由
const routes = [
  {path: '/goods', component: goods},
  {path: '/ratings', component: ratings},
  {path: '/seller', component: seller}
];
// 3.创建路由实例
const router = new VueRouter({
  // mode: 'history',
  linkActiveClass: 'active',
  routes
});
// 4.创建和挂载跟实例
/* eslint-disable no-new */
 new Vue({
  el: '#app',
  router,
  render: h => h(App)
});

router.push('/goods');
