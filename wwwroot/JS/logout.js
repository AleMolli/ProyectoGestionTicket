
//const getToken = () => localStorage.getItem("token");

async function cerrarSesion() {
    const token = getToken();
    const email = getEmail(); // suponiendo que guardaste el email al hacer login

    if (!token || !email) {
        localStorage.removeItem("token");
        localStorage.removeItem("email");
        window.location.href = "login.html";
        return;
    }

    try {
        const res = await fetch("https://localhost:5108/api/auth/logout", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ email })
        });

        if (res.ok) {
            alert("Sesión cerrada correctamente");
        } else {
            alert("Error al cerrar sesión: " + await res.text());
        }
    } catch (error) {
        console.error("Error en logout:", error);
    }

    // Limpiar token y redirigir
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    window.location.href = "login.html";
};