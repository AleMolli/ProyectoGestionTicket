function getToken(){
    return (localStorage.getItem("token"))
}

const authHeaders = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${getToken()}`
});