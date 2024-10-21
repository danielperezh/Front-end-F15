<template>
  <div class="excel-uploader">
    <h1 class="styled-header">Formato 15</h1>
    <h2>Subir Archivos Excel</h2>
    <input type="file" multiple @change="handleFileUpload" />
    <button @click="uploadFiles">Unir Archivos</button>
    <a v-if="downloadLink" :href="downloadLink" download="Formato15.xlsx">Descargar Excel Combinado</a>

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
      files: [], // Almacena los archivos seleccionados
      downloadLink: null, // Enlace para descargar el archivo combinado
      showModal: false, // Controla la visibilidad del modal
      modalMessage: '' // Mensaje dinámico del modal
    };
  },
  methods: {
    handleFileUpload(event) {
      this.files = Array.from(event.target.files); // Almacena los archivos subidos
    },
    async uploadFiles() {
      // Validaciones para los archivos seleccionados
      if (this.files.length === 0) {
        this.modalMessage = 'No hay ningún archivo seleccionado. Por favor suba uno.';
        this.showModal = true; // Mostrar modal si no hay archivos subidos
        return;
      }

      if (this.files.length === 1) {
        this.modalMessage = 'No se puede unir un solo archivo. Por favor suba al menos dos archivos.';
        this.showModal = true; // Mostrar modal si solo hay un archivo
        return;
      }

      // Crear formData y agregar los archivos
      const formData = new FormData();
      this.files.forEach((file) => {
        formData.append('files', file);
      });

      try {
        // Enviar archivos al backend para unirlos
        const response = await axios.post('http://localhost:8086/api/excel/upload-merge', formData, {
          responseType: 'blob'
        });
        // Crear un enlace de descarga para el archivo combinado
        const url = window.URL.createObjectURL(new Blob([response.data]));
        this.downloadLink = url;
      } catch (error) {
        console.error('Error al subir los archivos:', error);
      }
    },
    closeModal() {
      this.showModal = false; // Cierra el modal
    }
  }
};
</script>

<style scoped>
.excel-uploader {
  text-align: center;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

button,
a {
  margin-top: 10px;
  padding: 10px 20px;
  background-color: #ffc629;
  color: black;
  border: none;
  cursor: pointer;
  width: 20%;
  text-align: center;
  text-decoration: none; /* Evitar subrayado en el enlace */
}

a {
  width: auto !important;
}

button:disabled {
  background-color: gray;
  cursor: not-allowed;
}

input {
  padding: 20px;
}

.styled-header {
  font-size: 48px;
  color: white;
  -webkit-text-stroke: 2px black; /* Borde negro alrededor del texto */
  font-weight: bold;
  margin-bottom: 20px;
}

/* Estilo del modal */
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

a {
  margin-top: 20px;
}
</style>
