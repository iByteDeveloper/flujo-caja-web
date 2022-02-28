const $PAGE_CUENTA = `
    <div class="body__cuenta">
        <h1>Gestión de Cuentas</h1>

        <p>Módulo para administrar las cuentas bancarias que se registren en el sistema.</p>
        
        <div class="table__container">
            <button id="btnAddCuenta" class="button__primary">Agregar</button>
            <div class="table__cuenta">
                <div class="table__cuenta--head">
                    <div>N°</div>
                    <div>Banco</div>
                    <div>Propietario</div>
                    <div>Moneda</div>
                    <div>Datos de la cuenta</div>
                    <div>Herramientas</div>
                </div>
                <div class="table__cuenta--body">

                </div>
            </div>
        </div>
    </div>
`
const $TEMPLATE_MODAL_CUENTA = `
    <div class="content__cuenta">
        <label id="lblIdCuenta" class="display__none"></label>
        <div class="input__text">
            <label>Nombre del banco</label>
            <select id="cboBanco">

            <select>
        </div>
        <div class="input__text">
            <label>Propietario</label>
            <select id="cboPersona">

            <select>
        </div>
        <div class="input__text">
            <label>Moneda</label>
            <select id="cboMoneda">

            <select>
        </div>
        <div class="input__text">
            <label>Disponible</label>
            <input id="txtDisponible" type="text">
        </div>
        <div class="input__text">
            <label>Código de cuenta (CC)</label>
            <input id="txtNroCTA" type="text">
        </div>
        <div class="input__text">
            <label>Código de cuenta interbancario (CCI)</label>
            <input id="txtNroCCI" type="text">
        </div>

        <div class="content__buttons">
            <button id="btnSaveCuenta" class="button__primary">Guardar</button>
            <button id="btnCancelCuenta" class="button__secondary">Cancelar</button>
        </div>
    </div>
`
var $btnAddCuenta;
var $btnSaveCuenta;
var flagAddCuenta = false;

// Función para obtener el registro
async function getCuenta(_cci = '__all__') {

    $btnAddCuenta = document.querySelector('#btnAddCuenta');
    $btnAddCuenta.addEventListener('click', addCuentaModal);

    const data = await fetch(`${GET_CUENTA}/${_cci}`).then(resp => resp.json());

    if (data === null) {
        alert('No hay datos para mostrar.')
        return;
    }

    fillTableCuenta(data);
}

async function getBancoSelect() {
    let dataBanco = await fetch(`${GET_BANCO}/0`).then(resp => resp.json());
    let $cboBanco = document.getElementById('cboBanco');

    dataBanco.map((row) => {
        let $option = document.createElement('option');
        $option.text = row.descorta;
        $option.value = row.idbanco;
        $cboBanco.appendChild($option);
    });
}

async function getPersonaSelect() {
    let dataPersona = await fetch(`${GET_PERSONA}/__all__`).then(resp => resp.json());
    let $cboPersona = document.getElementById('cboPersona');

    dataPersona.map((row) => {
        let $option = document.createElement('option');
        $option.text = row.completo;
        $option.value = row.idpersona;
        $cboPersona.appendChild($option);
    });
}

async function getMonedaSelect() {
    let dataMoneda = await fetch(`${GET_MONEDA}/0`).then(resp => resp.json());
    let $cboMoneda = document.getElementById('cboMoneda');

    dataMoneda.map((row) => {
        let $option = document.createElement('option');
        $option.text = row.descorta;
        $option.value = row.idmoneda;
        $cboMoneda.appendChild($option);
    });
}

// Función para llenar la tabla
function fillTableCuenta(_data) {
    let rowCurrent = 1;
    const $body = document.querySelector('.table__cuenta--body');
    $body.innerHTML = '';

    _data.map((row) => {

        let imgTgl = (row.idestado === 1) ? 'activate' : 'desactivate';
        const $row = `
            <div data-identificador="${row.idcuenta}" class="body__row" >
                <div>${rowCurrent}</div>
                <div>${row.banco}</div>
                <div>${row.persona}</div>
                <div>${row.moneda}</div>
                <div class="cuenta__info">
                    <span>CC: ${row.cta}</span>
                    <span>CCI: ${row.cci}</span>
                </div>
                <div class="table__options--horizontal">
                    <img class="edit__cuenta" onclick="openModalCuenta('${row.cci}');" alt="Editar" src="./images/general/edit.svg" title="Editar" />
                    <img onclick="deleteCuenta('${row.cci}');" title="${(row.idestado === 1) ? 'Desactivar' : 'Activar'}" class="toggle__cuenta" alt="Activar/desactivar" src="./images/general/${imgTgl}.svg" />
                </div>
            </div>
        `
        rowCurrent += 1;
        $body.insertAdjacentHTML('beforeend', $row);
    });
}

// Función para abrir el modal y settear los campos
async function openModalCuenta(_cci) {
    $modal__loader.classList.remove('display__none');

    flagAdd = false;
    clearModalContentClass();
    $modal__content.classList.add('modal__content-400');
    $lblModalTitle.textContent = 'Modificar Datos de la Cuenta'

    let data = await fetch(`${GET_CUENTA}/${_cci}`).then(resp => resp.json());

    if (data.length === 0) {
        alert('No se ha podido recuperar los datos. \nInténtelo nuevamente.');
        return;
    }

    let oData = data[0];

    $modalBody.innerHTML = $TEMPLATE_MODAL_CUENTA;
    $btnSaveCuenta = document.querySelector('#btnSaveCuenta');
    $btnSaveCuenta.addEventListener('click', saveDataCuenta);

    await getBancoSelect();
    await getPersonaSelect();
    await getMonedaSelect();

    let $lblIdCuenta = document.getElementById('lblIdCuenta');
    let $cboBanco = document.getElementById('cboBanco');
    let $cboPersona = document.getElementById('cboPersona');
    let $cboMoneda = document.getElementById('cboMoneda');
    let $txtDisponible = document.getElementById('txtDisponible');
    let $txtCuenta = document.getElementById('txtNroCTA');
    let $txtInterbancario = document.getElementById('txtNroCCI');

    $lblIdCuenta.value = oData.idcuenta;
    $cboBanco.value = oData.idbanco;
    $cboPersona.value = oData.idpersona;
    $cboMoneda.value = oData.idmoneda;
    $txtDisponible.value = oData.disponible;
    $txtCuenta.value = oData.cta;
    $txtInterbancario.value = oData.cci;

    $modal.classList.remove('display__none');
    $modal__loader.classList.add('display__none');
}

// Función para agregar un banco
async function addCuentaModal() {

    $modal__loader.classList.remove('display__none');

    flagAdd = true;
    clearModalContentClass();
    $modal__content.classList.add('modal__content-400');
    $lblModalTitle.textContent = 'Gestión de Cuenta'

    $modalBody.innerHTML = $TEMPLATE_MODAL_CUENTA;

    await getBancoSelect();
    await getPersonaSelect();
    await getMonedaSelect();

    $btnSaveCuenta = document.querySelector('#btnSaveCuenta');
    $btnSaveCuenta.addEventListener('click', saveDataCuenta);

    $modal.classList.remove('display__none');
    $modal__loader.classList.add('display__none');
}

//Función para guardar los cambios
async function saveDataCuenta() {

    let $lblIdCuenta = document.getElementById('lblIdCuenta');
    let $cboBanco = document.getElementById('cboBanco');
    let $cboPersona = document.getElementById('cboPersona');
    let $cboMoneda = document.getElementById('cboMoneda');
    let $txtDisponible = document.getElementById('txtDisponible');
    let $txtCuenta = document.getElementById('txtNroCTA');
    let $txtInterbancario = document.getElementById('txtNroCCI');

    let codeCuenta = $lblIdCuenta.value,
        URL_REQUEST = EDT_CUENTA,
        URL_METHOD = 'PATCH';

    if (flagAdd) {
        codeCuenta = 0;
        URL_REQUEST = ADD_CUENTA;
        URL_METHOD = 'PUT';
    }

    let fData = new FormData();
    fData.append('_idusuario', $VAL);
    fData.append('_idcuenta', codeCuenta)
    fData.append('_idbanco', $cboBanco.value);
    fData.append('_idpersona', $cboPersona.value);
    fData.append('_idmoneda', $cboMoneda.value);
    fData.append('_disponible', $txtDisponible.value);
    fData.append('_cta', $txtCuenta.value);
    fData.append('_cci', $txtInterbancario.value);

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
        getCuenta('__all__');
    }
}

async function deleteCuenta(_cci) {

    let fData = new FormData();
    fData.append('_idusuario', $VAL);
    fData.append('_cci', _cci);
    let data = await fetch(DEL_CUENTA, { method: 'DELETE', body: fData }).then(resp => resp.json());

    if (data.length === 0) {
        alert('No se ha podido desactivar el registro.');
        return;
    }

    let oData = data[0];

    if (oData.status_response === 1) {
        alert(oData.description_response);
        getCuenta('__all__');
    }
    else {
        alert('No se puedo guardar los cambios.')
        return;
    }

}