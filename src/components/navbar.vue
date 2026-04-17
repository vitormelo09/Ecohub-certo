<template>
  <header>
    <RouterLink to="/inicio">
      <img src="../assets/img/lohead2.png" alt="EcoHub" class="logo">
    </RouterLink>
    
    <nav>
      <RouterLink to="/inicio" active-class="ativo">Inicio</RouterLink>
      <RouterLink to="/eventos" active-class="ativo">Eventos</RouterLink>
      <RouterLink to="/noticias" active-class="ativo">Notícias</RouterLink>
      <RouterLink to="/feed" active-class="ativo">Feed</RouterLink>
      <RouterLink to="/sobre" active-class="ativo">Sobre</RouterLink>
    </nav>

    <div class="header-direita">
      <RouterLink to="/cadastro" class="btn-cadastro">Cadastre-se</RouterLink>

      <!-- 👇 ADICIONEI A CLASSE AQUI -->
      <RouterLink to="/perfil" class="perfil">
        <img src="../assets/img/perfil.jpg" alt="Perfil">
      </RouterLink>

      <button @click="toggleTema" class="btn-tema">
        <Sun v-if="darkMode" />
        <Moon v-else />
      </button>
    </div>
  </header>
</template>

<script>
import { ref, onMounted } from "vue"
import { Sun, Moon } from "lucide-vue-next"

export default {
  components: {
    Sun,
    Moon
  },
  setup() {
    const darkMode = ref(false)

    function toggleTema() {
      darkMode.value = !darkMode.value
      document.body.classList.toggle("dark-mode")

      if (darkMode.value) {
        localStorage.setItem("theme", "dark")
      } else {
        localStorage.setItem("theme", "light")
      }
    }

    onMounted(() => {
      const temaSalvo = localStorage.getItem("theme")

      if (temaSalvo === "dark") {
        document.body.classList.add("dark-mode")
        darkMode.value = true
      }
    })

    return {
      toggleTema,
      darkMode
    }
  }
}
</script>