<template>
  <div class="excel-uploader">
    <h1 class="styled-header">Formato 15</h1>
    <!-- <h2>Validar Formato 15</h2> -->
    <input class="cargue" type="file" @change="handleFileUpload" />
    <button @click="previewFile">Cargar Vista Previa</button>
    <button @click="validateFile" v-if="fileData.length > 0">Validar y Guardar</button>
    <button v-if="showSendButton" @click="sendToDatabase">Enviar a SIEC</button>
    <!-- <button @click="validateFile" v-if="fileData.length > 0">Validar Archivo</button>
    <button @click="saveFile"  v-if="isValid">Guardar Cambios</button> 
    <button @click="saveFile"  v-if="fileData.length > 0">Guardar Cambios</button>  -->
    <a v-if="downloadLink" :href="downloadLink" download="Formato15.xlsx">Descargar Archivo Validado</a>

    <!-- Tabla para visualizar y editar datos -->
    <div v-if="fileData.length > 0">
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
                <input v-model="fileData[rowIndex][key]" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de alerta -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>Mensaje!</h3>
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
      showSendButton: false
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0];
    },
    async previewFile() {
      if (!this.file) {
        this.modalMessage = 'No hay ningún archivo seleccionado. Por favor suba uno.';
        this.showModal = true;
        return;
      }
      const formData = new FormData();
      formData.append('file', this.file);
      try {
        const response = await axios.post('http://localhost:8086/api/excel/preview', formData);
        this.fileData = response.data;
      } catch (error) {
        this.handleError(error, 'Error al cargar vista previa.');
      }
    },
    async validateFile() {
      try {
        const response = await axios.post('http://localhost:8086/api/excel/validateAndSaveFile', this.fileData);
        this.modalMessage = 'El archivo es válido y cumple con todas las verificaciones.';
        this.showModal = true;
        //Crear un enlace de descarga para el archivo
        const url = window.URL.createObjectURL(new Blob([response.data]));
        this.downloadLink = url;

        // Muestra el botón "Enviar a SIEC" si la validación fue exitosa
        this.showSendButton = true;
      } catch (error) {
        this.handleError(error, 'El archivo no cumple con las validaciones.');
        this.showSendButton = false; // Oculta el botón si hay errores de validación
      }
    },
    // Nuevo método para enviar los datos validados a la base de datos
    async sendToDatabase() {
      try {
        const response = await axios.post('http://localhost:8086/api/excel/sendToDatabase');
        this.modalMessage = response.data;
        this.showModal = true;
        this.showSendButton = false; // Oculta el botón tras el envío exitoso
      } catch (error) {
        this.handleError(error, 'Error al enviar los datos a la base de datos.');
      }
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

.cargue {
  width: auto !important;
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
  width: 20%;
  text-align: center;
  text-decoration: none;
}

a {
  width: auto !important;
}

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

/* Estilos de la tabla */
.table-responsive {
  overflow-x: auto;
  width: 100%;
}

table, tr {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  /* background-color: rgb(253, 246, 237); */
  background-color: #e4e0d0;
}

th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}

th {
  /* background-color: #f2f2f2; */
  background-color: #e4dfcb;
  font-weight: bold;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 5px;
}

/* Estilos del modal */
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

/* Media queries para ajustar elementos en pantallas pequeñas */
@media (max-width: 768px) {
  .styled-header {
    font-size: 36px;
  }

  button, a {
    width: 80%;
  }

  th, td {
    padding: 5px;
  }
}
</style>
