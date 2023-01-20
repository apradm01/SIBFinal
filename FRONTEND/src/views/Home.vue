<template>
  <div id="home">
    <b-img :src="image" class="prueba"></b-img>
    <div id="texto-img">
      <span id="texto-grande">Ultra Fantasy</span>
      <br>
      <span id="texto-menor">¿Quieres ganar a tus amigos al Fantasy?</span>
      <br>
      <span id="texto-menor">Aquí tenemos toda la información que importa de la Liga.</span>
      <br>
      <br>
      <span id="texto-menor">Muy Fácil e intuitivo de usar.</span>

    </div>
  </div>
</template>

<script>
    import image from "@/assets/home-fondo.jpg"
    
    export default {
        data: function () {
            return {
                image: image
            }
        }
    }
</script>

<style scoped>

#home {
  position: relative;
  display: inline-block;
  width: 100%;
  height: 450px;
}

.prueba {
  width: 100%;
  height: 450px;
}

#texto-img {
  position: absolute;
  top: 10%;
  left: 60%;
  font-weight: bold;
  color: white;
}

#texto-grande {
  font-size:50px;
}

#texto-menor {
  font-size: 15px;
}

</style>