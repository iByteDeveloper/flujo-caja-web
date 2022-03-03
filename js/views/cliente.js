const $PAGE_CLIENTE = `
    <div class="body__cliente">
        <h1>Gestión de Clientes</h1>

        <p>Módulo para administrar los clientes que se registren en el sistema.</p>
        
        <div class="table__container">
            <button id="btnAddCliente" class="button__primary">Agregar</button>
            <div class="table__cliente">
                <div class="table__cliente--head">
                    <div>N°</div>
                    <div>Tipo doc.</div>
                    <div>Nro doc.</div>
                    <div>Apellidos y Nombres</div>
                    <div>Correo electrónico</div>
                    <div>Observación</div>
                    <div>Cabecera</div>
                    <div>Herramientas</div>
                </div>
                <div class="table__cliente--body">
                </div>
            </div>
        </div>
    </div>
`

const $TEMPLATE_MODAL_CLIENTE = `
    <div class="content__cliente">
        <label id="lblIdCliente" class="display__none"></label>
        <div class="input__text">
            <label>Tipo documento</label>
            <select id="cboTipoDocumento">
            <select>
        </div>
        <div class="input__text">
            <label>Nro documento</label>
            <input id="txtNdocumento" type="text">
        </div>
        <div class="input__text">
            <label>Ap. paterno</label>
            <input id="txtPaterno" type="text">
        </div>
        <div class="input__text">
            <label>Ap. materno</label>
            <input id="txtMaterno" type="text">
        </div>
        <div class="input__text">
            <label>Nombres</label>
            <input id="txtNombres" type="text">
        </div>
        <div class="input__text">
            <label>Fila de cabecera</label>
            <input id="txtCabecera" type="number">
        </div>
        <div class="input__text">
            <label>Correo</label>
            <input id="txtCorreo" type="text">
        </div>
        <div class="input__text">
            <label>Observación</label>
            <input id="txtObservacion" type="text">
        </div>

        <div class="content__buttons">
            <button id="btnSaveCliente" class="button__primary">Guardar</button>
            <button id="btnCancelCliente" class="button__secondary">Cancelar</button>
        </div>
    </div>
`
var $btnAddCliente;
var $btnSaveCliente;
var flagAddCliente = false;

// Función para obtener el registro
async function getCliente(_ndoc = '__all__') {
    
    $btnAddCliente = document.querySelector('#btnAddCliente');
    $btnAddCliente.addEventListener('click', addClienteModal);

    const data = await fetch(`${GET_CLIENTE}/${_ndoc}`).then(resp => resp.json());

    if (data === null) {
        alert('No hay datos para mostrar.')
        return;
    }

    fillTableCliente(data);
}

async function getTipoDocumentoSelect() {
    let dataTipo = await fetch(`${GET_TIPODOC}/0`).then(resp => resp.json());
    let $cboTipoDocumento = document.getElementById('cboTipoDocumento');

    dataTipo.map((row) => {
        let $option = document.createElement('option');
        $option.text = row.descorta;
        $option.value = row.idtipodocumento;
        $cboTipoDocumento.appendChild($option);
    });
}

// Función para llenar la tabla
function fillTableCliente(_data) {
    let rowCurrent = 1;
    const $body = document.querySelector('.table__cliente--body');
    $body.innerHTML = '';

    _data.map((row) => {

        let imgTgl = (row.idestado === 1) ? 'activate' : 'desactivate';
        const $row = `
            <div data-identificador="${row.idcliente}" class="body__row" >
                <div>${rowCurrent}</div>
                <div>${row.tipodocumento}</div>
                <div>${row.ndocumento}</div>
                <div>${row.completo}</div>
                <div>${row.correo}</div>
                <div>${row.observacion}</div>
                <div>${row.cabecera}</div>
                <div class="table__options--horizontal">
                    <img class="edit__cliente" onclick="openModalCliente('${row.ndocumento}');" alt="Editar" src="./images/general/edit.svg" title="Editar" />
                    <img onclick="deleteCliente(${row.idcliente});" title="${(row.idestado === 1) ? 'Desactivar' : 'Activar'}" class="toggle__cuenta" alt="Activar/desactivar" src="./images/general/${imgTgl}.svg" />
                </div>
            </div>
        `
        rowCurrent += 1;
        $body.insertAdjacentHTML('beforeend', $row);
    });
}

// Función para abrir el modal y settear los campos
async function openModalCliente(_ndoc) {
    $modal__loader.classList.remove('display__none');

    flagAdd = false;
    clearModalContentClass();
    $modal__content.classList.add('modal__content-500');
    $lblModalTitle.textContent = 'Modificar Datos del Cliente'

    let data = await fetch(`${GET_CLIENTE}/${_ndoc}`).then(resp => resp.json());

    if (data.length === 0) {
        alert('No se ha podido recuperar los datos. \nInténtelo nuevamente.');
        return;
    }

    let oData = data[0];

    $modalBody.innerHTML = $TEMPLATE_MODAL_CLIENTE;
    $btnSaveCliente = document.querySelector('#btnSaveCliente');
    $btnSaveCliente.addEventListener('click', saveDataCliente);

    await getTipoDocumentoSelect();

    let $lblIdCliente = document.getElementById('lblIdCliente');
    let $cboTipoDocumento = document.getElementById('cboTipoDocumento');
    let $txtNdocumento = document.getElementById('txtNdocumento');
    let $txtPaterno = document.getElementById('txtPaterno');
    let $txtMaterno = document.getElementById('txtMaterno');
    let $txtNombres = document.getElementById('txtNombres');
    let $txtCorreo = document.getElementById('txtCorreo');
    let $txtCabecera = document.getElementById('txtCabecera');
    let $txtObservacion = document.getElementById('txtObservacion');

    $lblIdCliente.value = oData.idcliente;
    $cboTipoDocumento.value = oData.idtipodocumento;
    $txtNdocumento.value = oData.ndocumento;
    $txtPaterno.value = oData.paterno;
    $txtMaterno.value = oData.materno;
    $txtNombres.value = oData.nombres;
    $txtCorreo.value = oData.correo;
    $txtCabecera.value = oData.cabecera;
    $txtObservacion.value = oData.observacion;

    $modal.classList.remove('display__none');
    $modal__loader.classList.add('display__none');
}

// Función para agregar una cliente
async function addClienteModal() {

    $modal__loader.classList.remove('display__none');

    flagAdd = true;
    clearModalContentClass();
    $modal__content.classList.add('modal__content-500');
    $lblModalTitle.textContent = 'Gestión de Cliente'

    $modalBody.innerHTML = $TEMPLATE_MODAL_CLIENTE;

    await getTipoDocumentoSelect();

    $btnSaveCliente = document.querySelector('#btnSaveCliente');
    $btnSaveCliente.addEventListener('click', saveDataCliente);

    $modal.classList.remove('display__none');
    $modal__loader.classList.add('display__none');
}

//Función para guardar los cambios
async function saveDataCliente() {

    let $lblIdCliente = document.getElementById('lblIdCliente');
    let $cboTipoDocumento = document.getElementById('cboTipoDocumento');
    let $txtNdocumento = document.getElementById('txtNdocumento');
    let $txtPaterno = document.getElementById('txtPaterno');
    let $txtMaterno = document.getElementById('txtMaterno');
    let $txtNombres = document.getElementById('txtNombres');
    let $txtCorreo = document.getElementById('txtCorreo');
    let $txtCabecera = document.getElementById('txtCabecera');
    let $txtObservacion = document.getElementById('txtObservacion');

    let codeCliente = $lblIdCliente.value,
        URL_REQUEST = EDT_CLIENTE,
        URL_METHOD = 'PATCH';

    if (flagAdd) {
        codeCliente = 0;
        URL_REQUEST = ADD_CLIENTE;
        URL_METHOD = 'PUT';
    }
    
    let fData = new FormData();
    fData.append('_idusuario', $VAL);
    fData.append('_idcliente', codeCliente)
    fData.append('_idtipodoc', $cboTipoDocumento.value)
    fData.append('_ndocumento', $txtNdocumento.value)
    fData.append('_paterno', $txtPaterno.value)
    fData.append('_materno', $txtMaterno.value)
    fData.append('_nombres', $txtNombres.value)
    fData.append('_correo', $txtCorreo.value)
    fData.append('_observacion', $txtObservacion.value)
    fData.append('_cabecera', $txtCabecera.value)
    debugger
    let data = await fetch(URL_REQUEST, { method: URL_METHOD, body: fData }).then(resp => resp.json());
    let oData;

    if (data.length === 0) {
        alert('No se puedo guardar los cambios.')
        return;
    }

    oData = data[0];
    alert(oData.description_response);

    if (oData.status_response === 1) {
        $modal.classList.add('display__none');
        getCliente('__all__');
    }
}

async function deleteCliente(_id) {

    let fData = new FormData();
    fData.append('_idusuario', $VAL);
    fData.append('_idcliente', _id);
    let data = await fetch(DEL_CLIENTE, { method: 'DELETE', body: fData }).then(resp => resp.json());

    if (data.length === 0) {
        alert('No se ha podido desactivar el registro.');
        return;
    }

    let oData = data[0];

    if (oData.status_response === 1) {
        alert(oData.description_response);
        getCliente('__all__');
    }
    else {
        alert('No se puedo guardar los cambios.')
        return;
    }
}