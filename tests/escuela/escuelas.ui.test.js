const { Builder, Browser, By, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');
const { expect } = require('chai');

async function esperarLoader(driver) {
    let loaderPresente = true;
    let intentos = 0;
    while (loaderPresente && intentos < 10) { // Limitar intentos
        try {
            await driver.findElement(By.xpath('//div[@class="loader"]'));
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

describe('Probar feature de escuelas', function () {
    let driver;

    before(async function () {
        // Aumentar timeout para la inicialización
        this.timeout(120000);

        const edgeOptions  = new edge.Options().addArguments('--window-size=1920x1080');
        try {
            console.log('Inicializando el driver...');
            driver = await new Builder()
                .forBrowser('MicrosoftEdge')
                .setChromeOptions(edgeOptions)
                .build();
            console.log('Driver inicializado correctamente.');
        } catch (error) {
            console.error('Error al inicializar el driver:', error);
            throw error;
        }
    });

    it('Se puede crear una escuela', async function () {
        // Aumentar timeout para este caso de prueba
        this.timeout(120000);

        await driver.get('http://localhost:2024/escuelas');
        await esperarLoader(driver);

        const escuela = {
            nombre: 'Universidad Tecnológica de Torreón',
            registro: 'AAAA123456X17',
            clave: 'XY1236'
        };

        const campoNombre = await driver.findElement(By.id('nombre'));
        await campoNombre.sendKeys(escuela.nombre);

        const campoRegistro = await driver.findElement(By.id('registro'));
        await campoRegistro.sendKeys(escuela.registro);

        const campoClave = await driver.findElement(By.id('clave'));
        await campoClave.sendKeys(escuela.clave);

        const submit = await driver.findElement(By.xpath('//button[@type="submit"]'));
        await submit.click();

        await esperarLoader(driver);

        const mensaje = await driver.findElement(By.xpath('//div[@role="alert"]'));
        const textoMensaje = await mensaje.getText();
        expect(textoMensaje).to.equal('Se creó la escuela :D');

        const listaEscuela = await driver.findElements(By.xpath('//li'));
        for (let i = 0; i < listaEscuela.length; i++) {
            const _escuela = listaEscuela[i];
            const datosEscuela = `${escuela.nombre} (${escuela.clave} - ${escuela.registro})`;
            let nombreEscuela = await _escuela.getText();
            nombreEscuela = nombreEscuela.replace('delete\n', '');
            if (datosEscuela === nombreEscuela) {
                const botonEliminar = await _escuela.findElement(By.xpath('.//span'));
                await driver.executeScript('arguments[0].scrollIntoView();', _escuela);
                await botonEliminar.click();
                await esperarLoader(driver);
                break;
            }
        }

        const textoMensajeEliminar = await mensaje.getText();
        expect(textoMensajeEliminar).to.equal('Se eliminó la escuela :D');
    });

    after(async function () {
        if (driver) {
            await driver.quit();
        }
    });
});
