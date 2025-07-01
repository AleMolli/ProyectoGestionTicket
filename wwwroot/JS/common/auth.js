const BASE_API_URL = "http://localhost:5108/api/";

var API_URL = BASE_API_URL;

function getToken(){
    return (localStorage.getItem("token"))
}
//console.log(getToken());

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function getEmail() {
  return localStorage.getItem("email");
}

function getRol(){
  return localStorage.getItem("rolusuario");
}
//console.log(localStorage.getItem("email"));

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

// const authHeaders = () => ({
//     "Content-Type": "application/json",
//     "Authorization": `Bearer ${getToken()}`
// });

function authFetch(url, options, retry) {
  retry = typeof retry === "undefined" ? true : retry;
  options = options || {};
  options.headers = options.headers || {};
  options.headers["Authorization"] = "Bearer " + getToken();
  options.headers["Content-Type"] = "application/json";

  return fetch(API_URL + url, options).then(function(response) {
    if (response.status === 401 && retry) {
      // Token expirado, intentamos renovarlo
      return refreshToken().then(function(newToken) {
        // Reintenta la solicitud original con el nuevo token
        options.headers["Authorization"] = "Bearer " + newToken;
        return fetch(API_URL + url, options);
      }).catch(function(err) {
        console.error("No se pudo renovar el token:", err);
        return response; // devolvemos el 401 original
      });
    }
    return response;
  });
}