<template>
  <!-- Header -->
  <header class="app-header">
    <div class="user-info">
      <!-- Botón desplegable -->
      <div class="dropdown">
        <button @click="toggleDropdown" class="dropdown-toggle">
          Bienvenido, {{ userName }}
          <span class="caret">&#9660;</span>
        </button>
        <ul v-if="isDropdownOpen" class="dropdown-menu">
          <li @click="logout">Cerrar Sesión</li>
        </ul>
      </div>
    </div>
  </header>

  <!-- Contenido principal -->
  <div v-if="isLoading" class="spinner-overlay">
    <div class="spinner"></div>
  </div>

  <img alt="Vue logo" src="../assets/EBSA_logo.png" class="logo" />

  <div class="excel-uploader">
    <h1 class="styled-header">Formato 15</h1>

    <!-- Fase 1: Campos de Año y Mes -->
    <div v-if="fase === 1" class="form-container">
      <label for="ano">Año:</label>
      <input type="number" id="ano" v-model="ano" placeholder="Ingrese el año" />
      <label for="mes">Mes:</label>
      <input type="number" id="mes" v-model="mes" placeholder="Ingrese el mes" />
      <button class="boton" @click="fetchData">Buscar datos en Siec</button>
    </div>

    <!-- Fase 2: Botón de Cargar archivo -->
    <div v-if="fase === 2" class="form-container">
      <label for="year">Año:</label>
      <input type="text" id="year" v-model="selectedYear" placeholder="Ej: 2024" />
      <label for="month">Mes:</label>
      <input type="text" id="month" v-model="selectedMonth" placeholder="Ej: 11" />
      <button class="boton" @click="loadFile">Buscar archivo generado por ADMS</button>
    </div>

    <!-- Fase 3: Botón de Validar y Guardar -->
    <div v-if="fase === 3">
      <button @click="validateFile" v-if="fileData.length > 0">Validar y Guardar</button>
    </div>

    <!-- Fase 4: Botón para Descargar CSV -->
    <div v-if="fase === 4">
      <button v-if="isValid && fileData.length > 0" @click="downloadCSV">Descargar Datos en CSV</button>
    </div>

    <!-- Tabla para visualizar y editar datos -->
    <div v-if="fileData.length" class="table-container">
      <h3>Vista Previa del Archivo</h3>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>#</th> 
              <th v-for="(value, key) in fileData[0]" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in fileData" :key="rowIndex">
              <td>{{ rowIndex + 1 }}</td> 
              <td v-for="(value, key) in row" :key="key">
                <input class="data" v-model="fileData[rowIndex][key]" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


    <!-- Modal de alerta -->
    <!-- <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Mensaje!</h2>
        <p>{{ modalMessage }}</p>
        <button @click="closeModal">Cerrar</button>
      </div>
    </div> -->

    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Mensaje!</h2>
        <!-- Usa v-html para renderizar el contenido con HTML -->
        <p v-html="modalMessage"></p>
        <button @click="closeModal">Cerrar</button>
      </div>
    </div>


    
  </div>
</template>

<script>
import axios from 'axios';

export default {
  
  data() {
    return {
      file: null,
      fileData: [],
      isLoading: false,
      downloadLink: null,
      showModal: false,
      isValid: false,
      modalMessage: '',
      showSendButton: false,
      ano: null,
      mes: null,
      userName: '',
      selectedYear: '',   // Año ingresado por el usuario
      selectedMonth: '',  // Mes ingresado por el usuari
      fase: 1, // Control de las fases
      isDropdownOpen: false,
    };
  },
  created() {
    // Extraer el nombre del usuario del token al cargar el componente
    this.getUserName();
  },
  methods: {
    getUserName() {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1]; // Extraer la parte del payload
          const payload = JSON.parse(atob(payloadBase64)); // Decodificar y parsear JSON
          this.userName = payload.nombre || 'Usuario'; // Extraer el campo 'nombre'
        } catch (error) {
          console.error('Error al leer el token:', error.message);
          this.userName = 'Usuario'; // Fallback en caso de error
        }
      } else {
        this.userName = 'Usuario'; // Si no hay token
      }
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen; // Alternar estado
    },
    logout() {
      localStorage.removeItem('authToken'); // Eliminar el token
      this.$router.push({ name: 'Login' }); // Redirigir al login
    },
    async fetchData() {
      if (!this.ano || !this.mes) {
        this.modalMessage = "Por favor, ingrese el año y el mes.";
        this.showModal = true;
        return;
      }
      this.isLoading = true;
      try {
        //const response = await axios.get("http://formato15.ebsa.com.co:8086/api/excel/findFullInformation", {
        const response = await axios.get("http://localhost:8086/api/excel/findFullInformation", {
          params: {
            ano: this.ano,
            mes: this.mes,
          },
        });

        if (response.data && response.data.length > 0) {
          this.fileData = [...this.fileData, ...response.data];
          this.isValid = true; // Activa el botón de descarga y envío
          this.modalMessage = "Datos cargados correctamente.";
          this.showModal = true;

          // Cambiar a fase 2 (Cargar archivo)
          this.fase = 2;
        } else {
          this.modalMessage = "No se encontraron datos para el año y mes ingresados.";
          // this.showModal = true;
        }
      } catch (error) {
        this.handleError(error, "Error al buscar los datos.");
      } finally {
        this.isLoading = false; // Desactiva el spinner
        this.showModal = true;
      }
    },

    async loadFile() {
      this.isLoading = true; // Activa el spinner
      try {
        const year = this.selectedYear;
        const month = this.selectedMonth;

        //const response = await axios.get("http://formato15.ebsa.com.co:8086/api/excel/loadFromFile", {
        const response = await axios.get("http://localhost:8086/api/excel/loadFromFile", {
          params: { year, month },
        });

        this.fileData = [...this.fileData, ...response.data];
        this.fase = 3;
      } catch (error) {
        this.modalMessage = "Error al cargar datos desde el archivo.";
        this.showModal = true;
      } finally {
        this.isLoading = false; // Desactiva el spinner
      }
    },



    async validateFile() {
      this.isLoading = true;
      try {
        //const response = await axios.post('http://formato15.ebsa.com.co:8086/api/excel/validateAndSaveFile', this.fileData);
        const response = await axios.post('http://localhost:8086/api/excel/validateAndSaveFile', this.fileData);
        this.fileData = response.data;
        
        this.modalMessage = 'El archivo es válido y cumple con todas las verificaciones.';
        // this.showModal = true;

        const url = window.URL.createObjectURL(new Blob([response.data]));
        this.downloadLink = url;

        this.showSendButton = true;

        // Cambiar a fase 4 (Descargar CSV)
        this.fase = 4;
      } catch (error) {
        this.handleError(error, 'El archivo no cumple con las validaciones.');
        this.showSendButton = false;
      } finally {
        this.isLoading = false; // Desactiva el spinner
        this.showModal = true;
      }
    },

    downloadCSV() {
      if (!this.fileData || this.fileData.length === 0) {
        this.modalMessage = "No hay datos disponibles para descargar.";
        this.showModal = true;
        return;
      }

      const header = Object.keys(this.fileData[0]).join(",");
      const rows = this.fileData
        .map(row => Object.values(row).map(value => `"${value}"`).join(","))
        .join("\n");

      const csvContent = `${header}\n${rows}`;
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "Formato15.csv");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },

    handleError(error, defaultMessage) {
      if (error.response && error.response.data) {
        this.modalMessage = error.response.data || defaultMessage;
      } else {
        this.modalMessage = defaultMessage;
      }
      this.showModal = true;
    },

    closeModal() {
      this.showModal = false;
    }
  }
};
</script>


<style scoped>
/* Estilos generales */
.excel-uploader {
  text-align: center;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
}

label, h3{
  color: black;
  margin-right: 10px;
  margin-left: 10px;
  margin-bottom: 5px;
  margin-top: 50px;
  font-family: 'Times New Roman', serif; 
}

.logo{
  margin-top: 40px;
  max-width: 13%;
}

.styled-header {
  font-family: 'Raleway', sans-serif;
  font-size: 48px;
  color: white;
  -webkit-text-stroke: 2px black;
  font-weight: bold;
  margin-bottom: 20px;
}

button, a {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #ffc629;
  color: black;
  border: none;
  cursor: pointer;
  width: auto;
  text-align: center;
  text-decoration: none;
}

.boton {
  margin-left: 15px;
}

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

body {
  margin: 0;
  /* font-family: Arial, sans-serif; */
}

/* Estilo al enfocar el campo */
input:focus {
  border-color: #030303; /* Azul brillante */
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5); /* Resaltado suave */
  outline: none; /* Eliminar el contorno predeterminado */
}

/* Cambiar el color del borde al pasar el mouse */
input:hover {
  border-color: #0056b3; /* Azul más oscuro */
}

.modal {
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: auto;
  text-align: center;
}

.modal-content button {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #a50000;
  color: white;
  border: none;
  cursor: pointer;
}

.spinner-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #f3f3f3;
  border-top: 6px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.app-header {
  background-color: #4A5A6C;
  color: #fff;
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-info {
  position: relative;
  display: flex; /* Asegura que el contenido del dropdown esté alineado correctamente */
  justify-content: flex-start; /* Mueve el botón hacia la izquierda */
  align-items: center;
  margin-left: 0; /* Asegura que no tenga margen izquierdo innecesario */
}

.dropdown-toggle {
  background: none;
  border: none;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.dropdown-toggle .caret {
  margin-left: 5px;
  font-size: 12px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background-color: #ffc629;
  color: black;
  border: 1px solid #ccc;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  border-radius: 4px;
  list-style: none;
  margin: 0;
  padding: 0;
  width: 150px;
  z-index: 1000;
}

.dropdown-menu li {
  padding: 10px;
  color: #333;
  cursor: pointer;
}

.dropdown-menu li:hover {
  background-color: #e9ae0d;
}


.excel-uploader {
  text-align: center;
  margin-top: 20px;
  padding: 0 15px;
}

.styled-header {
  font-size: 36px;
  color: white;
  -webkit-text-stroke: 1px black;
  font-weight: bold;
  margin-bottom: 20px;
}

button {
  margin-top: 10px;
  padding: 10px;
  /* background-color: #ffc629; */
  background-color: #FFD971;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.table-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
}

.table-responsive {
  overflow-x: auto;
  width: 100%;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #f8f6ee;
}

th, td {
  /* border: 1px solid #ddd; */
  border: 0.5px solid #F1F5FA;
  padding: 8px;
  text-align: center;
  font-family: 'Times New Roman', serif; 
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
  width: auto;
}

/* Responsividad */
@media (max-width: 768px) {
  .styled-header {
    font-size: 24px;
  }

  button {
    padding: 8px;
    font-size: 14px;
  }

  th, td {
    padding: 6px;
  }
}

@media (max-width: 480px) {
  .styled-header {
    font-size: 20px;
  }

  input {
    font-size: 12px;
  }

  th, td {
    font-size: 12px;
  }
}
</style>
