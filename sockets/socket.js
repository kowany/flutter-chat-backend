const { io } = require('../index');

const { comprobarJWT } = require('../helpers/jwt');
const { usuarioConectado, usuarioDesconectado, grabarMensaje } = require('../controllers/socket');


// Mensajes de Sockets
io.on('connect', async (client) => {
    console.log('Cliente conectado');

    const [valido, uid] = comprobarJWT( client.handshake.headers['x-token'] );
    
    // verificar autenticación
    if (!valido) { client.disconnect(); }
    
    // Ingresar al usuario a una sala específica
    // sala global donde están todos los usuarios conectados
    // client.id, 5fa09ce813c01b0654236727 ( uid )
    client.join( uid );

    // Escuchar del cliente 'mensaje-personal'

    client.on('mensaje-personal', async ( payload ) => {
        // TODO: grabar mensaje
        await grabarMensaje( payload );
        console.log('Escuhando:', payload );
        io.to( payload.para ).emit( 'mensaje-personal', payload );
    });



    // Cliente autenticado
    usuarioConectado( uid );
    console.log('Cliente autenticado, ', uid);
    client.on('disconnect', () => {
        usuarioDesconectado( uid );
        console.log('Cliente desconectado');
    });

});
