<template>
  <div class="perfil-layout">
    <aside class="sidebar-perfil">
      <div class="card-perfil-main">

        <!-- FOTO CLICÁVEL -->
        <label for="inputFoto">
          <img
            :src="fotoPerfil || fotoPadrao"
            alt="Foto de Perfil"
            class="foto-grande"
            style="cursor:pointer"
          >
        </label>

        <!-- INPUT OCULTO -->
        <input
          type="file"
          id="inputFoto"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          @change="trocarFoto"
          style="display:none"
        >

        <div class="perfil-badge">Meu Perfil</div>

        <h2>
          {{ perfilEditando ? dadosEditados.nome : (usuario?.nome || 'Usuário') }}
        </h2>

        <p class="username">
          @{{ (perfilEditando ? dadosEditados.email : usuario?.email)?.split('@')[0] || 'usuario' }}
        </p>

        <p class="bio">
          {{ perfilEditando ? dadosEditados.bio : (usuario?.bio || 'Adicione uma bio para contar mais sobre você no EcoHub.') }}
        </p>

        <div class="perfil-info-list">
          <div class="info-item">
            <i class="fa-solid fa-envelope"></i>
            <span>
              {{ perfilEditando ? dadosEditados.email : (usuario?.email || 'email@exemplo.com') }}
            </span>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>
              {{ perfilEditando ? dadosEditados.curso : (usuario?.curso || 'Curso não informado') }}
            </span>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-layer-group"></i>
            <span>
              {{ perfilEditando ? dadosEditados.semestre : (usuario?.semestre || 'Semestre não informado') }}
            </span>
          </div>
        </div>

        <!-- AGORA OS NÚMEROS VÊM DA API -->
        <div class="perfil-stats">
          <div class="stat">
            <span>{{ usuario?.seguidores || 0 }}</span>
            Seguidores
          </div>

          <div class="stat">
            <span>{{ usuario?.seguindo || 0 }}</span>
            Seguindo
          </div>

          <div class="stat">
            <span>{{ usuario?.posts || 0 }}</span>
            Posts
          </div>
        </div>

        <div class="acoes-perfil">
          <button
            v-if="!perfilEditando"
            class="btn-editar"
            @click="abrirEdicao"
          >
            Editar Perfil
          </button>

          <template v-else>
            <button
              class="btn-editar"
              @click="salvarPerfil"
              :disabled="salvando"
            >
              {{ salvando ? 'Salvando...' : 'Salvar' }}
            </button>

            <button
              class="btn-secundario"
              @click="cancelarEdicao"
              :disabled="salvando"
            >
              Cancelar
            </button>
          </template>

          <button class="btn-sair" @click="confirmarLogout">
            Sair (Logout)
          </button>
        </div>
      </div>
    </aside>

    <main class="perfil-timeline">
      <div class="tweet-card-fake destaque-card">
        <div class="section-head">
          <h3>Resumo do Perfil</h3>
          <span class="tag-status">
            {{ perfilEditando ? 'Editando' : 'Ativo' }}
          </span>
        </div>

        <p class="tweet-text-fake">
          Gerencie seus dados, personalize sua apresentação e mantenha seu perfil atualizado dentro do EcoHub.
        </p>
      </div>

      <div class="tweet-card-fake" v-if="perfilEditando">
        <div class="section-head">
          <h3>Editar informações</h3>
        </div>

        <div class="form-grid">
          <div class="grupo-campo">
            <label>Nome</label>
            <input type="text" v-model="dadosEditados.nome">
          </div>

          <div class="grupo-campo">
            <label>E-mail</label>
            <input type="email" v-model="dadosEditados.email" disabled>
          </div>

          <div class="grupo-campo">
            <label>Curso</label>
            <input type="text" v-model="dadosEditados.curso">
          </div>

          <div class="grupo-campo">
            <label>Semestre</label>
            <input type="text" v-model="dadosEditados.semestre">
          </div>

          <div class="grupo-campo grupo-campo-full">
            <label>Bio</label>
            <textarea v-model="dadosEditados.bio" rows="4"></textarea>
          </div>
        </div>
      </div>

      <div class="tweet-card-fake">
        <div class="section-head">
          <h3>Minha Atividade Recente</h3>
          <span class="tag-status">Últimas ações</span>
        </div>

        <div class="atividade-lista">
          <div class="atividade-item">
            <div class="atividade-icone">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>

            <div>
              <strong>Perfil atualizado</strong>
              <p>Personalize seus dados para aparecer melhor na comunidade.</p>
            </div>
          </div>

          <div class="atividade-item">
            <div class="atividade-icone">
              <i class="fa-solid fa-folder-open"></i>
            </div>

            <div>
              <strong>Projetos publicados</strong>
              <p>Mostre seus trabalhos e fortaleça sua presença no EcoHub.</p>
            </div>
          </div>

          <div class="atividade-item">
            <div class="atividade-icone">
              <i class="fa-solid fa-comments"></i>
            </div>

            <div>
              <strong>Interações na comunidade</strong>
              <p>Acompanhe seu crescimento dentro da plataforma.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import fotoPadrao from '../assets/img/perfil.jpg'

const router = useRouter()

const usuario = ref(null)
const perfilEditando = ref(false)
const fotoPerfil = ref(null)
const arquivoFoto = ref(null)
const salvando = ref(false)

const token = localStorage.getItem('token') || ''

const dadosEditados = ref({
  nome: '',
  email: '',
  curso: '',
  semestre: '',
  bio: ''
})

function montarFotoPerfil(user) {
  if (!user) return null

  if (user.foto_perfil_url) {
    return user.foto_perfil_url
  }

  if (user.foto_perfil && user.foto_perfil.startsWith('http')) {
    return user.foto_perfil
  }

  if (user.foto_perfil && user.foto_perfil.startsWith('/uploads')) {
    return `http://localhost:3000${user.foto_perfil}`
  }

  if (user.foto) {
    return user.foto
  }

  return null
}

function preencherDados(user) {
  usuario.value = user

  dadosEditados.value = {
    nome: user.nome || '',
    email: user.email || '',
    curso: user.curso || '',
    semestre: user.semestre || '',
    bio: user.bio || ''
  }

  fotoPerfil.value = montarFotoPerfil(user)
}

async function carregarPerfil() {
  const userStorage = localStorage.getItem('usuario')

  if (!userStorage || !token) {
    router.push('/login')
    return
  }

  const usuarioLocal = JSON.parse(userStorage)

  try {
    const response = await api.get('/api/users/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const usuarioMesclado = {
      ...usuarioLocal,
      ...response.data,
      curso: usuarioLocal.curso || response.data.curso || '',
      semestre: usuarioLocal.semestre || response.data.semestre || '',
      seguidores: response.data.seguidores || 0,
      seguindo: response.data.seguindo || 0,
      posts: response.data.posts || 0
    }

    preencherDados(usuarioMesclado)

    localStorage.setItem('usuario', JSON.stringify(usuarioMesclado))
    window.dispatchEvent(new Event('usuario-atualizado'))
  } catch (error) {
    console.error('Erro ao carregar perfil pela API:', error)

    const usuarioFallback = {
      ...usuarioLocal,
      seguidores: usuarioLocal.seguidores || 0,
      seguindo: usuarioLocal.seguindo || 0,
      posts: usuarioLocal.posts || 0
    }

    preencherDados(usuarioFallback)
  }
}

onMounted(() => {
  carregarPerfil()
})

function trocarFoto(event) {
  const file = event.target.files[0]

  if (!file) return

  arquivoFoto.value = file
  fotoPerfil.value = URL.createObjectURL(file)
}

function abrirEdicao() {
  perfilEditando.value = true
}

function cancelarEdicao() {
  if (!usuario.value) return

  dadosEditados.value = {
    nome: usuario.value.nome || '',
    email: usuario.value.email || '',
    curso: usuario.value.curso || '',
    semestre: usuario.value.semestre || '',
    bio: usuario.value.bio || ''
  }

  fotoPerfil.value = montarFotoPerfil(usuario.value)
  arquivoFoto.value = null
  perfilEditando.value = false
}

async function salvarPerfil() {
  if (!dadosEditados.value.nome.trim()) {
    alert('O nome não pode ficar vazio.')
    return
  }

  salvando.value = true

  try {
    const formData = new FormData()

    formData.append('nome', dadosEditados.value.nome.trim())
    formData.append('bio', dadosEditados.value.bio || '')

    if (arquivoFoto.value) {
      formData.append('foto', arquivoFoto.value)
    }

    const response = await api.put('/api/users/me', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data'
      }
    })

    const usuarioAtualizado = {
      ...usuario.value,
      ...response.data.usuario,
      curso: dadosEditados.value.curso || '',
      semestre: dadosEditados.value.semestre || '',
      seguidores: usuario.value?.seguidores || 0,
      seguindo: usuario.value?.seguindo || 0,
      posts: usuario.value?.posts || 0
    }

    usuario.value = usuarioAtualizado
    fotoPerfil.value = montarFotoPerfil(usuarioAtualizado)

    localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado))
    window.dispatchEvent(new Event('usuario-atualizado'))

    arquivoFoto.value = null
    perfilEditando.value = false

    await carregarPerfil()

    alert('Perfil atualizado com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar perfil:', error)

    const usuarioAtualizadoLocal = {
      ...usuario.value,
      nome: dadosEditados.value.nome,
      email: dadosEditados.value.email,
      curso: dadosEditados.value.curso,
      semestre: dadosEditados.value.semestre,
      bio: dadosEditados.value.bio
    }

    usuario.value = usuarioAtualizadoLocal

    localStorage.setItem('usuario', JSON.stringify(usuarioAtualizadoLocal))
    window.dispatchEvent(new Event('usuario-atualizado'))

    perfilEditando.value = false

    alert('Os dados locais foram salvos, mas a API não respondeu corretamente.')
  } finally {
    salvando.value = false
  }
}

function confirmarLogout() {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('usuario-atualizado'))
  router.push('/login')
}
</script>

<style>
@import "../assets/css/geral.css";
@import "../assets/css/perfil.css";
</style>