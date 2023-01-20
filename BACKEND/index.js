const express = require('express');
const app = express();

const cors = require('cors');

// Funciones útiles

const utils = require('./utils.js');

// NEO4J

const neo4j = require('./conexionDB.js');

// Configuraciones

app.set('port', 3000);

// Middlewares

app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cors());

//

app.get('', (req, res) => {
    res.send("Hola");
});

// DIRECCIÓN PARA BUSCAR UN JUGADOR SEGÚN LA SELECCIÓN EN LOS FILTROS
app.post('/buscarJugador', (req, res) => {

    // LEEMOS LOS VALORES

    var posicion = req.body.posicion;
    var equipo = req.body.equipo;
    var partidosJugados = req.body.partidosJugados;
    var partidosEnteros = req.body.partidosEnteros;
    var amarilla = req.body.amarilla;
    var rojadirecta = req.body.rojadirecta;
    var segundaAmarilla = req.body.segundaAmarilla;
    var tiros = req.body.tiros;
    var goles = req.body.goles;
    var penalti = req.body.penalti;
    var propiapuerta = req.body.propiapuerta;
    var golesCedidos = req.body.golesCedidos;
    var tackle = req.body.tackle;
    var inteceptions = req.body.inteceptions;
    var recoveries = req.body.recoveries;
    var clearances = req.body.clearances;
    var dribles = req.body.dribles;

    // CREAMOS LA PETICIÓN

    var query = 'MATCH (j:Jugador) ';

    query += 'WHERE ';
    
    // POSICION
    query += 'j.posicion = \''+posicion+ '\' ';
    
    // PARTIDOS JUGADOS
    query += ' AND j.partidosJugados >= '+partidosJugados+' ';
    
    // EQUIPO
    if(equipo != 'Empty') {
    query += ' AND j.equipo = \''+equipo+ '\' ';
    }
    
    // PARTIDOS ENTEROS
    query += ' AND j.partidosEnteros >= '+partidosEnteros+' ';
    
     // AMARILLAS
    query += ' AND j.amarilla <= '+amarilla+' ';
    
    // ROJA DIRECTA
    query += ' AND j.rojadirecta <= '+rojadirecta+' ';
    
    // SEGUNDA AMARILLA
    query += ' AND j.segundaAmarilla <= '+segundaAmarilla+' ';

    // TIROS
    query += ' AND j.tiros >= '+tiros+' ';
    
    // GOLES
    query += ' AND j.goles >= '+goles+' ';
    
    // PENALTIS
    query += ' AND j.penalti >= '+penalti+' ';
    
    // PROPIA PUERTA
    query += ' AND j.propiapuerta <= '+propiapuerta+' ';
    
    // GOLES CEDIDOS
    query += ' AND j.golesCedidos <= '+golesCedidos+' ';
    
    // TACKLES
    query += ' AND j.tackle >= '+tackle+' ';
    
    // INTERCEPTIONS
    query += ' AND j.inteceptions >= '+inteceptions+' ';
    
    // RECOVERIES
    query += ' AND j.recoveries >= '+recoveries+' ';
    
    // CLEARANCES
    query += ' AND j.clearances >= '+clearances+' ';
    
    // DRIBLES
    query += ' AND j.dribles >= '+dribles+' ';

    // DEVOLVER LOS JUGADORES
    query += ' RETURN j;';

    // PROCESAMOS LA PETICIÓN
    neo4j.run(query)

    .then(results => {

        // ARRAY QUE VAMOS A DEVOLVER CON LOS JUGADORES OBTENIDOS
        var jugadores = [];

        // SI NO HAY NINGUNA COINCIDENCIA LO DEVUELVE VACIO
        if(results.records.length == 0) {
            res.json(jugadores);
            return;
        }

        // SI HAY ALGUNA COINCIDENCIA VA RELENANDO EL ARRAY CON LOS DATOS QUE QUEREMOS MOSTRAR
        results.records.forEach(function(record) { 
		
            var jugador = {

                // CARACTERÍSTICAS DE LOS JUGADORES

                nombre: record._fields[0].properties.nombre,
                equipo: record._fields[0].properties.equipo,
                partidosJugados: record._fields[0].properties.partidosJugados,
                partidosEnteros: record._fields[0].properties.partidosEnteros,
                amarilla: record._fields[0].properties.amarilla,
                rojadirecta: record._fields[0].properties.rojadirecta,
                segundaAmarilla: record._fields[0].properties.segundaAmarilla,
                tiros: record._fields[0].properties.tiros,
                goles: record._fields[0].properties.goles,
                penalti: record._fields[0].properties.penalti,
                propiapuerta: record._fields[0].properties.propiapuerta,
                golesCedidos: record._fields[0].properties.golesCedidos,
                tackle: record._fields[0].properties.tackle,
                inteceptions: record._fields[0].properties.inteceptions,
                recoveries: record._fields[0].properties.recoveries,
                clearances: record._fields[0].properties.clearances,
                dribles: record._fields[0].properties.dribles      
            };
            jugadores.push(jugador);
        })
        
        // DEVUELVE EL ARRAY PARA MOSTRARLO
        res.json(jugadores);
    })
    .catch(error => {
        console.log(error);
    });
});



// DIRECCIÓN PARA RECOMENDAR JUGADORES SIMILARES SEGÚN BÚSQUEDAS ANTERIORES
app.post('/recomendarSimilares', (req, res) => {

    // OBTENEMOS LOS VALORES DE LA PETICIÓN

    var posicion = req.body.posicion;
    var usuario = req.body.usuario;

    // CREAMOS LA PETICIÓN
    var query = 'MATCH (j:Jugador) WHERE j.posicion = \''+posicion+ '\' ';

    // COMPROBAMOS QUE HAYA UNA RELACIÓN DE QUE EL USUARIO YA HA VISITADO EL PERFIL DEL JUGADOR
    query += 'MATCH (u:Usuario)-[v:VISITA_PERFIL]->(j) WHERE u.nombre = \''+usuario+'\' ';

    // ORDENAMOS SEGÚN SE HA VISITADO MÁS VECES
    query += 'RETURN j.nombre ORDER BY v.veces DESC LIMIT 1;'

    // PROCESAMOS LA PETICIÓN
    neo4j.run(query)

    .then(results => {

        // ARRAY QUE VAMOS A DEVOLVER CON LOS JUGADORES OBTENIDOS
        var jugadores = [];

        // SI NO HAY NINGUNA COINCIDENCIA LO DEVUELVE VACIO
        if(results.records.length == 0) {
            res.json(jugadores);
            return;
        }

        // SI HAY ALGUNA COINCIDENCIA VAMOS A BUSCAR JUGADORES SIMILARES
        var queryRecomendados = 'MATCH (j1:Jugador {nombre: \''+ results.records[0]._fields +'\'}) ';

        queryRecomendados += 'MATCH (j2:Jugador) WHERE j2.posicion = \''+posicion+ '\' ';
        //queryRecomendados += 'WHERE j1 <> j2 ';

        // ATRIBUTOS SEGÚN LA POSICIÓN
        if(posicion == 'Goalkeeper') { // PORTERO
            queryRecomendados += 'WITH j1, j2, \
            gds.alpha.similarity.euclideanDistance([j1.partidosJugados, j1.partidosEnteros, j1.rojadirecta, j1.propiapuerta, j1.golesCedidos], \
            [j2.partidosJugados, j2.partidosEnteros, j2.rojadirecta, j2.propiapuerta, j2.golesCedidos]) AS similitud '

        } else if(posicion == 'Defender') { // DEFENSA 
            queryRecomendados += 'WITH j1, j2, \
            gds.alpha.similarity.euclideanDistance([j1.partidosJugados, j1.partidosEnteros, j1.rojadirecta, j1.propiapuerta, j1.amarilla, j1.segundaAmarilla, j1.tackle, j1.inteceptions, j1.recoveries, j1.clearances], \
                [j2.partidosJugados, j2.partidosEnteros, j2.rojadirecta, j2.propiapuerta, j2.amarilla, j2.segundaAmarilla, j2.tackle, j2.inteceptions, j2.recoveries, j2.clearances]) AS similitud '

        } else if(posicion == 'Midfielder') { // MEDIOCENTRO
            queryRecomendados += 'WITH j1, j2, \
            gds.alpha.similarity.euclideanDistance([j1.partidosJugados, j1.partidosEnteros, j1.rojadirecta, j1.propiapuerta, j1.amarilla, j1.segundaAmarilla, j1.tackle, j1.goles, j1.recoveries, j1.dribles, j1.penalti], \
                [j2.partidosJugados, j2.partidosEnteros, j2.rojadirecta, j2.propiapuerta, j2.amarilla, j2.segundaAmarilla, j2.tackle, j2.goles, j2.recoveries, j2.dribles, j2.penalti]) AS similitud '

        } else if(posicion == 'Forward') { // DELANTERO
            queryRecomendados += 'WITH j1, j2, \
            gds.alpha.similarity.euclideanDistance([j1.partidosJugados, j1.partidosEnteros, j1.rojadirecta, j1.segundaAmarilla, j1.goles, j1.penalti], \
                [j2.partidosJugados, j2.partidosEnteros, j2.rojadirecta, j2.segundaAmarilla, j2.goles, j2.penalti]) AS similitud '

        }

        queryRecomendados += 'RETURN j2 ';
        queryRecomendados += 'ORDER BY similitud LIMIT 7;';

        // PROCESAMOS LA PETICIÓN
        neo4j.run(queryRecomendados)
    
        .then(results => {

            // SI HAY ALGUNA COINCIDENCIA VA RELENANDO EL ARRAY CON LOS DATOS QUE QUEREMOS MOSTRAR
            results.records.forEach(function(record) { 

                var jugador = {

                    // CARACTERÍSTICAS GENERALES DE LOS JUGADORES
    
                	nombre: record._fields[0].properties.nombre,
                	equipo: record._fields[0].properties.equipo,
                	partidosJugados: record._fields[0].properties.partidosJugados,
                	partidosEnteros: record._fields[0].properties.partidosEnteros,
                	amarilla: record._fields[0].properties.amarilla,
                	rojadirecta: record._fields[0].properties.rojadirecta,
                	segundaAmarilla: record._fields[0].properties.segundaAmarilla,
                	tiros: record._fields[0].properties.tiros,
                	goles: record._fields[0].properties.goles,
                	penalti: record._fields[0].properties.penalti,
                	propiapuerta: record._fields[0].properties.propiapuerta,
                	golesCedidos: record._fields[0].properties.golesCedidos,
                	tackle: record._fields[0].properties.tackle,
                	inteceptions: record._fields[0].properties.inteceptions,
                	recoveries: record._fields[0].properties.recoveries,
                	clearances: record._fields[0].properties.clearances,
                	dribles: record._fields[0].properties.dribles
                };
                jugadores.push(jugador);
            });

            // DEVUELVE EL ARRAY PARA MOSTRARLO
            res.json(jugadores);
        })
        .catch(error => {
            console.log(error);
        });
    })
    .catch(error => {
        console.log(error);
    });
});

// DIRECCIÓN DONDE SE DEVOLVERÁ INFORMACIÓN MÁS ESPECÍFICA DEL JUGADOR
app.post('/infoJugador', (req, res) => {

    // OBTENEMOS LOS VALORES DE LA PETICIÓN
    var jugador = req.body.nombre;
    var usuario = req.body.usuario;
    var posicion = req.body.posicion;

    // BUSCAMOS EL USUARIO
    var queryVisitaPerfil = 'MATCH (u:Usuario { nombre: \''+usuario+'\' }) ';

    // BUSCAMOS EL JUGADOR
    queryVisitaPerfil += 'MATCH (j:Jugador { nombre: \''+jugador+'\' }) ';

    // CREAMOS RELACIÓN
    queryVisitaPerfil += 'MERGE (u)-[v:VISITA_PERFIL]->(j) ';

    // CREA LA RELACIÓN SI NO EXISTE
    queryVisitaPerfil += 'ON CREATE SET v.veces = 1 ';
    
    // ACTUALIZA LA RELACIÓN
    queryVisitaPerfil += 'ON MATCH SET v.veces = v.veces + 1;';

    // PROCESAMOS LA PETICIÓN
    neo4j.run(queryVisitaPerfil)
    
    .then(results => {

        // CONEXIÓN PARA VISITAR EL PERFIL DEL JUGADOR
        var queryVerPerfil = 'MATCH (j:Jugador { nombre: \''+jugador+'\'}) RETURN j;';

        // PROCESAMOS LA PETICIÓN
        neo4j.run(queryVerPerfil)

        .then(results => {

            var recomendar = '';

            // TODA LA INFORMACIÓN DEL JUGADOR

            var jugador = {

                // CARACTERÍSTICAS GENERALES DE LOS JUGADORES

                nombre: record._fields[0].properties.nombre,
                equipo: record._fields[0].properties.equipo,
                partidosJugados: record._fields[0].properties.partidosJugados,
                partidosEnteros: record._fields[0].properties.partidosEnteros,
                amarilla: record._fields[0].properties.amarilla,
                rojadirecta: record._fields[0].properties.rojadirecta,
                segundaAmarilla: record._fields[0].properties.segundaAmarilla,
                tiros: record._fields[0].properties.tiros,
                goles: record._fields[0].properties.goles,
                penalti: record._fields[0].properties.penalti,
                propiapuerta: record._fields[0].properties.propiapuerta,
                golesCedidos: record._fields[0].properties.golesCedidos,
                tackle: record._fields[0].properties.tackle,
                inteceptions: record._fields[0].properties.inteceptions,
                recoveries: record._fields[0].properties.recoveries,
                clearances: record._fields[0].properties.clearances,
                dribles: record._fields[0].properties.dribles,


                // ATRIBUTOS ESPECÍFICOS

                // JUGADORES SIMILARES

                recomendados: []
            };

            // JUGADORES SIMILARES

            var queryRecomendados = 'MATCH (j1:Jugador {nombre: \''+jugador.nombre+'\'})-[:TIENE]->(skill1) ';

            queryRecomendados += 'WITH j1, collect(id(skill1)) AS j1Skill ';
            queryRecomendados += 'MATCH (j2:Jugador) WHERE j2.posicion = \''+posicion+ '\' ';

            queryRecomendados += 'MATCH (j2)-[:TIENE]->(skill2) WHERE j1 <> j2 ';
            queryRecomendados += 'WITH j2, gds.alpha.similarity.jaccard(j1Skill, collect(id(skill2))) AS similitud ';
            queryRecomendados += 'RETURN j2 ORDER BY similitud DESC LIMIT 3;';

            // PROCESAMOS PETICIÓN PARA ENVIAR JUGADORES SIMILARES
            neo4j.run(queryRecomendados)

            .then(results => {

                // GUARDAR INFORMACIÓN DE LOS JUGADORES SIMILARES
                results.records.forEach(function(record) { 


                    var similar = {
                        nombre: record._fields[0].properties.nombre,
                        posicion: record._fields[0].properties.posicion,
                        equipo: record._fields[0].properties.equipo,
                    };
                    jugador.recomendados.push(similar);
                });

                // ENVIAMOS LA INFORMACIÓN
                res.json(jugador);
            })
            .catch(error => {
                console.log(error);
            });
        })
        .catch(error => {
            console.log(error);
        });
    })
    .catch(error => {
        console.log(error);
    });;
});

// DIRECCIÓN PARA ELIMINAR TODAS TUS BÚSQUEDAS Y FAVORITOS
app.post('/borrarBusquedas', (req, res) => {

    var usuario = req.body.usuario;
    var query = 'MATCH (u:Usuario { nombre: \''+usuario+'\' })-[v:VISITA_PERFIL]->(j:Jugador) ';
    query += 'DELETE v '
    query += 'WITH u ';
    query += 'MATCH (u)-[l:LIKES]->(j:Jugador) ';
    query += 'DELETE l;'
    neo4j.run(query)

    .then(results => {
        res.json( { correcto: true } );
    })
    .catch(error => {
        console.log(error);
    });
});

// DIRECCIÓN CUANDO UN USUARIO MARCA COMO FAVORITO A UN JUGADOR
app.post('/addFavorito', (req, res) => {
    var usuario = req.body.usuario;
    var jugador = req.body.jugador;
    var query = 'MATCH (u:Usuario { nombre: \''+usuario+'\' }) ';
    query += 'MATCH (j:Jugador { nombre: \''+jugador+'\' }) ';
    query += 'MERGE (u)-[l:LIKES]->(j) RETURN l;';
    neo4j.run(query)

    .then(results => {
        res.json( { correcto: true } );
    })
    .catch(error => {
        console.log(error);
    });
});

// DIRECCIÓN PARA VER TUS JUGADORES FAVORITOS
app.post('/verFavorito', (req, res) => {

    // OBTENEMOS LOS VALORES DE LA PETICIÓN
    var usuario = req.body.usuario;

    // BUSCAMOS EL USUARIO
    var query = 'MATCH (u:Usuario { nombre: \''+usuario+'\' })-[:LIKES]->(j:Jugador) ';

    query += 'RETURN j.nombre, j.equipo, j.posicion;'

    // PROCESAMOS LA PETICIÓN
    neo4j.run(query)

    .then(results => {
  
        // ARRAY QUE VAMOS A DEVOLVER CON LOS JUGADORES OBTENIDOS
        var jugadores = [];

        // SI NO HAY NINGUNA COINCIDENCIA LO DEVUELVE VACIO
        if(results.records.length == 0) {
            res.json(jugadores);
            return;
        }

        // SI HAY ALGUNA COINCIDENCIA VA RELENANDO EL ARRAY CON LOS DATOS QUE QUEREMOS MOSTRAR
        results.records.forEach(function(record) { 

            var jugador = {

                // CARACTERÍSTICAS GENERALES DE LOS JUGADORES

                nombre: record._fields[0],
                posicion: record._fields[2],
                equipo: record._fields[1],
            };
            jugadores.push(jugador);
        });

        // DEVUELVE EL ARRAY PARA MOSTRARLO
        res.json(jugadores);      
    })
    .catch(error => {
        console.log(error);
    });
});



// INICIAR EL SERVIDOR
app.listen(app.get('port'), () => {
    console.log('Servidor abierto en puerto', app.get('port'));
});
