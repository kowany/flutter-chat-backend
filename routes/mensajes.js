/*

    Path: /api/mensajes

*/


/*

'/api/usuarios'


*/


const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt');
const { obtenerChat } = require('../controllers/mensajes');


const router = Router();

//validarJWT,
router.get('/:de', validarJWT, obtenerChat );



module.exports = router;