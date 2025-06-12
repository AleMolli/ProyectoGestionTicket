function ObtenerCliente(){
    fetch('http://localhost:5108/api/Clientes',{
        method: 'GET',
        headers: authHeaders()
    })
    .then(response => response.json())
    .then(data => MostrarClientes(data))
    .catch(error => console.log("No se puede ingresar a la api: ", error));
}



function MostrarClientes(data) {
    $("#todosLosClientes").empty();

    $.each(data, function (index, item) {
        if(item.eliminado == false){
            $('#todosLosClientes').append(
                "<tr>",
                "<td>" + item.clienteID + "</td>",
                "<td>" + item.nombre + "</td>",
                "<td>" + item.email + "</td>",
                "<td>" + item.telefono + "</td>",
                "<td>" + item.observaciones + "</td>",
                "<td><a onclick='ConfirmacionEliminacionCliente(" + item.clienteID + ")'><i class='bi bi-trash'></i></a></td>",
                "<td><a onclick='BuscarClienteparaEditar(" + item.clienteID + ")'><i class='bi bi-brush'></i></a></td>"
            )
        }else{
            $('#todosLosClientes').append(
                "<tr>",
                "<td>" + item.clienteID + "</td>",
                "<td>" + item.nombre + "</td>",
                "<td>" + item.email + "</td>",
                "<td>" + item.telefono + "</td>",
                "<td>" + item.observaciones + "</td>",
                //"<td><a onclick='ConfirmacionEliminacionCliente(" + item.clienteID + ")'><i class='bi bi-trash'></i></a></td>",
                "<td><a onclick='habilitarCliente(" + item.clienteID + ")'><i class='bi bi-arrow-clockwise'></i></a></td>"
            )
        }
    })
}


function CrearClienteNuevo(){
    let nombreCliente = document.getElementById("nombreCliente").value.trim();
    let dniCliente = document.getElementById("dniCliente").value.trim();
    let emailCliente = document.getElementById("emailCliente").value.trim();
    let telefonoCliente = document.getElementById("telefonoCliente").value.trim();
    let observacionCliente = document.getElementById("observacionCliente").value.trim();

    let posiblesErrores = "";
    
    if(!nombreCliente){
        posiblesErrores = "Debe cargar un Nombre para el Cliente.";
    }
    if(!dniCliente){
        posiblesErrores += " - Debe cargar un DNI para el Cliente.";
    } 
    // if(!telefonoCliente){
    //     posiblesErrores += " - SDebe cargar un numero de Telefono para el Cliente.";
    // }
        
    if(posiblesErrores != ""){
        Swal.fire({
            icon: "error",
            title: "Corrija los errores para continuar",
            text: posiblesErrores,
        });
    }
    else{
        let cliente = {
            nombre: capitalizarTexto(nombreCliente),
            dni: dniCliente,
            email: emailCliente,
            telefono: telefonoCliente,
            observaciones: observacionCliente,
            eliminado: false
        };

        fetch('http://localhost:5108/api/Clientes',
            {
                method: 'POST',
                headers: authHeaders(),
                body: JSON.stringify(cliente)
            }
        )
        .then(async response => {
            if (!response.ok){
                let textoError = await response.text(); //CAPTURA ERROR DEL CONTROLADOR SI LA CATEGORIA YA EXISTE Y LA MUESTRA EN EL CATCH
                throw (textoError);
            }
            return response.json();
        })
        .then(data => {
            if(data.status == 201 || data.status == undefined){
                document.getElementById("nombreCliente").value = "";
                document.getElementById("emailCliente").value = "";
                document.getElementById("telefonoCliente").value = "";
                document.getElementById("observacionCliente").value = "";

                $('#modalAgregarCliente').modal('hide');
                ObtenerCliente();

                Swal.fire({
                    icon: "success",
                    title: "Cliente creado",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
            else{
                //console.log(data);
            }
            
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
}


function ConfirmacionEliminacionCliente(id){
    Swal.fire({
        title: "Esta seguro de eliminar este Cliente?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            EliminarCliente(id);
            Swal.fire("Cliente Eliminado");
        }
    });
}


function EliminarCliente(id){
    fetch(`http://localhost:5108/api/Clientes/${id}`,
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
        ObtenerCliente();
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


function habilitarCliente(id){
    fetch(`http://localhost:5108/api/Clientes/${id}`, {
        method: 'DELETE',  //EN EL METODO DELETE TENEMOS UN IF PREGUNTANDO EN QUE ESTADO ESTA EL ATRIBUTO "ELIMINADO"
        headers: authHeaders()
    })
    .then(() => {
        ObtenerCliente();
    })
    .catch(error => console.log("No se puede ingresar a la api: ", error))
}


function BuscarClienteparaEditar(id) {
    fetch(`http://localhost:5108/api/Clientes/${id}`,
        {
            method: 'GET',
            headers: authHeaders()
        }
    )
    .then(response => response.json())
    .then(data => {
        //console.log(data);

        document.getElementById("ClienteID").value = data.clienteID;
        document.getElementById("nombreCliente").value = data.nombre;
        document.getElementById("emailCliente").value = data.email;
        document.getElementById("telefonoCliente").value = data.telefono;
        document.getElementById("observacionCliente").value = data.observaciones;

        document.getElementById("CrearEditar").innerText = "Editar Cliente";

        $('#modalAgregarCliente').modal('show');
    })
    .catch(error => console.log("No se puede acceder a la api: ", error))
}


function EditarCliente(){
    let IDCliente = document.getElementById("ClienteID").value;
    let nombreClienteeditar = document.getElementById("nombreCliente").value.trim();
    let emailClienteeditar = document.getElementById("emailCliente").value.trim();
    let telefonoClienteeditar = document.getElementById("telefonoCliente").value.trim();
    let observacioneseditar = document.getElementById("observacionCliente").value.trim();

    let posiblesErroreseditar = "";
    
    if(!nombreClienteeditar){
        posiblesErroreseditar = "Debe cargar un Nombre para el Cliente.";
    }
    
    if(posiblesErroreseditar != ""){
        Swal.fire({
            icon: "error",
            title: "Corrija los errores para continuar",
            text: posiblesErroreseditar,
        });
    }
    else{
        let editarCliente = {
            clienteID: IDCliente,
            nombre: capitalizarTexto(nombreClienteeditar),
            email: emailClienteeditar,
            telefono: telefonoClienteeditar,
            observaciones: observacioneseditar,
            eliminado: false
        };

        fetch(`http://localhost:5108/api/Clientes/${IDCliente}`,
            {
                method: 'PUT',
                headers: authHeaders(),
                body: JSON.stringify(editarCliente)
            }
        )
        //.then(response => response.json())
        .then(data => {
                VaciarModalCliente();
                //$('#modalAgregarTicket').modal('hide');
                //ObtenerTickets();
                document.getElementById("CrearEditar").innerText = "Nuevo Ticket";
        })
        .catch(error => console.log("No se puede acceder a la api: ", error))
    }
}


function VaciarModalCliente(){
    document.getElementById("ClienteID").value = 0;
    document.getElementById("nombreCliente").value = "";
    document.getElementById("emailCliente").value = "";
    document.getElementById("telefonoCliente").value = "";
    document.getElementById("observacionCliente").value = "";

    document.getElementById("CrearEditar").innerText = "Nuevo Cliente";
    $('#modalAgregarCliente').modal('hide');
    ObtenerCliente();
}

function BotonGuardarCliente(){
    let inputIDconvalor = document.getElementById("ClienteID").value;

    if (inputIDconvalor != 0){
        EditarCliente();
    }
    else{
        CrearClienteNuevo();
    }
}