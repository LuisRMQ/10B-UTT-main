const { Builder, Browser, Capabilities, By, Key, until } = require('selenium-webdriver');
const edge = require('selenium-webdriver/edge');
const chrome = require('selenium-webdriver/chrome');
const { expect, should } = require('chai');
should();

async function esperarLoader(driver) {
    let loaderPresente = true;
    let intentos = 0;
    while (loaderPresente && intentos < 10) {  // Limitar intentos
        try {
            await driver.findElement(By.xpath('//div[@class="loader"]'));
            loaderPresente = true;
        } catch (error) {
            loaderPresente = false;
        }
        intentos++;
        if (loaderPresente) {
            await driver.sleep(500);  // Esperar 500ms antes de verificar de nuevo
        }
    }
}

describe('Probar feature de escuelas', async function() {

    let driver;

    before(async function() {
        this.timeout(15000);  // 15 segundos para la configuración inicial
        const chromeOptions = new chrome.Options()
            .addArguments(
                '--no-sandbox',  // Para evitar problemas de permisos
                '--window-size=1920x1080'  // Establecer el tamaño de la ventana
            )
            .setLoggingPrefs({ 'browser': 'ALL' });  // Habilitar logs del navegador

        driver = await new Builder().forBrowser(Browser.CHROME)
            .setChromeOptions(chromeOptions)
            .build();
    
        await driver.manage().window().setSize({
            width: 1920,
            height: 1080
        });

        // Abrir la URL de pruebas
        await driver.get('http://localhost:2024/escuelas'); 

        // Esperar explícitamente hasta que el body de la página se cargue
        await driver.wait(until.elementLocated(By.tagName('body')), 10000);
    });

    it('Se puede crear una escuela', async () => {
        await esperarLoader(driver);
    
        const escuela = {
            "nombre": "Universidad Tecnológica de Torreón",
            "registro": "AAAA123456X17",
            "clave": "XY1236"
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
        let textoMensaje = await mensaje.getText();
    
        expect(textoMensaje).to.equal('Se creó la escuela :D');
    
        const listaEscuela = await driver.findElements(By.xpath('//li'));
        for (let i = 0; i < listaEscuela.length; i++) {
            const _escuela = listaEscuela[i];
            const datosEscuela = `${escuela.nombre} (${escuela.clave} - ${escuela.registro})`;
            let nombreEscuela = await _escuela.getText();
            nombreEscuela = nombreEscuela.replace('delete\n', '');
            if(datosEscuela === nombreEscuela) {
                const botonEliminar = await _escuela.findElement(By.xpath('//span'));
                driver.executeScript('arguments[0].scrollIntoView();', _escuela);
                await botonEliminar.click();
                await esperarLoader(driver);
                break;
            }
        }
    
        textoMensaje = await mensaje.getText();
        textoMensaje.should.equal('Se eliminó la escuela :D');
        //expect(textoMensaje).to.equal('Se eliminó la escuela :D');
    });

    after(async function() {
        if (driver) {
            await driver.quit();
        } else {
            console.log("El driver no se inicializó correctamente.");
        }
    });
});
