function getToken(){
    return (localStorage.getItem("token"))
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function getEmail() {
  return localStorage.getItem("email");
}
console.log(localStorage.getItem("email"));

function saveTokens(token, refreshToken) {
  localStorage.setItem("token", token);
  localStorage.setItem("refreshToken", refreshToken);
}

function refreshToken() {
  return fetch('http://localhost:5108/api/Auth/refresh-token', {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: getEmail(),
      refreshToken: getRefreshToken()
    })
  })
  .then(function(response) {
    if (!response.ok) {
      throw new Error("Error al renovar el token");
    }
    return response.json();
  })
  .then(function(data) {
    saveTokens(data.token, data.refreshToken);
    return data.token;
  });
}

const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
});

