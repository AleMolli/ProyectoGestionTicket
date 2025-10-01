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

    const res = await authFetch(`Informes/ticketsporDesarrolladores`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filtros)
    });

    const desarrolladores = await res.json();
    console.log(desarrolladores);
    const tbody = document.querySelector("#tablaTicket tbody");
    tbody.innerHTML = "";

    desarrolladores.forEach(desarrollador => {

        const rowdesarrollador = document.createElement("tr");
        rowdesarrollador.innerHTML = `          
            <td class='colorfilainforme text-start' colspan='4'>Desarrollador: ${desarrollador.nombre}</td>          
        `;
        tbody.appendChild(rowdesarrollador);

        desarrollador.categorias.forEach(categoria => {
            const rowcategoria = document.createElement("tr");
            rowcategoria.innerHTML = `          
            <td class='colorfilainforme text-center' colspan='4'>Categoria: ${categoria.nombre}</td>          
        `;
            tbody.appendChild(rowcategoria);

            categoria.clientes.forEach(cliente => {
                const rowcliente = document.createElement("tr");
                rowcliente.innerHTML = `          
            <td class='colorfilainforme text-end' colspan='4'>Cliente: ${cliente.nombre}</td>          
        `;
                tbody.appendChild(rowcliente);

                cliente.tickets.forEach(tic => {
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
            <td class="text-center ${clase}">${tic.prioridadString}</td>
            <td class="text-center celda-titulo">${tic.estadoString}</td>
        `;
                    tbody.appendChild(row);
                });
            })
        })
    });
}

//getTickets();
comboCategorias();