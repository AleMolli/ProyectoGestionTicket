function capitalizarTexto(texto) {
    return texto.replace(/\b\w/g, function(char) {
        return char.toUpperCase();
    });
}