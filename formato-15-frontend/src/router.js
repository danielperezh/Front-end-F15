import { createRouter, createWebHistory } from 'vue-router';
import ExcelUploader from './components/ExcelUploader.vue';
import Login from './components/LoginView.vue';

const routes = [
  { path: '/', component: Login, name: "Login" },
  { path: '/formato15', component: ExcelUploader, name: "Formato15", meta: { requiresAuth: true } }, // Ruta protegida
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Guardia global de navegación
router.beforeEach((to, from, next) => {
  // Verifica si la ruta requiere autenticación
  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Verifica si el usuario está logeado (por ejemplo, si existe un token en localStorage)
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      // Si no está logeado, redirige al login
      next({ name: 'Login' });
    } else {
      // Si está logeado, permite el acceso
      next();
    }
  } else {
    // Si no requiere autenticación, permite el acceso
    next();
  }
});

export default router;
