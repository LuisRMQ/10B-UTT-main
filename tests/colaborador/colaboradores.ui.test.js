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
            await driver.sleep(500); 
        }
    }
}

describe('Administrador de Colaboradores - Pruebas de UI', function () {
    let driver;

    before(async function () {
        this.timeout(120000);

        const chromeOptions = new chrome.Options()
            .addArguments('--headless=new')
            .addArguments('--headless') // Ejecutar en modo headless
            .addArguments('--window-size=1920x1080')
            .addArguments('--no-sandbox');
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

    it('Debe crear y eliminar un colaborador correctamente', async function () {
        this.timeout(120000);

        await driver.get('http://localhost:2024/colaboradores');
        await esperarLoader(driver);

        const colaborador = {
            nombre: 'Juan',
            apellidoPaterno: 'Pérez',
            apellidoMaterno: 'Gómez',
            email: 'juan.perez@example.com',
            puesto: 'Desarrollador',
            telefono: '1234567890',
        };

        await driver.findElement(By.id('nombre')).sendKeys(colaborador.nombre);
        await driver.findElement(By.id('apellido_paterno')).sendKeys(colaborador.apellidoPaterno);
        await driver.findElement(By.id('apellido_materno')).sendKeys(colaborador.apellidoMaterno);
        await driver.findElement(By.id('email')).sendKeys(colaborador.email);
        await driver.findElement(By.id('puesto')).sendKeys(colaborador.puesto);
        await driver.findElement(By.id('telefono')).sendKeys(colaborador.telefono);
        await driver.findElement(By.css('button[type="submit"]')).click();

        await esperarLoader(driver);

        const mensaje = await driver.findElement(By.css('.alert'));
        const textoMensaje = await mensaje.getText();
        expect(textoMensaje).to.include('Se creó el colaborador');

        const listaColaboradores = await driver.findElements(By.css('.list-group-item'));
        for (const li of listaColaboradores) {
            const textoLi = await li.getText();
            if (textoLi.includes(colaborador.email)) {
                const botonEliminar = await li.findElement(By.css('.delete-button'));
                await botonEliminar.click();
                await esperarLoader(driver);
                break;
            }
        }

        const mensajeEliminacion = await mensaje.getText();
        expect(mensajeEliminacion).to.include('Se eliminó el colaborador');
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});
