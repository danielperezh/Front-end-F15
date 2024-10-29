<template>
  <div class="excel-uploader">
    <h1 class="styled-header">Formato 15</h1>
    <h2>Subir y Visualizar Archivo Excel</h2>
    <input type="file" @change="handleFileUpload" />
    <button @click="previewFile">Cargar Vista Previa</button>
    <button @click="saveFile" v-if="fileData.length > 0">Guardar Cambios</button>
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
      file: null, // Almacena el archivo seleccionado
      fileData: [], // Datos del archivo cargado para visualizar y editar
      downloadLink: null, // Enlace para descargar el archivo validado
      showModal: false, // Controla la visibilidad del modal
      modalMessage: '' // Mensaje dinámico del modal
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0]; // Almacena el archivo subido
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
      if (error.response && error.response.data) {
        this.modalMessage = error.response.data.message || 'Error desconocido'; // Si el backend no proporciona un mensaje, muestra un mensaje genérico
      } else {
        this.modalMessage = 'Error al comunicarse con el servidor.';
      }
      this.showModal = true;
    }
    },
    async saveFile() {
      try {
    const response = await axios.post('http://localhost:8086/api/excel/upload-merge', this.fileData, {
          responseType: 'blob',
          validateStatus: (status) => status < 500 // Permitir manejar errores de cliente (400)
        });
        if (response.status === 200) {
          this.modalMessage = "Archivo validado correctamente!";
          this.showModal = true;
          const url = window.URL.createObjectURL(new Blob([response.data]));
          this.downloadLink = url;
        } else if (response.status === 400) {
          const errorText = await response.data.text();
          this.modalMessage = errorText;
          this.showModal = true;
        }
      } catch (error) {
        console.error('Error al subir el archivo:', error);
        this.modalMessage = 'Ocurrió un error al subir el archivo. Por favor, intente nuevamente.';
        this.showModal = true;
      }
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
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0 10px;
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
 
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}
 
th, td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center;
}
 
th {
  background-color: #f2f2f2;
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