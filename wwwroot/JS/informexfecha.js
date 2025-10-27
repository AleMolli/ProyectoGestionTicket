async function ObtenerTickets() {
    const filtros = {
        fechaDesde: null,
        fechaHasta: null,
        categoriaID: 0,
        prioridad: 0,
        estado: document.getElementById("estadoFiltro").value
    };

    const res = await authFetch(`Informes/ticketsporfechacreacion`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filtros)
    });

    const fechas = await res.json();
    
    const tbody = document.querySelector("#tablaTicketxfechacreacion tbody");
    tbody.innerHTML = "";

    fechas.forEach(fecha => {

        const rowFecha = document.createElement("tr");
        rowFecha.innerHTML = `          
            <td class='colorfilainforme text-start' colspan='2'>Fecha Creación: ${fecha.fechaCreacion}</td>          
        `;
        tbody.appendChild(rowFecha);

        fecha.prioridades.forEach(prioridad => {
            const rowPrioridad = document.createElement("tr");
            rowPrioridad.innerHTML = `
                <td class='colorfilainforme text-center' colspan='2'>Prioridad: ${prioridad.prioridad}</td>
            `;
            tbody.appendChild(rowPrioridad)

            prioridad.tickets.forEach(tic => {
                const row = document.createElement("tr");

                row.innerHTML = `
                    <td class='celda-titulo'>${tic.titulo}</td>
                    <td class="text-center celda-titulo">${tic.categoriaString}</td>
                `;
                tbody.appendChild(row);
            })
        });

    });
}

//getTickets();
ObtenerTickets();