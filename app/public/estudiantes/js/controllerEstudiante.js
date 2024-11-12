const app = Vue.createApp({
    data() {
        return {
            nuevoEstudiante: {
                nombre: "",
                apellido_paterno: "",
                apellido_materno: "",
                matricula: "",
                curp: ""
            },
            estudiantes: [],
            message: false,
            status: false,
            showLoader: true
        }
    },
    methods: {
        async sleep(time) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve(true);
                }, time);
            });
        },
        async ocultarLoader() {
            await this.sleep(1500);
            this.showLoader = false;
        },
        async crearEstudiante($event) {
            $event.preventDefault();

            this.showLoader = true;
            const copiaEstudiante = { ...this.nuevoEstudiante };

            // Crear estudiante
            try {
                await axios.post('/estudiante/new', copiaEstudiante, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                // Mensaje de éxito
                this.status = true;
                this.message = "Se creó el estudiante :D";

                // Actualizar lista de estudiantes
                await this.actualizarEstudiantes();
            } catch (error) {
                // Mensaje de error
                this.status = false;
                this.message = "No se pudo crear el estudiante D:";
            } finally {
                await this.ocultarLoader();
            }
        },
        async actualizarEstudiantes() {
            this.estudiantes = [];
            this.showLoader = true;
            try {
                const response = await axios.get('/estudiante/all', {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const _estudiantes = response.data;
                this.estudiantes = _estudiantes;
            } catch (error) {
                console.error(error);
                this.estudiantes = [];
            } finally {
                await this.ocultarLoader();
            }
        },
        async borrarEstudiante(matricula) {
            this.showLoader = true;
            try {
                await axios.delete(`/estudiante/${matricula}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                this.status = true;
                this.message = "Se eliminó el estudiante :D";
            } catch (error) {
                this.status = false;
                this.message = "No se pudo eliminar el estudiante D:";
            } finally {
                await this.actualizarEstudiantes();
            }
        }
    },
    mounted() {
        this.actualizarEstudiantes();
    }
});

app.mount('#app');
