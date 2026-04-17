<script setup>
import { RouterView, useRoute } from 'vue-router'
import { computed } from 'vue'
import Navbar from './components/navbar.vue'
import Footer from './components/footer.vue'

const route = useRoute()

// Define as páginas onde o Header e o Footer NÃO devem aparecer
const esconderLayout = computed(() => {
  const paginasSemLayout = ['login', 'cadastro', 'esqueci']
  return paginasSemLayout.includes(route.name)
})
</script>

<template>
  <div class="app-container">
    <Navbar v-if="!esconderLayout" />

    <main :class="{ 'conteudo-principal': !esconderLayout }">
      <RouterView />
    </main>

    <Footer v-if="!esconderLayout" />
  </div>
</template>

<style>
@import './assets/css/geral.css';

.app-container {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.conteudo-principal {
  flex: 1;
  margin-top: 80px; /* Só aplica o espaço do header se ele existir */
}

body { margin: 0; padding: 0; }
</style>