import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

const routes = [
  {
    path: '/class-data/:id',
    name: 'Main',
    component: () => import('../views/Main.vue')
  },
  {
    path: '/',
    alias: '/course-choice',
    name: 'CourseChoice',
    component: () => import('../views/CourseChoice.vue')
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
