import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home/Home'
import NotFoundComponent from '@/components/NotFoundComponent'

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '*',
      component: NotFoundComponent
    }
  ],
  mode: 'history'
})
