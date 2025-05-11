function getToken(){
    return (localStorage.getItem("token"))
}

const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
});


function ObtenerCategorias(){
    fetch('http://localhost:5108/api/Categorias')
    .then(response => response.json())
    .then(data => MostrarCategorias(data))
    .catch(error => console.log("No se puede ingresar a la api: ", error));
}

//MOSTRAMOS EN UNA TABLA LOS DATOS GUARDADOS EN TABLA CATEGORIA
function MostrarCategorias(data){
    $("#tablaDeCategorias").empty();
    
    $.each(data, function(index, item) { //SI EL CAMPO ELIMINADO ES FALSO LO MOSTRAMOS ASI
        if(item.eliminado == false){
            $('#tablaDeCategorias').append(
                "<tr>",
                "<td>" + item.categoriaID + "</td>",
                "<td>" + item.nombre + "</td>",
                "<td><a onclick='deshabilitarCategorias(" + item.categoriaID + ")'<i class='bi bi-trash'></i></a></td>",
                "<td><a onclick='BuscarCategoria(" + item.categoriaID + ")'<i class='bi bi-brush'></i></a></td>"
            )
        }
        else{//SI EL CAMPO ELIMINADO ES VERDADERO LO MOSTRAMOS ASI
            $('#tablaDeCategorias').append(
                "<tr class = 'filaRoja'>", //¡¡¡¡NO FUNCIONA LA CLASE!!!!
                "<td>" + item.categoriaID + "</td>",
                "<td>" + item.nombre + "</td>",
                "<td><a onclick='habilitarCategoria(" + item.categoriaID + ")'<i class='bi bi-arrow-clockwise'></i></a></td>"
            )
        }
    })
}


//limpia el imput si se hace clik en boton cancelar.
function VaciadoImput(){
    document.getElementById("categoriaID").value = 0;
    document.getElementById("nombreCategoria").value = "";
}


//FUNCION PARA AGREGAR UNA CATEGORIA NUEVA
function AgregarCategoria(){
    let nombreCategoria = document.getElementById("nombreCategoria").value; //CAPTURA LO QUE GUARDAMOS EN EL IMPUT

    if (nombreCategoria.trim() != 0){ //VALIDA QUE NO ESTE VACIO
        let categoria = {
            nombre: capitalizarTexto(nombreCategoria.trim()),
            eliminado: false
        };

        fetch('http://localhost:5108/api/Categorias',
        {
            method: 'POST',
            headers: authHeaders(),
            body: JSON.stringify(categoria)
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
                document.getElementById("nombreCategoria").value = "";
                ObtenerCategorias();
                Swal.fire({
                    icon: "success",
                    title: "Categoria creada",
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
            title: "Debe ingresar un nombre valido para la Categoria",
            showConfirmButton: false,
            timer: 1500
        })
    }
}
//deshabilita un dato
function deshabilitarCategorias(id) {
    let quieredeshabilitar = confirm("Esta seguro de borrar esta Categoria?")

    if (quieredeshabilitar) {
        fetch(`http://localhost:5108/api/Categorias/${id}`, {
            method: 'DELETE'  //EN EL METODO DELETE TENEMOS UN IF PREGUNTANDO EN QUE ESTADO ESTA EL ATRIBUTO "ELIMINADO"
        })
        .then(() => {
            ObtenerCategorias();
        })
        .catch(error => console.log("No se puede ingresar a la api: ", error))
    }
}

//FUNCION PARA HABILITAR UNA CATEGORIA DESHABILITADA
function habilitarCategoria(id){
    fetch(`http://localhost:5108/api/Categorias/${id}`, {
        method: 'DELETE'  //EN EL METODO DELETE TENEMOS UN IF PREGUNTANDO EN QUE ESTADO ESTA EL ATRIBUTO "ELIMINADO"
    })
    .then(() => {
        ObtenerCategorias();
    })
    .catch(error => console.log("No se puede ingresar a la api: ", error))
}



//busca una categoria para completar el modal para despues editar
function BuscarCategoria(id){
    fetch(`http://localhost:5108/api/Categorias/${id}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("categoriaID").value = data.categoriaID;
        document.getElementById("nombreCategoria").value = data.nombre;
    })
    .catch(error => console.log("No se puede ingresar a la api: ", error))
}


//PARA EDITAR UNA CATEGORIA YA CREADA

function EditarunaCategoria(){
    let idCategoria = document.getElementById("categoriaID").value;
    let nombreCategoriaEditado = document.getElementById("nombreCategoria").value;

    if (nombreCategoriaEditado.trim() != 0) {//PARA CORROBORAR DE QUE EL IMPUT NO ESTE VACIO
        let categoriaEditada = {
            categoriaID: idCategoria,
            nombre: capitalizarTexto(nombreCategoriaEditado.trim()) //LLAMA A UNA FUNCION PARA GUARDAR EL CAMPO CON LA PRIMER LETRA DE CADA PALABRA EN MAYUSCULA
        };

        fetch(`http://localhost:5108/api/Categorias/${idCategoria}`, {
            method: 'PUT',
            headers: authHeaders(),
            body: JSON.stringify(categoriaEditada)
        })
        .then(async response => {
            if (!response.ok){
                let textoErrorEditar = await response.text();//CAPTURA EL ERROR DESDE EL CONTROLADOR 
                throw (textoErrorEditar);                    //DONDE HACEMOS VALIDACION QUE NO EXISTA LA CATEGORIA
            }
            else{
                VaciadoImput();

                ObtenerCategorias();
                Swal.fire({
                    icon: "success",
                    title: "Categoria creada",
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
            title: "Debe ingresar un nombre valido para la Categoria",
            showConfirmButton: false,
            timer: 3000
        })
    }
}


//PARA INDICARLE AL BOTON GUARDAR A QUE CATEGORIA LLAMAR.

function BotonGuardarCategoria(){
    let inputIDconvalor = document.getElementById("categoriaID").value;

    if (inputIDconvalor != 0){
        EditarunaCategoria();
    }
    else{
        AgregarCategoria();
    }
}