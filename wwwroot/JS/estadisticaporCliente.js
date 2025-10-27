async function ObtenerTickets() {

    const res = await authFetch(`Informes/estadisticaticketporcliente`, {
        method: "GET",
    });
    if (!res.ok) {
        const errorText = await res.text();
        console.error("Error del servidor:", errorText);
        return;
    }


    const clientes = await res.json();
    console.log(clientes);
    const tbody = document.querySelector("#tablaTicket tbody");
    tbody.innerHTML = "";

    clientes.forEach(cliente => {

        const rowCliente = document.createElement("tr");
        rowCliente.innerHTML = `          
            <td class='colorfilainforme text-center'>${cliente.nombreCliente}</td>
            <td class="text-center celda-titulo">${cliente.ticketsTotales}</td>
            <td class="text-center celda-titulo">${cliente.ticketsAbiertos}</td>
            <td class="text-center celda-titulo">${cliente.ticketsCerrados}</td>     
            <td class="text-center celda-titulo">${cliente.critico} %</td>     
            <td class="text-center celda-titulo">${cliente.fechaUltimoTicketCreado}</td>     
            <td class="text-center celda-titulo">${cliente.fechaUltimoTicketFinalizado}</td>     
        `;
        tbody.appendChild(rowCliente);
    });
}

ObtenerTickets();