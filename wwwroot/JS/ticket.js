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
        //console.log("datos filtro: ", optFiltro);
    })
    ObtenerTickets();
    //ObtenerPrioridadDropdown();
}

//ObtenerCategoriaDropdown();

//let ultimaListaDeTickets = [];

async function ObtenerTickets() {
    //console.log("hola")
    let fechaDesde = document.getElementById("FechaDesdeBuscar").value;
    let fechaHasta = document.getElementById("FechaHastaBuscar").value;

    // Convertir a objetos Date
    // const fecha1 = new Date(fechaDesde);
    // const fecha2 = new Date(fechaHasta);

    // // Comparar 
    // if (fecha1 > fecha2) {
    //     fechaHasta = fechaDesde ;
    //     document.getElementById("FechaHastaBuscar").value = fechaDesde;
    // } 

    let categoriaIDBuscar = document.getElementById("categoriaFiltro").value;
    let prioridadesBuscar = document.getElementById("prioridadFiltro").value;
    let estadoBuscar = document.getElementById("estadoFiltro").value;

    const filtrosCategoria = {
        fechaDesde: fechaDesde,
        fechaHasta: fechaHasta,
        categoriaID: categoriaIDBuscar,
        prioridad: prioridadesBuscar,
        estado: estadoBuscar
    };
    //console.log(filtrosCategoria);
    const res = await authFetch(`Informes/Filtrar`,
        {
            method: 'POST',
            body: JSON.stringify(filtrosCategoria)
        }
    )
    const data = await res.json();

    let tbody = document.querySelector("#tablaTicket tbody")
    tbody.innerHTML = "";

    data.forEach(tick => {
        let obtenerrol = getRol();
        let verdadero = false;
        if (obtenerrol == "DESARROLLADOR") {
            verdadero = true;
        }
        let prioridad = tick.prioridadString.toLowerCase();
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
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class='data-ticket celda-titulo'>${tick.fechaCreacionString}</td>
            <td class='data-ticket celda-titulo d-none d-sm-table-cell'>${tick.titulo}</td>
            <td class='data-ticket celda-titulo d-none d-md-table-cell'>${tick.estadoString}</td>
            <td class='data-ticket subrayado ${clase}'>${icono} ${tick.prioridadString}</td>
            <td class='data-ticket celda-titulo d-none d-lg-table-cell'>${tick.categoriaString}</td>
            <td class='text-center'>
                <a onclick='BuscarTicketparaEditar(${tick.ticketID})'><i class='btn bi bi-brush text-info'></i></a>
                <a onclick='BuscarTicketparadetalle(${tick.ticketID})'><i class='btn bi bi-card-checklist text-success'></i></a>
                <a onclick='ObtenerHistorialTicket(${tick.ticketID})'><i class='btn bi bi-search text-warning'></i></a>
                ${verdadero ? `<a onclick='cambioEstado(${tick.ticketID})'><i class='btn bi bi-gear text-light' id='botonRespuesta'></i></a>` : ''}
            </td>
        `;
        tbody.appendChild(row);
    })
}

function cambioEstado(id) {
    authFetch(`Tickets/CambioEstado/${id}`, {
        method: 'PUT',
    })
        .then(() => {
            ObtenerTickets();
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
            if (data.ticket.estados != 1) {
                Swal.fire({
                    icon: "warning",
                    title: "No se puede Editar un Ticket que esta en proceso o ya ha sido contestado",
                    showConfirmButton: false,
                    timer: 1500
                });
            }
            else {
                document.getElementById("nombreUsuariocreador").value = data.usuarioCreador.nombreCompleto;
                document.getElementById("emailUsuarioCreador").value = data.usuarioCreador.email;
                document.getElementById("TicketID").value = data.ticket.ticketID;
                document.getElementById("tituloTicket").value = data.ticket.titulo;
                document.getElementById("descripcionTicket").value = data.ticket.descripcion;
                document.getElementById("prioridadTicket").value = data.ticket.prioridades;
                document.getElementById("categoriaTicket").value = data.ticket.categoriaID;

                document.getElementById("staticBackdropLabel").innerText = "Editar Ticket";
                document.getElementById("nombreUsuariocreador").classList.remove("d-none");
                document.getElementById("emailUsuarioCreador").classList.remove("d-none");

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


function ObtenerHistorialTicket(id) {

    authFetch(`HistorialTickets/${id}`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => {
            $('#modalHistorialTicket').modal('show');
            MostrarHistorialTickets(data);
            //console.log(data);
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
            "<td class='data-ticket celda-titulo'>" + fechaFormateada + "</td>",
            "<td class='data-ticket celda-titulo'>" + item.usuarioClienteID + "</td>"
        )
    })
}


ObtenerCategoriaDropdown();

// function GenerarPDFTickets(data) {

//     //console.log("jsPDF disponible:", typeof jsPDF); // Debe decir "function"
//   const { jsPDF } = window.jspdf;
//   const doc = new jsPDF();

//   const columnas = ["Fecha", "Título", "Estado", "Prioridad", "Categoría"];
//   const filas = data.map(item => [
//     item.fechaCreacionString,
//     item.titulo,
//     item.estadoString,
//     item.prioridadString,
//     item.categoriaString
//   ]);

//   // Encabezado visual
//   doc.setDrawColor(78, 115, 223);
//   doc.setLineWidth(0.7);
//   doc.rect(14, 10, 30, 20, 'S');
//   doc.rect(44, 10, 151, 20, 'S');

//   doc.setFontSize(12);
//   doc.text("Listado de Tickets", 46, 15);
//   doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 46, 22);
//   doc.text("Versión del sistema: 1.0.0", 46, 28.5);

//   doc.line(44, 17, 195, 17);
//   doc.line(44, 24, 195, 24);

//     console.log("Columnas:", columnas);
//     console.log("Filas:", filas);
//     console.log("autoTable existe:", typeof doc.autoTable);


//   // Tabla
//   doc.autoTable({
//     startY: 40,
//     head: [columnas],
//     body: filas,
//     theme: 'grid',
//     styles: {
//       fontSize: 8,
//       cellPadding: 3,
//       lineColor: [220, 220, 220],
//       lineWidth: 0.1,
//     },
//     headStyles: {
//       fillColor: [78, 115, 223],
//       textColor: 255,
//       halign: 'center',
//     },
//     alternateRowStyles: {
//       fillColor: [245, 245, 245],
//     },
//     createdCell: function (cell, opts) {
//       cell.styles.fontSize = 7;
//       if ([0, 3, 4].includes(opts.column.index)) {
//         cell.styles.halign = 'center';
//       }
//     },
//     didDrawPage: function (data) {
//       const pageHeight = doc.internal.pageSize.height;
//       const pageCount = doc.internal.getNumberOfPages();
//       const str = `Página ${data.pageCount} de ${pageCount}`;

//       doc.setLineWidth(8);
//       doc.setDrawColor(78, 115, 223);
//       doc.setTextColor(255, 255, 255);
//       doc.line(14, pageHeight - 11, 196, pageHeight - 11);

//       doc.setFontSize(10);
//       doc.text(str, 17, pageHeight - 10);
//     }
//   });

//   doc.save("tickets_filtrados.pdf");
// }


// async function generarInformeTickets() {
//   const response = await fetch('/api/tickets');
//   const data = await response.json();

//   const columnas = ["Fecha", "Título", "Estado", "Prioridad", "Categoría"];
//   const filas = data.map(ticket => [
//     ticket.fecha,
//     ticket.titulo,
//     ticket.estado,
//     ticket.prioridad,
//     ticket.categoria
//   ]);

//   generarInformePDF({
//     titulo: "Listado de Tickets",
//     columnas,
//     filas,
//     nombreArchivo: "tickets.pdf"
//   });
// }
function Imprimir() {
  //const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  const totalPagesExp = "{total_pages_count_string}";

  const pageContent = function (data) {
    const pageHeight = doc.internal.pageSize.height;
    const pageWidth = doc.internal.pageSize.width;

    doc.setDrawColor(78, 115, 223);
    doc.setLineWidth(0.7);
    doc.rect(14, 10, 30, 20, 'S');
    doc.rect(44, 10, 151, 20, 'S');

    doc.setFontSize(12);
    doc.text("Listado de Tickets", 46, 15);
    doc.text("Con métodos de búsqueda", 46, 22);
    doc.text("Versión del sistema: 1.0.0", 46, 28.5);

    doc.line(44, 17, 195, 17);
    doc.line(44, 24, 195, 24);

    const str = "Página " + data.pageNumber + (typeof doc.putTotalPages === 'function' ? " de " + totalPagesExp : "");

    doc.setLineWidth(8);
    doc.setDrawColor(78, 115, 223);
    doc.setTextColor(255, 255, 255);
    doc.line(14, pageHeight - 11, 196, pageHeight - 11);

    doc.setFontSize(10);
    doc.setFont(undefined, 'bold');
    doc.text(str, 17, pageHeight - 10);
  };

  // ✅ Clonar la tabla y eliminar la columna de acciones (índice 5)
  const originalTable = document.getElementById("tablaTicket");
  if (!originalTable) {
    alert("No se encontró la tabla con id='tablaTickets'");
    return;
  }

  const clonedTable = originalTable.cloneNode(true);
  Array.from(clonedTable.rows).forEach(row => {
    if (row.cells.length > 5) {
      row.deleteCell(5);
    }
  });
  //console.log(doc);

  // ✅ Generar el PDF con la tabla modificada
  autoTable(doc, {
    html: clonedTable,
    startY: 32,
    margin: { top: 32 },
    didDrawPage: pageContent,
    styles: {
      fillStyle: 'DF',
      overflow: 'linebreak',
      fontSize: 7,
      lineColor: [238, 238, 238],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [78, 115, 223],
      textColor: [255, 255, 255]
    },
    columnStyles: {
      0: { columnWidth: 28 },
      1: { columnWidth: 62 },
      2: { columnWidth: 50 },
      3: { columnWidth: 20 },
      4: { columnWidth: 20 }
    },
    createdHeaderCell: function (cell, opts) {
      if ([0, 3, 4].includes(opts.column.index)) {
        cell.styles.halign = 'center';
      }
      cell.styles.fontSize = 8;
    },
    createdCell: function (cell, opts) {
      cell.styles.fontSize = 7;
      if ([0, 3, 4].includes(opts.column.index)) {
        cell.styles.halign = 'center';
      }
    }
  });

  if (typeof doc.putTotalPages === 'function') {
    doc.putTotalPages(totalPagesExp);
  }

  const string = doc.output('datauristring');
  const iframe = `<iframe width='100%' height='100%' src='${string}'></iframe>`;
  const x = window.open();
  x.document.open();
  x.document.write(iframe);
  x.document.close();
}


// function Imprimir() {
//     const email = getEmail();
//     // 1. Crear el PDF
//     const { jsPDF } = window.jspdf;
//     var doc = new jsPDF();
//     var totalPagesExp = "{total_pages_count_string}";


//     // 2. Función para encabezado más atractivo y pie de página
//     var pageContent = function (data) {
//         var pageHeight = doc.internal.pageSize.getHeight();
//         var pageWidth = doc.internal.pageSize.getWidth();
//         // Asumo que ya tienes estas variables definidas en tu Imprimir():
//         var marginLeft = 14;
//         var marginRight = 14;
//         var marginTop = 45; // coincide con el startY/offset de tu tabla
//         var marginBottom = 20;

//         // Dentro de pageContent (o justo antes de doc.autoTable):
//         var bodyX = marginLeft;
//         var bodyY = marginTop;
//         var bodyW = pageWidth - marginLeft - marginRight;
//         var bodyH = pageHeight - marginTop - marginBottom;

//         // Configuro estilo de línea
//         doc.setDrawColor(63, 162, 228); // mismo color que tu header/footer
//         doc.setLineWidth(0.7);

//         // Dibujo el rectángulo de borde
//         doc.rect(bodyX, bodyY, bodyW, bodyH);


//         // ––––– ENCABEZADO “FACTURA” CON FONDO COLOREADO –––––
//         doc.setFillColor(63, 162, 228);
//         doc.rect(marginLeft, 10, pageWidth - marginLeft - marginRight, 25, "F");

//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(17);
//         doc.setTextColor(255, 255, 255);
//         doc.text("Detalles de Tickets", marginLeft + 3, 18);

//         doc.setFont("helvetica", "normal");
//         doc.setFontSize(10);
//         var fecha = new Date().toLocaleDateString();
//         doc.text("Fecha: " + fecha, pageWidth - marginRight - 5, 18, { align: "right" });
//         // Si deseas, reemplaza 'NOMBRE CLIENTE' por tu variable
//         doc.text(Usuario = email, pageWidth - marginRight - 5, 25, { align: "right" });

//         // Línea separadora bajo el header
//         doc.setDrawColor(63, 162, 228);
//         doc.setLineWidth(0.7);
//         doc.line(marginLeft, 36, pageWidth - marginRight, 36);

//         // ––––– PIE DE PÁGINA –––––
//         var str = "Página " + data.pageCount;
//         if (typeof doc.putTotalPages === "function") {
//             str += " de " + totalPagesExp;
//         }
//         // Banda de color
//         doc.setLineWidth(8);
//         doc.setDrawColor(63, 162, 228);
//         doc.line(marginLeft, pageHeight - 11, pageWidth - marginRight, pageHeight - 11);

//         // Texto sobre la banda
//         doc.setFont("helvetica", "bold");
//         doc.setFontSize(10);
//         doc.setTextColor(255, 255, 255);
//         doc.text(str, marginLeft + 3, pageHeight - 10);
//     };

//     // 3. Leer la tabla HTML y eliminar columna “Acciones” (índice 6)
//     var original = document.getElementById("tablaTicket");
//     if (!original) {
//         alert("No se encontró la tabla con id='tablaTickets'");
//         return;
//     }
//     const tablaClon = original.cloneNode(true);
//     Array.from(tablaClon.rows).forEach(row => {
//         if (row.cells.length > 5) {
//             row.deleteCell(5);
//         }
//     });
//     // var res = doc.autoTableHtmlToJson(elem);
//     // if (res.columns.length > 5) {
//     //     res.columns.splice(5, 1);
//     //     res.data.forEach(function (row) {
//     //         row.splice(5, 1);
//     //     });
//     // }

//     // 4. Generar la tabla con estilos mejorados
//     doc.autoTable(
//         // res.columns,
//         // res.data,
//         {
//             // addPageContent: pageContent,
//             // margin: { top: 45, left: 14, right: 14, bottom: 20 },
//             html: tablaClon,
//             startY: 45,
//             margin: { top: 45, left: 14, right: 14, bottom: 20 },
//             didDrawPage: pageContent,

//             // Estilos generales
//             styles: {
//                 overflow: 'linebreak',   // fuerza el salto de línea
//                 cellWidth: 'wrap',        // la columna se ajusta al contenido
//                 fontSize: 7,
//                 lineColor: [220, 220, 220],
//                 lineWidth: 0.1,
//                 fillStyle: "PF"
//             },

//             // Estilos de cabecera
//             headerStyles: {
//                 fillColor: [63, 162, 228],
//                 textColor: [255, 255, 255],
//                 fontStyle: "bold",
//                 fontSize: 8
//             },

//             // Zebra striping en filas
//             alternateRowStyles: {
//                 fillColor: [245, 245, 245]
//             },

//             // Anchos y alineaciones por columna
//             columnStyles: {
//                 0: { columnWidth: 25, halign: "center" },  // Fecha
//                 1: { columnWidth: 35, cellWidth: 35, halign: 'left' },   // Título
//                 2: { columnWidth: 35, cellWidth: 35, halign: 'left' },  // Categoría
//                 3: { columnWidth: 17, halign: "center" },  // Prioridad
//                 4: { columnWidth: 17, halign: "center" },   // Estado
//                 // 5: {
//                 //     columnWidth: 53, cellWidth: 53, halign: 'left'
//                 // },// Descripción
//             },

//             // Ajustar tamaño de fuente en creación de celdas
//             createdHeaderCell: function (cell, opts) {
//                 cell.styles.fontSize = 8;
//             },
//             createdCell: function (cell, opts) {
//                 cell.styles.fontSize = 7;
//             }
//         }
//     );

//     // 5. Poner el total de páginas
//     if (typeof doc.putTotalPages === "function") {
//         doc.putTotalPages(totalPagesExp);
//     }

//     // 6. Mostrar PDF en un iframe emergente
//     var pdfString = doc.output("datauristring");
//     var iframe = "<iframe width='100%' height='100%' src='" + pdfString + "'></iframe>";
//     var ventana = window.open();
//     ventana.document.open();
//     ventana.document.write(iframe);
//     ventana.document.close();
// }