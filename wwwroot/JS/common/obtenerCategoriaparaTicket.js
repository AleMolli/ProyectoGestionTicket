function ObtenerCategoriaDropdown(){
    fetch('http://localhost:5108/api/Categorias')
    .then(response => response.json())
    .then(data => CompletarDropdown(data))
    .catch(error => console.log("No se pudo acceder acceder al servicio.", error))
}

function CompletarDropdown(data){
    let bodySelect = document.getElementById('categoriaTicket');
    bodySelect.innerHTML = '';
    
    data.forEach(element => {
        opt = document.createElement("option"); 
        opt.value = element.categoriaID;
        opt.text = element.nombre

        bodySelect.add(opt);
    })
}