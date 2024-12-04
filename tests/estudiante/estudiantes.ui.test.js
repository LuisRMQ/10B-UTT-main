const { Builder, Browser, Capabilities, By, Key, until } = require('selenium-webdriver')
const edge = require('selenium-webdriver/edge');
const chrome = require('selenium-webdriver/chrome');
const { expect } = require('chai');

async function esperarLoader(driver) {
    let loaderPresente = true;
    let intentos = 0;
    while (loaderPresente && intentos < 10) {
        try {
            await driver.findElement(By.css('.loader'));
            loaderPresente = true;
        } catch (error) {
            loaderPresente = false;
        }
        intentos++;
        if (loaderPresente) {
            await driver.sleep(500); // Esperar 500ms antes de verificar de nuevo
        }
    }
}

describe('Administrador de Estudiantes - Pruebas de UI', function () {
    let driver;

    before(async function () {
        this.timeout(120000);

        const chromeOptions = new chrome.Options()
            .addArguments('--headless') // Ejecutar en modo headless
            .addArguments('--disable-gpu'); // Deshabilitar GPU

        try {
            console.log('Inicializando el driver...');
            driver = await new Builder()
                .forBrowser('chrome')
                .setChromeOptions(chromeOptions)
                .build();

            // Ajustar tamaño de la ventana después de construir el driver
            await driver.manage().window().setRect({
                width: 1920,
                height: 1080
            });
            console.log('Driver inicializado correctamente.');
        } catch (error) {
            console.error('Error al inicializar el driver:', error);
            throw error;
        }
    });

    it('Debe crear y eliminar un estudiante correctamente', async function () {
        this.timeout(120000);

        await driver.get('http://localhost:2024/estudiantes');
        await esperarLoader(driver);

        const estudiante = {
            nombre: 'Juan',
            apellidoPaterno: 'Pérez',
            apellidoMaterno: 'Gómez',
            matricula: '123456',
            curp: 'GOPJ010203HDFRML00',
        };

        // Llenar formulario
        await driver.findElement(By.id('nombre')).sendKeys(estudiante.nombre);
        await driver.findElement(By.id('apellido_paterno')).sendKeys(estudiante.apellidoPaterno);
        await driver.findElement(By.id('apellido_materno')).sendKeys(estudiante.apellidoMaterno);
        await driver.findElement(By.id('matricula')).sendKeys(estudiante.matricula);
        await driver.findElement(By.id('curp')).sendKeys(estudiante.curp);
        await driver.findElement(By.css('button[type="submit"]')).click();

        await esperarLoader(driver);

        // Verificar mensaje de éxito
        const mensaje = await driver.findElement(By.css('.alert'));
        const textoMensaje = await mensaje.getText();
        expect(textoMensaje).to.include('Se creó el estudiante');

        // Buscar y eliminar el estudiante
        const listaEstudiantes = await driver.findElements(By.css('.list-group-item'));
        for (const li of listaEstudiantes) {
            const textoLi = await li.getText();
            if (textoLi.includes(estudiante.matricula)) {
                const botonEliminar = await li.findElement(By.css('.delete-button'));
                await botonEliminar.click();
                await esperarLoader(driver);
                break;
            }
        }

        // Verificar mensaje de eliminación
        const mensajeEliminacion = await mensaje.getText();
        expect(mensajeEliminacion).to.include('Se eliminó el estudiante');
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});
