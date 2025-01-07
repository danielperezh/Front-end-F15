<template>
  <div class="login-wrapper">
    <h1 class="styled-header">Formato 15</h1>
    <!-- Logo -->
    <img alt="Vue logo" src="../assets/EBSA_logo.png" class="logo" />
    

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
  </div>
</template>

  
<script>
import axios from "axios";


// Configura Axios para agregar automáticamente el token JWT en el encabezado
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    // if (token && config.url !== "http://formato15.ebsa.com.co:8086/api/auth/login") {
    if (token && config.url !== "http://localhost:8086/api/auth/login") {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

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
        // const response = await axios.post("http://formato15.ebsa.com.co:8086/api/auth/login", this.credentials);
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

body{
  background-image: linear-gradient(180deg, #d1d5da 5%, rgb(219, 218, 214) 26%, #dadee2 44%, #F1F5FA 100%);
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
}
/* Contenedor principal para centrar elementos vertical y horizontalmente */
.login-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* Asegura que ocupe todo el alto de la pantalla */
  padding: 20px; /* Espaciado interno para pantallas pequeñas */
  /* background-color: #f5f5f5; */
}

/* Logo */
.logo {
  max-width: 100%;
  width: 200px; /* Tamaño inicial del logo */
  height: auto;
  margin-bottom: 20px;
}

.styled-header {
  font-family: 'Raleway', sans-serif;
  font-size: 38px;
  color: black;
  /* -webkit-text-stroke: 2px black;
  font-weight: bold; */
  margin-bottom: 20px;
}

/* Contenedor del formulario */
.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
  color: black;
  background-color: #fffcfc;
  border: 1px solid #ddd;
  border-radius: 5px;
  text-align: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Título */
h1 {
  margin-bottom: 20px;
  font-size: 1.5rem; /* Tamaño responsivo del texto */
  color: #333;
}

/* Estilo de los inputs */
.form-group {
  margin-bottom: 15px;
  text-align: left;
  width: 100%;
}

label {
  display: block;
  font-weight: bold;
  font-size: 0.9rem; /* Tamaño adaptado */
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  color: black;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem; /* Ajuste de texto */
}

/* Botón */
button {
  width: 100%;
  padding: 10px;
  font-size: 1rem;
  background-color: #ffc629;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #dda50a;
}

/* Mensaje de error */
.error-message {
  color: red;
  margin-top: 15px;
  font-size: 0.9rem;
}

/* Media Queries para adaptabilidad */
@media (max-width: 768px) {
  .login-container {
    padding: 15px;
  }

  h1 {
    font-size: 1.2rem;
  }

  input {
    font-size: 0.9rem;
  }

  button {
    font-size: 0.9rem;
    padding: 8px;
  }
}

@media (max-width: 480px) {
  .logo {
    width: 150px; /* Reduce el tamaño del logo */
  }

  h1 {
    font-size: 1rem;
  }

  button {
    font-size: 0.8rem;
    padding: 6px;
  }
}
</style>