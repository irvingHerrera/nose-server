const express = require('express');
const { verificaToken, verificaAdminRol } = require('../middleweres/autenticacion');
const app = express();

const Categoria = require('../models/categoria');

// mostrar todas las categorias
app.get('/categoria', verificaToken, (req, res) => {

    Categoria.find({})
            .sort('descripcion')
            .populate('usuario', 'nombre email')
            .exec((err, categorias) => {
                if( err ) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }
                
                res.json({
                    ok: true,
                    categorias
                })
            })


});

// mostrar una categoria por id
app.get('/categoria:id', verificaToken, (req, res) => {


    let id = res.params.id;

    Categoria.findById(id, (err , categoriaDB))
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            
            if( !categoriaDB ) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'El ID no es correcto'
                    }
                });
            }

            res.json({
                ok: true,
                categoria: categoriaDB
            })
});

// crear nueva categoria
app.post('/categoria', verificaToken, (req, res) => {

    let body = req.body;

    let categoria = new Categoria({
        descripcion: body.descripcion,
        usuario: req.usuario._id
    });

    categoria.save((err, categoriaDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// actualiar categoria
app.put('/categoria', verificaToken, (req, res) => {

    let id = req.param.id;
    let body = req.body;

    let descCategoria = { descripcion: body.descripcion }

    Categoria.findByIdAndUpdate(id, descCategoria {new: true, runValidators: true}, ( err, categoriaDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err
            });
        }


        res.json({
            ok: true,
            categoria: categoriaDB
        });

    });

});

// borrar categoria
app.delete('/categoria', [verificaToken, verificaAdminRol], (req, res) => {


    let id = req.params.id;

    Categoria.findByIdAndRemove(id, (err, categoriaDB) => {

        if( err ) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if( !categoriaDB ) {
            return res.status(400).json({
                ok: false,
                err: "El id no existe"
            });
        }


        res.json({
            ok: true, 
            message: "Categoria borrada"
        })

    });

});

module.exports = app;