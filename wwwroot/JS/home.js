async function ObtenerTicketsParaHome(){
    const filtrosCategoria = {
        fechaDesde: null,
        fechaHasta: null,
        categoriaID: 0,
        prioridad: 0,
        estado: 0
    };
    const res = await authFetch(`Informes/Filtrar`,
        {
            method: 'POST',
            body: JSON.stringify(filtrosCategoria)
        }
    )
    const data = await res.json();
    //console.log(data);

    let tbodyAbierto = document.querySelector("#tablaTicketAbiertos tbody")
    tbodyAbierto.innerHTML = "";

    let tbodyProceso = document.querySelector("#tablaTicketProceso tbody")
    tbodyProceso.innerHTML = "";

    let tbodyCerrado = document.querySelector("#tablaTicketCerrados tbody")
    tbodyCerrado.innerHTML = "";

    data.forEach(ticket => {
        let estado = ticket.estadoString;
        if(estado == "Abierto"){
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class='data-ticket celda-titulo align-middle'>${ticket.fechaCreacionString}</td>
                <td class='text-center'>
                    <a onclick='BuscarTicketparadetalle(${ticket.ticketID})'><i class='btn bi bi-card-checklist text-success'></i></a>
                </td>
            `;
            tbodyAbierto.appendChild(row);
        } else if(estado == "EnProceso") {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class='data-ticket celda-titulo align align-middle'>${ticket.fechaCreacionString}</td>
                <td class='text-center'>
                    <a onclick='BuscarTicketparadetalle(${ticket.ticketID})'><i class='btn bi bi-card-checklist text-success'></i></a>
                </td>
            `;
            tbodyProceso.appendChild(row);
        } else if(estado == "Cerrado"){
            const row = document.createElement("tr");
            row.innerHTML = `
                <td class='data-ticket celda-titulo align-middle'>${ticket.fechaCreacionString}</td>
                <td class='text-center'>
                    <a onclick='BuscarTicketparadetalle(${ticket.ticketID})'><i class='btn bi bi-card-checklist text-success'></i></a>
                </td>
            `;
            tbodyCerrado.appendChild(row);
        }
    })
}

function BuscarTicketparadetalle(id) {
    authFetch(`Tickets/${id}`,
        {
            method: 'GET',
        }
    )
        .then(response => response.json())
        .then(data => {
            document.getElementById("usuariocreadorDetalle").value = data.usuarioCreador.nombreCompleto + " " + "-" + " " + "Email: " + data.usuarioCreador.email;
            document.getElementById("fechadetalleTicket").value = data.ticket.fechaCreacionString;
            document.getElementById("titulodetealleTicket").value = data.ticket.titulo;
            document.getElementById("categoriadetalleTicket").value = data.ticket.categoriaString;
            document.getElementById("estadodetalleTicket").value = data.ticket.estadoString;
            document.getElementById("prioridaddetalleTicket").value = data.ticket.prioridadString;
            document.getElementById("detalledetalleTicket").value = data.ticket.descripcion;

            $('#modalDetalleTicket').modal('show');
        })
        .catch(error => console.log("No se puede acceder a la api: ", error))
}

ObtenerTicketsParaHome();