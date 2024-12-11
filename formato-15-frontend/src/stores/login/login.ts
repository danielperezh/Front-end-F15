import { defineStore } from "pinia";


export const useLogin = defineStore('login', () => {
    let usuario: string = '';
    let contrasena: string = '';
    let errorMessage: string = '';
    let roles: string[] = [];

    return {
        usuario, contrasena, roles, errorMessage
    }
})