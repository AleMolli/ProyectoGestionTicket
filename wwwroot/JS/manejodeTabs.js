// document.querySelectorAll('.nav-link[type="button"]').forEach(btn => {
//   btn.addEventListener('click', async () => {
//     const file = btn.getAttribute('data-file');
//     const scriptPath = btn.getAttribute('data-script'); // nuevo atributo para el JS

//     // Cargar el HTML
//     const res = await fetch(file);
//     const html = await res.text();
//     document.getElementById('tabContent').innerHTML = html;

//     // Activar visualmente el tab
//     document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
//     btn.classList.add('active');

//     // Cargar el script dinámicamente
//     if (scriptPath) {
//       const script = document.createElement('script');
//       script.src = scriptPath;
//       script.defer = true;
//       document.body.appendChild(script);
//     }
//   });
// });

// document.addEventListener('click', async (e) => {
//   const btn = e.target.closest('.nav-link');
//   if (!btn) return;

//   const file = btn.getAttribute('data-file');
//   const scriptPath = btn.getAttribute('data-script');

//   const res = await fetch(file);
//   const html = await res.text();
//   document.getElementById('tabContent').innerHTML = html;

//   document.querySelectorAll('.nav-link').forEach(b => b.classList.remove('active'));
//   btn.classList.add('active');

//   if (scriptPath) {
//     const script = document.createElement('script');
//     script.src = scriptPath;
//     script.defer = true;
//     document.body.appendChild(script);
//   }
// });

function inicializarTabs() {
    const tabButtons = document.querySelectorAll('button.nav-link');
    if (!tabButtons.length) return;

    tabButtons.forEach(btn => {
        btn.addEventListener('click', async () => {
            const file = btn.getAttribute('data-file');
            const scriptPath = btn.getAttribute('data-script');

            if (file) {
                const res = await fetch(file);
                const html = await res.text();

                document.getElementById('tabContent').innerHTML = html;
                const wrapper = document.getElementById('ticketWrapper');
                if (wrapper) {
                    wrapper.classList.remove('container-fluid', 'pt-4', 'px-4');
                }

                tabButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                if (scriptPath) {
                    const scripts = scriptPath.split(',').map(s => s.trim());
                    scripts.forEach(src => {
                        const script = document.createElement('script');
                        script.src = src;
                        script.defer = true;
                        document.body.appendChild(script);
                    });
                }
            }
        });
    });

    // Ejecutar el tab activo automáticamente
    const activo = document.querySelector('button.nav-link.active');
    if (activo) activo.click();
}