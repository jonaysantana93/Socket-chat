var params = new URLSearchParams(window.location.search);

var nombre = params.get('nombre')
var sala = params.get('sala')

//Referencias JQuery
var divUsuarios = $('#divUsuarios');
var formEnviar = $('#formEnviar');
var txtMessage = $('#txtMessage');
var divChatbox = $('#divChatbox');




// Funciones para renderizar usuarios
function renderizarUsuarios(personas) { //[{},{},{}]
    console.log(personas);
    var html = '';

    html += `<li><a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a></li>`;

    for (var i = 0; i < personas.length; i++) {
        html += `<li><a data-id=${personas[i].id} href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${personas[i].nombre}<small class="text-success">online</small></span></a></li>`;
    }

    divUsuarios.html(html);
}

function renderizarMensajes(data, yo) {
    var html = '';
    var fecha = new Date(data.fecha);
    var hora = `${fecha.getHours()}:${fecha.getMinutes()}`;

    var adminClass = 'info';
    if (data.nombre === 'Administrador') {
        adminClass = 'danger';
    }

    if (yo) {
        // Mensaje propio
        html += `<li class="reverse">
                <div class="chat-content">
                    <h5>${data.nombre}</h5>
                    <div class="box bg-light-inverse">${data.message}</div>
                </div>
                <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                <div class="chat-time">${hora}</div>
                </li>`;
    } else {
        // Mensaje publico
        html += `<li class="animated fadeIn">`
        if (data.nombre !== 'Administrador') {
            html += `<div class="chat-img"><img src="assets/images/users/2.jpg" alt="user" /></div>`
        }

        html += `<div class="chat-content">
                    <h5>${data.nombre}</h5>
                    <div class="box bg-light-${adminClass}">${data.message}</div>
                </div>
                <div class="chat-time">${hora}</div>
            </li>`;
    }

    divChatbox.append(html);
}

function scrollBottom() {

    // selectors
    var newMessage = divChatbox.children('li:last-child');

    // heights
    var clientHeight = divChatbox.prop('clientHeight');
    var scrollTop = divChatbox.prop('scrollTop');
    var scrollHeight = divChatbox.prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        divChatbox.scrollTop(scrollHeight);
    }
}

//Listeners
divUsuarios.on('click', 'a', function() {
    var id = $(this).data('id');

    if (id) {
        console.log(id);
    }

});

formEnviar.on('submit', function(e) {
    e.preventDefault();

    if (txtMessage.val().trim().length === 0) {
        return;
    }


    socket.emit('crearMensaje', {
        message: txtMessage.val()
    }, function(message) {
        txtMessage.val('').focus();
        renderizarMensajes(message, true);
        scrollBottom();
    });

});