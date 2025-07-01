function ObtenerCategoriaDropdown() {
    authFetch(`Categorias`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => CompletarDropdown(data))
        .catch(error => console.log("No se pudo acceder acceder al servicio.", error))
}

function CompletarDropdown(data) {
    let bodySelect = document.getElementById("categoriaTicket");
    bodySelect.innerHTML = "";
    let bodySelectFiltro = document.getElementById("categoriaFiltro");
    bodySelectFiltro.innerHTML = "";

    optFiltro = document.createElement("option");
    optFiltro.value = 0;
    optFiltro.text = "[Todas las Categorias]"

    bodySelectFiltro.add(optFiltro);

    data.forEach(element => {
        optmodal = document.createElement("option");
        optmodal.value = element.categoriaID;
        optmodal.text = element.nombre

        bodySelect.add(optmodal);

        optFiltro = document.createElement("option");
        optFiltro.value = element.categoriaID;
        optFiltro.text = element.nombre

        bodySelectFiltro.add(optFiltro);
        //console.log(optFiltro);
    })
    ObtenerTickets();
    //ObtenerPrioridadDropdown();
}

ObtenerCategoriaDropdown();


function ObtenerTickets() {
    //console.log("hola")
    let categoriaIDBuscar = document.getElementById("categoriaFiltro").value;
    let prioridadesBuscar = document.getElementById("prioridadFiltro").value;
    let estadoBuscar = document.getElementById("estadoFiltro").value;
    const filtrosCategoria = {
        categoriaID: categoriaIDBuscar,
        prioridad: prioridadesBuscar,
        estado: estadoBuscar
    };

    authFetch(`Tickets/Filtrar`,
        {
            method: 'POST',
            body: JSON.stringify(filtrosCategoria)
        }
    )
        .then(response => response.json())
        .then(data => MostrarTickets(data))
        .catch(error => console.log("No se puede acceder a la api: ", error))
}

//MOSTRAMOS EN UNA TABLA LOS DATOS GUARDADOS EN TABLA TICKETS
function MostrarTickets(data) {
    $("#todosLosTickets").empty();

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

        $('#todosLosTickets').append(
            "<tr>",
            "<td class='data-ticket celda-titulo'>" + item.fechaCreacionString + "</td>",
            "<td class='data-ticket celda-titulo'>" + item.titulo + "</td>",
            "<td class='data-ticket celda-titulo d-none d-sm-table-cell'>" + item.estadoString + "</td>",
            "<td class='data-ticket subrayado " + clase + " d-none d-md-table-cell'>" + icono + " " + item.prioridadString + "</td>",
            "<td class='data-ticket celda-titulo d-none d-lg-table-cell'>" + item.categoriaString + "</td>",
            "<td class='text-center'><a onclick='BuscarTicketparaEditar(" + item.ticketID + ")'><i class='bi bi-brush text-info'></i></a></td>",
            "<td class='text-center'><a onclick='BuscarTicketparadetalle(" + item.ticketID + ")'><i class='bi bi-card-checklist text-success'></i></a></td>",
            "<td class='text-center'><a onclick='ObtenerHistorialTicket(" + item.ticketID + ")'><i class='bi bi-search text-warning'></i></a></td>"
        )
    })
}



function CrearTicketNuevo() {
    let tituloTicket = document.getElementById("tituloTicket").value.trim();
    let descripcionTicket = document.getElementById("descripcionTicket").value.trim();
    let prioridadTicket = document.getElementById("prioridadTicket").value;
    let categoriaTicket = document.getElementById("categoriaTicket").value;

    let posiblesErrores = "";

    if (!tituloTicket) {
        posiblesErrores = "Debe cargar un Titulo para el Ticket.";
    }
    if (categoriaTicket == 0) {
        posiblesErrores += " - Debera seleccionar una Categoria para el Ticket.";
    }
    if (!prioridadTicket) {
        posiblesErrores += " - Seleccione una Prioridad valida.";
    }
    if (!descripcionTicket) {
        posiblesErrores += " - Cargue una descripcion para el Ticket.";
    }

    if (posiblesErrores != "") {
        Swal.fire({
            icon: "error",
            title: "Corrija los errores para continuar",
            text: posiblesErrores,
        });
    }
    else {
        let ticket = {
            titulo: capitalizarTexto(tituloTicket),
            descripcion: descripcionTicket,
            prioridades: parseInt(prioridadTicket),
            categoriaID: categoriaTicket,
        };

        authFetch("Tickets",
            {
                method: 'POST',
                body: JSON.stringify(ticket)
            }
        )
            .then(response => response.json())
            .then(data => {
                if (data.status == 201 || data.status == undefined) {
                    document.getElementById("tituloTicket").value = "";
                    document.getElementById("descripcionTicket").value = "";
                    document.getElementById("prioridadTicket").value = "";
                    document.getElementById("categoriaTicket").value = "";

                    $('#modalAgregarTicket').modal('hide');
                    ObtenerTickets();

                    Swal.fire({
                        icon: "success",
                        title: "Ticket Creado",
                        showConfirmButton: false,
                        timer: 1000
                    });
                }
                else {
                    //console.log(data);
                }

            })
            .catch(error => console.log("No se puede acceder a la api: ", error))
    }
}



// function EliminarTicket(id) {
//     authFetch(`Tickets/${id}`,
//         {
//             method: 'DELETE',
//         }
//     )
//         .then(async response => {
//             if (!response.ok) {
//                 let errorEliminar = await response.text();
//                 throw (errorEliminar)
//             }
//             ObtenerTickets();
//         })
//         .catch(error => {
//             Swal.fire({
//                 icon: "warning",
//                 title: error,
//                 showConfirmButton: false,
//                 timer: 2000
//             });
//         })
// }



// function ConfirmacionEliminacion(id) {
//     Swal.fire({
//         title: "Esta seguro de eliminar este Ticket?",
//         showCancelButton: true,
//         confirmButtonText: "Eliminar",
//     }).then((result) => {
//         /* Read more about isConfirmed, isDenied below */
//         if (result.isConfirmed) {
//             EliminarTicket(id);
//             Swal.fire("Ticket Eliminado");
//         }
//     });
// }



function BuscarTicketparaEditar(id) {
    authFetch(`Tickets/${id}`,
        {
            method: 'GET',
        }
    )
        .then(response => response.json())
        .then(data => {
            //console.log(data);
            if (data.estados != 1) {
                Swal.fire({
                    icon: "warning",
                    title: "No se puede Editar un Ticket que esta en proceso o ya ha sido contestado",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            else {
                document.getElementById("TicketID").value = data.ticketID;
                document.getElementById("tituloTicket").value = data.titulo;
                document.getElementById("descripcionTicket").value = data.descripcion;
                document.getElementById("prioridadTicket").value = data.prioridades;
                document.getElementById("categoriaTicket").value = data.categoriaID;

                document.getElementById("staticBackdropLabel").innerText = "Editar Ticket";

                $('#modalAgregarTicket').modal('show');
            }
        })
        .catch(error => console.log("No se puede acceder a la api: ", error))
}



function EditarTicket() {
    let IDticket = document.getElementById("TicketID").value;
    let tituloTicketeditar = document.getElementById("tituloTicket").value.trim();
    let descripcionTicketeditar = document.getElementById("descripcionTicket").value.trim();
    let prioridadTicketeditar = document.getElementById("prioridadTicket").value;
    let categoriaTicketeditar = document.getElementById("categoriaTicket").value;

    let posiblesErroreseditar = "";

    if (!tituloTicketeditar) {
        posiblesErrores = "Debe cargar un Titulo para el Ticket.";
    }
    if (categoriaTicketeditar == 0) {
        posiblesErrores += " - Debera seleccionar una Categoria para el Ticket.";
    }
    if (!prioridadTicketeditar) {
        posiblesErrores += " - Seleccione una Prioridad valida.";
    }
    if (!descripcionTicketeditar) {
        posiblesErrores += " - Cargue una descripcion para el Ticket.";
    }

    if (posiblesErroreseditar != "") {
        Swal.fire({
            icon: "error",
            title: "Corrija los errores para continuar",
            text: posiblesErroreseditar,
        });
    }
    else {
        let editarTicket = {
            ticketID: IDticket,
            titulo: capitalizarTexto(tituloTicketeditar),
            descripcion: descripcionTicketeditar,
            prioridades: parseInt(prioridadTicketeditar),
            categoriaID: categoriaTicketeditar
        };

        authFetch(`Tickets/${IDticket}`,
            {
                method: 'PUT',
                body: JSON.stringify(editarTicket)
            }
        )
            //.then(response => response.json())
            .then(data => {
                VaciarModal();
                //$('#modalAgregarTicket').modal('hide');
                //ObtenerTickets();
                document.getElementById("staticBackdropLabel").innerText = "Nuevo Ticket";
            })
            .catch(error => console.log("No se puede acceder a la api: ", error))
    }
}


function VaciarModal() {
    document.getElementById("TicketID").value = 0;
    document.getElementById("tituloTicket").value = "";
    document.getElementById("descripcionTicket").value = "";
    document.getElementById("prioridadTicket").value = 0;
    document.getElementById("categoriaTicket").value = "";
    document.getElementById("staticBackdropLabel").innerText = "Nuevo Ticket";
    $('#modalAgregarTicket').modal('hide');
    ObtenerTickets();
}


function BotonGuardarTicket() {
    let inputIDconvalor = document.getElementById("TicketID").value;

    if (inputIDconvalor != 0) {
        EditarTicket();
    }
    else {
        CrearTicketNuevo();
    }
}

function BuscarTicketparadetalle(id) {
    authFetch(`Tickets/${id}`,
        {
            method: 'GET',
        }
    )
    .then(response => response.json())
    .then(data => {
        console.log(data);
        document.getElementById("fechadetalleTicket").value = data.fechaCreacionString;
        document.getElementById("titulodetealleTicket").value = data.titulo;
        document.getElementById("categoriadetalleTicket").value = data.categoriaString;
        document.getElementById("estadodetalleTicket").value = data.estadoString;
        document.getElementById("prioridaddetalleTicket").value = data.prioridadString;
        document.getElementById("detalledetalleTicket").value = data.descripcion;

        $('#modalDetalleTicket').modal('show');
    })
    .catch(error => console.log("No se puede acceder a la api: ", error))
}


function ObtenerHistorialTicket(id) {

    authFetch(`HistorialTickets/${id}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            $('#modalHistorialTicket').modal('show');
            MostrarHistorialTickets(data);
        })
        .catch(error => console.log("No se puede acceder a la api: ", error))
}

function MostrarHistorialTickets(data) {
    $("#historialdeTickets").empty();

    $.each(data, function (index, item) {
        const fecha = new Date(item.fechaCambio);
        const fechaFormateada = new Intl.DateTimeFormat("es-AR", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }).format(fecha);

        $('#historialdeTickets').append(
            "<tr>",
            "<td class='data-ticket celda-titulo'>" + item.campoModificado + "</td>",
            "<td class='data-ticket celda-titulo'>" + item.valorAnterior + "</td>",
            "<td class='data-ticket celda-titulo'>" + item.valorNuevo + "</td>",
            "<td class='data-ticket celda-titulo'>" + fechaFormateada + "</td>"
        )
    })
}


ObtenerCategoriaDropdown();



// function ImprimirPdf() {
//     const{ jsPDF } = window.jspdf;
//     var doc = new jsPDF();
//     //var doc = new jsPDF('l', 'mm', [297, 210]);

//     var totalpaginas = "{total_pages_count_string}";
//     var pageContent = function (data) {

//         doc.setDrawColor(78, 115, 223);
//         doc.setLineWidth(0.7);
//         doc.rect(14, 10, 30, 20, 'S');
//         doc.rect(44, 10, 151, 20, 'S');

//         doc.setFontSize(12);
//         doc.text("Listado de Tickets", 46, 15);
//         doc.text("Filtrado por:", 46, 22);
//          doc.text("Version del sistema: 1.0.0", 46, 28.5);
        
        
//         doc.setLineWidth(0.5);
//         doc.line(44, 17, 195, 17, 'S');

//          doc.line(44, 24, 195, 24, 'S');
      

//         var pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
//         var pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

//         // FOOTER
//         var str = "Pagina " + data.pageCount;
//         // Total page number plugin only available in jspdf v1.0+
//         if (typeof doc.putTotalPages == 'function') {
//             str = str + " de " + totalpaginas;
//         }

//         doc.setLineWidth(8);
//         doc.setDrawColor(78, 115, 223);
//         doc.setTextColor(255, 255, 255);
//         doc.line(14, pageHeight - 11, 196, pageHeight - 11);

//         doc.setFontSize(10);

//         doc.setFontStyle('bold');

//         doc.text(str, 17, pageHeight - 10);
//     };


//     var elem = document.getElementById("tablaTicket");
//     var res = doc.autoTableHtmlToJson(elem);

//     // Eliminar la columna 5 (índice 5)
//     res.columns.splice(5, 1); // Elimina la columna de encabezado
//     res.data = res.data.map(row => {
//         row.splice(5, 1); // Elimina la celda correspondiente de cada fila
//         return row;
//     });

//     doc.autoTable(res.columns, res.data,
//         {
//             addPageContent: pageContent,
//             margin: { top: 32 },
//             styles: {
//                 fillStyle: 'DF',
//                 overflow: 'linebreak',
//                 columnWidth: 110,
//                 lineWidth: 0.1,
//                 lineColor: [238, 238, 238]
//             },
//             headerStyles: {
//                 fillColor: [78, 115, 223],
//                 textColor: [255, 255, 255]
//             },
//             columnStyles: {
//                 0: { columnWidth: 28 },//fecha
//                 1: { columnWidth: 62 },//titulo
//                 2: { columnWidth: 50 },//estado
//                 3: { columnWidth: 20 },//prioridad
//                 4: { columnWidth: 20 }//categoria
//             },
//             createdHeaderCell: function (cell, opts) {
//                 if (opts.column.index == 0 || opts.column.index == 3 || opts.column.index == 4) {
//                     cell.styles.halign = 'center';
//                 }
//                 cell.styles.fontSize = 8;
//             },
//             createdCell: function (cell, opts) {
//                 cell.styles.fontSize = 7;
//                 if (opts.column.index == 0 || opts.column.index == 3 || opts.column.index == 4) {
//                     cell.styles.halign = 'center';
//                 }
//             }
//         }
//     );

//     // Llama antes de abrirlo y calcula el total de paginas.
//     if (typeof doc.putTotalPages === 'function') {
//         doc.putTotalPages(totalpaginas);
//     }

//     var string = doc.output('datauristring');
//     var iframe = "<iframe width='100%' height='100%' src='" + string + "'></iframe>"

//     var x = window.open();
//     x.document.open();
//     x.document.write(iframe);
//     x.document.close();
// }