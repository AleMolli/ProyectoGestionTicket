function ObtenerClienteDropdown() {
    authFetch(`Clientes`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => DropdownClientes(data))
        .catch(error => console.log("No se pudo acceder acceder al servicio.", error))
}

function DropdownClientes(data) {
    let bodySelect = document.getElementById("clienteFiltro");
    bodySelect.innerHTML = "";

    optFiltro = document.createElement("option");
    optFiltro.value = 0;
    optFiltro.text = "[Todos los Clientes]"

    bodySelect.add(optFiltro);

    data.forEach(element => {
        optFiltro = document.createElement("option");
        optFiltro.value = element.clienteID;
        optFiltro.text = element.nombre

        bodySelect.add(optFiltro);
    })
    //ObtenerTicketsporClientes();
}

const inputCliente = document.getElementById("clienteFiltro");
inputCliente.onchange = function () {
  ObtenerTicketsporClientes();
};


function ObtenerTicketsporClientes() {
    //console.log("hola")
    let fechaDesde = document.getElementById("FechaDesdeBuscarcliente").value;
    let fechaHasta = document.getElementById("FechaHastaBuscarcliente").value;
    let clienteID = document.getElementById("clienteFiltro").value;

    const filtrosClientes = {
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
        clienteID: clienteID
    };
    console.log(filtrosClientes);
    authFetch(`Tickets/FiltrarCliente`,
        {
            method: 'POST',
            body: JSON.stringify(filtrosClientes)
        }
    )
    .then(response => response.json())
    .then(data => MostrarTicketsxCliente(data))
    .catch(error => console.log("No se puede acceder a la api: ", error))
}


function MostrarTicketsxCliente(data) {
    $("#todosLosTicketsClientes").empty();

    $.each(data, function (index, item) {
        let prioridad = item.prioridadString.toLowerCase();
        let icono = '';
        let clase = '';

        switch (prioridad) {
            case 'alta':
                icono = '<i class="bi bi-exclamation-triangle-fill"></i>';
                clase = 'prioridad-alta';
                break;
            case 'media':
                icono = '<i class="bi bi-exclamation-circle-fill"></i>';
                clase = 'prioridad-media';
                break;
            case 'baja':
                icono = '<i class="bi bi-check-circle-fill"></i>';
                clase = 'prioridad-baja';
                break;
        }

        $('#todosLosTicketsClientes').append(
            "<tr>",
            "<td class='data-ticket celda-titulo'>" + item.fechaCreacionString + "</td>",
            "<td class='data-ticket celda-titulo d-none d-sm-table-cell'>" + item.titulo + "</td>",
            "<td class='data-ticket celda-titulo d-none d-md-table-cell'>" + item.estadoString + "</td>",
            "<td class='data-ticket subrayado " + clase + " '>" + icono + " " + item.prioridadString + "</td>",
            "<td class='data-ticket celda-titulo d-none d-lg-table-cell'>" + item.categoriaString + "</td>"
        )
    })
}

ObtenerClienteDropdown();