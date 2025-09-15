//HACER PRIMERO EL METODO PARA ARMAR EL COMBO DESPLEGABLE DE CATEGORIAS
async function comboCategorias() {

    const res = await authFetch("Categorias");

    const categorias = await res.json();

    const comboSelectBuscar = document.querySelector("#categoriaFiltro");
    comboSelectBuscar.innerHTML = "";


    let opcionesBuscar = `<option value="0">[Categorias]</option>`;
    categorias.forEach(cat => {

        opcionesBuscar += `<option value="${cat.categoriaID}">${cat.nombre}</option>`;
    });
  
    comboSelectBuscar.innerHTML = opcionesBuscar;

    ObtenerTickets();
}

async function ObtenerTickets() {
    let fechaDesde = document.getElementById("FechaDesdeBuscar").value;
    let fechaHasta = document.getElementById("FechaHastaBuscar").value;

    const fecha1 = new Date(fechaDesde);
    const fecha2 = new Date(fechaHasta);

    if (fecha1 > fecha2) {
        fechaHasta = fechaDesde;
        document.getElementById("FechaHastaBuscar").value = fechaDesde;
    }

    const filtros = {
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
        categoriaID: document.getElementById("categoriaFiltro").value,
        prioridad: document.getElementById("prioridadFiltro").value,
        estado: document.getElementById("estadoFiltro").value
    };

    const res = await authFetch(`Informes/ticketsporcategoria`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filtros)
    });

    const categorias = await res.json();
    const tbody = document.querySelector("#tablaTicket tbody");
    tbody.innerHTML = "";

    categorias.forEach(categoria => {

        const rowCategoria = document.createElement("tr");
        rowCategoria.innerHTML = `          
            <td class='text-bold table-success text-center' colspan='4'>${categoria.nombre}</td>          
        `;
        tbody.appendChild(rowCategoria);

        categoria.tickets.forEach(tic => {
            const row = document.createElement("tr");
            let clase = "prioridad-baja";
            if (tic.prioridades == 2) {
                clase = "prioridad-media";
            } else if (tic.prioridades == 3) {
                clase = "prioridad-alta";
            }

            row.innerHTML = `
            <td class="text-center celda-titulo">${tic.fechaCreacionString}</td>
            <td class='celda-titulo'>${tic.titulo}</td>
            <td class="text-center text-bold ${clase}">${tic.prioridadString}</td>
            <td class="text-center celda-titulo">${tic.estadoString}</td>
        `;
            tbody.appendChild(row);
        });

    });
}

//getTickets();
comboCategorias();