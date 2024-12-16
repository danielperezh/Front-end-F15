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

<style>

.excel-uploader {
  text-align: center; /* Centra el contenido dentro del div */
  margin-top: 40px;
}

#app {
  width: 100%;
  height: 100vh;
}

body {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  /* color: #ffffff; */
  margin-top: 60px;
  /* background: linear-gradient(
    rgba(0, 0, 0, 0.6),  
    rgba(0, 0, 0, 0.199) 
  ), #ffffff;   */
  background-image: linear-gradient(180deg, #2E291A 5%, #3E3621 26%, #61583F 44%, #DBD2BA 100%);
  padding: 20px;
  /* height: 100vh;  */
}


.logo {
  width: 170px; /* Ajusta el tamaño del logo */
  margin-bottom: 20px; /* Espacio entre el logo y el contenido */
}

h1 {
  font-size: 2.5rem;
  /* color: #3498db; */
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
