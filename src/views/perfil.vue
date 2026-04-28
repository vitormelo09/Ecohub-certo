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

        <small class="texto-foto">
          Clique na foto para alterar
        </small>

        <div class="perfil-badge">Meu Perfil</div>

        <h2>
          {{ perfilEditando ? dadosEditados.nome : (usuario?.nome || 'Usuário') }}
        </h2>

        <div
          class="tipo-usuario-badge"
          :class="tipoUsuarioClasse"
        >
          {{ tipoUsuarioTexto }}
        </div>

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
            <i class="fa-solid fa-user-tag"></i>
            <span>
              {{ tipoUsuarioTexto }}
            </span>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>
              {{ nomeCurso(perfilEditando ? dadosEditados.curso : usuario?.curso) }}
            </span>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-layer-group"></i>
            <span>
              {{ nomeSemestre(perfilEditando ? dadosEditados.semestre : usuario?.semestre) }}
            </span>
          </div>
        </div>

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
            <span>{{ posts.length }}</span>
            Posts
          </div>

          <div class="stat">
            <span>{{ projetos.length }}</span>
            Projetos
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

          <button
            v-if="usuario?.tipo === 'admin'"
            class="btn-admin-usuarios"
            @click="irParaAdminUsuarios"
          >
            Gerenciar Administradores
          </button>

          <button class="btn-sair" @click="confirmarLogout">
            Sair (Logout)
          </button>
        </div>
      </div>
    </aside>

    <main class="perfil-timeline">
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
            <select v-model="dadosEditados.curso">
              <option value="">Selecione</option>
              <option value="eng_software">Eng. Software</option>
              <option value="ciencia_computacao">Ciência da Computação</option>
              <option value="sistemas_info">Sistemas de Informação</option>
              <option value="analise_dev">Análise e Desenvolvimento</option>
              <option value="redes">Redes de Computadores</option>
            </select>
          </div>

          <div class="grupo-campo">
            <label>Semestre</label>
            <select v-model="dadosEditados.semestre">
              <option value="">Selecione</option>
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

          <div class="grupo-campo grupo-campo-full">
            <label>Bio</label>
            <textarea v-model="dadosEditados.bio" rows="4"></textarea>
          </div>
        </div>
      </div>

      <!-- MEUS PROJETOS -->
      <div class="tweet-card-fake">
        <div class="section-head">
          <h3>Meus Projetos Publicados</h3>
          <span class="tag-status">
            {{ projetos.length }} projeto(s)
          </span>
        </div>

        <p v-if="carregandoProjetos" class="mensagem-perfil">
          Carregando projetos...
        </p>

        <p v-else-if="erroProjetos" class="mensagem-perfil erro">
          {{ erroProjetos }}
        </p>

        <p v-else-if="projetos.length === 0" class="mensagem-perfil">
          Você ainda não publicou nenhum projeto.
        </p>

        <div v-else class="meus-projetos-grid">
          <article
            v-for="projeto in projetos"
            :key="projeto.id"
            class="meu-projeto-card"
          >
            <div v-if="projeto.imagem || projeto.imagem_url" class="meu-projeto-img">
              <img
                :src="montarImagemProjeto(projeto.imagem || projeto.imagem_url)"
                alt="Imagem do projeto"
              >
            </div>

            <div class="meu-projeto-body">
              <h4>{{ projeto.titulo }}</h4>

              <p>
                {{ projeto.descricao }}
              </p>

              <div class="projeto-meta">
                <span>
                  ❤️ {{ projeto.curtidas || 0 }} curtida(s)
                </span>

                <span v-if="projeto.tecnologias_usadas || projeto.tecnologias">
                  🛠 {{ projeto.tecnologias_usadas || projeto.tecnologias }}
                </span>
              </div>

              <a
                v-if="projeto.link_github"
                :href="projeto.link_github"
                target="_blank"
                rel="noopener noreferrer"
                class="btn-github"
              >
                Ver GitHub
              </a>
            </div>
          </article>
        </div>
      </div>

      <!-- MEUS POSTS -->
      <div class="tweet-card-fake">
        <div class="section-head">
          <h3>Meus Posts Publicados</h3>
          <span class="tag-status">
            {{ posts.length }} post(s)
          </span>
        </div>

        <p v-if="carregandoPosts" class="mensagem-perfil">
          Carregando posts...
        </p>

        <p v-else-if="erroPosts" class="mensagem-perfil erro">
          {{ erroPosts }}
        </p>

        <p v-else-if="posts.length === 0" class="mensagem-perfil">
          Você ainda não publicou nenhum post.
        </p>

        <div v-else class="meus-posts-lista">
          <article
            v-for="post in posts"
            :key="post.id"
            class="meu-post-card"
          >
            <div class="meu-post-topo">
              <strong>{{ post.nome }}</strong>
              <span>{{ formatarData(post.data_publicacao || post.data_criacao) }}</span>
            </div>

            <p class="meu-post-conteudo">
              {{ post.conteudo }}
            </p>

            <div v-if="post.imagem_post_url || post.imagem_url || post.imagem" class="meu-post-img">
              <img
                :src="montarImagemProjeto(post.imagem_post_url || post.imagem_url || post.imagem)"
                alt="Imagem do post"
              >
            </div>

            <div class="meu-post-footer">
              <span>❤️ {{ post.likes || 0 }} curtida(s)</span>
            </div>
          </article>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../services/api'
import fotoPadrao from '../assets/img/perfil.jpg'

const router = useRouter()

const API_URL = 'http://localhost:3000'

const usuario = ref(null)
const perfilEditando = ref(false)
const fotoPerfil = ref(null)
const arquivoFoto = ref(null)
const salvando = ref(false)

const projetos = ref([])
const carregandoProjetos = ref(false)
const erroProjetos = ref('')

const posts = ref([])
const carregandoPosts = ref(false)
const erroPosts = ref('')

const token = localStorage.getItem('token') || ''

const dadosEditados = ref({
  nome: '',
  email: '',
  curso: '',
  semestre: '',
  bio: ''
})

const tipoUsuarioTexto = computed(() => {
  if (!usuario.value || !usuario.value.tipo) {
    return 'Aluno'
  }

  if (usuario.value.tipo === 'admin') {
    return 'Administrador'
  }

  if (usuario.value.tipo === 'professor') {
    return 'Professor'
  }

  return 'Aluno'
})

const tipoUsuarioClasse = computed(() => {
  if (!usuario.value || !usuario.value.tipo) {
    return 'tipo-aluno'
  }

  if (usuario.value.tipo === 'admin') {
    return 'tipo-admin'
  }

  if (usuario.value.tipo === 'professor') {
    return 'tipo-professor'
  }

  return 'tipo-aluno'
})

function nomeCurso(curso) {
  const cursos = {
    eng_software: 'Eng. Software',
    ciencia_computacao: 'Ciência da Computação',
    sistemas_info: 'Sistemas de Informação',
    analise_dev: 'Análise e Desenvolvimento',
    redes: 'Redes de Computadores'
  }

  return cursos[curso] || 'Curso não informado'
}

function nomeSemestre(semestre) {
  if (!semestre) return 'Semestre não informado'

  return `${semestre}º Semestre`
}

function montarUrlArquivo(caminho) {
  if (!caminho) return null

  if (String(caminho).startsWith('blob:')) {
    return caminho
  }

  if (String(caminho).startsWith('http')) {
    return caminho
  }

  if (String(caminho).startsWith('/uploads')) {
    return `${API_URL}${caminho}`
  }

  if (String(caminho).startsWith('uploads')) {
    return `${API_URL}/${caminho}`
  }

  return caminho
}

function montarFotoPerfil(user) {
  if (!user) return null

  const foto =
    user.foto_perfil_url ||
    user.foto_perfil ||
    user.foto ||
    user.avatar ||
    null

  return montarUrlArquivo(foto)
}

function montarImagemProjeto(imagem) {
  return montarUrlArquivo(imagem) || ''
}

function formatarData(data) {
  if (!data) return 'Data não informada'

  const dataLimpa = String(data).split('T')[0]
  const dataFormatada = new Date(dataLimpa + 'T00:00:00')

  if (Number.isNaN(dataFormatada.getTime())) {
    return 'Data inválida'
  }

  return dataFormatada.toLocaleDateString('pt-BR')
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

function pegarListaDaResposta(dados) {
  if (Array.isArray(dados)) return dados
  if (Array.isArray(dados.projetos)) return dados.projetos
  if (Array.isArray(dados.posts)) return dados.posts
  if (Array.isArray(dados.data)) return dados.data
  if (Array.isArray(dados.results)) return dados.results
  return []
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
      curso: response.data.curso || '',
      semestre: response.data.semestre || '',
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
      curso: usuarioLocal.curso || '',
      semestre: usuarioLocal.semestre || '',
      seguidores: usuarioLocal.seguidores || 0,
      seguindo: usuarioLocal.seguindo || 0,
      posts: usuarioLocal.posts || 0
    }

    preencherDados(usuarioFallback)
  }
}

async function carregarMeusProjetos() {
  try {
    carregandoProjetos.value = true
    erroProjetos.value = ''

    const response = await api.get('/api/projects/meus', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    projetos.value = pegarListaDaResposta(response.data)
  } catch (error) {
    console.error('Erro ao carregar meus projetos:', error)

    if (error.response) {
      erroProjetos.value =
        error.response.data?.detalhes ||
        error.response.data?.erro ||
        error.response.data?.message ||
        'Erro ao carregar seus projetos.'
    } else {
      erroProjetos.value = 'Erro ao conectar com a API.'
    }
  } finally {
    carregandoProjetos.value = false
  }
}

async function carregarMeusPosts() {
  try {
    carregandoPosts.value = true
    erroPosts.value = ''

    const response = await api.get('/api/posts/meus', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    posts.value = pegarListaDaResposta(response.data)
  } catch (error) {
    console.error('Erro ao carregar meus posts:', error)

    if (error.response) {
      erroPosts.value =
        error.response.data?.detalhes ||
        error.response.data?.erro ||
        error.response.data?.message ||
        'Erro ao carregar seus posts.'
    } else {
      erroPosts.value = 'Erro ao conectar com a API.'
    }
  } finally {
    carregandoPosts.value = false
  }
}

function trocarFoto(event) {
  const file = event.target.files[0]

  if (!file) return

  const tiposPermitidos = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp'
  ]

  if (!tiposPermitidos.includes(file.type)) {
    alert('Escolha uma imagem JPG, PNG ou WEBP.')
    event.target.value = ''
    return
  }

  const tamanhoMaximo = 5 * 1024 * 1024

  if (file.size > tamanhoMaximo) {
    alert('A imagem precisa ter no máximo 5MB.')
    event.target.value = ''
    return
  }

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
    formData.append('curso', dadosEditados.value.curso || '')
    formData.append('semestre', dadosEditados.value.semestre || '')

    if (arquivoFoto.value) {
      formData.append('foto', arquivoFoto.value)
    }

    const response = await api.put('/api/users/me', formData, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    const usuarioResposta = response.data.usuario || response.data

    const usuarioAtualizado = {
      ...usuario.value,
      ...usuarioResposta,
      curso: usuarioResposta?.curso || dadosEditados.value.curso || '',
      semestre: usuarioResposta?.semestre || dadosEditados.value.semestre || '',
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

    alert(
      error.response?.data?.detalhes ||
      error.response?.data?.erro ||
      error.response?.data?.message ||
      'Erro ao salvar perfil na API.'
    )
  } finally {
    salvando.value = false
  }
}

function irParaAdminUsuarios() {
  router.push('/admin-usuarios')
}

function confirmarLogout() {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  window.dispatchEvent(new Event('usuario-atualizado'))
  router.push('/login')
}

onMounted(() => {
  carregarPerfil()
  carregarMeusProjetos()
  carregarMeusPosts()
})
</script>

<style>
@import "../assets/css/geral.css";
@import "../assets/css/perfil.css";

.texto-foto {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  color: #64748b;
  text-align: center;
}
</style>