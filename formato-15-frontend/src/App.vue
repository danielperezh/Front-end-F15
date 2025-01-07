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
  background-color: #F1F5FA;
}
</style>
