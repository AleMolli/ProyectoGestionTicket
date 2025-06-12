function ObtenerCategoriaDropdown(){
    fetch('http://localhost:5108/api/Categorias', {
        method: 'GET',
        headers: authHeaders()
    })
    .then(response => response.json())
    .then(data => CompletarDropdown(data))
    .catch(error => console.log("No se pudo acceder acceder al servicio.", error))
}

function CompletarDropdown(data){
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
    //ObtenerTickets();
    ObtenerPrioridadDropdown();
}

ObtenerCategoriaDropdown();

function ObtenerPrioridadDropdown() {
    fetch('http://localhost:5108/api/Tickets/prioridades',{
        method: 'GET',
        headers: authHeaders()
    }) // Llama al GET de prioridades
    .then(response => response.json())
    .then(data => CompletarDropdownPrioridad(data))
    .catch(error => console.log("No se pudo acceder a la api.", error));
}

function CompletarDropdownPrioridad(data) {
    let bodySelect = document.getElementById("prioridadTicket");
    bodySelect.innerHTML = "";
    let bodySelectfiltro = document.getElementById("prioridadFiltro");
    bodySelectfiltro.innerHTML = "";

    data.forEach((element,index) => {
        let opt = document.createElement("option");
        opt.value = index; // Usamos el nombre del enum como valor
        opt.text = element;  // Mostramos el nombre del enum

        bodySelect.add(opt);

        let optB = `<option value="3">[Todas las prioridades]</option>`;
        let opt2 = document.createElement("option");
        opt2.value = index;
        opt2.text = element;

        bodySelectfiltro.add(opt2);
    });
    ObtenerTickets();
}

//ObtenerPrioridadDropdown();

// const input = document.getElementById("categoriaFiltro");
// input.onchange = function () {
//   ObtenerTickets();
// };

$('#prioridadFiltro').on("change", 
    function() {
        alert()});

// function ObtenerTickets(){
//     fetch('http://localhost:5108/api/Tickets', {
//         method: 'GET',
//         headers: authHeaders()
//     })
//     .then(response => response.json())
//     .then(data => MostrarTickets(data))
//     .catch(error => console.log("No se puede ingresar a la api: ", error));
// }

function ObtenerTickets(){
    console.log("hola")
    let categoriaIDBuscar = document.getElementById("categoriaFiltro").value;
    const filtrosCategoria = {
        categoriaID: categoriaIDBuscar
    };

    fetch('http://localhost:5108/api/Tickets/Filtrar',
        {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(filtrosCategoria)
        }
    )
        .then(response => response.json())
        .then(data => MostrarTickets(data))
        //.then(data => console.log(data))
        .catch(error => console.log("No se puede acceder a la api: ", error))
}

//MOSTRAMOS EN UNA TABLA LOS DATOS GUARDADOS EN TABLA TICKETS
function MostrarTickets(data) {
    $("#todosLosTickets").empty();

    $.each(data, function (index, item) {
        let estado;
        switch(item.estados){
            case 0:
                estado = "Abierto";
                break;
            case 1:
                estado = "En Proceso";
                break;
            case 2:
                estado = "Cerrado";
                break;
            case 3:
                estado = "Cancelado";
                break;
        }
        let prioridades;
        switch(item.prioridades){
            case 0:
                prioridades = "Baja";
                break;
            case 1:
                prioridades = "Media";
                break;
            case 2:
                prioridades = "Alta";
                break;
        }
        $('#todosLosTickets').append(
            "<tr>",
            "<td>" + item.ticketID + "</td>",
            "<td>" + item.titulo + "</td>",
            "<td>" + item.descripcion + "</td>",
            "<td>" + estado + "</td>",
            "<td>" + prioridades + "</td>",
            "<td>" + item.fechaCreacionString + "</td>",
            "<td>" + item.categoriaString + "</td>",
            "<td><a onclick='ConfirmacionEliminacion(" + item.ticketID + ")'><i class='bi bi-trash'></i></a></td>",
            "<td><a onclick='BuscarTicketparaEditar(" + item.ticketID + ")'><i class='bi bi-brush'></i></a></td>",
            "<td><a onclick='ObtenerHistorialTicket(" + item.ticketID + ")'><i class='bi bi-search'></i></a></td>"
        )
    })
}



function CrearTicketNuevo(){
    let tituloTicket = document.getElementById("tituloTicket").value.trim();
    let descripcionTicket = document.getElementById("descripcionTicket").value.trim();
    let prioridadTicket = document.getElementById("prioridadTicket").value;
    let categoriaTicket = document.getElementById("categoriaTicket").value;

    let posiblesErrores = "";
    
    if(!tituloTicket){
        posiblesErrores = "Debe cargar un Titulo para el Ticket.";
    }
    if(categoriaTicket == 0){
        posiblesErrores += " - Debera seleccionar una Categoria para el Ticket.";
    } 
    if(!prioridadTicket){
        posiblesErrores += " - Seleccione una Prioridad valida.";
    }
    if(!descripcionTicket){
        posiblesErrores += " - Cargue una descripcion para el Ticket.";
    }
    
    if(posiblesErrores != ""){
        Swal.fire({
            icon: "error",
            title: "Corrija los errores para continuar",
            text: posiblesErrores,
        });
    }
    else{
        let ticket = {
            titulo: capitalizarTexto(tituloTicket),
            descripcion: descripcionTicket,
            prioridades: parseInt(prioridadTicket),
            categoriaID: categoriaTicket,
        };

        fetch('http://localhost:5108/api/Tickets',
            {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(ticket)
            }
        )
        .then(response => response.json())
        .then(data => {
            if(data.status == 201 || data.status == undefined){
                document.getElementById("tituloTicket").value = "";
                document.getElementById("descripcionTicket").value = "";
                document.getElementById("prioridadTicket").value = "";
                document.getElementById("categoriaTicket").value = "";

                $('#modalAgregarTicket').modal('hide');
                ObtenerTickets();

                Swal.fire({
                    icon: "success",
                    title: "Categoria creada",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
            else{
                //console.log(data);
            }
            
        })
        .catch(error => console.log("No se puede acceder a la api: ", error))
    }
}



function EliminarTicket(id){
    fetch(`http://localhost:5108/api/Tickets/${id}`,
        {
            method: 'DELETE',
            headers: authHeaders()
        }
    )
    .then(async response => {
        if (!response.ok){
            let errorEliminar = await response.text();
            throw (errorEliminar)
        }
        ObtenerTickets();
    })
    .catch(error => {
        Swal.fire({
            icon: "warning",
            title: error,
            showConfirmButton: false,
            timer: 2000
        });
    })
}



function ConfirmacionEliminacion(id){
    Swal.fire({
        title: "Esta seguro de eliminar este Ticket?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            EliminarTicket(id);
            Swal.fire("Ticket Eliminado");
        }
    });
}



function BuscarTicketparaEditar(id){
    fetch(`http://localhost:5108/api/Tickets/${id}`,
        {
            method: 'GET',
            headers: authHeaders()
        }
    )
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        if(data.estados != 1){
            Swal.fire({
                icon: "warning",
                title: "No se puede Editar un Ticket que esta en proceso o ya ha sido contestado",
                showConfirmButton: false,
                timer: 1500
            });
        }
        else{
            document.getElementById("TicketID").value = data.ticketID;
            document.getElementById("tituloTicket").value = data.titulo;
            document.getElementById("descripcionTicket").value = data.descripcion;
            document.getElementById("prioridadTicket").value = data.prioridad;
            document.getElementById("categoriaTicket").value = data.categoriaID;

            document.getElementById("staticBackdropLabel").innerText = "Editar Ticket";

            $('#modalAgregarTicket').modal('show');
        }
    })
    .catch(error => console.log("No se puede acceder a la api: ", error))
}



function EditarTicket(){
    let IDticket = document.getElementById("TicketID").value;
    let tituloTicketeditar = document.getElementById("tituloTicket").value.trim();
    let descripcionTicketeditar = document.getElementById("descripcionTicket").value.trim();
    let prioridadTicketeditar = document.getElementById("prioridadTicket").value;
    let categoriaTicketeditar = document.getElementById("categoriaTicket").value;

    let posiblesErroreseditar = "";
    
    if(!tituloTicketeditar){
        posiblesErrores = "Debe cargar un Titulo para el Ticket.";
    }
    if(categoriaTicketeditar == 0){
        posiblesErrores += " - Debera seleccionar una Categoria para el Ticket.";
    } 
    if(!prioridadTicketeditar){
        posiblesErrores += " - Seleccione una Prioridad valida.";
    }
    if(!descripcionTicketeditar){
        posiblesErrores += " - Cargue una descripcion para el Ticket.";
    }
    
    if(posiblesErroreseditar != ""){
        Swal.fire({
            icon: "error",
            title: "Corrija los errores para continuar",
            text: posiblesErroreseditar,
        });
    }
    else{
        let editarTicket = {
            ticketID: IDticket,
            titulo: capitalizarTexto(tituloTicketeditar),
            descripcion: descripcionTicketeditar,
            prioridades: parseInt(prioridadTicketeditar),
            categoriaID: categoriaTicketeditar
        };

        fetch(`http://localhost:5108/api/Tickets/${IDticket}`,
            {
                method: 'PUT',
                headers: authHeaders(),
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


function VaciarModal(){
    document.getElementById("TicketID").value = 0;
    document.getElementById("tituloTicket").value = "";
    document.getElementById("descripcionTicket").value = "";
    document.getElementById("prioridadTicket").value = 0;
    document.getElementById("categoriaTicket").value = "";
    document.getElementById("staticBackdropLabel").innerText = "Nuevo Ticket";
    $('#modalAgregarTicket').modal('hide');
    ObtenerTickets();
}


function BotonGuardarTicket(){
    let inputIDconvalor = document.getElementById("TicketID").value;

    if (inputIDconvalor != 0){
        EditarTicket();
    }
    else{
        CrearTicketNuevo();
    }
}


function ObtenerHistorialTicket(id){

    fetch(`http://localhost:5108/api/HistorialTickets/${id}`, {
        method: 'GET',
        headers: authHeaders()
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
        $('#historialdeTickets').append(
            "<tr>",
            "<td>" + item.campoModificado + "</td>",
            "<td>" + item.valorAnterior + "</td>",
            "<td>" + item.valorNuevo + "</td>",
            "<td>" + item.fechaCambio + "</td>"
        )
    })
}
//ObtenerTickets();