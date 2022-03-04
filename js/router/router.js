const $app = document.querySelector('#app');

function router(_route) {
    let htmlPage = '';

    console.log(`Ruta detectada: ${_route}`)
    switch (_route) {
        case '':
        case '#/':
        case '#/Home':
        case '#/Dashboard':
            // htmlPage = $PAGE_DASHBOARD;
            break;


        case '#/Bancos':
            switchLoader(true);
            htmlPage = $PAGE_BANCO;
            setTimeout(() => {
                getBanco();
                switchLoader(false);
            }, 200);
            break;

        case '#/Personas':
            switchLoader(true);
            htmlPage = $PAGE_PERSONA;
            setTimeout(() => {
                getPersona();
                switchLoader(false);
            }, 200);
            break;

        case '#/Cuentas':
            switchLoader(true);
            htmlPage = $PAGE_CUENTA;
            setTimeout(() => {
                getCuenta();
                switchLoader(false);
            }, 200);
            break;

        case '#/Clientes':
            switchLoader(true);
            htmlPage = $PAGE_CLIENTE;
            setTimeout(() => {
                getCliente();
                switchLoader(false);
            }, 200);
            break;

        case '#/Lista':
            switchLoader(true);
            htmlPage = $PAGE_LISTA;
            setTimeout(() => {
                getClienteSelect();
                switchLoader(false);
            }, 200);
            break;
    }


    $app.innerHTML = '';
    $app.insertAdjacentHTML('beforeend', `${htmlPage}`);
}