async function ObtenerTickets() {

    const res = await authFetch(`Informes/estadisticaticketporclienteporcategoria`, {
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
            <td class='colorfilainforme text-center table-info'>${cliente.nombreCliente}</td>
            <td class="text-center celda-titulo table-info">${cliente.ticketsTotales}</td>
            <td class="text-center celda-titulo table-info">${cliente.ticketsAbiertos}</td>
            <td class="text-center celda-titulo table-info">${cliente.ticketsCerrados}</td>     
            <td class="text-center celda-titulo table-info">${cliente.critico} %</td>     
            <td class="text-center celda-titulo table-info">${cliente.fechaUltimoTicketCreado}</td>     
            <td class="text-center celda-titulo table-info">${cliente.fechaUltimoTicketFinalizado}</td>     
        `;
        tbody.appendChild(rowCliente);

        cliente.categorias.forEach(categoria => {
            const rowCategoria = document.createElement("tr");
            rowCategoria.innerHTML = `          
            <td class='colorfilainforme text-center'>${categoria.nombre}</td>
            <td class="text-center celda-titulo">${categoria.ticketsTotales}</td>
            <td class="text-center celda-titulo">${categoria.cantidadAbiertos}</td>
            <td class="text-center celda-titulo">${categoria.cantidadCerrados}</td>     
            <td class="text-center celda-titulo">${categoria.critico} %</td>     
            <td class="text-center celda-titulo">${categoria.fechaUltimoTicketCreado}</td>     
            <td class="text-center celda-titulo">${categoria.fechaUltimoTicketFinalizado}</td>     
        `;
        tbody.appendChild(rowCategoria);
        })
    });
}

ObtenerTickets();