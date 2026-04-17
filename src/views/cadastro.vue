<template>
  <div class="split-layout">
    <div class="form-side">
      <div class="form-container">
        <img
          :src="darkMode ? logoEscuro : logoClaro"
          alt="EcoHub"
          class="logo icon-logo"
        >

        <h2>Crie sua conta</h2>
        <p class="subtitle">Preencha os dados para se cadastrar no EcoHub</p>

        <ToastMessage
          :show="mostrarMensagem"
          :message="mensagem"
          :type="tipoMensagem"
          @close="mostrarMensagem = false"
        />

        <div class="form-box">
          <div class="form-header">
            <h3>Cadastro</h3>
            <p>Use seu e-mail institucional da Eniac</p>
          </div>

          <form @submit.prevent="fazerCadastro">
            <div class="grupo-input">
              <label>Nome completo</label>
              <div class="campo">
                <i class="fa-regular fa-user"></i>
                <input type="text" v-model="nome" placeholder="Seu nome completo" required>
              </div>
            </div>

            <div class="grupo-input">
              <label>E-mail institucional</label>
              <div class="campo">
                <i class="fa-regular fa-envelope"></i>
                <input
                  type="email"
                  v-model="email"
                  placeholder="seu.nome@eniac.edu.br"
                  pattern=".+@eniac\.edu\.br$"
                  title="Por favor, utilize um e-mail com o domínio @eniac.edu.br"
                  required
                >
              </div>
            </div>

            <div class="linha">
              <div class="grupo-input">
                <label>Curso</label>
                <select v-model="curso" required>
                  <option value="" disabled>Selecione</option>
                  <option value="eng_software">Eng. Software</option>
                  <option value="ciencia_computacao">Ciência da Computação</option>
                  <option value="sistemas_info">Sistemas de Informação</option>
                  <option value="analise_dev">Análise e Desenvolvimento</option>
                  <option value="redes">Redes de Computadores</option>
                </select>
              </div>

              <div class="grupo-input">
                <label>Semestre</label>
                <select v-model="semestre" required>
                  <option value="" disabled>Selecione</option>
                  <option value="1">1º Semestre</option>
                  <option value="2">2º Semestre</option>
                  <option value="3">3º Semestre</option>
                  <option value="4">4º Semestre</option>
                  <option value="5">5º Semestre</option>
                  <option value="6">6º Semestre</option>
                  <option value="7">7º Semestre</option>
                  <option value="8">8º Semestre</option>
                </select>
              </div>
            </div>

            <div class="grupo-input">
              <label>Senha</label>
              <div class="campo">
                <i class="fa-solid fa-lock"></i>
                <input
                  :type="mostrarSenha ? 'text' : 'password'"
                  v-model="senha"
                  placeholder="Mínimo 8 caracteres"
                  required
                >
                <i
                  class="fa-regular toggle-senha"
                  :class="mostrarSenha ? 'fa-eye-slash' : 'fa-eye'"
                  @click="mostrarSenha = !mostrarSenha"
                  style="cursor: pointer;"
                ></i>
              </div>
            </div>

            <div class="grupo-input">
              <label>Confirmar senha</label>
              <div class="campo">
                <i class="fa-solid fa-lock"></i>
                <input
                  :type="mostrarConfirmarSenha ? 'text' : 'password'"
                  v-model="confirmarSenha"
                  placeholder="Digite a senha novamente"
                  required
                >
                <i
                  class="fa-regular toggle-senha"
                  :class="mostrarConfirmarSenha ? 'fa-eye-slash' : 'fa-eye'"
                  @click="mostrarConfirmarSenha = !mostrarConfirmarSenha"
                  style="cursor: pointer;"
                ></i>
              </div>
            </div>

            <p v-if="erroSenha" class="erro-senha" style="color: red; font-size: 13px;">
              {{ erroSenha }}
            </p>

            <div class="termos">
              <input type="checkbox" id="aceitarTermos" v-model="aceitarTermos" required>
              <label for="aceitarTermos">
                Eu concordo com os <a href="#">Termos de Uso</a> e <a href="#">Política de Privacidade</a>
              </label>
            </div>

            <button type="submit">Criar conta</button>

            <p class="troca-pagina">
              Já tem uma conta? <RouterLink to="/login">Faça login</RouterLink>
            </p>
          </form>
        </div>

        <RouterLink to="/inicio" class="btn-voltar">
          ← Voltar para a página inicial
        </RouterLink>
      </div>
    </div>

    <div class="image-side">
      <div class="image-content">
        <h2>Faça Parte do EcoHub</h2>
        <p>Junte-se a milhares de alunos que já estão compartilhando seus projetos.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'
import ToastMessage from '../components/ToastMessage.vue'

// IMAGENS
import logoClaro from '../assets/img/eniacpreto.png'
import logoEscuro from '../assets/img/ecoescuro.png'

// STATES
const nome = ref('')
const email = ref('')
const curso = ref('')
const semestre = ref('')
const senha = ref('')
const confirmarSenha = ref('')
const aceitarTermos = ref(false)
const erroSenha = ref('')

// senha visível
const mostrarSenha = ref(false)
const mostrarConfirmarSenha = ref(false)

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

// tema
const darkMode = ref(false)

onMounted(() => {
  const temaSalvo = localStorage.getItem('theme')

  if (temaSalvo === 'dark') {
    document.body.classList.add('dark-mode')
    darkMode.value = true
  }
})

const fazerCadastro = async () => {
  if (senha.value !== confirmarSenha.value) {
    erroSenha.value = 'As senhas não coincidem!'
    return
  }

  if (!aceitarTermos.value) {
    exibirMensagem('Você precisa aceitar os termos!', 'error')
    return
  }

  erroSenha.value = ''

  const dados = {
    nome: nome.value,
    email: email.value,
    senha: senha.value,
    curso: curso.value,
    semestre: semestre.value
  }

  try {
    console.log('ENVIANDO:', dados)
    const response = await api.post('/api/users/register', dados)

    console.log('RESPOSTA:', response.data)

    exibirMensagem('Cadastro realizado com sucesso!', 'success')

    nome.value = ''
    email.value = ''
    curso.value = ''
    semestre.value = ''
    senha.value = ''
    confirmarSenha.value = ''
    aceitarTermos.value = false
  } catch (error) {
    console.error('ERRO COMPLETO:', error)

    if (error.response) {
      exibirMensagem(error.response.data.erro || 'Erro ao cadastrar', 'error')
    } else {
      exibirMensagem('Erro ao conectar com o servidor', 'error')
    }
  }
}
</script>

<style scoped>
@import "../assets/css/login_cadastro.css";

.icon-logo {
  width: 120px;
  margin-bottom: 15px;
  align-self: center;
}
</style>