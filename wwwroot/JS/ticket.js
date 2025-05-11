function getToken(){
    return (localStorage.getItem("token"))
}

const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
});

function ObtenerTickets(){
    fetch('http://localhost:5108/api/Tickets')
    .then(response => response.json())
    .then(data => MostrarTickets(data))
    .catch(error => console.log("No se puede ingresar a la api: ", error));
}

//MOSTRAMOS EN UNA TABLA LOS DATOS GUARDADOS EN TABLA TICKETS
function MostrarTickets(data) {
    $("#todosLosTickets").empty();

    $.each(data, function (index, item) {
        $('#todosLosTickets').append(
            "<tr>",
            "<td>" + item.ticketID + "</td>",
            "<td>" + item.titulo + "</td>",
            "<td>" + item.descripcion + "</td>",
            "<td>" + item.estado + "</td>",
            "<td>" + item.prioridad + "</td>",
            "<td>" + item.fechaCreacion + "</td>",
            "<td>" + item.categoria.nombre + "</td>",
            "<td><a onclick='ConfirmacionEliminacion(" + item.ticketID + ")'<i class='bi bi-trash'></i></a></td>",
            "<td><a onclick='BuscarTicketparaEditar(" + item.ticketID + ")'<i class='bi bi-brush'></i></a></td>"
        )
    })
}



function CrearTicketNuevo(){
    let tituloTicket = document.getElementById("tituloTicket").value;
    let descripcionTicket = document.getElementById("descripcionTicket").value;
    let prioridadTicket = document.getElementById("prioridadTicket").value;
    let categoriaTicket = document.getElementById("categoriaTicket").value;

    let posiblesErrores = "";
    
    if(tituloTicket.trim() = 0){
        posiblesErrores = "Debe cargar un Titulo para el Ticket.";
    }
    if(categoriaTicket = 0){
        posiblesErrores += " - Debera seleccionar una Categoria para el Ticket.";
    } 
    if(!prioridadTicket){
        posiblesErrores += " - Seleccione una Prioridad valida.";
    }
    if(descripcionTicket.trim() = 0){
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
        let nuevoTicket = {
            titulo: Capitalizar(tituloTicket.trim()),
            descripcion: descripcionTicket.trim(),
            prioridades: prioridadTicket,
            categoriaID: categoriaTicket
        };

        fetch('http://localhost:5108/api/Tickets',
            {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(nuevoTicket)
            }
        )
        .then(response => response.json())
        .then(data => {
            document.getElementById("tituloTicket").value = "";
            document.getElementById("descripcionTicket").value = "";
            document.getElementById("prioridadTicket").value = "";
            document.getElementById("categoriaTicket").value = "";

            ObtenerTickets();

            Swal.fire({
                icon: "success",
                title: "Categoria creada",
                showConfirmButton: false,
                timer: 1000
            });
        })
        .catch(error => console.log("No se puede acceder a la api: ", error))
    }
}



function EliminarTicket(id){
    fetch(`http://localhost:5108/api/Tickets/${id}`,
        {
            method: 'DELETE'
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
            method: 'GET'
        }
    )
    .then(response => response.json())
    .then(data => {
        if(data.Estados != 0){
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
}



function EditarTicket(){
    let IDticket = document.getElementById("TicketID").value;
    let tituloTicketeditar = document.getElementById("tituloTicket").value;
    let descripcionTicketeditar = document.getElementById("descripcionTicket").value;
    let prioridadTicketeditar = document.getElementById("prioridadTicket").value;
    let categoriaTicketeditar = document.getElementById("categoriaTicket").value;

    let posiblesErroreseditar = "";
    
    if(tituloTicketeditar.trim() = 0){
        posiblesErrores = "Debe cargar un Titulo para el Ticket.";
    }
    if(categoriaTicketeditar = 0){
        posiblesErrores += " - Debera seleccionar una Categoria para el Ticket.";
    } 
    if(!prioridadTicketeditar){
        posiblesErrores += " - Seleccione una Prioridad valida.";
    }
    if(descripcionTicketeditar.trim() = 0){
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
            titulo: Capitalizar(tituloTicketeditar.trim()),
            descripcion: descripcionTicketeditar.trim(),
            prioridades: prioridadTicketeditar,
            categoriaID: categoriaTicketeditar
        };

        fetch(`http://localhost:5108/api/Tickets/${IDticket}`,
            {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(editarTicket)
            }
        )
        .then(data => {
            VaciarModal();

            ObtenerTickets();
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

    $('#modalAgregarTicket').modal('hide');
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