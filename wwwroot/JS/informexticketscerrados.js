
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
        categoriaID: 0,
        prioridad: 0,
        estado: 0
    };

    const res = await authFetch(`Informes/ticketsporfechacierre`, {
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

        const rowDesarrollador = document.createElement("tr");
        rowDesarrollador.innerHTML = `          
            <td class='colorfilainforme text-center' colspan='5'>${desarrollador.nombre}</td>          
        `;
        tbody.appendChild(rowDesarrollador);

        desarrollador.tickets.forEach(tic => {
            const row = document.createElement("tr");
            let clase = "prioridad-baja";
            if (tic.prioridades == 2) {
                clase = "prioridad-media";
            } else if (tic.prioridades == 3) {
                clase = "prioridad-alta";
            }

            row.innerHTML = `
            <td class="text-center celda-titulo">${tic.fechaCierreString}</td>
            <td class='celda-titulo'>${tic.titulo}</td>
            <td class="text-center ${clase}">${tic.prioridadString}</td>
            <td class="text-center celda-titulo">${tic.estadoString}</td>
            <td class="text-center celda-titulo">${tic.categoriaString}</td>
        `;
            tbody.appendChild(row);
        });

    });
}

//getTickets();
ObtenerTickets();