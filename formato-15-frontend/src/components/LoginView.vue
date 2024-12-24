<template>
  <img alt="Vue logo" src="../assets/Ebsa.png" class="logo" />

  <div class="login-container">
    <h1>Inicio de Sesión</h1>

    <!-- Formulario de login -->
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="usuario">Usuario:</label>
        <input
          type="text"
          id="usuario"
          v-model="credentials.usuario" 
          placeholder="Ingrese su usuario"
          required
        />
      </div>
      <div class="form-group">
        <label for="contrasena">Contraseña:</label>
        <input
          type="password"
          id="contrasena"
          v-model="credentials.contrasena" 
          placeholder="Ingrese su contraseña"
          required
        />
      </div>
      <button type="submit">Ingresar</button>
    </form>

    <!-- Mostrar mensaje de error si las credenciales son incorrectas -->
    <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
  </div>
</template>

  
<script>
import axios from "axios";

// Configura Axios para agregar automáticamente el token JWT en el encabezado
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default {
  data() {
    return {
      credentials: {
        usuario: "", // Cambiar a "usuario" para coincidir con el backend
        contrasena: "", // Cambiar a "contrasena" para coincidir con el backend
      },
      errorMessage: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        console.log("Enviando credenciales:", this.credentials); // Imprime el objeto enviado
        const response = await axios.post("http://localhost:8086/api/auth/login", this.credentials);
        

        if (response.data.success) {
          console.log("Respuesta del backend:", response.data); // Imprime la respuesta del backend
          localStorage.setItem("authToken", response.data.token);
          this.$router.push({ name: "Formato15" });
        } else {
          this.errorMessage = response.data.message || "Credenciales incorrectas.";
        }
      } catch (error) {
        console.error("Error en la solicitud:", error); // Imprime el error
        if (error.response && error.response.data && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = "Error al intentar iniciar sesión. Intente nuevamente.";
        }
      }
    }
  },
};
</script>

  
  <style scoped>
  .login-container {
    width: 100%;
    max-width: 500px;
    margin: 50px auto;
    padding: 40px 50px 50px 40px;
    color: black;
    background-color: #fffcfc;
    border: 1px solid #ddd;
    border-radius: 5px;
    text-align: center;
  }
  
  h1 {
    margin-bottom: 20px;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 15px;
    text-align: left;
    width: 100%;
  }
  
  label {
    display: block;
    font-weight: bold;
  }
  
  input {
  width: 100%; /* Se asegura de que el input ocupe todo el ancho del contenedor */
  box-sizing: border-box; /* Incluye padding y borde dentro del ancho total */
  padding: 10px;
  color: black;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}
  
  button {
    width: 100%;
    padding: 10px;
    background-color: #ffc629;
    color: black;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }
  
  button:hover {
    background-color: #dda50a;
  }
  
  .error-message {
    color: red;
    margin-top: 15px;
  }

  .logo {
    margin-top: 100px;
  }
  </style>
  