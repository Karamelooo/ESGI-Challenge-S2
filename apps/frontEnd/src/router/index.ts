import { authMiddleware } from '@/middlewares/auth.middleware'
import { useAuthStore } from '@/stores/auth'
import AdminProductView from '@/views/AdminProductView.vue'
import AdminView from '@/views/AdminView.vue'
import ConfirmEmailView from '@/views/ConfirmEmailView.vue'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import LogoutView from '@/views/LogoutView.vue'
import ProductView from '@/views/ProductView.vue'
import RegisterView from '@/views/RegisterView.vue'
import OrderHistoryView from '@/views/OrderHistoryView.vue'
import RequestResetPasswordView from '@/views/RequestResetPasswordView.vue'
import ResetPasswordView from '@/views/ResetPasswordView.vue'
import { createRouter, createWebHistory } from 'vue-router'

function adminGuard(to, from, next) {
  const authStore = useAuthStore()
  if (!authStore.isAdmin) {
    next('/')
    return
  }
  next()
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'homepage',
      component: HomeView,
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/logout',
      name: 'logout',
      component: LogoutView,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductView,
    },
    {
      path: '/admin',
      name: 'admin',
      component: AdminView,
      beforeEnter: adminGuard,
      children: [
        {
          path: 'products',
          name: 'admin-products',
          component: AdminProductView,
        },
        {
          path: 'products/create',
          name: 'admin-products-create',
          component: AdminProductView,
        },
      ],
    },
    {
      path: '/confirm-email/:token',
      name: 'confirm-email',
      component: ConfirmEmailView,
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue'),
      beforeEnter: authMiddleware,
    },
    {
      path: '/request-reset-password',
      name: 'request-reset-password',
      component: RequestResetPasswordView,
    },
    {
      path: '/reset-password/:token',
      name: 'reset-password',
      component: ResetPasswordView,
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrderHistoryView,
      beforeEnter: authMiddleware,
    },
  ],
})

export default router
