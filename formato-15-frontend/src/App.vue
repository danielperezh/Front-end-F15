<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
.excel-uploader {
  text-align: center;
  /* Centra el contenido dentro del div */
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
  margin: 0;
  background-image: linear-gradient(180deg, #2E291A 5%, #3E3621 26%, #61583F 44%, #DBD2BA 100%);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}

/* h1 {
  font-size: 2.5rem;
  margin-bottom: 20px;
}

.file-input {
  display: block; 
  margin: 10px auto; 
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
} */
</style>
