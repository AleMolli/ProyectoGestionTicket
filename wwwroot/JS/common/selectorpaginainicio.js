// document.addEventListener("DOMContentLoaded", function () {
//     const tabs = document.querySelectorAll(".tabs li a");
//     const contents = document.querySelectorAll(".tab-content");

//     tabs.forEach(tab => {
//         tab.addEventListener("click", function (e) {
//             e.preventDefault();

//             // Remover la clase 'active' de todas las pestañas y contenidos
//             tabs.forEach(t => t.classList.remove("active"));
//             contents.forEach(c => c.classList.remove("active"));

//             // Agregar la clase 'active' a la pestaña y contenido correspondiente
//             this.classList.add("active");
//             const target = document.querySelector(this.getAttribute("href"));
//             target.classList.add("active");
//         });
//     });
// });

document.addEventListener("DOMContentLoaded", () => {
    const links = document.querySelectorAll("a[data-view]"); // Seleccionar todos los enlaces con el atributo 'data-view'

    links.forEach(link => {
        link.addEventListener("click", async (event) => {
            event.preventDefault(); // Evita el comportamiento predeterminado del enlace (recargar la página)
            const viewPath = link.getAttribute("data-view"); // Obtiene la ruta de la vista desde 'data-view'

            await loadView(viewPath); // Llama a la función para cargar la vista

            ObtenerCategorias(); //para mostrar datos en tabla de categoria
            ObtenerTickets();
            ObtenerCategoriaDropdown();
            ObtenerPrioridadDropdown();
        });
    });
});

// Tu función loadView
const loadView = async (viewPath) => {
    try {
        const response = await fetch(viewPath);
        if (response.ok) {
            const html = await response.text();
            document.getElementById("content-div").innerHTML = html;
        } else {
            document.getElementById("content-div").innerHTML = "<p>Error al cargar la vista.</p>";
        }
    } catch (error) {
        console.error("Error:", error);
        document.getElementById("content-div").innerHTML = "<p>No se pudo cargar la vista.</p>";
    }
};