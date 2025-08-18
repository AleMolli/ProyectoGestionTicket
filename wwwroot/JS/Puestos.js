function ObtenerCategoriaparaPuestos() {
    authFetch(`Categorias`, {
        method: 'GET',
    })
        .then(response => response.json())
        .then(data => CompletarDropdownCategoria(data))
        .catch(error => console.log("No se pudo acceder acceder al servicio.", error))
}

function CompletarDropdownCategoria(data) {
    let bodySelect = document.getElementById("categoriaPuesto");
    bodySelect.innerHTML = "";

    data.forEach(element => {
        optmodal = document.createElement("option");
        optmodal.value = element.categoriaID;
        optmodal.text = element.nombre

        bodySelect.add(optmodal);
        //console.log(optFiltro);
    })
    ObtenerPuestos();
    //ObtenerPrioridadDropdown();
}

ObtenerCategoriaparaPuestos();

function ObtenerPuestos(){
    authFetch("PuestosLaborales")
    .then(response => response.json())
    .then(data => MostrarPuestos(data))
    .catch(error => console.log("No se puede ingresar a la api: ", error));
}

//MOSTRAMOS EN UNA TABLA LOS DATOS GUARDADOS EN TABLA CATEGORIA
function MostrarPuestos(data){
    $("#tablaDePuestos").empty();
    
    $.each(data, function(index, item) { //SI EL CAMPO ELIMINADO ES FALSO LO MOSTRAMOS ASI

        if(item.eliminado == false){
            $('#tablaDePuestos').append(
                "<tr>",
                "<td class='data-false celda-titulo'>" + item.nombre + "</td>",
                "<td class='text-center'><a onclick='deshabilitarPuesto(" + item.puestoLaboralID + ")'><i class='bi bi-trash text-danger'></i></a></td>",
                "<td class='text-center'><a onclick='BuscarPuesto(" + item.puestoLaboralID + ")'><i class='bi bi-brush text-info'></i></a></td>",
                "<td class='text-center'><a onclick='AbrirModalRelacion(" + item.puestoLaboralID + ")'><i class='bi bi-search text-warning'></i></a></td>"
            )
        }
        else{//SI EL CAMPO ELIMINADO ES VERDADERO LO MOSTRAMOS ASI
            $('#tablaDePuestos').append(
                "<tr>",
                "<td class='data-true'>" + item.nombre + "</td>",
                "<td class='text-center'><a onclick='habilitarPuesto(" + item.puestoLaboralID + ")'><i class='bi bi-arrow-clockwise fs-5 text-success' style='text-shadow: 0 0 4px green;'></i></a></td>"
            )
        }
    })
}

//limpia el imput si se hace clik en boton cancelar.
function VaciadoImput(){
    document.getElementById("puestoID").value = 0;
    document.getElementById("nombrePuesto").value = "";
}

//FUNCION PARA AGREGAR UNA CATEGORIA NUEVA
function AgregarPuesto(){
    let nombrePuesto = document.getElementById("nombrePuesto").value; //CAPTURA LO QUE GUARDAMOS EN EL IMPUT

    if (nombrePuesto.trim() != 0){ //VALIDA QUE NO ESTE VACIO
        let puesto = {
            nombre: capitalizarTexto(nombrePuesto.trim()),
            eliminado: false
        };

        authFetch(`PuestosLaborales`,
        {
            method: 'POST',
            body: JSON.stringify(puesto)
        })
        .then(async response => {
            if (!response.ok){
                let textoError = await response.text(); //CAPTURA ERROR DEL CONTROLADOR SI LA CATEGORIA YA EXISTE Y LA MUESTRA EN EL CATCH
                throw (textoError);
            }
            return response.json();
        })
        .then(data => {
            if(data.status == 201 || data.status == undefined){ //SI ESTA BIEN VACIAMOS IMPUT REFRESCAMOS PAGINA Y MOSTRAMOS MENSAJE OK
                document.getElementById("nombrePuesto").value = "";
                ObtenerPuestos();
                Swal.fire({
                    icon: "success",
                    title: "Puesto creado",
                    showConfirmButton: false,
                    timer: 1000
                });
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
    else {
        Swal.fire({
            icon: "warning",
            title: "Debe ingresar un nombre valido para el Puesto Laboral",
            showConfirmButton: false,
            timer: 1500
        })
    }
}
//deshabilita un dato
function deshabilitarPuesto(id) {
    let quieredeshabilitar = confirm("Esta seguro de borrar este Puesto?")

    if (quieredeshabilitar) {
        authFetch(`PuestosLaborales/${id}`, {
            method: 'DELETE',  //EN EL METODO DELETE TENEMOS UN IF PREGUNTANDO EN QUE ESTADO ESTA EL ATRIBUTO "ELIMINADO"
        })
        .then(() => {
            ObtenerPuestos();
        })
        .catch(error => console.log("No se puede ingresar a la api: ", error))
    }
}

//FUNCION PARA HABILITAR UNA CATEGORIA DESHABILITADA
function habilitarPuesto(id){
    authFetch(`PuestosLaborales/${id}`, {
        method: 'DELETE',  //EN EL METODO DELETE TENEMOS UN IF PREGUNTANDO EN QUE ESTADO ESTA EL ATRIBUTO "ELIMINADO"
    })
    .then(() => {
        ObtenerPuestos();
    })
    .catch(error => console.log("No se puede ingresar a la api: ", error))
}

//busca una categoria para completar el modal para despues editar
function BuscarPuesto(id){
    authFetch(`PuestosLaborales/${id}`, {
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("puestoID").value = data.puestoLaboralID;
        document.getElementById("nombrePuesto").value = data.nombre;
    })
    .catch(error => console.log("No se puede ingresar a la api: ", error))
}

//PARA EDITAR UNA CATEGORIA YA CREADA
function EditarunPuesto(){
    let idpuesto = document.getElementById("puestoID").value;
    let nombrepuestoEditado = document.getElementById("nombrePuesto").value;

    if (nombrepuestoEditado.trim() != 0) {//PARA CORROBORAR DE QUE EL IMPUT NO ESTE VACIO
        let puestoEditado = {
            puestoLaboralID: idpuesto,
            nombre: capitalizarTexto(nombrepuestoEditado.trim()) //LLAMA A UNA FUNCION PARA GUARDAR EL CAMPO CON LA PRIMER LETRA DE CADA PALABRA EN MAYUSCULA
        };

        authFetch(`Categorias/${idpuesto}`, {
            method: 'PUT',
            body: JSON.stringify(puestoEditado)
        })
        .then(async response => {
            if (!response.ok){
                let textoErrorEditar = await response.text();//CAPTURA EL ERROR DESDE EL CONTROLADOR 
                throw (textoErrorEditar);                    //DONDE HACEMOS VALIDACION QUE NO EXISTA el puesto
            }
            else{
                VaciadoImput();

                ObtenerPuestos();
                Swal.fire({
                    icon: "success",
                    title: "Puesto Editado",
                    showConfirmButton: false,
                    timer: 3000
                });
            }
        })
        .catch(error => {         //ACA MOSTRAMOS EL ERROR DEL THEN
                Swal.fire({
                    icon: "warning",
                    title: error,
                    showConfirmButton: false,
                    timer: 3000
                });
        })
    }
    else {
        Swal.fire({
            icon: "warning",
            title: "Debe ingresar un nombre valido para el Puesto Laboral",
            showConfirmButton: false,
            timer: 3000
        })
    }
}

//PARA INDICARLE AL BOTON GUARDAR A QUE CATEGORIA LLAMAR.
function BotonGuardarPuesto(){
    let inputIDconvalor = document.getElementById("puestoID").value;

    if (inputIDconvalor != 0){
        EditarunPuesto();
    }
    else{
        AgregarPuesto();
    }
}

function AbrirModalRelacion(id){
    authFetch(`PuestosLaborales/${id}`,{
        method: 'GET',
    })
    .then(response => response.json())
    .then(data => {
        //console.log(data);
        document.getElementById("puestoLaboralid").value = data.puestoLaboralID;
        document.getElementById("puestoLaboral").value = data.nombre;

        ObtenerRelacionLaborCategoria(data.puestoLaboralID);

        $('#modalRelacionpuestoCategoria').modal('show');
    })
    .catch(error => console.log("No se puede ingresar a la api: ", error));
}


function ObtenerRelacionLaborCategoria(puestoLaboralID){
    authFetch(`PuestoCategorias/por-puesto/${puestoLaboralID}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => MostrarPuestosCategoria(data))
    .catch(error => console.log("No se puede ingresar a la api: ", error));
}

function MostrarPuestosCategoria(data){
    $("#puestoCategoria").empty();
    
    $.each(data, function(index, item) {
        $('#puestoCategoria').append(
                "<tr>",
                "<td class='data-false celda-titulo'>" + item.puesto + "</td>",
                "<td class='data-false celda-titulo'>" + item.categoria + "</td>",
                "<td class='text-center'><a onclick='deshabilitarPuesto(" + item.id + ")'><i class='bi bi-trash text-danger'></i></a></td>",
            )
    })
}


function guardarrelaciones(){
    let puestorelacio = document.getElementById('puestoLaboralid').value;
    let categoriarelacion = document.getElementById('categoriaPuesto').value;

    let puestocategoria = {
        puestoLaboralID: puestorelacio,
        categoriaID: categoriarelacion
    };
    authFetch("PuestoCategorias",
            {
                method: 'POST',
                body: JSON.stringify(puestocategoria)
            }
        )
    .then(async response => {
        if(!response.ok){
            const errorTexto = await response.text();
            alert(errorTexto)
            throw new Error(errorTexto);
        }
        return response.json()
    })
    .then(data => {
        ObtenerRelacionLaborCategoria(puestorelacio);
    })
    .catch(error => console.log("No se puede ingresar a la api: ", error));
}



ObtenerCategoriaparaPuestos();