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
       <RouterLink to="/projetos" active-class="ativo">Projeto</RouterLink>
    </nav>


    <div class="header-direita">
      <!-- Só aparece se NÃO tiver usuário logado -->
      <RouterLink
        v-if="!usuario"
        to="/cadastro"
        class="btn-cadastro"
      >
        Cadastre-se
      </RouterLink>

      <!-- Perfil só aparece se tiver usuário logado -->
      <RouterLink
        v-if="usuario"
        to="/perfil"
        class="perfil"
      >
        <img
          :src="fotoPerfil"
          alt="Perfil"
          @error="usarFotoPadrao"
        >
      </RouterLink>

      <button @click="toggleTema" class="btn-tema">
        <Sun v-if="darkMode" />
        <Moon v-else />
      </button>
    </div>
  </header>
</template>

<script>
import { ref, computed, onMounted, onBeforeUnmount } from "vue"
import { Sun, Moon } from "lucide-vue-next"
import perfilPadrao from "../assets/img/perfil.jpg"

export default {
  components: {
    Sun,
    Moon
  },

  setup() {
    const darkMode = ref(false)
    const usuario = ref(JSON.parse(localStorage.getItem("usuario")) || null)

    const API_URL = "http://localhost:3000"

    const fotoPerfil = computed(() => {
      const fotoUrl = usuario.value?.foto_perfil_url
      const fotoBanco = usuario.value?.foto_perfil
      const fotoLocal = usuario.value?.foto

      if (fotoUrl) {
        return fotoUrl
      }

      if (fotoBanco && fotoBanco.startsWith("/uploads")) {
        return `${API_URL}${fotoBanco}`
      }

      if (fotoBanco && fotoBanco.startsWith("http")) {
        return fotoBanco
      }

      if (fotoLocal && fotoLocal.startsWith("data:image")) {
        return fotoLocal
      }

      if (fotoLocal && fotoLocal.startsWith("http")) {
        return fotoLocal
      }

      return perfilPadrao
    })

    function atualizarUsuarioLocal() {
      usuario.value = JSON.parse(localStorage.getItem("usuario")) || null
    }

    function usarFotoPadrao(event) {
      event.target.src = perfilPadrao
    }

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

      atualizarUsuarioLocal()

      window.addEventListener("usuario-atualizado", atualizarUsuarioLocal)
      window.addEventListener("storage", atualizarUsuarioLocal)
    })

    onBeforeUnmount(() => {
      window.removeEventListener("usuario-atualizado", atualizarUsuarioLocal)
      window.removeEventListener("storage", atualizarUsuarioLocal)
    })

    return {
      toggleTema,
      darkMode,
      fotoPerfil,
      usarFotoPadrao,
      usuario
    }
  }
}
</script>