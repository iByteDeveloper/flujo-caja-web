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
            htmlPage = $PAGE_BANCO;
            break;
    }


    $app.innerHTML = '';
    $app.insertAdjacentHTML('beforeend', `${htmlPage}`);
}