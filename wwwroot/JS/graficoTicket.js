let graficoDonnaCategoria;
let graficoBarraTickets;
let GraficoCreadosyCerrados;

const inputPrioridad = document.getElementById("prioridadFiltroGrafico");
inputPrioridad.onchange = function () {
     if (graficoDonnaCategoria) {
    graficoDonnaCategoria.destroy();
}
    GenerarGraficoCategoria();
};

const inputEstado = document.getElementById("estadoFiltroGrafico");
inputEstado.onchange = function () {
     if (graficoDonnaCategoria) {
    graficoDonnaCategoria.destroy();
}
    GenerarGraficoCategoria();
};

const inputFechaDesde = document.getElementById("FechaDesdeBuscarGrafico");
inputFechaDesde.onchange = function () {
    if (graficoDonnaCategoria) {
    graficoDonnaCategoria.destroy();
}
    GenerarGraficoCategoria();
};

const inputFechaHasta = document.getElementById("FechaHastaBuscarGrafico");
inputFechaHasta.onchange = function () {
    if (graficoDonnaCategoria) {
    graficoDonnaCategoria.destroy();
}
    GenerarGraficoCategoria();
};

async function GenerarGraficoCategoria() {
    //graficoDonnaCategoria.destroy();

    const filtrosGrafico = {
        prioridad: document.getElementById("prioridadFiltroGrafico").value,
        estado: document.getElementById("estadoFiltroGrafico").value,
        fechaDesde: document.getElementById("FechaDesdeBuscarGrafico").value,
        fechaHasta: document.getElementById("FechaHastaBuscarGrafico").value,
        categoriaID: 0
    };

    const res = await authFetch(`Informes/graficoCategoria`, {
        method: 'POST',
        body: JSON.stringify(filtrosGrafico)
    });

    const categorias = await res.json();
    var labels = [];
    var data = [];
    var fondo = [];

    categorias.forEach(categoria => {
        labels.push(categoria.nombre);
        var color = generarColorRojo();
        fondo.push(color);
        data.push(categoria.cantidad);
    });

    var ctx6 = document.getElementById("doughnut-chart");

    graficoDonnaCategoria = new Chart(ctx6, {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: fondo,
            }],
        },
    });
}


async function GraficoTicketsCerrados() {

    const res = await authFetch(`Informes/graficoticketscerrados`);

    const ticketsxMes = await res.json();
    var labels = [];
    var data = [];
    var fondo = [];

    ticketsxMes.forEach(ticketporMes => {
        labels.push(ticketporMes.mes);
        var color = generarColorRojo();
        fondo.push(color);
        data.push(ticketporMes.cantidad);
    });

    var ctx4 = document.getElementById("bar-chart");
    //var ctx4 = $("#bar-chart").get(0).getContext("2d");
    graficoBarraTickets = new Chart(ctx4, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                backgroundColor: fondo,
                data: data,
                label: 'Tickets'
            }]
        },
        options: {
            responsive: true
        }
    });
}

async function GraficoTicketsCreadosyCerrados(){
    const res = await authFetch(`Informes/ticketscreadosycerradospormes`);

    const ticketscreadosycerradospormes = await res.json();
    var labels = [];
    var dataCreado = [];
    var dataCerrado = [];
    console.log(ticketscreadosycerradospormes);

    ticketscreadosycerradospormes.forEach(cantidadPorMes => {
        labels.push(cantidadPorMes.mes);
        dataCreado.push(cantidadPorMes.cantidadCreados);
        dataCerrado.push(cantidadPorMes.cantidadCerrados);
    });

    var ctx1 = $("#worldwide-sales").get(0).getContext("2d");
    var GraficoCreadosyCerrados = new Chart(ctx1, {
        type: "bar",
        data: {
            labels: labels,
            datasets: [{
                    label: "Creados",
                    data: dataCreado,
                    backgroundColor: "rgba(235, 22, 22, .3)"
                },
                {
                    label: "Cerrados",
                    data: dataCerrado,
                    backgroundColor: "rgba(235, 22, 22, .7)"
                }
            ]
            },
        options: {
            responsive: true
        }
    });
}

GenerarGraficoCategoria();
GraficoTicketsCerrados();
GraficoTicketsCreadosyCerrados();

function generarColorRojo() {
    // El valor de RR será alto (de 128 a 255) para garantizar que predomine el Rojo.
    // Los valores de GG y BB serán bajos (de 0 a 127).

    let rr = Math.floor(Math.random() * 128) + 128; // 128 a 255
    let gg = Math.floor(Math.random() * 128); // 0 a 127
    let bb = Math.floor(Math.random() * 128); // 0 a 127

    // Convertimos a hexadecimal y formateamos para que tenga siempre dos dígitos.
    let colorHex = `#${rr.toString(16).padStart(2, '0')}${gg.toString(16).padStart(2, '0')}${bb.toString(16).padStart(2, '0')}`;
    return colorHex;
}


// (function ($) {
//     "use strict";
//     var ctx6 = $("#doughnut-chart").get(0).getContext("2d");
//     var myChart6 = new Chart(ctx6, {
//         type: "doughnut",
//         data: {
//             labels: ["Italy", "France", "Spain", "USA", "Argentina"],
//             datasets: [{
//                 backgroundColor: [
//                     "rgba(235, 22, 22, .7)",
//                     "rgba(235, 22, 22, .6)",
//                     "rgba(235, 22, 22, .5)",
//                     "rgba(235, 22, 22, .4)",
//                     "rgba(235, 22, 22, .3)"
//                 ],
//                 data: [55, 49, 44, 24, 15]
//             }]
//         },
//         options: {
//             responsive: true
//         }
//     });

// })(jQuery);