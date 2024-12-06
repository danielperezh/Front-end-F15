// src/router.js
import { createRouter, createWebHistory } from 'vue-router';
import ExcelUploader from './components/ExcelUploader.vue';
import Login from './components/LoginView.vue';

const routes = [
  { path: '/', component: Login, name: "Login" }, // Agregar nombre para esta ruta
  { path: '/formato15', component: ExcelUploader, name: "Formato15" }, // Nombre para esta ruta
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
