const router = require('express').Router();

const mongoose = require('mongoose');
var status = require('http-status');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/students', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const Student = require('../models/student.model');

module.exports=()=>{
    //insertar estudihambre
    router.post('/', (req, res) => {
        student = req.body;
        Student.create(student)
            .then(
                (data) => {
                    res.json({
                        code: status.OK,
                        msg: 'Se inserto correctamente',
                        data: data
                    })
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json(
                            {
                                code: status.BAD_REQUEST,
                                msg: 'Ocurrio un error',
                                err: err.name,
                                detal: err.message
                            }
                        )
                }
            )
    })

    //consulta general de estudihambres
    router.get('/', (req, res) => {
        Student.find({})
            .then(
                (students) => {
                    res.json({
                        code: status.OK,
                        msg: 'Consulta correcta',
                        data: students
                    })
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error en la peticion',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    })

    //consulta por controlnumber estudihambre
    router.get('/:controlnumber', (req, res) => {
        const controlnumber = req.params.controlnumber;
        Student.findOne({ controlnumber: controlnumber })
            .then(
                (student) => {
                    if (student)
                        res.json({
                            code: status.OK,
                            msg: 'Consulta correcta',
                            data: student
                        });
                    else
                        res.status(status.NOT_FOUND).json({
                            code: status.NOT_FOUND,
                            msg: 'No se encontro el elemento'
                        });
                    }
                )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error en la peticion',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    })

    //actualizar
    router.put('/:controlnumber', (req, res) => {
        controlnumber = req.params.controlnumber;
        student = req.body;
        Student.findOneAndUpdate({ controlnumber: controlnumber }, student, { new: true })
            .then(
                (data) => {
                    console.log(data);
                    res.json({
                        code: status.OK,
                        msg: 'Se actualizo correctamente',
                        data: data
                    });
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST);
                    res.json({
                        code: status.BAD_REQUEST,
                        msg: 'Error en la aplicacion',
                        err: err.name,
                        detail: err.message
                    })
                }
            )
    })

//Eliminar
router.delete('/:controlnumber', (req, res) => {
        controlnumber = req.params.controlnumber;
        Student.findOneAndDelete({ controlnumber: controlnumber })
            .then(
                (data) => {
                    if (data)
                        res.json({
                            code: status.OK,
                            msg: 'Se elimino correctamente',
                            data: data
                        })
                    else
                        res.status(status.NOT_FOUND)
                            .json({
                                code: status.NOT_FOUND,
                                msg: 'No se encontro elemento'
                            })
                }
            )
            .catch(
                (err) => {
                    res.status(status.BAD_REQUEST)
                        .json({
                            code: status.BAD_REQUEST,
                            msg: 'Error en la peticion',
                            err: err.name,
                            detail: err.message
                        })
                }
            )
    })
    
//aprobado reprobado
router.post("/getAprobadosByCareer/", (req, res) => {
    Student.find({})
      .then((data) => {
        iscA = 0;
        imA = 0;
        igeA = 0;
        icA = 0;
        iscR = 0;
        imR = 0;
        igeR = 0;
        icR = 0;

        data.forEach((student, i) => {
          if (data[i].career === "ISC") {
            data[i].grade >= 70 ? iscA++ : iscR++;
          }
          if (data[i].career === "IM") {
            data[i].grade >= 70 ? imA++ : imR++;
          }
          if (data[i].career === "IGE") {
            data[i].grade >= 70 ? igeA++ : igeR++;
          }
          if (data[i].career === "IC") {
            data[i].grade >= 70 ? icA++ : icR++;
          }
        });

        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: [
            ["ISC", ["Aprobados: " + iscA, "Reprobados: " + iscR]],
            ["IM", ["Aprobados: " + imA, "Reprobados: " + imR]],
            ["IGE", ["Aprobados: " + igeA, "Reprobados: " + igeR]],
            ["IC", ["Aprobados: " + icA, "Reprobados: " + icR]],
          ],
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });


  //mujeres y hombres
  router.post("/getMujHomByCareer/", (req, res) => {
    Student.find({})
      .then((data) => {
        iscH = 0;
        imH = 0;
        igeH = 0;
        icH = 0;
        iscM = 0;
        imM = 0;
        igeM = 0;
        icM = 0;

        data.forEach((student, i) => {
          if ([...data[i].curp][10] === "H" && data[i].career === "ISC") {
            iscH++;
          }
          if ([...data[i].curp][10] === "M" && data[i].career === "ISC") {
            iscM++;
          }
          if ([...data[i].curp][10] === "H" && data[i].career === "IM") {
            imH++;
          }
          if ([...data[i].curp][10] === "M" && data[i].career === "IM") {
            imM++;
          }
          if ([...data[i].curp][10] === "H" && data[i].career === "IGE") {
            igeH++;
          }
          if ([...data[i].curp][10] === "M" && data[i].career === "IGE") {
            igeM++;
          }
          if ([...data[i].curp][10] === "H" && data[i].career === "IC") {
            icH++;
          }
          if ([...data[i].curp][10] === "M" && data[i].career === "IC") {
            icM++;
          }
        });

        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: [
            ["ISC", ["HOMBRES: " + iscH, "MUJERES: " + iscM]],
            ["IM", ["HOMBRES: " + imH, "MUJERES: " + imM]],
            ["IGE", ["HOMBRES: " + igeH, "MUJERES: " + igeM]],
            ["IC", ["HOMBRES: " + icH, "MUJERES: " + icM]],
          ],
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });


  //FORANEOS
  router.post("/getForaneos/", (req, res) => {
    Student.find({})
      .then((data) => {
        iscF = 0;
        imF = 0;
        igeF = 0;
        icF = 0;

        data.forEach((student, i) => {
          if ([...data[i].curp][11] !== "N" && [...data[i].curp][11] !== "T" && data[i].career === "ISC") {
            iscF++;
          }
          if ([...data[i].curp][11] !== "N" && [...data[i].curp][11] !== "T" && data[i].career === "IM") {
            imF++;
          }
          if ([...data[i].curp][11] !== "N" && [...data[i].curp][11] !== "T" && data[i].career === "IGE") {
            igeF++;
          }
          if ([...data[i].curp][11] !== "N" && [...data[i].curp][11] !== "T" && data[i].career === "IC") {
            icF++;
          }
        });

        res.json({
          code: status.OK,
          msg: "Consulta correcta",
          data: [
            ["ISC", ["HOMBRES: " + iscH, "MUJERES: " + iscM]],
            ["IM", ["HOMBRES: " + imH, "MUJERES: " + imM]],
            ["IGE", ["HOMBRES: " + igeH, "MUJERES: " + igeM]],
            ["IC", ["HOMBRES: " + icH, "MUJERES: " + icM]],
          ],
        });
      })
      .catch((err) => {
        res.status(status.BAD_REQUEST).json({
          code: status.BAD_REQUEST,
          msg: "Error en la petición",
          err: err.name,
          detail: err.message,
        });
      });
  });

    //MAYORES Y MENORES DE EDAD
    router.post("/getMayoresMenores/", (req, res) => {
        Student.find({})
          .then((data) => {
            iscMay = 0;
            imMay = 0;
            igeMay = 0;
            icMay = 0;
            iscMen = 0;
            imMen = 0;
            igeMen = 0;
            icMen = 0;  
            
            data.forEach((student, i) => {
                if (data[i].career === "ISC") {
                    [...data[i].curp][4] === "0" && parseInt([...data[i].curp][5]) > 3
                      ? iscMen++
                      : iscMay++;
                  }

                  if (data[i].career === "IM") {
                    [...data[i].curp][4] === "0" && parseInt([...data[i].curp][5]) > 3
                      ? imMen++
                      : imMay++;
                  }

                  if (data[i].career === "IGE") {
                    [...data[i].curp][4] === "0" && parseInt([...data[i].curp][5]) > 3
                      ? igeMen++
                      : igeMay++;
                  }

                  if (data[i].career === "IC") {
                    [...data[i].curp][4] === "0" && parseInt([...data[i].curp][5]) > 3
                      ? icMen++
                      : icMay++;
                  }
            });
    
            res.json({
              code: status.OK,
              msg: "Consulta correcta",
              data: [
                ["ISC", ["MAYORES: " + iscMay, "MENORES: " + iscMen]],
                ["IM", ["MAYORES: " + imMay, "MENORES: " + imMen]],
                ["IGE", ["MAYORES: " + igeMay, "MENORES: " + igeMen]],
                ["IC", ["MAYORES: " + icMay, "MENORES: " + icMen]],
              ],
            });
          })
          .catch((err) => {
            res.status(status.BAD_REQUEST).json({
              code: status.BAD_REQUEST,
              msg: "Error en la petición",
              err: err.name,
              detail: err.message,
            });
          });
      });

return router;}
