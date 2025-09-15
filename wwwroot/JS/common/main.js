
//(function ($) {
// "use strict";

// Spinner
// var spinner = function () {
//     setTimeout(function () {
//         if ($('#spinner').length > 0) {
//             $('#spinner').removeClass('show');
//         }
//     }, 1);
// };
// spinner();

// Back to top button
    // $(window).scroll(function () {
    //     if ($(this).scrollTop() > 100) {
    //         $('.back-to-top').fadeIn('slow');
    //     } else {
    //         $('.back-to-top').fadeOut('slow');
    //     }
    // });
    // $('.back-to-top').click(function () {
    //     $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
    //     return false;
    // });

// Sidebar Toggler
$('.sidebar-toggler').click(function () {
  $('.sidebar, .content').toggleClass("open");
  return false;
});



function verificarUsuario() {
  const token = getToken();
  const email = getEmail(); // suponiendo que guardaste el email al hacer login
  const rolusuario = getRol();
  const nombre = localStorage.getItem("nombre");

  $("#NombredeUsuario").text(nombre);
  $("#rolusuario").text(rolusuario);

  if (!token) {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("rolusuario");
    window.location.href = "login.html";
    return;
  }
  mostrarOpcionesSidebar(rolusuario);
}

function mostrarOpcionesSidebar(rolUsuario) {
  const links = document.querySelectorAll('.nav-item.nav-link'); //seleccionamos todos los elementos <a> del sidebar que tienen esas clases

  links.forEach(link => {
    const rolesPermitidos = link.dataset.visibleFor; //accede al atributo data-visible-for del HTML y obtiene los roles permitidos que declaramos

    if (rolesPermitidos) {
      const rolesArray = rolesPermitidos.split(',').map(r => r.trim());//convierte un string en un array y le quita espacios innecesarios
      if (!rolesArray.includes(rolUsuario)) { //si el rol del usuario no esta en el array oculta el acceso con la clase d-none
        link.classList.add('d-none');
      } else {//si esta el rol, quita la clase para que quede visible el enlace
        link.classList.remove('d-none');
      }
    } else {
      // Si no tiene data-visible-for, se muestra por defecto
      link.classList.remove('d-none');
    }
  });
}

// function cargarComponente(id, path) {
//     return fetch(path)
//         .then(res => res.text())
//         .then(html => {
//             document.getElementById(id).innerHTML = html;
//         });
// }

function cargarVista(view) {
  fetch(`${view}.html`)
    .then(res => res.text())
    .then(html => {
      const app = document.getElementById('app');
      app.innerHTML = html;

      // Ejecutar scripts de la vista si hay
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const scripts = tempDiv.querySelectorAll('script');

      scripts.forEach(script => {
        const nuevoScript = document.createElement('script');
        if (script.src) {
          nuevoScript.src = script.src;
        } else {
          nuevoScript.textContent = script.textContent;
        }
        document.body.appendChild(nuevoScript);
      });
      if (view === 'ticketTabs' || html.includes('id="ticketTabs"')) {
        // Esperás un pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
          if (typeof inicializarTabs === 'function') {
            inicializarTabs();
          }
        }, 100);
      }
    });
}

function cargarVistaPorHash() {
  const vista = window.location.hash.replace('#', '') || 'home';
  cargarVista(vista);
  actualizarLinkActivo(); // 👈 Asegurate de actualizar los estilos del menú
}

function navigateTo(vista) {
  window.location.hash = vista;
}

function actualizarLinkActivo() {
  const vistaActual = window.location.hash.replace('#', '') || 'home';

  // Elimina la clase 'active' de todos los nav-items y links
  const todosItemsNav = document.querySelectorAll('.nav-item');
  todosItemsNav.forEach(item => item.classList.remove('active'));

  const todosLinks = document.querySelectorAll('a[href^="#"]');
  todosLinks.forEach(link => {
    const hrefVista = link.getAttribute('href').replace('#', '');
    if (hrefVista === vistaActual) {
      link.classList.add('active');

      // Agrega clase active al nav-item padre si existe
      const itemNavPadre = link.closest('.nav-item');
      if (itemNavPadre) {
        itemNavPadre.classList.add('active');
      }

      const contenedorColapsar = link.closest('.collapse');

      if (contenedorColapsar) {
        // Si está dentro de un collapse, abrirlo
        contenedorColapsar.classList.add('show');
        const linkColapsar = document.querySelector(`[data-target="#${contenedorColapsar.id}"]`);
        //console.log(linkColapsar);
        if (linkColapsar) {
          linkColapsar.classList.remove('collapsed');
          linkColapsar.setAttribute('aria-expanded', 'true');
        }
      } else {
        // Si NO está dentro de un collapse, cerrar todos los collapses
        document.querySelectorAll('.collapse').forEach(collapse => {
          collapse.classList.remove('show');
        });
        document.querySelectorAll('[data-linkColapsar="collapse"]').forEach(linkColapsar => {
          linkColapsar.classList.add('collapsed');
          linkColapsar.setAttribute('aria-expanded', 'false');
        });
      }
    } else {
      link.classList.remove('active');
    }
  });
}

// Inicializar
//hashchange evento de ejecutar una funcion cuando cambia el hash del link
window.addEventListener('hashchange', cargarVistaPorHash);
//load se ejecuta cuando toda la página, incluyendo todos los recursos, ha sido cargada completamente. 
window.addEventListener('load', actualizarLinkActivo);
//DOMContentLoaded se ejecuta cuando el HTML ha sido completamente cargado y analizado, sin importar si los recursos externos (imágenes, hojas de estilo, etc.) se han cargado
window.addEventListener('DOMContentLoaded', () => {
  //   cargarComponente('accordionSidebar', '../components/sidebar.html')
  //   .then(() => {//ES UNA PROMESA QUE DESENCADENA UNA ACCION
  //     actualizarLinkActivo(); //Se ejecuta después de cargar el menú
  //   });

  //   cargarComponente('footer', '../components/footer.html');
  cargarVistaPorHash();
  verificarUsuario(); //Se ejecuta después de cargar el menú
});