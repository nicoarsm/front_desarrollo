import React, { useState, useEffect } from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import MaterialDatatable from "material-datatable";
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2)

    },
    delete: {
        backgroundColor: "red"
    }

}));


export default function Prestamo() {
    const classes = useStyles();

    const { register, handleSubmit, errors, getValues, setValue, reset } = useForm();

    const [contador, setContador] = useState(0)
    const [prestamos, setPrestamo] = useState([])
    const [libros, setLibro] = useState([])
    const [personas, setPersona] = useState([])
    const [accion, setAccion] = useState("Guardar")
    const [idPrestamo, setIdPrestamo] = useState(null);
    const [personaSelect, setPersonaSelect] = useState();
    const [libroSelect, setLibroSelect] = useState();

    useEffect(() => {
        cargarPrestamo();
        cargarLibro();
        cargarPersona();
    }, []);

    const seleccionar = (item) => {
        setValue("codigo", item.codigo)
        setValue("nombre", item.nombre)
        setIdPrestamo(item._id)
        setAccion("Modificar")
    }
    const columns = [
        {
            name: "Seleccionar",
            options: {
                headerNoWrap: true,
                customBodyRender: (item, tablemeta, update) => {
                    return (
                        <Button
                            variant="contained"
                            className="btn-block"
                            onClick={() => seleccionar(item)}
                        >
                            Seleccionar
                        </Button>
                    );
                },
            },
        },
        {
            name: 'Libro',
            field: 'libro'
        },
        {
            name: 'Persona',
            field: 'persona'
        },
        {
            name: 'Fecha',
            field: 'fecha'
        }
    ];

    const options = {
        selectableRows: false,
        print: false,
        onlyOneRowCanBeSelected: false,
        textLabels: {
            body: {
                noMatch: "Lo sentimos, no se encuentran registros",
                toolTip: "Sort",
            },
            pagination: {
                next: "Siguiente",
                previous: "Página Anterior",
                rowsPerPage: "Filas por página:",
                displayRows: "de",
            },
        },
        download: false,
        pagination: true,
        rowsPerPage: 5,
        usePaperPlaceholder: true,
        rowsPerPageOptions: [5, 10, 25],
        sortColumnDirection: "desc",
    }
    const onSubmit = data => {
        if (accion == "Guardar") {
            let today = new Date();
            if (typeof personaSelect === 'undefined') {
                alert("No se seleccionó una persona");
                return;
            }
            if (typeof libroSelect === 'undefined') {
                alert("No se seleccionó un libro");
                return;
            }
            data.idPersona = personaSelect;
            data.libro = libroSelect;
            data.fecha = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
            console.log(data);
            axios
                .post("http://localhost:9000/api/prestamo", data, {
                    headers: {
                        Accept: '*/* '
                    }
                })
                .then(
                    (response) => {
                        console.log(response.data);
                        if (response.status == 200) {
                            alert("Registro ok")
                            cargarPrestamo();
                            reset();
                        }
                    },
                    (error) => {
                        // Swal.fire(
                        //   "Error",
                        //   "No es posible realizar esta acción: " + error.message,
                        //   "error"
                        // );
                    }
                )
                .catch((error) => {
                    // Swal.fire(
                    //   "Error",
                    //   "No cuenta con los permisos suficientes para realizar esta acción",
                    //   "error"
                    // );
                    console.log(error);
                });
        }
        if (accion == "Modificar") {
            axios
                .put("http://localhost:9000/api/prestamo/" + idPrestamo, data)
                .then(
                    (response) => {
                        if (response.status == 200) {
                            alert("Modificado")
                            cargarPrestamo();
                            reset();
                            setIdPrestamo(null)
                            setAccion("Guardar")
                            console.log(response.data)
                        }
                    },
                    (error) => {
                        // Swal.fire(
                        //   "Error",
                        //   "No es posible realizar esta acción: " + error.message,
                        //   "error"
                        // );
                    }
                )
                .catch((error) => {
                    // Swal.fire(
                    //   "Error",
                    //   "No cuenta con los permisos suficientes para realizar esta acción",
                    //   "error"
                    // );
                    console.log(error);
                });
        }

    }

    const eliminar = () => {
        if (idPrestamo == null) {
            alert("Debe seleccionar un prestamo")
            return
        }
        axios
            .delete("http://localhost:9000/api/prestamo/" + idPrestamo)
            .then(
                (response) => {
                    if (response.status == 200) {
                        cargarPrestamo();
                        reset();
                        setIdPrestamo(null)
                        setAccion("Guardar")
                        console.log(response.data)
                        alert("Eliminado")
                    }
                },
                (error) => {
                    // Swal.fire(
                    //   "Error",
                    //   "No es posible realizar esta acción: " + error.message,
                    //   "error"
                    // );
                }
            )
            .catch((error) => {
                // Swal.fire(
                //   "Error",
                //   "No cuenta con los permisos suficientes para realizar esta acción",
                //   "error"
                // );
                console.log(error);
            });
    }

    const cargarPrestamo = async () => {
        const { data } = await axios.get("http://localhost:9000/api/prestamo");
        setPrestamo(data.resultado);
    };

    const cargarLibro = async () => {
        const { data } = await axios.get("http://localhost:9000/api/libroautor");
        setLibro(data.libroConAutor);
    };

    const cargarPersona = async () => {
        const { data } = await axios.get("http://localhost:9000/api/personas");
        setPersona(data.persona);
    };

    function click2() {
        setContador(contador + 1);
    }
    return (
        <Container component="main" maxWidth="md">
            <CssBaseline />
            <div className={classes.paper}>
                <Button
                    type="button"
                    fullWidth
                    variant="contained"
                    className={classes.submit}
                    onClick={() => { reset(); setAccion("Guardar"); setIdPrestamo(null) }}
                >
                    Nuevo
          </Button>
                <Typography component="h1" variant="h5">
                    Prestamo - Contador: {contador}
                </Typography>
                <form className={classes.form} onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Select
                                id="libro"
                                label="Libro"
                                name="libro"
                                displayEmpty
                                onChange={(e) => {
                                    setLibroSelect(e.target.value);
                                }}
                            >
                                <MenuItem disabled>
                                    <em>Debe elegir un libro</em>
                                </MenuItem>
                                {libros.map((libro) =>
                                    <MenuItem value={libro._id}>{libro.nombre}</MenuItem>
                                )}
                            </Select>
                        </Grid>
                        <Grid item xs={12}>
                            <Select
                                id="persona"
                                label="Persona"
                                name="persona"
                                displayEmpty
                                onChange={(e) => {
                                    setPersonaSelect(e.target.value);
                                }}
                            >
                                <MenuItem disabled>
                                    <em>Debe elegir una persona</em>
                                </MenuItem>
                                {personas.map((persona) =>
                                    <MenuItem value={persona._id}>{persona.nombre + " " + persona.apellido}</MenuItem>
                                )}
                            </Select>
                        </Grid>
                    </Grid>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                        onClick={() => { }}
                    >
                        {accion}
                    </Button>
                    <Button
                        type="button"
                        fullWidth
                        variant="contained"
                        color="secondary"
                        className={classes.delete}
                        onClick={() => { eliminar() }}
                    >
                        Eliminar
                    </Button>
                    <Grid container spacing={1}>
                        <MaterialDatatable

                            title={"Prestamos"}
                            //data={prestamos}
                            columns={columns}
                            options={options}
                        />
                    </Grid>
                </form>
            </div>
        </Container>
    );
}