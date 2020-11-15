const { response } = require('express');

const Usuario = require('./../models/usuario');


const getUsuarios = async ( req, res = response ) => {

    const desde = Number( req.query.desde ) || 0;
    const usuarios = await Usuario
                    .find({ _id: { $ne: req.uid }})
                    .sort('-online')
                    .skip( desde )
                    .limit( 20 );
    return res.json({
        ok: true,
        usuarios,
        desde
    });
    // try {
    //     if ( usuarios ) {
    //         return res.json({
    //             ok: true,
    //             msg: 'get usuario'
    //         });
    //     }
    // } catch (error) {
    //     res.status(500).json({
    //         ok: false,
    //         msg: 'Hable con el administrador'
    //     });
    // }
}

module.exports = {
    getUsuarios
}