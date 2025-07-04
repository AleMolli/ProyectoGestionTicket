async function IngresarconUsuario() {
    const apiBase = "http://localhost:5108/api/auth"; //MEDIO DE CONEXION A LA API


    //document.getElementById("loginForm").addEventListener("submit", async (e) => {
    // e.preventDefault();
    const data = {
        email: document.getElementById("loginEmail").value,
        password: document.getElementById("loginPassword").value
    };

    const response = await fetch(`${apiBase}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    });

    if (response.ok) {
        const result = await response.json();
        //document.getElementById("tokenOutput").textContent = result.token;
        localStorage.setItem("token", result.token);
        localStorage.setItem("refreshToken", result.refreshToken);
        localStorage.setItem("email", document.getElementById("loginEmail").value);
        localStorage.setItem("nombre", result.nombreCompleto);
        localStorage.setItem("rolusuario", result.rol);
        window.location.href = "index.html";
    } else {
        alert("Login fallido");
    }
};