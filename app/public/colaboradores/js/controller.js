const app = Vue.createApp({
    data() {
        return {
            nuevoColaborador: {
                nombre: "",
                apellido_paterno: "",
                apellido_materno: "",
                email: "",
                puesto: "",
                telefono: ""
            },
            colaboradores: [],
            message: false,
            status: false,
            showLoader: true
        }
    },
    methods: {
        async sleep (time) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                  resolve(true);
                }, time);
            });
        },
        async ocultarLoader() {
            await this.sleep(1500);
            this.showLoader = false;
        },
        async crearColaborador($event) {
            $event.preventDefault(); 
            
            this.showLoader = true;
            const copiaColaborador = Object.assign({}, this.nuevoColaborador);

            // Crear colaborador...
            try {
                await axios.post('/colaborador/new', copiaColaborador, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                // Mostrar que se creó
                this.status = true;
                this.message = "Se creó el colaborador :D";

                await this.actualizarColaboradores();
            } catch(error) {
                // Mostrar error
                this.status = false;
                this.message = "No se pudo crear el colaborador D:";
            } finally {
                await this.ocultarLoader();
            }
        },

        async actualizarColaboradores() {
            this.colaboradores = [];
            this.showLoader = true;
            try {
                const response = await axios.get('/colaborador/all', {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                const _colaboradores = response.data;

                _colaboradores.forEach(colaborador => {
                    this.colaboradores.push(colaborador);
                });
            } catch(error) {
                console.error(error);
                this.colaboradores = [];
            } finally {
                await this.ocultarLoader();
            }
        },

        async borrarColaborador(email) {
            this.showLoader = true;
            try {
                await axios.delete(`/colaborador/${email}`, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

                this.status = true;
                this.message = "Se eliminó el colaborador :D";
            } catch(error) {
                this.status = false;
                this.message = "No se pudo eliminar el colaborador D:";
            } finally {
                await this.actualizarColaboradores();
            }
        }
    },
    mounted() {
        this.actualizarColaboradores();
    }
});

app.mount('#app');
