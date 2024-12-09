<template>
  <div class="excel-uploader">
    <h1 class="styled-header">Formato 15</h1>

    <!-- Fase 1: Campos de Año y Mes -->
    <div v-if="fase === 1">
      <label for="ano">Año:</label>
      <input type="number" id="ano" v-model="ano" placeholder="Ingrese el año" />
      <label for="mes">Mes:</label>
      <input type="number" id="mes" v-model="mes" placeholder="Ingrese el mes" />
      <button @click="fetchData">Buscar Datos</button>
    </div>

    <!-- Fase 2: Botón de Cargar archivo -->
    <div v-if="fase === 2">
      <button @click="loadFile">Unir Formato 15 de ADMS</button>
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
    <div v-if="fileData.length">
      <h3>Vista Previa del Archivo</h3>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th v-for="(value, key) in fileData[0]" :key="key">{{ key }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, rowIndex) in fileData" :key="rowIndex">
              <td v-for="(value, key) in row" :key="key">
                <input class="data" v-model="fileData[rowIndex][key]" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de alerta -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Mensaje!</h2>
        <p>{{ modalMessage }}</p>
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
      downloadLink: null,
      showModal: false,
      isValid: false,
      modalMessage: '',
      showSendButton: false,
      ano: null,
      mes: null,
      fase: 1, // Control de las fases
    };
  },
  methods: {
    async fetchData() {
      if (!this.ano || !this.mes) {
        this.modalMessage = "Por favor, ingrese el año y el mes.";
        this.showModal = true;
        return;
      }

      try {
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
          this.showModal = true;
        }
      } catch (error) {
        this.handleError(error, "Error al buscar los datos.");
      }
    },

    async loadFile() {
      try {
        const response = await axios.get('http://localhost:8086/api/excel/loadFromFile');
        this.fileData = [...this.fileData, ...response.data];
        
        // Cambiar a fase 3 (Validar y Guardar)
        this.fase = 3;
      } catch (error) {
        this.modalMessage = 'Error al cargar datos desde el archivo.';
        this.showModal = true;
      }
    },

    async validateFile() {
      try {
        const response = await axios.post('http://localhost:8086/api/excel/validateAndSaveFile', this.fileData);
        this.fileData = response.data;
        
        this.modalMessage = 'El archivo es válido y cumple con todas las verificaciones.';
        this.showModal = true;

        const url = window.URL.createObjectURL(new Blob([response.data]));
        this.downloadLink = url;

        this.showSendButton = true;

        // Cambiar a fase 4 (Descargar CSV)
        this.fase = 4;
      } catch (error) {
        this.handleError(error, 'El archivo no cumple con las validaciones.');
        this.showSendButton = false;
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
  color: white;
}

.styled-header {
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

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

.table-responsive {
  overflow-x: auto;
  width: 100%;
  border-radius: 10px;
}

table, tr {
  width: 100%;
  /* border-collapse: collapse; */
  margin-top: 20px;
  background-color: #e4e0d0;
  border-radius: 5px;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  background-color: #e4dfcb;
  font-weight: bold;
}

input {
  width: 100%; /* Ocupa todo el ancho del contenedor */
  box-sizing: border-box; /* Incluye el padding y borde dentro del ancho total */
  padding: 10px; /* Espaciado interno más cómodo */
  margin-top: 5px;
  border: 1px solid #ccc; /* Borde sutil */
  border-radius: 5px; /* Esquinas redondeadas */
  font-size: 16px; /* Tamaño de fuente legible */
  font-family: Arial, sans-serif; /* Fuente moderna */
  background-color: #f9f9f9; /* Fondo ligeramente gris */
  transition: border-color 0.3s ease, box-shadow 0.3s ease; /* Transiciones suaves para hover/focus */
  margin-bottom: 20px;
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
</style>
