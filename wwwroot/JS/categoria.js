
// function getToken(){
//     return (localStorage.getItem("token"))
// }

// const authHeaders = () => ({
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${getToken()}`
// });

async function ObtenerCategorias(){
    const res = await authFetch("Categorias");
    const categorias = await res.json();

    let tbody = document.querySelector("#tablaDeCategorias tbody");
    tbody.innerHTML = "";

    categorias.forEach(data => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${data.nombre}</td>
            <td class="text-center">
                ${!data.eliminado ? `<a onclick="deshabilitarCategorias(${data.categoriaID})"><i class="btn bi bi-trash text-danger"></i></a>` : `<a onclick="habilitarCategoria(${data.categoriaID})"><i class="btn bi bi-arrow-clockwise fs-5 text-success" style="text-shadow: 0 0 4px green;"></i></a>`}
                ${!data.eliminado ? `<a onclick="BuscarCategoria(${data.categoriaID})"><i class="btn bi bi-brush text-info"></i></a>` : ""}
            </td>
        `;
        tbody.appendChild(row);
    });
}

//MOSTRAMOS EN UNA TABLA LOS DATOS GUARDADOS EN TABLA CATEGORIA
// function MostrarCategorias(data){
//     $("#tablaDeCategorias").empty();
    
//     $.each(data, function(index, item) { //SI EL CAMPO ELIMINADO ES FALSO LO MOSTRAMOS ASI

//         if(item.eliminado == false){
//             $('#tablaDeCategorias').append(
//                 "<tr>",
//                 "<td class='data-false celda-titulo'>" + item.nombre + "</td>",
//                 "<td class='text-center'><a onclick='deshabilitarCategorias(" + item.categoriaID + ")'><i class='bi bi-trash text-danger'></i></a></td>",
//                 "<td class='text-center'><a onclick='BuscarCategoria(" + item.categoriaID + ")'><i class='bi bi-brush text-info'></i></a></td>"
//             )
//         }
//         else{//SI EL CAMPO ELIMINADO ES VERDADERO LO MOSTRAMOS ASI
//             $('#tablaDeCategorias').append(
//                 "<tr>",
//                 "<td class='data-true'>" + item.nombre + "</td>",
//                 "<td class='text-center'><a onclick='habilitarCategoria(" + item.categoriaID + ")'><i class='bi bi-arrow-clockwise fs-5 text-success' style='text-shadow: 0 0 4px green;'></i></a></td>"
//             )
//         }
//     })
// }


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

        authFetch(`Categorias`,
        {
            method: 'POST',
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
        authFetch(`Categorias/${id}`, {
            method: 'DELETE',  //EN EL METODO DELETE TENEMOS UN IF PREGUNTANDO EN QUE ESTADO ESTA EL ATRIBUTO "ELIMINADO"
        })
        .then(() => {
            ObtenerCategorias();
        })
        .catch(error => console.log("No se puede ingresar a la api: ", error))
    }
}

//FUNCION PARA HABILITAR UNA CATEGORIA DESHABILITADA
function habilitarCategoria(id){
    authFetch(`Categorias/${id}`, {
        method: 'DELETE',  //EN EL METODO DELETE TENEMOS UN IF PREGUNTANDO EN QUE ESTADO ESTA EL ATRIBUTO "ELIMINADO"
    })
    .then(() => {
        ObtenerCategorias();
    })
    .catch(error => console.log("No se puede ingresar a la api: ", error))
}



//busca una categoria para completar el modal para despues editar
function BuscarCategoria(id){
    authFetch(`Categorias/${id}`, {
        method: 'GET',
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

        authFetch(`Categorias/${idCategoria}`, {
            method: 'PUT',
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
                    title: "Categoria Editada",
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

ObtenerCategorias();

function ImprimirCategorias() {
const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  const fecha = new Date().toLocaleDateString();

  // Encabezado
  doc.setFontSize(14);
  doc.setTextColor(40);
  doc.text("Listado de Categorías", 14, 20);
  doc.setFontSize(10);
  doc.text(`Fecha: ${fecha}`, 14, 26);
  doc.setFontSize(10);
  doc.text(`Usuario: ${localStorage.getItem("nombre")}`, 80, 26);
  doc.setFontSize(10);
  doc.text(`Rol: ${localStorage.getItem("rolusuario")}`, 150, 26);
  doc.line(14, 28, 195, 28);

  // Clonar tabla y eliminar columnas de acciones
  const tablaOriginal = document.querySelector(".table");
  console.log(document.querySelector(".table").outerHTML);

  const tablaClon = tablaOriginal.cloneNode(true);

  tablaClon.querySelectorAll("tr").forEach(tr => {
    const celdas = tr.querySelectorAll("td, th");
    if (celdas.length > 1) {
      celdas[1]?.remove(); // columna de ícono 1
      celdas[2]?.remove(); // columna de ícono 2
    }
  });

  // Generar tabla en PDF
  doc.autoTable({
    html: tablaClon,
    startY: 35,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 4,
      lineColor: [220, 220, 220],
      lineWidth: 0.1
    },
    headStyles: {
      fillColor: [78, 115, 223],
      textColor: 255,
      halign: 'center'
    },
    alternateRowStyles: {
      fillColor: [245, 245, 245]
    },
    didDrawPage: function (data) {
      const pageHeight = doc.internal.pageSize.height;
      doc.setDrawColor(78, 115, 223);
      doc.setLineWidth(8);
      doc.line(14, pageHeight - 11, 196, pageHeight - 11);
      doc.setFontSize(10);
      doc.setTextColor(255, 255, 255);
      doc.text(`Página ${data.pageNumber}`, 17, pageHeight - 10);
    }
  });

  // Mostrar en iframe
  const pdfString = doc.output("datauristring");
  const iframe = `<iframe width='100%' height='100%' src='${pdfString}'></iframe>`;
  const ventana = window.open();
  ventana.document.write(iframe);
  ventana.document.close();
}