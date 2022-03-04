const $PAGE_PERSONA = `
    <div class="body__persona">
        <h1>Gestión de Personas</h1>

        <p>Módulo para administrar las personas que se registren en el sistema.</p>
        
        <div class="table__container">
            <button id="btnAddPersona" class="button__primary">Agregar</button>
            <div class="table__persona">
                <div class="table__persona--head">
                    <div>N°</div>
                    <div>Tipo doc.</div>
                    <div>Nro doc.</div>
                    <div>Apellidos y Nombres</div>
                    <div>Correo electrónico</div>
                    <div>Nro teléfono</div>
                    <div>Nro celular</div>
                    <div>Herramientas</div>
                </div>
                <div class="table__persona--body">

                </div>
            </div>
        </div>
    </div>
`

const $TEMPLATE_MODAL_PERSONA = `
    <div class="content__persona">
        <label id="lblIdPersona" class="display__none"></label>
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
            <label>Correo</label>
            <input id="txtCorreo" type="text">
        </div>
        <div class="input__text">
            <label>Nro de teléfono</label>
            <input id="txtTelefono" type="text">
        </div>
        <div class="input__text">
            <label>Nro de celular</label>
            <input id="txtCelular" type="text">
        </div>

        <div class="content__buttons">
            <button id="btnSavePersona" class="button__primary">Guardar</button>
            <button id="btnCancelPersona" class="button__secondary">Cancelar</button>
        </div>
    </div>
`
var $btnAddPersona;
var $btnSavePersona;
var flagAddPersona = false;

// Función para obtener el registro
async function getPersona(_ndoc = '__all__') {

    $btnAddPersona = document.querySelector('#btnAddPersona');
    $btnAddPersona.addEventListener('click', addPersonaModal);

    const data = await fetch(`${GET_PERSONA}/${_ndoc}`).then(resp => resp.json());

    if (data === null) {
        alert('No hay datos para mostrar.')
        return;
    }

    fillTablePersona(data);
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
function fillTablePersona(_data) {
    let rowCurrent = 1;
    const $body = document.querySelector('.table__persona--body');
    $body.innerHTML = '';

    _data.map((row) => {

        let imgTgl = (row.idestado === 1) ? 'activate' : 'desactivate';
        const $row = `
            <div data-identificador="${row.idpersona}" class="body__row" >
                <div>${rowCurrent}</div>
                <div>${row.tipodocumento}</div>
                <div>${row.ndocumento}</div>
                <div>${row.completo}</div>
                <div>${row.correo}</div>
                <div>${row.telefono}</div>
                <div>${row.celular}</div>
                <div class="table__options--horizontal">
                    <img class="edit__persona" onclick="openModalPersona('${row.ndocumento}');" alt="Editar" src="./images/general/edit.svg" title="Editar" />
                    <img onclick="deletePersona(${row.idpersona});" title="${(row.idestado === 1) ? 'Desactivar' : 'Activar'}" class="toggle__cuenta" alt="Activar/desactivar" src="./images/general/${imgTgl}.svg" />
                </div>
            </div>
        `
        rowCurrent += 1;
        $body.insertAdjacentHTML('beforeend', $row);
    });
}

// Función para abrir el modal y settear los campos
async function openModalPersona(_ndoc) {
    $modal__loader.classList.remove('display__none');

    flagAdd = false;
    clearModalContentClass();
    $modal__content.classList.add('modal__content-500');
    $modal__content.classList.add('modal__contentWidth-40perc');
    $lblModalTitle.textContent = 'Modificar Datos de la Persona'

    let data = await fetch(`${GET_PERSONA}/${_ndoc}`).then(resp => resp.json());

    if (data.length === 0) {
        alert('No se ha podido recuperar los datos. \nInténtelo nuevamente.');
        return;
    }

    let oData = data[0];

    $modalBody.innerHTML = $TEMPLATE_MODAL_PERSONA;
    $btnSavePersona = document.querySelector('#btnSavePersona');
    $btnSavePersona.addEventListener('click', saveDataPersona);

    await getTipoDocumentoSelect();

    let $lblIdPersona = document.getElementById('lblIdPersona');
    let $cboTipoDocumento = document.getElementById('cboTipoDocumento');
    let $txtNdocumento = document.getElementById('txtNdocumento');
    let $txtPaterno = document.getElementById('txtPaterno');
    let $txtMaterno = document.getElementById('txtMaterno');
    let $txtNombres = document.getElementById('txtNombres');
    let $txtCorreo = document.getElementById('txtCorreo');
    let $txtTelefono = document.getElementById('txtTelefono');
    let $txtCelular = document.getElementById('txtCelular');

    $lblIdPersona.value = oData.idpersona;
    $cboTipoDocumento.value = oData.idtipodocumento;
    $txtNdocumento.value = oData.ndocumento;
    $txtPaterno.value = oData.paterno;
    $txtMaterno.value = oData.materno;
    $txtNombres.value = oData.nombres;
    $txtCorreo.value = oData.correo;
    $txtTelefono.value = oData.telefono;
    $txtCelular.value = oData.celular;

    $modal.classList.remove('display__none');
    $modal__loader.classList.add('display__none');
}

// Función para agregar una persona
async function addPersonaModal() {

    $modal__loader.classList.remove('display__none');

    flagAdd = true;
    clearModalContentClass();
    $modal__content.classList.add('modal__content-500');
    $modal__content.classList.add('modal__contentWidth-40perc');
    $lblModalTitle.textContent = 'Gestión de Personas'

    $modalBody.innerHTML = $TEMPLATE_MODAL_PERSONA;

    await getTipoDocumentoSelect();

    $btnSavePersona = document.querySelector('#btnSavePersona');
    $btnSavePersona.addEventListener('click', saveDataPersona);

    $modal.classList.remove('display__none');
    $modal__loader.classList.add('display__none');
}

//Función para guardar los cambios
async function saveDataPersona() {

    let $lblIdPersona = document.getElementById('lblIdPersona');
    let $cboTipoDocumento = document.getElementById('cboTipoDocumento');
    let $txtNdocumento = document.getElementById('txtNdocumento');
    let $txtPaterno = document.getElementById('txtPaterno');
    let $txtMaterno = document.getElementById('txtMaterno');
    let $txtNombres = document.getElementById('txtNombres');
    let $txtCorreo = document.getElementById('txtCorreo');
    let $txtTelefono = document.getElementById('txtTelefono');
    let $txtCelular = document.getElementById('txtCelular');

    let codePersona = $lblIdPersona.value,
        URL_REQUEST = EDT_PERSONA,
        URL_METHOD = 'PATCH';

    if (flagAdd) {
        codePersona = 0;
        URL_REQUEST = ADD_PERSONA;
        URL_METHOD = 'PUT';
    }
    debugger
    let fData = new FormData();
    fData.append('_idusuario', $VAL);
    fData.append('_idpersona', codePersona)
    fData.append('_idtipodoc', $cboTipoDocumento.value)
    fData.append('_ndocumento', $txtNdocumento.value)
    fData.append('_paterno', $txtPaterno.value)
    fData.append('_materno', $txtMaterno.value)
    fData.append('_nombres', $txtNombres.value)
    fData.append('_correo', $txtCorreo.value)
    fData.append('_telefono', $txtTelefono.value)
    fData.append('_celular', $txtCelular.value)

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
        getPersona('__all__');
    }
}

async function deletePersona(_id) {

    let fData = new FormData();
    fData.append('_idusuario', $VAL);
    fData.append('_idpersona', _id);
    let data = await fetch(DEL_PERSONA, { method: 'DELETE', body: fData }).then(resp => resp.json());

    if (data.length === 0) {
        alert('No se ha podido desactivar el registro.');
        return;
    }

    let oData = data[0];

    if (oData.status_response === 1) {
        alert(oData.description_response);
        getPersona('__all__');
    }
    else {
        alert('No se puedo guardar los cambios.')
        return;
    }
}