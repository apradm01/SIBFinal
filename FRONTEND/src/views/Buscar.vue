<template>

  <div class="buscar">

    <div v-if="verPerfil">

      <table class="table tabla-perfil">

        <tbody>
          <tr>
            <td>
            </td>
            <td>
                <b-img :src="image" fluid alt="Jugador"></b-img>
                <br>
                <br>
                {{this.jugadorPerfil.nombre}}
                <br>
                {{this.jugadorPerfil.equipo}}
                <br>
                {{this.jugadorPerfil.posicion}}
                <br>
                <br>
                <b-button
                variant="danger"
                v-b-tooltip.hover title="Puedes marcar este jugador como favorito."
                v-on:click="marcarComoFavorito">
                <i class="fas fa-heart"></i>
                </b-button>
            </td>
            <td>
            </td>
          </tr>

          <br>

          <tr>
            <td>
              Partidos Jugados: {{this.jugadorPerfil.partidosJugados}}
              <br>
              Partidos Enteros: {{this.jugadorPerfil.PartidosEnteros}}
              <br>
              Amarillas: {{this.jugadorPerfil.amarilla}}
              <br>
              Rojas: {{this.jugadorPerfil.rojadirecta}}
              <br>
              Segundas Amarillas: {{this.jugadorPerfil.segundaAmarilla}}
            </td>
            <td>
              <h3>Habilidad</h3>
              <br>
              Tiros: {{this.jugadorPerfil.tiros}}
              <br>
              Goles: {{this.jugadorPerfil.goles}}
              <br>
              Penaltis: {{this.jugadorPerfil.penalti}}
              <br>
              Propia puerta: {{this.jugadorPerfil.propiapuerta}}
            </td>
            <td>
              <br>
              <br>
                Tackles: {{this.jugadorPerfil.tackle}}
              <br>
                Intercepciones: {{this.jugadorPerfil.inteceptions}}
              <br>
                Recuperaciones: {{this.jugadorPerfil.recoveries}}
              <br>
                Despejes: {{this.jugadorPerfil.recoveries}}
              <br>
                Dribles: {{this.jugadorPerfil.dribles}}
    
              </td>
          </tr>
          <br>
          <tr>
            <td>
            </td>
            <td>
                <b-button
                variant="primary"
                v-b-tooltip.hover title="Vuelve a la secci??n de b??squeda pulsando aqu??."
                v-on:click="volverBusqueda">
                <i class="fas fa-undo-alt"></i>
                </b-button>
            </td>
            <td>
            </td>
          </tr>

          <br>
          <br>

          <tr>
            <td>
              <h3>Jugadores similares:</h3>
            </td>
          </tr>

          <br>

          <tr>
            <td>
              <b-img :src="image" fluid alt="Jugador"></b-img>
              <br>
              <br>
              {{this.jugadorPerfil.recomendados[0].nombre}} 
              <br>
              {{this.jugadorPerfil.recomendados[0].equipo}}
              <br>
              {{this.jugadorPerfil.recomendados[0].posicion}} 
              <br>
              <br>
              <b-button
              variant="danger"
              v-b-tooltip.hover title="Puedes visitar el perfil de este jugador."
              v-on:click="verPerfilSimilar(0)">
              Ver perfil
              </b-button>
            </td>
            <td>
              <b-img :src="image" fluid alt="Jugador"></b-img>
              <br>
              <br>
              {{this.jugadorPerfil.recomendados[1].nombre}}
              <br>
              {{this.jugadorPerfil.recomendados[1].equipo}}
              <br>
              {{this.jugadorPerfil.recomendados[1].posicion}} 
              <br>
              {{this.jugadorPerfil.recomendados[1].altura}} 
              <br>
              <br>
              <b-button
              variant="danger"
              v-b-tooltip.hover title="Puedes visitar el perfil de este jugador."
              v-on:click="verPerfilSimilar(1)">
              Ver perfil
              </b-button>
            </td>
            <td>
              <b-img :src="image" fluid alt="Jugador"></b-img>
              <br>
              <br>
              {{this.jugadorPerfil.recomendados[2].nombre}} 
              <br>
              {{this.jugadorPerfil.recomendados[2].equipo}}
              <br>
              {{this.jugadorPerfil.recomendados[2].posicion}} 
              <br>
              <br>
              <b-button
              variant="danger"
              v-b-tooltip.hover title="Puedes visitar el perfil de este jugador."
              v-on:click="verPerfilSimilar(2)">
              Ver perfil
              </b-button>
            </td>
          </tr>

        </tbody>
      </table>
    </div>

    <div v-else>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">

        <table class="table tabla-filtros">

          <!-- CARACTER??STICAS DE TODOS LOS JUGADORES-->

          <thead>
            <tr>
              <td>
                <h5>Caracter??sticas generales</h5>
              </td>
            </tr>
          </thead>

          <tbody>
            <tr>
              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Localizaci??n del jugador en el campo, por defecto buscar?? un potero."></i> Posici??n:
                <b-form-group id="input-group-0" label-for="input-0">
                  <b-form-select
                    id="input-0"
                    v-model="form.posicion"
                    :options="posiciones"
                    required
                  ></b-form-select>
                </b-form-group>
              </td>

              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Equipo del que se quiere buscar jugadores, por defecto no se especifica."></i> Equipo:
                <b-form-group id="input-group-1" label-for="input-0">
                  <b-form-select
                    id="input-0"
                    v-model="form.equipo"
                    :options="equipo"
                    required
                  ></b-form-select>
                </b-form-group>
              </td>

              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??nimo de partidos que tiene que haber jugado el jugador esta temporada. El programa seleccionar?? cualquiera mayor al n??mero seleccionado."></i> Partidos jugados: <br>{{ new Intl.NumberFormat("de-DE").format(form.partidosJugados) }}
                <b-form-group id="input-group-2" label-for="input-2">
                  <b-form-input id="input-2" v-model="form.partidosJugados" type="range" min="0" max="38" step="1"></b-form-input>
                </b-form-group>
              </td>
            </tr>
            <br>
            <tr>
              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??nimo de partidos que tiene que haber jugado el jugador esta temporada. El programa seleccionar?? cualquiera mayor al n??mero seleccionado."></i> Partidos Enteros: <br>{{ new Intl.NumberFormat("de-DE").format(form.partidosEnteros) }}
                <b-form-group id="input-group-3" label-for="input-3">
                  <b-form-input id="input-3" v-model="form.partidosEnteros" type="range" min="0" max="38" step="1"></b-form-input>
                </b-form-group>
              </td>

              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??ximo de amarillas que puede haber tenido el jugador esta temporada. El programa seleccionar?? cualquiera menor al n??mero seleccionado."></i> Amarillas: <br>{{ new Intl.NumberFormat("de-DE").format(form.amarilla) }}
                <b-form-group id="input-group-4" label-for="input-4">
                  <b-form-input id="input-4" v-model="form.amarilla" type="range" min="0" max="20" step="1"></b-form-input>
                </b-form-group>
              </td>

              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??ximo de rojas directas que puede haber tenido el jugador esta temporada. El programa seleccionar?? cualquiera menor al n??mero seleccionado."></i> Rojas Directas: <br>{{ new Intl.NumberFormat("de-DE").format(form.rojadirecta) }}
                <b-form-group id="input-group-5" label-for="input-5">
                  <b-form-input id="input-5" v-model="form.rojadirecta" type="range" min="0" max="10" step="1"></b-form-input>
                </b-form-group>
              </td>
            </tr>
            <br>
            <tr>
              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??ximo de dobles amarillas que puede haber tenido el jugador esta temporada. El programa seleccionar?? cualquiera menor al n??mero seleccionado."></i> Doble Amarilla: <br>{{ new Intl.NumberFormat("de-DE").format(form.segundaAmarilla) }}
                <b-form-group id="input-group-6" label-for="input-6">
                  <b-form-input id="input-6" v-model="form.segundaAmarilla" type="range" min="0" max="10" step="1"></b-form-input>
                </b-form-group>
              </td>

              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??nimo de tiros que puede haber tenido el jugador esta temporada. El programa seleccionar?? cualquiera mayor al n??mero seleccionado."></i> Tiros: <br>{{ new Intl.NumberFormat("de-DE").format(form.tiros) }}
                <b-form-group id="input-group-7" label-for="input-7">
                  <b-form-input id="input-7" v-model="form.tiros" type="range" min="0" max="100" step="5"></b-form-input>
                </b-form-group>
              </td>

              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??nimo de goles que puede haber tenido el jugador esta temporada. El programa seleccionar?? cualquiera mayor al n??mero seleccionado."></i> Goles: <br>{{ new Intl.NumberFormat("de-DE").format(form.goles) }}
                <b-form-group id="input-group-8" label-for="input-8">
                  <b-form-input id="input-8" v-model="form.goles" type="range" min="0" max="50" step="5"></b-form-input>
                </b-form-group>
              </td>

            </tr>
            <br>
            <tr>
                <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??nimo de penaltis que puede haber tenido el jugador esta temporada. El programa seleccionar?? cualquiera mayor al n??mero seleccionado."></i> Penaltis: <br>{{ new Intl.NumberFormat("de-DE").format(form.penalti) }}
                <b-form-group id="input-group-9" label-for="input-9">
                  <b-form-input id="input-9" v-model="form.penalti" type="range" min="0" max="10" step="1"></b-form-input>
                </b-form-group>
              </td>

                <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??ximo de goles en propia puerta que puede haber tenido el jugador esta temporada. El programa seleccionar?? cualquiera menor al n??mero seleccionado."></i> Propia puerta: <br>{{ new Intl.NumberFormat("de-DE").format(form.propiapuerta) }}
                <b-form-group id="input-group-10" label-for="input-10">
                  <b-form-input id="input-10" v-model="form.propiapuerta" type="range" min="0" max="5" step="1"></b-form-input>
                </b-form-group>
              </td>

              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??ximo de goles cedidos mientras el jugador est?? en el campo que puede haber tenido el jugador esta temporada. El programa seleccionar?? cualquiera menor al n??mero seleccionado."></i> Goles Cedidos: <br>{{ new Intl.NumberFormat("de-DE").format(form.golesCedidos) }}
                <b-form-group id="input-group-11" label-for="input-11">
                  <b-form-input id="input-11" v-model="form.golesCedidos" type="range" min="0" max="70" step="5"></b-form-input>
                </b-form-group>
              </td>
            </tr> 
            <br>
            <tr>
                <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??nimo de tackles que puede haber tenido el jugador esta temporada. El programa seleccionar?? cualquiera mayor al n??mero seleccionado."></i> Tackles: <br>{{ new Intl.NumberFormat("de-DE").format(form.tackle) }}
                <b-form-group id="input-group-12" label-for="input-12">
                  <b-form-input id="input-12" v-model="form.tackle" type="range" min="0" max="70" step="5"></b-form-input>
                </b-form-group>
              </td>

              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??nimo de intercepciones realizadas por el jugador. El programa seleccionar?? cualquiera mayor al n??mero seleccionado."></i> Intercepciones : <br>{{ new Intl.NumberFormat("de-DE").format(form.inteceptions) }}
                <b-form-group id="input-group-13" label-for="input-13">
                  <b-form-input id="input-13" v-model="form.inteceptions" type="range" min="0" max="70" step="5"></b-form-input>
                </b-form-group>
              </td>

              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??nimo de recuperaciones realizadas por el jugador. El programa seleccionar?? cualquiera mayor al n??mero seleccionado."></i> Recuperaciones : <br>{{ new Intl.NumberFormat("de-DE").format(form.recoveries) }}
                <b-form-group id="input-group-14" label-for="input-14">
                  <b-form-input id="input-14" v-model="form.recoveries" type="range" min="0" max="70" step="5"></b-form-input>
                </b-form-group>
              </td>
             </tr> 
             <br>
            <tr> 
                <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??nimo de despejes realizados por el jugador. El programa seleccionar?? cualquiera mayor al n??mero seleccionado."></i> Despejes : <br>{{ new Intl.NumberFormat("de-DE").format(form.clearances) }}
                <b-form-group id="input-group-15" label-for="input-15">
                  <b-form-input id="input-15" v-model="form.clearances" type="range" min="0" max="70" step="5"></b-form-input>
                </b-form-group>
              </td>

              <td>
                <i class="fas fa-info-circle" v-b-tooltip.hover title="Es el m??nimo de dribles realizados por el jugador. El programa seleccionar?? cualquiera mayor al n??mero seleccionado."></i> Dribles : <br>{{ new Intl.NumberFormat("de-DE").format(form.dribles) }}
                <b-form-group id="input-group-16" label-for="input-16">
                  <b-form-input id="input-16" v-model="form.dribles" type="range" min="0" max="70" step="5"></b-form-input>
                </b-form-group>
              </td>
            </tr> 
          </tbody>

          <br>            

          <thead>

            <!-- BOTONES -->

            <tr style="text-align:center;">
              <td>
                <ul class="list-unstyled list-inline">
                  <li class="list-inline-item">
                    <b-button type="submit" variant="primary">Buscar</b-button> 
                  </li>
                  <li class="list-inline-item">
                    <b-button type="reset" variant="danger">Reiniciar</b-button>
                  </li>
                </ul>
              </td>

              <td>
              </td>

              <td >
                <ul class="list-unstyled list-inline">
                  <li class="list-inline-item">
                    <b-button
                    variant="warning"
                    v-b-tooltip.hover title="Esta opci??n te recomendar?? jugadores similares seg??n la posici??n seleccionada y tus b??squedas anteriores."
                    v-on:click="recomendarSimilares">
                    Recomendar
                    </b-button>
                  </li>
                </ul>
              </td>
            </tr>
          </thead>
          <tbody>
            <tr>
            </tr>
          </tbody>

        </table>

      </b-form>

      <!-- RESULTADO DE LA B??SQUEDA -->

      <div id="texto-busqueda">Prueba a buscar alg??n jugador.</div>

      <div v-show="this.totalJugadores != 0">

        <b-table
        hover
        :fields="fields"
        :items="jugadores"
        id="tabla-resultados" 
        :per-page="perPage"
        :current-page="currentPage"
        sort-icon-left
        @row-clicked="verInfoJugador"
        ></b-table>

        <b-pagination
          v-show="this.totalJugadores > this.perPage"
          v-model="currentPage"
          :total-rows="totalJugadores"
          :per-page="perPage"
          aria-controls="tabla-resultados"
          align="right"
        ></b-pagination>
      </div>
    </div>
    <br>
  </div>

</template>

<script>

  import image from "@/assets/foto-perfil.jpeg"

  export default {
    data() {
      return {

        // INFORMACI??N DE LOS FILTROS

        form: {
          posicion: 'Goalkeeper',
          equipo: 'Empty',
          partidosJugados: '1',
          partidosEnteros: '1',
          amarilla: '10',
          rojadirecta: '2',
          segundaAmarilla: '2',
          tiros: '0',
          goles: '0',
          penalti: '0',
          propiapuerta: '5',
          golesCedidos: '70',
          tackle: '0',
          inteceptions: '0',
          recoveries: '0',
          clearances: '0',
          dribles: '0'
        },

        // PARA FILTRAR EN LA TABLA

        fields: [
          { key: 'nombre', sortable: true },
          { key: 'equipo', sortable: true },
          { key: 'partidosJugados', sortable: true },
          { key: 'partidosEnteros', sortable: true },
          { key: 'amarilla', sortable: true },
          { key: 'rojadirecta', sortable: true },
          { key: 'segundaAmarilla', sortable: true },
          { key: 'tiros', sortable: true },
          { key: 'goles', sortable: true },
          { key: 'penalti', sortable: true },
          { key: 'golesCedidos', sortable: true },
          { key: 'propiapuerta', sortable: true },
          { key: 'tackle', sortable: true }
        ],

        // PAGINACI??N PARA LA TABLA

        perPage: 7,
        currentPage: 1,

        // JUGADORES RECOMENDADOS POR EL SISTEMA

        totalJugadores: 0,
        jugadores: [],

        // POSICIONES DISPONIBLES PARA BUSCAR

        posiciones: [
          { text: 'Portero', value: 'Goalkeeper'},
          { text: 'Defensa', value: 'Defender'},
          { text: 'MedioCentro', value: 'Midfielder'},
          { text: 'Delantero', value: 'Forward'},
        ],
        
        // EQUIPOS DISPONIBLES PARA BUSCAR

        equipo: [
          { text: 'None', value: 'Empty'},
          { text: 'Athletic Club', value: 'Athletic Club'},
          { text: 'Atl??tico de Madrid', value: 'Atl??tico de Madrid'},
          { text: 'CD Legan??s', value: 'CD Legan??s'},
          { text: 'D. Alav??s', value: 'D. Alav??s'},
          { text: 'FC Barcelona', value: 'FC Barcelona'},
          { text: 'Getafe CF', value: 'Getafe CF'},
          { text: 'Girona FC', value: 'Girona FC'},
          { text: 'Levante UD', value: 'Levante UD'},
          { text: 'R. Valladolid CF', value: 'R. Valladolid CF'},
          { text: 'Rayo Vallecano', value: 'Rayo Vallecano'},
          { text: 'RC Celta', value: 'RC Celta'},
          { text: 'RCD Espanyol', value: 'RCD Espanyol'},
          { text: 'Real Betis', value: 'Real Betis'},
          { text: 'Real Madrid', value: 'Real Madrid'},
          { text: 'Real Sociedad', value: 'Real Sociedad'},
          { text: 'SD Eibar', value: 'SD Eibar'},
          { text: 'SD Huesca', value: 'SD Huesca'},
          { text: 'Sevilla FC', value: 'Sevilla FC'},
          { text: 'Valencia CF', value: 'Valencia CF'},
          { text: 'Villarreal CF', value: 'Villarreal CF'}
        ],

        valoresBusqueda: [
          { text: 'Sin definir', value: '0'},
          { text: 'Bajo, medio y alto', value: '25'},
          { text: 'Medio y alto', value: '50'},
          { text: 'Alto', value: '75'}
        ],
        show: true,

        // JUGADOR PERFIL

        verPerfil: false,
        jugadorPerfil: [],
        image: image
      }
    },
    methods: {

      // ENVIAR PETICI??N AL SERVIDOR

      async onSubmit(event) {
        event.preventDefault();

        // CAMBIAR TEXTO DE BUSCANDO

        if(this.totalJugadores == 0) {
          document.getElementById('texto-busqueda').innerHTML = 'Buscando jugadores...';
        }

        // ENVIA PETICI??N

        const respuesta = await fetch('http://localhost:3000/buscarJugador', {
          method: 'POST',
          body: JSON.stringify(this.form),
          headers: {
            'Content-Type': 'application/json'
          },
        });

        var response = await respuesta.json();
        this.totalJugadores = response.length;

        if(this.totalJugadores != 0) {
          this.jugadores = response;

          document.getElementById('texto-busqueda').innerHTML = 'Resultados totales: '+this.totalJugadores;

        } else {
          document.getElementById('texto-busqueda').innerHTML = 'Sin resultados..';
        }
      },

      // REINICIAR B??SQUEDA

      onReset(event) {
        event.preventDefault();

        // RESTEAR TEXTO

        document.getElementById('texto-busqueda').innerHTML = 'Prueba a buscar alg??n jugador.';

        // BORRAR LISTA DE JUGADORES BUSCADOS

        this.totalJugadores = 0;

        // REINICIAR VALORES GENERALES
        this.form.equipo = 'Empty';
        this.form.posicion = 'Goalkeeper';
        this.form.partidosJugados = '1';
        this.form.partidosEnteros = '1';
        this.form.amarilla = '10';
        this.form.rojadirecta = '2';
        this.form.tiros = '0';
        this.form.goles = '0';
        this.form.penalti = '0';
        this.form.segundaAmarilla = '2';
        this.form.propiapuerta = '5';
        this.form.golesCedidos = '70';
        this.form.tackle = '0';
        this.form.inteceptions = '0';
        this.form.recoveries = '0';
        this.form.clearances = '0';
        this.form.dribles = '0';

        // Trick to reset/clear native browser form validation state
        this.show = false;
        this.$nextTick(() => {
          this.show = true
        })
      },

      // RECOMIENDA UN JUGADOR

      async recomendarSimilares() {

        // ENVIA PETICI??N

        const respuesta = await fetch('http://localhost:3000/recomendarSimilares', {
          method: 'POST',
          body: JSON.stringify({ posicion: this.form.posicion, usuario: 'Alonsez' }),
          headers: {
            'Content-Type': 'application/json'
          },
        });

        var response = await respuesta.json();
        this.totalJugadores = response.length;

        if(this.totalJugadores != 0) {
          this.jugadores = response;

          document.getElementById('texto-busqueda').innerHTML = 'Resultados totales: '+this.totalJugadores;

        } else {
          document.getElementById('texto-busqueda').innerHTML = 'Visita los perfiles de los jugadores para poder hacerte alguna recomendaci??n.';
        }
      },

      // AL HACER CLICK EN UNA FILA DE LA TABLA DE JUGADORES RECOMENDADOS

      async verInfoJugador(item) {

        // OBTENEMOS EL NOMBRE DEL JUGADOR DE LA TABLA
        var jugadorNombre = item.nombre;
        var jugadorPosicion = this.form.posicion;

        // ENVIA PETICI??N

        const respuesta = await fetch('http://localhost:3000/infoJugador', {
          method: 'POST',

          body: JSON.stringify({
            nombre: jugadorNombre,
            usuario: 'Alonsez',
            posicion: jugadorPosicion
          }),

          headers: {
            'Content-Type': 'application/json'
          },
        });

        var response = await respuesta.json();

        this.verPerfil = true;
        this.jugadorPerfil = response;

        setTimeout(() => { document.documentElement.scrollTop = 0; }, 200);
      },

      // REGRESAR A LA B??SQUEDA DE JUGADORES

      volverBusqueda() {
        this.verPerfil = false;
        this.jugadorPerfil = [];

        document.documentElement.scrollTop = 0;
      },

      //

      async marcarComoFavorito() {

        // OBTENEMOS EL NOMBRE DEL JUGADOR DE LA TABLA
        var jugadorNombre = this.jugadorPerfil.nombre;

        // ENVIA PETICI??N
        const respuesta = await fetch('http://localhost:3000/addFavorito', {
          method: 'POST',
          body: JSON.stringify({ jugador: jugadorNombre, usuario: 'Alonsez' }),
          headers: {
            'Content-Type': 'application/json'
          },
        });

        var response = await respuesta.json();

        // MENSAJE DE QUE SE HA A??ADIDO CORRECTAMENTE
        if(response.correcto == true) {

          this.$bvModal.msgBoxOk('Se ha a??adido el jugador a favoritos', {
            title: 'Confirmaci??n',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'success',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true
          });
        }
      },

      // MOSTRAR EL PERFIL DE UN JUGADOR SIMILAR

      async verPerfilSimilar(id) {

        // OBTENEMOS LA INFORMACI??N
        var jugadorNombre = this.jugadorPerfil.recomendados[id].nombre;
        var jugadorPosicion = this.form.posicion;

        // ENVIA PETICI??N

        const respuesta = await fetch('http://localhost:3000/infoJugador', {
          method: 'POST',

          body: JSON.stringify({
            nombre: jugadorNombre,
            usuario: 'Alonsez',
            posicion: jugadorPosicion
          }),

          headers: {
            'Content-Type': 'application/json'
          },
        });

        var response = await respuesta.json();

        this.verPerfil = true;
        this.jugadorPerfil = response;

        document.documentElement.scrollTop = 0;
      }
    }
  }
</script>

<style scoped>

thead {
  text-align: left;
}

.tabla-filtros {
  color:white;
}

.tabla-filtros td {
  border-bottom:0px !important;
}

#texto-busqueda {
  text-align: left; 
  color: white;
  font-weight: bold;
}

#tabla-resultados {
  background-color: lightgrey;
  text-align: left;
}

.img-fluid {
  width: 10%;
  height: 10%;
}

.tabla-perfil {
  color: white;
  font-weight: bold;
}

.tabla-perfil td {
  border-bottom:0px !important;
}

#caja {
}

.bp3-tag {
	display: -ms-inline-flexbox;
	display: inline-flex;
	-webkit-box-orient: horizontal;
	-webkit-box-direction: normal;
	-ms-flex-direction: row;
	flex-direction: row;
	-webkit-box-align: center;
	-ms-flex-align: center;
	align-items: center;
	position: relative;
	border: 0;
	min-width: 1rem;
	max-width: 100%;
	min-height: 1rem;
	padding: 0 .3rem;
	line-height: 1.3rem;
	text-transform: uppercase
}


.p {
	min-width: 7rem;
	text-align: center;
	justify-content: center;
  background: green;
	padding-top: 0;
	padding-bottom: 0
}
</style>
