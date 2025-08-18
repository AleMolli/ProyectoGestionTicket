function ObtenerpuestosDropdown() {
    authFetch(`PuestosLaborales`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => CompletarDropdownpuestos(data))
        .catch(error => console.log("No se pudo acceder acceder al servicio.", error))
}

function CompletarDropdownpuestos(data) {
    let bodySelect = document.getElementById("puestodesa");
    bodySelect.innerHTML = "";

    data.forEach(element => {
        opt = document.createElement("option");
        opt.value = element.puestoLaboralID;
        opt.text = element.nombre

        bodySelect.add(opt);
    })
    ObtenerDesarrollador();
}

ObtenerpuestosDropdown();

function ObtenerDesarrollador(){
    authFetch("Desarrolladores")
    .then(response => response.json())
    .then(data => MostrarDesarrolladores(data))
    .catch(error => console.log("No se puede ingresar a la api: ", error));
}


function MostrarDesarrolladores(data) {
    $("#todosLosDesa").empty();

    $.each(data, function (index, item) {
        //if(item.eliminado == false){
            $('#todosLosDesa').append(
                "<tr>",
                "<td class='celda-titulo data-ticket data-false'>" + item.nombreCompleto + "</td>",
                "<td class='celda-titulo data-ticket'>" + item.dni + "</td>",
                "<td class='d-none d-sm-table-cell celda-titulo data-ticket'>" + item.email + "</td>",
                "<td class='d-none d-sm-table-cell celda-titulo data-ticket'>" + item.telefono + "</td>",
                "<td class='d-none d-sm-table-cell celda-titulo data-ticket'>" + item.puestoLaboral.nombre + "</td>",
                "<td class='text-center'><a onclick='ConfirmacionEliminaciondesarrollador(" + item.desarrolladorID + ")'><i class='bi bi-trash text-danger'></i></a></td>",
                "<td class='text-center'><a onclick='BuscarDesarrolladorparaEditar(" + item.desarrolladorID + ")'><i class='bi bi-brush text-info'></i></a></td>"
            )
        // }else{
        //     $('#todosLosDesa').append(
        //         "<tr>",
        //         "<td class='celda-titulo data-ticket data-true'>" + item.nombreCompleto + "</td>",
        //         "<td class='celda-titulo data-ticket'>" + item.dni + "</td>",
        //         "<td class='d-none d-sm-table-cell celda-titulo data-ticket'>" + item.email + "</td>",
        //         "<td class='d-none d-sm-table-cell celda-titulo data-ticket'>" + item.telefono + "</td>",
        //         "<td class='d-none d-sm-table-cell celda-titulo data-ticket'>" + item.observaciones + "</td>",
        //         "<td class='text-center'><a onclick='habilitarDesarrollador(" + item.desarrolladorID + ")'><i class='bi bi-arrow-clockwise fs-5 text-success' style='text-shadow: 0 0 4px green;'></i></a></td>"
        //     )
        // }
    })
}


function CrearDesarrolladorNuevo(){
    let nombredesarrollador = document.getElementById("nombredesarrollador").value.trim();
    let dnidesarrollador = document.getElementById("dnidesarrollador").value.trim();
    let emaildesarrollador = document.getElementById("emaildesarrollador").value.trim();
    let telefonodesarrollador = document.getElementById("telefonodesarrollador").value.trim();
    let puestoLaboral = document.getElementById("puestodesa").value;
    let observaciondesarrollador = document.getElementById("observaciondesarrollador").value.trim();

    let posiblesErrores = "";
    
    if(!nombredesarrollador){
        posiblesErrores = "Debe cargar un Nombre para el Desarrollador.";
    }
    if(!dnidesarrollador){
        posiblesErrores += " - Debe cargar un DNI para el Desarrollador.";
    } 
    // if(!telefonodesarrollador){
    //     posiblesErrores += " - SDebe cargar un numero de Telefono para el Desarrollador.";
    // }
        
    if(posiblesErrores != ""){
        Swal.fire({
            icon: "error",
            title: "Corrija los errores para continuar",
            text: posiblesErrores,
        });
    }
    else{
        let Desarrollador = {
            nombreCompleto: capitalizarTexto(nombredesarrollador),
            dni: dnidesarrollador,
            email: emaildesarrollador,
            telefono: telefonodesarrollador,
            observaciones: observaciondesarrollador,
            puestoLaboralID: puestoLaboral
        };

        authFetch('Desarrolladores',
            {
                method: 'POST',
                body: JSON.stringify(Desarrollador)
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
                document.getElementById("nombredesarrollador").value = "";
                document.getElementById("emaildesarrollador").value = "";
                document.getElementById("telefonodesarrollador").value = "";
                document.getElementById("observaciondesarrollador").value = "";

                $('#modalAgregarDesa').modal('hide');
                ObtenerDesarrollador();

                Swal.fire({
                    icon: "success",
                    title: "Desarrollador creado",
                    showConfirmButton: false,
                    timer: 1000
                });
            }
            else{
                //console.log(data);
            }
            
        })
        .catch(error => {
            console.log(error)
            Swal.fire({
                    icon: "warning",
                    title: error,
                    showConfirmButton: false,
                    timer: 10000
                });
        })
    }
}


function ConfirmacionEliminaciondesarrollador(id){
    Swal.fire({
        title: "Esta seguro de eliminar este Desarrollador?",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
    }).then((result) => {
        /* Read more about isConfirmed, isDenied below */
        if (result.isConfirmed) {
            EliminarDesarrollador(id);
            Swal.fire("Desarrollador Eliminado");
        }
    });
}


function EliminarDesarrollador(id){
    authFetch(`Desarrolladores/${id}`,
        {
            method: 'DELETE',
        }
    )
    .then(async response => {
        if (!response.ok){
            let errorEliminar = await response.text();
            throw (errorEliminar)
        }
        ObtenerDesarrollador();
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


function habilitarDesarrollador(id){
    authFetch(`Desarrolladores/${id}`, {
        method: 'DELETE',  //EN EL METODO DELETE TENEMOS UN IF PREGUNTANDO EN QUE ESTADO ESTA EL ATRIBUTO "ELIMINADO"
    })
    .then(() => {
        ObtenerDesarrollador();
    })
    .catch(error => console.log("No se puede ingresar a la api: ", error))
}


function BuscarDesarrolladorparaEditar(id) {
    authFetch(`Desarrolladores/${id}`,
        {
            method: 'GET',
        }
    )
    .then(response => response.json())
    .then(data => {
        //console.log(data);

        document.getElementById("DesarrolladorID").value = data.desarrolladorID;
        document.getElementById("nombredesarrollador").value = data.nombreCompleto;
        document.getElementById("dnidesarrollador").value = data.dni;
        document.getElementById("emaildesarrollador").value = data.email;
        document.getElementById("telefonodesarrollador").value = data.telefono;
        document.getElementById("puestodesa").value = data.puestoLaboralID;
        document.getElementById("observaciondesarrollador").value = data.observaciones;

        document.getElementById("CrearEditar").innerText = "Editar Desarrollador";
        document.getElementById("emaildesarrollador").disabled = true;

        $('#modalAgregarDesa').modal('show');
    })
    .catch(error => console.log("No se puede acceder a la api: ", error))
}


function EditarDesarrollador(){
    let IDDesarrollador = document.getElementById("DesarrolladorID").value;
    let nombredesarrolladoreditar = document.getElementById("nombredesarrollador").value.trim();
    let dnidesarrolladoreditar = document.getElementById("dnidesarrollador").value.trim();
    let telefonodesarrolladoreditar = document.getElementById("telefonodesarrollador").value.trim();
    let puestoLaboraleditar = document.getElementById("puestodesa").value;
    let observacioneseditar = document.getElementById("observaciondesarrollador").value.trim();

    let posiblesErroreseditar = "";
    
    if(!nombredesarrolladoreditar){
        posiblesErroreseditar = "Debe cargar un Nombre para el Desarrollador.";
    }
    
    if(posiblesErroreseditar != ""){
        Swal.fire({
            icon: "error",
            title: "Corrija los errores para continuar",
            text: posiblesErroreseditar,
        });
    }
    else{
        let editarDesarrollador = {
            desarrolladorID: IDDesarrollador,
            nombreCompleto: capitalizarTexto(nombredesarrolladoreditar),
            dni: dnidesarrolladoreditar,
            telefono: telefonodesarrolladoreditar,
            observaciones: observacioneseditar,
            puestoLaboralID: puestoLaboraleditar
        };

        authFetch(`Desarrolladores/${IDDesarrollador}`,
            {
                method: 'PUT',
                body: JSON.stringify(editarDesarrollador)
            }
        )
        //.then(response => response.json())
        .then(data => {
                VaciarModalDesarrollador();
                //$('#modalAgregarTicket').modal('hide');
                //ObtenerTickets();
                document.getElementById("CrearEditar").innerText = "Nuevo Ticket";
        })
        .catch(error => console.log("No se puede acceder a la api: ", error))
    }
}


function VaciarModalDesarrollador(){
    document.getElementById("DesarrolladorID").value = 0;
    document.getElementById("nombredesarrollador").value = "";
    document.getElementById("emaildesarrollador").value = "";
    document.getElementById("telefonodesarrollador").value = "";
    document.getElementById("observaciondesarrollador").value = "";

    document.getElementById("CrearEditar").innerText = "Nuevo Desarrollador";
    $('#modalAgregarDesa').modal('hide');
    ObtenerDesarrollador();
}

function BotonGuardarDesarrollador(){
    let inputIDconvalor = document.getElementById("DesarrolladorID").value;

    if (inputIDconvalor != 0){
        EditarDesarrollador();
    }
    else{
        CrearDesarrolladorNuevo();
    }
}

ObtenerpuestosDropdown();