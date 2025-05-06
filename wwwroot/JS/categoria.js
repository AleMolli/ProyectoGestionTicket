function ObtenerCategorias(){
    fetch('http://localhost:5108/api/Categorias')
    .then(response => response.json())
    .then(data => MostrarCategorias(data))
    .catch(error => console.log("No se puede ingresar a la api: ", error));
}


function MostrarCategorias(data){
    $("#tablaDeCategorias").empty();
    
    $.each(data, function(index, item) {
        if(item.eliminado == false){
            $('#tablaDeCategorias').append(
                "<tr>",
                "<td>" + item.categoriaID + "</td>",
                "<td>" + item.nombre + "</td>",
                "<td><a onclick='deshabilitarCategorias(" + item.categoriaID + ")'<i class='bi bi-trash'></i></a></td>",
                "<td><a onclick='BuscarCategoria(" + item.categoriaID + ")'<i class='bi bi-brush'></i></a></td>"
            )
        }
        else{
            $('#tablaDeCategorias').append(
                "<tr class = 'filaRoja td'>",
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


//
function AgregarCategoria(){
    let nombreCategoria = document.getElementById("nombreCategoria").value;

    if (nombreCategoria.trim() != 0){
        let categoria = {
            nombre: capitalizarTexto(nombreCategoria),
            eliminado: false
        };

        fetch('http://localhost:5108/api/Categorias',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoria)
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById("nombreCategoria").value = "";
            ObtenerCategorias();
        })
        .catch(error => console.log("No se puede ingresar a la api: ", error))
    }
    else {
        alert("Debe ingresar un nombre valido para la Categoria")
    }
}
//deshabilita un dato
function deshabilitarCategorias(id) {
    let quieredeshabilitar = confirm("Esta seguro de borrar esta Categoria?")

    if (quieredeshabilitar) {
        fetch(`http://localhost:5108/api/Categorias/${id}`, {
            method: 'DELETE'
        })
        .then(() => {
            ObtenerCategorias();
        })
        .catch(error => console.log("No se puede ingresar a la api: ", error))
    }
}


function habilitarCategoria(id){
    fetch(`http://localhost:5108/api/Categorias/${id}`, {
        method: 'DELETE'
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

function EditarunaCategoria(){
    let idCategoria = document.getElementById("categoriaID").value;
    let nombreCategoriaEditado = document.getElementById("nombreCategoria").value;

    if (nombreCategoriaEditado.trim() != 0) {
        let categoriaEditada = {
            categoriaID: idCategoria,
            nombre: capitalizarTexto(nombreCategoriaEditado)
        };

        fetch(`http://localhost:5108/api/Categorias/${idCategoria}`, {
            method: 'PUT',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(categoriaEditada)
        })
        .then(data => {
            VaciadoImput();

            ObtenerCategorias();
        })
        .catch(error => console.log("No se puede ingresar a la api: ", error))
    }
}

function BotonGuardarCategoria(){
    let inputIDconvalor = document.getElementById("categoriaID").value;

    if (inputIDconvalor != 0){
        EditarunaCategoria();
    }
    else{
        AgregarCategoria();
    }
}