/**
 * Se ejecuta cuando la página ha cargado completamente (DOM, CSS, Images, etc...)
 */
window.addEventListener('load', function() {
    
    const tipoDocumento = document.getElementById('tipoDocumento');
    const numeroDocumento = document.getElementById('numeroDocumento');
    const password = document.getElementById('password');
    const btnIngresar = document.getElementById('btnIngresar');
    const msgError = document.getElementById('msgError');

    btnIngresar.addEventListener('click', function() {

        if (tipoDocumento.value === null || tipoDocumento.value.trim() === '' || 
            numeroDocumento.value === null || numeroDocumento.value.trim() === '' || 
            password.value === null || password.value.trim() === '') {
                mostrarAlerta('Error: Debe completar correctamente sus credenciales');
                return;
        }
        ocultarAlerta();
        autenticar();
    });
});

function mostrarAlerta(mensaje) {
    const msgError = document.getElementById('msgError');
    msgError.innerHTML = mensaje;
    msgError.style.display = 'block';
}


function ocultarAlerta() {
    const msgError = document.getElementById('msgError');
    msgError.innerHTML = '';
    msgError.style.display = 'none';
}


async function autenticar() {
    const tipoDocumento = document.getElementById('tipoDocumento').value;
    const numeroDocumento = document.getElementById('numeroDocumento').value;
    const password = document.getElementById('password').value;

    const url = 'http://localhost:8082/login/autenticar-async';
    const request = {
        tipoDocumento: tipoDocumento,
        numeroDocumento: numeroDocumento,
        password: password
    };

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            mostrarAlerta('Error: Ocurrió un problema con la autenticación');
            throw new Error(`Error: ${response.statusText}`);
        }

        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        if (result.codigo === '00') {
            localStorage.setItem('result', JSON.stringify({
                nombreUsuario: result.nombreUsuario,
                tipoDocumento: tipoDocumento,
                numeroDocumento: numeroDocumento
            }));
            window.location.replace('principal.html');
        } else {
            mostrarAlerta(result.mensaje);
        }

    } catch (error) {
        console.log('Error: Ocurrió un problema', error);
        mostrarAlerta('Error: Ocurrió un problema');
    }
}
