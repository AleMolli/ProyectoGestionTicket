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
    ObtenerTickets();
}

ObtenerCategoriaDropdown();