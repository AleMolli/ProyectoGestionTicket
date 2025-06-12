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
}