const apiBase = "http://localhost:5108/api/auth"; //MEDIO DE CONEXION A LA API

document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = {
        nombreCompleto: document.getElementById("regNombre").value,
        email: document.getElementById("regEmail").value,
        password: document.getElementById("regPassword").value
    };

    const response = await fetch(`${apiBase}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    const result = await response.text();
    alert(result);
    window.location.href = "login.html"
});