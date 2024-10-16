
window.addEventListener('load', function() {

    const msgSuccess = document.getElementById('msgSuccess');
    const btnLogout = document.getElementById('btnLogout'); 

    const result = JSON.parse(localStorage.getItem('result'));

    if (result && result.nombreUsuario) {
        mostrarAlerta(`Bienvenido ${result.nombreUsuario}`);
    } else {
        window.location.replace('index.html'); 
        return;
    }

    btnLogout.addEventListener('click', function() {
        ocultarAlerta();
        logout(result.tipoDocumento, result.numeroDocumento);  
    });
});

function mostrarAlerta(mensaje) {
    const msgSuccess = document.getElementById('msgSuccess');
    msgSuccess.innerHTML = mensaje;
    msgSuccess.style.display = 'block';
}


function ocultarAlerta() {
    const msgSuccess = document.getElementById('msgSuccess');
    msgSuccess.innerHTML = '';
    msgSuccess.style.display = 'none';
}


async function logout(tipoDocumento, numeroDocumento) {
    const url = 'http://localhost:8082/login/logout-async';
    const request = {
        tipoDocumento: tipoDocumento,
        numeroDocumento: numeroDocumento
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
            mostrarAlerta('Error: Ocurrió un problema con el logout');
            throw new Error(`Error: ${response.statusText}`);
        }

    
        const result = await response.json();
        console.log('Respuesta del servidor:', result);

        if (result.codigo === '00') {
    
            localStorage.removeItem('result');
            window.location.replace('index.html'); 
        } else {
            mostrarAlerta(result.mensaje); 
        }

    } catch (error) {
        console.log('Error: Ocurrió un problema durante el logout', error);
        mostrarAlerta('Error: Ocurrió un problema durante el logout');
    }
}
