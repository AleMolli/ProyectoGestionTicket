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
                "<td><a onclick='deshabilitarCategorias(" + item.id + ")'<i class='bi bi-trash'></i></a></td>",
                "<td><a onclick='BuscarCategoria(" + item.id + ")'<i class='bi bi-brush'></i></a></td>"
            )
        }
        else{
            $('#tablaDeCategorias').append(
                "<tr style='background-color: red'>",
                "<td>" + item.categoriaID + "</td>",
                "<td>" + item.nombre + "</td>",
                "<td><a onclick=''<i class='bi bi-arrow-clockwise'></i></a></td>"
            )
        }
    })
}

//limpia el imput si se hace clik fuera
function LimpiarImput(){


    document.addEventListener("click", function(event) {
        let input = document.getElementById("nombreCategoria");
        let botonGuardar = document.getElementById("btnGuardar");
    
        // Si el clic no fue dentro del input ni en el botón "Guardar", se borra el contenido
        if (event.target !== input && event.target !== botonGuardar) {
            input.value = "";
        }
    });
}


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
//eliminar un dato
function deshabilitarCategorias(id) {
    //console.log("ID recibido:", id);
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
//busca una categoria para completar el modal para despues editar
function BuscarCategoria(id){
    fetch(`http://localhost:5108/api/Categorias/${1}`, {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("categoriaID").value = data.categoriaID;
        document.getElementById("nombreCategoria").value = data.nombre;
    })
    .catch(error => console.log("No se puede ingresar a la api: ", error))
}