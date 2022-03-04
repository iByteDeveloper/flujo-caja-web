const $PAGE_LISTA = `
    <div class="body__lista">
        <h1>Gestión de Listas</h1>

        <p>Módulo para administrar las listas de excel que se registren en el sistema.</p>
        
        <div class="table__container">
            <div class="section__upload">
                <input id="file__attachment" class="button__upload" type="file"
                    accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" title="Subir archivos">
                
            </div>
            <div class="section__filter">
                <div class="input__text">
                    <label>Cliente</label>
                    <select id="cboCliente">
                    <select>
                </div>
                <button id="btnAddLista" class="button__primary">Nuevo</button>
            </div>
            <table id="tableExcel">

            </table>
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
var $cboCliente;
var rowDefault = 1;
var $file__attachment;

// Función para llenar el combo de cliente
async function getClienteSelect() {
    const dataCliente = await fetch(`${GET_CLIENTE}/__all__`).then(resp => resp.json());
    $cboCliente = document.getElementById('cboCliente');

    let $optionAll = document.createElement('option');
    $optionAll.text = '- TODOS -';
    $optionAll.value = '-999999___1';
    $cboCliente.appendChild($optionAll);

    dataCliente.map((row) => {
        let $option = document.createElement('option');
        $option.text = row.completo;
        $option.value = `${row.idcliente}___${row.cabecera}`;
        $cboCliente.appendChild($option);
    });

    $file__attachment = document.getElementById('file__attachment');
    $btnAddLista = document.getElementById('btnAddLista');
    $btnAddLista.addEventListener('click', () => {
        if (parseInt($cboCliente.value.split('___')[0]) > 0) {
            rowDefault = parseInt($cboCliente.value.split('___')[1]);
            $file__attachment.click();
        }
        else {
            alert('Primero seleccione un cliente.');
            return;
        }
    });

    $file__attachment.addEventListener('change', readExcelFile);
}

function getLista() {


}

function readExcelFile() {

    readXlsxFile($file__attachment.files[0]).then(function (data) {
        //Abrimos el modal
        openExcelDetail(data)
    });
}

const $CONTENT_MODAL_EXCEL = `
    <div class="modal__excel">
        <div class="table__container">
            <button id="btnExcelConfirm" class="button__primary display__none">Confirmar</button>
            
        </div>
    </div>
`
function openExcelDetail(_data) {
    $modal__loader.classList.remove('display__none');

    $modalBody.innerHTML = $CONTENT_MODAL_EXCEL;
    let nRow = 0;
    _data.map((r) => {
        nRow += 1;

        let table = document.getElementById('tableExcel')
        if (nRow < rowDefault) return;
        if (nRow === rowDefault) {
            //Cabecera
            generateTableHead(table, r);
        }
        if (nRow > rowDefault) {
            //Body
            countHeadRow = 0;
            generateTableRows(table, r);
        }
    });

    $modal__loader.classList.add('display__none');
}

let selectTemplate = `<br />
                        <select>
                            <option>No considerar</option>
                            <option>Datos</option>
                            <option>Alias</option>
                            <option>Banco</option>
                            <option>CC</option>
                            <option>CCI</option>
                            <option>Monto</option>
                        </select>`;
var countHead = 0;
var countHeadRow = 0;
function generateTableHead(_table, _data) {
    let thead = _table.createTHead();
    let row = thead.insertRow();

    for (let key of _data) {
        if (key === null) return;

        let th = document.createElement('th');
        let text = document.createTextNode(key);
        th.appendChild(text);
        th.insertAdjacentHTML('beforeend', selectTemplate)
        row.appendChild(th);

        countHead += 1;
    }
}

function generateTableRows(_table, _data) {
    let newRow = _table.insertRow(-1);
    _data.map((row, index) => {
        countHeadRow += 1;
        if (countHeadRow > countHead) return;
        
        let newCell = newRow.insertCell();
        let newText = document.createTextNode(row);
        newCell.appendChild(newText);
    })
}