const { response } = require("express");
const bcript = require('bcryptjs');


const Usuario = require('./../models/usuario');
const { generarJWT } = require("../helpers/jwt");

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {
        
        const existeEmail = await Usuario.findOne( {email} );

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya está registrado'
            });
        }
        const usuario = new Usuario( req.body );
    
        // Encriptar contraseña
        const salt = bcript.genSaltSync();
        usuario.password = bcript.hashSync( password, salt ) ;

        await usuario.save();
        
        // Generar mi JWT
        
        const token = await generarJWT( usuario.id );
        
        res.json({
            ok: true,
            usuario,
            token
        });
        
    } catch (error) {
        console.log( error );
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    
};

const login = async (req, res = response) => {
    
    const { email, password } = req.body;

    try {
        
        const usuarioDB = await Usuario.findOne( { email } );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email no encontrado'
            });
        }
        
        // validar el password
        const validarPassword =  bcript.compareSync( password, usuarioDB.password );
        if ( !validarPassword ) {
            return res.status(404).json({
                ok: false,
                msg: 'La contraseña no es válida'
            });
        }

        // Generar el JWT
        const token = await generarJWT( usuarioDB.id );
        console.log('TOKEN!!!:      ', token );
        return res.json({
            ok: true,
            usuario: usuarioDB,
            token
        });
        
    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Hable con el administrador'
        });
    }
    return res.status(200).json({
        ok: true,
        msg: 'login'
    })
}

const renewToken = async ( req, res = response ) => {
    
    const uid = req.uid;

    const token = await generarJWT( uid );

    const usuario = await Usuario.findById(uid);


    res.json({
        ok: true,
        usuario,
        token
    })
}


module.exports = {
    crearUsuario,
    login,
    renewToken
}