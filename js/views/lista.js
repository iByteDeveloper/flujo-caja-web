const $PAGE_LISTA = `
    <div class="body__lista">
        <h1>Gestión de Listas</h1>

        <p>Módulo para administrar las listas de excel que se registren en el sistema.</p>
        
        <div class="table__container">
            <div class="section__upload">
                <input id="file__attachment" class="button__upload" type="file"
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" title="Subir archivos">
                
            </div>
            <div>
                <button id="btnAddLista" class="button__primary">Nuevo</button>
                <div class="input__text">
                    <label>Tipo documento</label>
                    <select id="cboTipoDocumento">
                    <select>
                </div>
            </div>
            <div class="table__lista">
                <div class="table__lista--head">
                    <div>N°</div>
                    <div>Cliente</div>
                    <div>Fecha y Hora</div>
                    <div>Cantidad</div>
                    <div>Monto SOL</div>
                    <div>Monto USD</div>
                    <div>Herramientas</div>
                </div>
                <div class="table__lista--body">

                </div>
            </div>
        </div>
    </div>
`


const $TEMPLATE_MODAL_LISTA = `
    <div class="content__lista">
        <div class="table__container">
            <div class="section__upload">
                <input id="file__attachment" class="button__upload" type="file"
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" title="Subir archivos">
                <button id="btnAddLista" class="button__primary">Nuevo</button>
            </div>
            <div class="table__lista">
                <div class="table__lista--head">
                    <div>N°</div>
                    <div>Cliente</div>
                    <div>Fecha y Hora</div>
                    <div>Cantidad</div>
                    <div>Monto SOL</div>
                    <div>Monto USD</div>
                    <div>Herramientas</div>
                </div>
                <div class="table__lista--body">

                </div>
            </div>
        </div>
    </div>
`

var $btnAddLista;
function getLista() {

    let $file__attachment = document.getElementById('file__attachment');
    $btnAddLista = document.getElementById('btnAddLista');
    $btnAddLista.addEventListener('click', () => {
        $file__attachment.click();
    });

    $file__attachment.addEventListener('change', readExcelFile);
}

function readExcelFile() {

    readXlsxFile($file__attachment.files[0]).then(function (data) {
        
    });
}

function openModalExcelDetail() {
    
}