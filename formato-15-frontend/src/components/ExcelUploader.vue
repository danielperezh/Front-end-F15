<template>
  <div class="excel-uploader">
    <h1 class="styled-header">Formato 15</h1>
    <h2>Subir Archivo Excel</h2>
    <input type="file" @change="handleFileUpload" />
    <button @click="uploadFile">Validar Archivo</button>
    <a v-if="downloadLink" :href="downloadLink" download="Formato15.xlsx">Descargar Archivo Validado</a>

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
      downloadLink: null, // Enlace para descargar el archivo validado
      showModal: false, // Controla la visibilidad del modal
      modalMessage: '' // Mensaje dinámico del modal
    };
  },
  methods: {
    handleFileUpload(event) {
      this.file = event.target.files[0]; // Almacena el archivo subido
    },
    async uploadFile() {
      // Validación para asegurarse de que se haya seleccionado un archivo
      if (!this.file) {
        this.modalMessage = 'No hay ningún archivo seleccionado. Por favor suba uno.';
        this.showModal = true; // Mostrar modal si no hay archivos subidos
        return;
      }

      // Crear formData y agregar el archivo
      const formData = new FormData();
      formData.append('file', this.file);

      try {
        // Enviar archivo al backend para validar
        const response = await axios.post('http://localhost:8086/api/excel/upload-merge', formData, {
          responseType: 'blob',
          validateStatus: (status) => status < 500 // Permitir manejar errores de cliente (400)
        });

        if (response.status === 200) {
          // Mostrar mensaje de éxito
          this.modalMessage = "Archivo validado correctamente!"; // Aquí puedes modificar según lo que devuelva el backend
          this.showModal = true; // Mostrar modal con el mensaje de éxito
          // Crear un enlace de descarga para el archivo validado
          const url = window.URL.createObjectURL(new Blob([response.data]));
          this.downloadLink = url;
        } else if (response.status === 400) {
          // Leer el mensaje de error devuelto por el backend
          const errorText = await response.data.text();
          this.modalMessage = errorText;
          this.showModal = true; // Mostrar modal con el mensaje de error
        }
      } catch (error) {
        console.error('Error al subir el archivo:', error);
        this.modalMessage = 'Ocurrió un error al subir el archivo. Por favor, intente nuevamente.';
        this.showModal = true; // Mostrar modal con el mensaje de error
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
