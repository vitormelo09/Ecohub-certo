<template>
  <div class="recovery-layout">
    <div class="recovery-side">
      <div class="recovery-container">
        <img
          :src="darkMode ? logoEscuro : logoClaro"
          alt="EcoHub"
          class="icon-logo"
        >

        <h2>Recuperar acesso</h2>
        <p class="subtitle">
          Digite seu e-mail para receber as instruções de recuperação de senha
        </p>

        <ToastMessage
          :show="mostrarMensagem"
          :message="mensagem"
          :type="tipoMensagem"
          @close="mostrarMensagem = false"
        />

        <div class="recovery-box" v-if="!sucesso">
          <div class="form-header">
            <h3>Esqueceu sua senha?</h3>
            <p>
              Informe o e-mail da sua conta para continuar
            </p>
          </div>

          <form @submit.prevent="enviar">
            <div class="grupo-input">
              <label>E-mail</label>
              <div class="campo" :class="{ invalido: !!erro }">
                <i class="fa-solid fa-envelope"></i>
                <input
                  type="email"
                  v-model="email"
                  placeholder="seu.email@eniac.edu.br"
                  @input="limparErro"
                  required
                >
              </div>
              <span v-if="erro" class="erro-texto">{{ erro }}</span>
            </div>

            <button type="submit" :disabled="carregando">
              {{ carregando ? 'Enviando...' : 'Enviar link de recuperação' }}
            </button>

            <p class="troca-pagina">
              Lembrou a senha?
              <RouterLink to="/login">Voltar para o login</RouterLink>
            </p>
          </form>
        </div>

        <div class="recovery-box sucesso-box" v-else>
          <div class="success-icon">
            <i class="fa-solid fa-paper-plane"></i>
          </div>

          <h3>Verifique seu e-mail</h3>
          <p class="success-text">
            Enviamos as instruções de recuperação para
            <strong>{{ email }}</strong>
          </p>

          <RouterLink to="/login" class="btn-login">
            Ir para o login
          </RouterLink>
        </div>

        <RouterLink to="/inicio" class="btn-voltar">
          ← Voltar para a página inicial
        </RouterLink>
      </div>
    </div>

    <div class="image-side">
      <div class="image-content">
        <h2>Seu acesso continua seguro</h2>
        <p>
          Recupere sua conta e volte a compartilhar projetos, eventos e conexões no EcoHub.
        </p>

        <div class="info-cards">
          <div class="info-card">
            <i class="fa-solid fa-shield-halved"></i>
            <span>Recuperação segura</span>
          </div>

          <div class="info-card">
            <i class="fa-solid fa-envelope-open-text"></i>
            <span>Instruções por e-mail</span>
          </div>

          <div class="info-card">
            <i class="fa-solid fa-user-lock"></i>
            <span>Acesso protegido</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ToastMessage from '../components/ToastMessage.vue'
import logoClaro from '../assets/img/eniacpreto.png'
import logoEscuro from '../assets/img/ecoescuro.png'

const email = ref('')
const erro = ref('')
const sucesso = ref(false)
const carregando = ref(false)
const darkMode = ref(false)

const mostrarMensagem = ref(false)
const mensagem = ref('')
const tipoMensagem = ref('success')

let timeoutMensagem = null

const exibirMensagem = (texto, tipo = 'success') => {
  mensagem.value = texto
  tipoMensagem.value = tipo
  mostrarMensagem.value = true

  if (timeoutMensagem) clearTimeout(timeoutMensagem)

  timeoutMensagem = setTimeout(() => {
    mostrarMensagem.value = false
  }, 3000)
}

onMounted(() => {
  const temaSalvo = localStorage.getItem('theme')

  if (temaSalvo === 'dark') {
    document.body.classList.add('dark-mode')
    darkMode.value = true
  }
})

const limparErro = () => {
  erro.value = ''
}

const enviar = () => {
  erro.value = ''

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!email.value.trim()) {
    erro.value = 'Informe seu e-mail.'
    exibirMensagem('Informe seu e-mail para continuar.', 'error')
    return
  }

  if (!regex.test(email.value)) {
    erro.value = 'Digite um e-mail válido.'
    exibirMensagem('Digite um e-mail válido.', 'error')
    return
  }

  carregando.value = true

  setTimeout(() => {
    carregando.value = false
    sucesso.value = true
    exibirMensagem('Link de recuperação enviado com sucesso!', 'success')
  }, 1400)
}
</script>

<style scoped>
@import "../assets/css/esqueci.css";
</style>