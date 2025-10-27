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

    const res = await authFetch(`Informes/cantidadticketsporClientes`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(filtros)
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
            <td class='colorfilainforme text-center' colspan='3'>${cliente.nombre}</td>          
        `;
        tbody.appendChild(rowCliente);

        cliente.categorias.forEach(categoria => {
            const rowcategoria = document.createElement("tr");
            rowcategoria.innerHTML = `          
            <td class='colorfilainforme text-center' colspan='3'>Categoria: ${categoria.nombre}</td>          
        `;
            tbody.appendChild(rowcategoria);

            const row = document.createElement("tr");
            row.innerHTML = `
            <td class="text-center celda-titulo">${categoria.cantidadAbiertos}</td>
            <td class="text-center celda-titulo">${categoria.cantidadenProceso}</td>
            <td class="text-center celda-titulo">${categoria.cantidadCerrados}</td>
        `;
            tbody.appendChild(row);
        });
    });
}

ObtenerTickets();