import Vue from 'vue'
import Router from 'vue-router'
import map from '../components/map'

Vue.use(Router)

export default new Router({
  routes: [
    {
      name: 'map',
      path: '/',
      componnets: map
    }
  ]
})
