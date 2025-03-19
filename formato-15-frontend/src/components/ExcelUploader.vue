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
    <img alt="Vue logo" src="../assets/Ebsa.png" class="logo" />
  </header>

  <!-- Contenido principal -->
  <div v-if="isLoading" class="spinner-overlay">
    <div class="spinner"></div>
  </div>

  <div class="excel-uploader">
    <h1 class="styled-header">Formato 15</h1>

    <!-- Fase 1: Campos de Año y Mes -->
    <div v-if="fase === 1" class="form-container">
      <label for="ano">Año:</label>
      <input type="number" id="ano" v-model="ano" placeholder="Ingrese el año" min="1"
        @input="validatePositiveNumber('ano')" class="input-fixed" />
      <label for="mes">Mes:</label>
      <input type="number" id="mes" v-model="mes" placeholder="Ingrese el mes" min="1" max="12" @input="validateMonth"
        @blur="fixMonth" class="input-fixed" />
      <button class="boton" @click="fetchData">Buscar datos en Siec</button>
    </div>

    <!-- Fase 2: Campos de Año y Mes -->
    <div v-if="fase === 2" class="form-container">
      <label for="year">Año:</label>
      <input type="number" id="year" v-model="selectedYear" placeholder="Ingrese el año" min="1"
        @input="validatePositiveNumber('selectedYear')" class="input-fixed" />
      <label for="month">Mes:</label>
      <input type="number" id="month" v-model="selectedMonth" placeholder="Ingrese el mes" min="1" max="12"
        @input="validateMonth" @blur="fixMonth" class="input-fixed" />
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

    <!-- Input de Filtro (filtra por el número de fila, es decir, la columna “#”) -->
    <div class="left-align-container">
      <label>Buscar por número de fila: </label>
      <input v-model="filterText" placeholder="Filtrar por..." class="filter-input" />
    </div>



    <!-- Tabla para visualizar y editar datos -->
    <div v-if="paginatedData.length" class="table-container">
      <h3>Vista Previa del Archivo</h3>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <!-- Columna de número de fila -->
              <th>#</th>
              <!-- Encabezados (excluyendo "rowNumber") -->
              <th v-for="header in tableHeaders" :key="header">{{ header }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in paginatedData" :key="rowIndex">
              <!-- Se muestra el número de fila (almacenado en fileData) -->
              <td>{{ row.rowNumber }}</td>
              <!-- Iteramos sobre las claves del registro (excluyendo "rowNumber") -->
              <td v-for="key in filteredRowKeys(row)" :key="key">
                <!-- <input class="data" v-model="row[key]" /> -->
                {{ row[key] }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Controles de Paginación Mejorados -->
    <nav aria-label="Page navigation" class="pagination-container" v-if="totalPages > 1">
      <ul class="pagination justify-content-center">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="goToPage(1)">«</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <a class="page-link" href="#" @click.prevent="previousPage">‹</a>
        </li>
        <li class="page-item" v-for="page in visiblePages" :key="page" :class="{ active: page === currentPage }">
          <a class="page-link" href="#" @click.prevent="goToPage(page)">{{ page }}</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="nextPage">›</a>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <a class="page-link" href="#" @click.prevent="goToPage(totalPages)">»</a>
        </li>
      </ul>
    </nav>

    <!-- Modal (se muestra cuando showModal es true) -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Mensaje!</h2>
        <!-- Se muestran todos los mensajes (ya sea de error o de éxito) -->
        <p v-html="modalMessage"></p>
        <!-- Botón de descarga: se muestra solo si downloadLink tiene un valor -->
        <div v-if="downloadError" style="margin: 15px 0;">
          <a :href="downloadError" download="errores.txt" class="boton">
            Descargar errores
          </a>
        </div>
        <button @click="closeModal">Cerrar</button>
      </div>
    </div>

  </div>

  <!-- Footer -->
  <footer class="border-top footer text-muted">
    <div class="container text-center">
      dperez&copy; 2024 | Formato 15 | Empresa de Energía de Boyacá S.A E.S.P | Boyacá, Colombia
    </div>
  </footer>
</template>

<script>
import axios from 'axios';
axios.defaults.withCredentials = true;

export default {
  data() {
    return {
      fileData: [],
      errorCells: {},
      isLoading: false,
      downloadLink: null,
      downloadError: null,
      filterText: "",
      showModal: false,
      isValid: false,
      modalMessage: '',
      showSendButton: false,
      ano: null,
      mes: null,
      userName: '',
      selectedYear: '',
      selectedMonth: '',
      fase: 1,
      currentPage: 1,
      pageSize: 10,
      pageRange: 5,
      isDropdownOpen: false,
    };
  },

  computed: {
    // Encabezados de la tabla (excluyendo "rowNumber")
    tableHeaders() {
      if (this.fileData.length > 0) {
        return Object.keys(this.fileData[0]).filter(key => key !== 'rowNumber');
      }
      return [];
    },
    // Filtra la data basándose en el valor de "rowNumber"
    filteredData() {
      if (!this.filterText) return this.fileData;
      return this.fileData.filter(row =>
        String(row.rowNumber).toLowerCase().includes(this.filterText.toLowerCase())
      );
    },
    totalPages() {
      return Math.ceil(this.filteredData.length / this.pageSize);
    },
    paginatedData() {
      const start = (this.currentPage - 1) * this.pageSize;
      return this.filteredData.slice(start, start + this.pageSize);
    },
    visiblePages() {
      const halfRange = Math.floor(this.pageRange / 2);
      let start = Math.max(1, this.currentPage - halfRange);
      let end = Math.min(this.totalPages, start + this.pageRange - 1);
      if (end - start < this.pageRange - 1) {
        start = Math.max(1, end - this.pageRange + 1);
      }
      return Array.from({ length: end - start + 1 }, (_, i) => start + i);
    },
  },

  created() {
    // Extraer el nombre del usuario desde el token
    this.getUserName();
  },

  methods: {
    // Devuelve las claves del registro excluyendo "rowNumber"
    filteredRowKeys(row) {
      return Object.keys(row).filter(key => key !== 'rowNumber');
    },
    goToPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    validatePositiveNumber(field) {
      if (this[field] < 1 || isNaN(this[field])) {
        this[field] = "";
      }
    },
    validateMonth() {
      if (this.mes < 1) {
        this.mes = "";
      } else if (this.mes > 12) {
        this.mes = 12;
      }
      if (this.selectedMonth < 1) {
        this.selectedMonth = "";
      } else if (this.selectedMonth > 12) {
        this.selectedMonth = 12;
      }
    },
    fixMonth() {
      if (this.mes < 1) this.mes = 1;
      if (this.mes > 12) this.mes = 12;
      if (this.selectedMonth < 1) this.selectedMonth = 1;
      if (this.selectedMonth > 12) this.selectedMonth = 12;
    },
    getUserName() {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const payloadBase64 = token.split('.')[1];
          const payload = JSON.parse(atob(payloadBase64));
          this.userName = payload.nombre || 'Usuario';
        } catch (error) {
          console.error('Error al leer el token:', error.message);
          this.userName = 'Usuario';
        }
      } else {
        this.userName = 'Usuario';
      }
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    logout() {
      localStorage.removeItem('authToken');
      this.$router.push({ name: 'Login' });
    },
    async fetchData() {
      if (!this.ano || !this.mes) {
        this.modalMessage = "Por favor, ingrese el año y el mes.";
        this.showModal = true;
        return;
      }
      this.isLoading = true;
      try {
        const response = await axios.get("http://localhost:8086/api/excel/findFullInformation", {
          params: { ano: this.ano, mes: this.mes },
        });
        if (response.data && response.data.length > 0) {
          // Calculamos el offset para asignar el número de fila (rowNumber) de forma consecutiva
          const offset = this.fileData.length;
          const newData = response.data.map((row, index) => ({
            ...row,
            rowNumber: offset + index + 1
          }));
          this.fileData = [...this.fileData, ...newData];
          this.isValid = true;
          this.modalMessage = "Datos cargados correctamente.";
          this.showModal = true;
          // Cambiar a fase 2 (Cargar archivo)
          this.fase = 2;
          this.currentPage = 1;
        } else {
          this.modalMessage = "No se encontraron datos para el año y mes ingresados.";
        }
      } catch (error) {
        this.handleError(error, "Error al buscar los datos.");
      } finally {
        this.isLoading = false;
        this.showModal = true;
      }
    },
    async loadFile() {
      this.isLoading = true;
      try {
        const year = this.selectedYear;
        const month = this.selectedMonth;
        const response = await axios.get("http://localhost:8086/api/excel/loadFromFile", {
          params: { year, month },
        });
        // Asignar el rowNumber de forma consecutiva según la data ya cargada
        const offset = this.fileData.length;
        const newData = response.data.map((row, index) => ({
          ...row,
          rowNumber: offset + index + 1
        }));
        this.fileData = [...this.fileData, ...newData];
        this.fase = 3;
        this.currentPage = 1;
      } catch (error) {
        this.modalMessage = "Error al cargar datos desde el archivo.";
        this.showModal = true;
      } finally {
        this.isLoading = false;
      }
    },
    async validateFile() {
      this.isLoading = true;
      this.errorCells = {};
      try {
        const response = await axios.post('http://localhost:8086/api/validateAndSaveFile', this.fileData, {
          headers: { "Content-Type": "application/json" }
        });
        this.fileData = response.data;
        this.modalMessage = 'El archivo es válido y cumple con todas las verificaciones.';
        const url = window.URL.createObjectURL(new Blob([response.data]));
        this.downloadLink = url;
        this.downloadError = null;
        this.showSendButton = true;
        this.fase = 4;
      } catch (error) {
        this.handleError(error, 'El archivo no cumple con las validaciones.');
        this.showSendButton = false;
      } finally {
        this.isLoading = false;
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
      let message = defaultMessage;
      if (error.response && error.response.data) {
        message = error.response.data;
        // Aquí se asume que el mensaje contiene los errores separados por <br>
        // Si no, deberás adaptarlo según el formato recibido.
        if (message && message.indexOf("<br>") !== -1) {
          const errorLines = message.split("<br>");
          // Se mantiene el formato HTML para el modal:
          this.modalMessage = errorLines.join("<br>");
          // Se crea un arreglo de líneas sin etiquetas HTML para la descarga:
          const plainErrorLines = errorLines.map(line => line.replace(/<[^>]*>/g, ""));
          const blob = new Blob([plainErrorLines.join("\n")], { type: "text/plain;charset=utf-8" });
          this.downloadError = URL.createObjectURL(blob);
        } else {
          this.modalMessage = message;
        }

      } else {
        this.modalMessage = message;
      }
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    }
  },
  watch: {
    filterText() {
      // Reinicia la paginación al cambiar el filtro
      this.currentPage = 1;
    }
  }
};
</script>

<style scoped>
.left-align-container {
  align-self: flex-start;
  /* Esto alinea el contenedor a la izquierda */
  text-align: left;
  margin: 10px 0;
}


.filter-input {
  margin-bottom: 10px;
  padding: 8px;
  width: 30%;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}


.input-fixed {
  width: 150px;
  padding: 10px;
  text-align: center;
}

.excel-uploader {
  text-align: center;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
}

label,
h3 {
  color: black;
  margin: 0 10px 15px 10px;
  font-family: 'Times New Roman', serif;
}

.logo {
  max-width: 5%;
}

.styled-header {
  font-family: 'Raleway', sans-serif;
  font-size: 48px;
  color: white;
  -webkit-text-stroke: 2px black;
  font-weight: bold;
  margin-bottom: 20px;
}

button,
a {
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
}

input:focus {
  border-color: #030303;
  box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
  outline: none;
}

input:hover {
  border-color: #0056b3;
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
  z-index: 4;
}

.modal-content {
  background-color: white;
  padding: 20px;
  border-radius: 5px;
  width: auto;
  text-align: center;
  max-height: 500px;
  overflow-y: auto;
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
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
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
  display: flex;
  align-items: center;
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
  margin: 0 15px;
  position: relative;
  z-index: 1;
}

.table-responsive {
  max-height: 650px;
  overflow-y: auto;
  overflow-x: auto;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  background-color: #f8f6ee;
}

th,
td {
  border: 0.5px solid #F1F5FA;
  padding: 8px;
  text-align: center;
  font-family: 'Times New Roman', serif;
}

input {
  box-sizing: border-box;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 14px;
}

@media (max-width: 768px) {
  .styled-header {
    font-size: 24px;
  }

  button {
    padding: 8px;
    font-size: 14px;
  }

  th,
  td {
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

  th,
  td {
    font-size: 12px;
  }
}

.pagination-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px 0 50px;
  position: relative;
  z-index: 0;
}

.pagination {
  display: flex;
  list-style: none;
  padding: 0;
}

.page-item {
  margin: 0 1px;
}

.page-link {
  padding: 8px 12px;
  text-decoration: none;
  background-color: #ffc107;
  color: black;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.page-link:hover {
  background-color: #3a3a3a;
  color: #fff;
}

.page-item.disabled .page-link {
  background-color: #d6d6d6;
  color: #a0a0a0;
  pointer-events: none;
}

.page-item.active .page-link {
  background-color: #3a3a3a;
  color: white;
  font-weight: bold;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  background-color: #d2d4d6;
  padding: 10px 0;
  text-align: center;
  border-top: 1px solid #b6b4b4;
}

.footer-container {
  max-width: 1200px;
  margin: auto;
  font-size: 14px;
  color: #555;
}

.boton {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #ffc629;
  color: black;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
}
</style>
