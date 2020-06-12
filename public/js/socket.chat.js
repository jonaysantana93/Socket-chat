var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios')
}

var usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        //console.log(resp);
        renderizarUsuarios(resp);
    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


//Mensajes privados
socket.on('mensajePrivado', function(message) {
    console.log('Mensaje privado ', message);
})

// Escuchar información
socket.on('crearMensaje', function(message) {
    renderizarMensajes(message, false);
    scrollBottom();
    //console.log('Servidor:', message);

});

socket.on('listaPersonas', function(personas) {
    renderizarUsuarios(personas);
    //console.log(personas);

});