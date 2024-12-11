<script setup lang="ts">
import { useLogin } from 'src/stores/login/login.ts';

const login = useLogin()
</script>
<template>
    <q-card-section>
        <p class="enfasis primario-t xxl bold">Iniciar Sesion</p>
        <p class="blanco-t texto m normal texto-login">Bienvenido nuevamente, ingresa los datos para acceder al sistema.
        </p>
        <p class="enfasis texto m error texto-login" v-if="login.errorMessage" >{{ login.errorMessage }}
        </p>
    </q-card-section>
    <q-card-section>
        <div class="column gris-formulario-b q-pa-md " style="border-radius: 10px; gap:10px">
            <q-input outlined v-model="login.usuario" bg-color="white" dense label="Usuario">
            </q-input>
            <q-input outlined v-model="login.contrasena" bg-color="white" dense label="Password" type="password" @keydown.enter ="$emit('cambiarPagina', 'loader')">
            </q-input>
        </div>
    </q-card-section>
    <q-card-section>

        <q-btn color="primary" class="full-width" text-color="black" label="Ingresar" style="font-weight: bold;"
            v-on:click="$emit('cambiarPagina', 'loader')"></q-btn>

    </q-card-section>

</template>