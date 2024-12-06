<!-- <template>
  <div id="app">
    <img alt="Vue logo" src="./assets/EBSA_logo.png" class="logo">
    <HelloWorld msg="Formato 15 SUI" />
    <login msg="Login" />
  </div>
</template> -->

<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/EBSA_logo.png" class="logo" />
    <router-view /> <!-- Renderiza el componente según la ruta -->
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<!-- <script>
import HelloWorld from './components/ExcelUploader.vue'
//import login from './components/LoginView.vue'

export default {
  name: 'App',
  components: {
    HelloWorld,
    //login
  }
}
</script> -->

<style>

.excel-uploader {
  text-align: center; /* Centra el contenido dentro del div */
  margin-top: 40px;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
  background-color: #f0f4f8; /* Fondo suave */
  padding: 20px;
  /* height: 100vh;  */
}

.logo {
  width: 150px; /* Ajusta el tamaño del logo */
  margin-bottom: 20px; /* Espacio entre el logo y el contenido */
}

h1 {
  font-size: 2.5rem;
  color: #3498db;
  margin-bottom: 20px;
}

.file-input {
  display: block; /* Hace que el input ocupe toda la línea */
  margin: 10px auto; /* Centra el input y añade espacio inferior */
  padding: 10px;
  font-size: 1rem;
}

.upload-btn {
  display: block; 
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  margin: 10px auto; 
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 10px 20px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

a, button:hover {
  background-color: #daa30e;
}

.download-link {
  display: block;
  margin-top: 20px;
  font-size: 1.2rem;
  color: #2c3e50;
  text-decoration: underline;
}

</style>
