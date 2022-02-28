const $PAGE_BANCO = `
    <div class="body__banco">
        <h1>Gestión de Bancos</h1>

        <p>Módulo para administrar las entidades bancarias que se registren en el sistema.</p>
        
        <div class="table__container">
            <button id="btnAddBanco" class="button__primary">Agregar</button>
            <div class="table__banco">
                <div class="table__banco--head">
                    <div>N°</div>
                    <div>Nombre de la Entidad</div>
                    <div>Descripción corta</div>
                    <div>Herramientas</div>
                </div>
                <div class="table__banco--body">

                </div>
            </div>
        </div>
    </div>
`
const $TEMPLATE_MODAL_BANCO = `
    <div class="content__banco">
        <label id="lblIdBanco" class="display__none"></label>
        <div class="input__text">
            <label>Nombre del banco</label>
            <input id="txtNombreBanco" type="text" placeholder="Ejemplo: Banco de la Nación">
        </div>
        <div class="input__text">
            <label>Descripción corta del banco</label>
            <input id="txtDescortaBanco" type="text" placeholder="Ejemplo: BN">
        </div>

        <div class="content__buttons">
            <button id="btnBancoSave" class="button__primary">Guardar</button>
            <button id="btnBancoCancel" class="button__secondary">Cancelar</button>
        </div>
    </div>
`
var $btnAddBanco;
var $btnBancoSave;
var flagAdd = false;
// Función para obtener el registro
async function getBanco(_id = 0) {

    $btnAddBanco = document.querySelector('#btnAddBanco');
    $btnAddBanco.addEventListener('click', addBancoModal);

    const data = await fetch(`${GET_BANCO}/${_id}`).then(resp => resp.json());

    if (data === null) {
        alert('No hay datos para mostrar.')
        return;
    }

    fillTableBanco(data);
}

// Función para llenar la tabla
function fillTableBanco(_data) {
    let rowCurrent = 1;
    const $body = document.querySelector('.table__banco--body');
    $body.innerHTML = '';

    _data.map((row) => {

        let imgTgl = (row.idestado === 1) ? 'activate' : 'desactivate';
        const $row = `
            <div data-identificador="${row.idbanco}" class="body__row" >
                <div>${rowCurrent}</div>
                <div>${row.nombre}</div>
                <div>${row.descorta}</div>
                <div class="table__options--horizontal">
                    <img class="edit__banco" onclick="openModalBanco(${row.idbanco});" alt="Editar" src="./images/general/edit.svg" title="Editar" />
                    <img onclick="deleteBanco(${row.idbanco});" title="${(row.idestado === 1) ? 'Desactivar' : 'Activar'}" class="toggle__bacno" alt="Activar/desactivar" src="./images/general/${imgTgl}.svg" />
                </div>
            </div>
        `
        rowCurrent += 1;
        $body.insertAdjacentHTML('beforeend', $row);
    });
}

// Función para abrir el modal y settear los campos
async function openModalBanco(_id) {
    flagAdd = false;
    clearModalContentClass();
    $modal__content.classList.add('modal__content-200');
    $lblModalTitle.textContent = 'Modificar Datos del Banco'

    let data = await fetch(`${GET_BANCO}/${_id}`).then(resp => resp.json());

    if (data.length === 0) {
        alert('No se ha podido recuperar los datos. \nInténtelo nuevamente.');
        return;
    }

    let oData = data[0];

    $modalBody.innerHTML = $TEMPLATE_MODAL_BANCO;
    $btnBancoSave = document.querySelector('#btnBancoSave');
    $btnBancoSave.addEventListener('click', saveDataBanco);


    let $lblIdBanco = document.getElementById('lblIdBanco');
    let $txtNombreBanco = document.getElementById('txtNombreBanco');
    let $txtDescortaBanco = document.getElementById('txtDescortaBanco');

    $lblIdBanco.value = oData.idbanco;
    $txtNombreBanco.value = oData.nombre;
    $txtDescortaBanco.value = oData.descorta;

    $modal.classList.remove('display__none');
}

// Función para agregar un banco
function addBancoModal() {
    flagAdd = true;
    clearModalContentClass();
    $modal__content.classList.add('modal__content-200');
    $lblModalTitle.textContent = 'Gestión de Banco'

    $modalBody.innerHTML = $TEMPLATE_MODAL_BANCO;

    $btnBancoSave = document.querySelector('#btnBancoSave');
    $btnBancoSave.addEventListener('click', saveDataBanco);

    $modal.classList.remove('display__none');
}

//Función para guardar los cambios
async function saveDataBanco() {

    let $lblIdBanco = document.getElementById('lblIdBanco');
    let $txtNombreBanco = document.getElementById('txtNombreBanco');
    let $txtDescortaBanco = document.getElementById('txtDescortaBanco');

    let codeBanco = $lblIdBanco.value,
        URL_REQUEST = EDT_BANCO,
        URL_METHOD = 'PATCH';

    if (flagAdd) {
        codeBanco = 0;
        URL_REQUEST = ADD_BANCO;
        URL_METHOD = 'PUT';
    }

    let fData = new FormData();
    fData.append('_idusuario', $VAL);
    fData.append('_idbanco', $lblIdBanco.value);
    fData.append('_nombre', $txtNombreBanco.value);
    fData.append('_descorta', $txtDescortaBanco.value);


    let data = await fetch(URL_REQUEST, { method: URL_METHOD, body: fData }).then(resp => resp.json());
    let oData;

    if (data.length === 0) {
        alert('No se puedo guardar los cambios.')
        return;
    }

    oData = data[0];
    if (oData.status_response === 1) {
        alert(oData.description_response);
        $modal.classList.add('display__none');
    }
    else {
        alert('No se puedo guardar los cambios.')
        return;
    }

    getBanco(0);
}

async function deleteBanco(_id) {

    let fData = new FormData();
    fData.append('_idusuario', $VAL);
    fData.append('_idbanco', _id);
    let data = await fetch(DEL_BANCO, { method: 'DELETE', body: fData }).then(resp => resp.json());

    if (data.length === 0) {
        alert('No se ha podido desactivar el registro.');
        return;
    }

    let oData = data[0];

    if (oData.status_response === 1) {
        alert(oData.description_response);
        getBanco(0);
    }
    else {
        alert('No se puedo guardar los cambios.')
        return;
    }

}