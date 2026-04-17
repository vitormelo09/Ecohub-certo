<template>
  <div class="feed-page">
    <div class="feed-layout">
      <!-- ESQUERDA -->
      <aside class="left-column">
        <div class="profile-card">
          <div class="profile-cover"></div>

          <div class="profile-content">
            <div class="profile-avatar">
              {{ iniciaisUsuario }}
            </div>

            <h2>{{ usuario?.nome || 'Usuário' }}</h2>
            <p>{{ usuario?.email || 'email@exemplo.com' }}</p>

            <div class="profile-stats">
              <div class="stat-item">
                <span>Posts</span>
                <strong>{{ posts.length }}</strong>
              </div>
            </div>
          </div>
        </div>

        <div class="side-card">
          <h4>Seu espaço</h4>
          <p>
            Compartilhe projetos, ideias, conquistas e acompanhe a comunidade do EcoHub.
          </p>
        </div>
      </aside>

      <!-- CENTRO -->
      <main class="center-column">
        <div class="create-post-card">
          <div class="create-post-top">
            <div class="mini-avatar">
              {{ iniciaisUsuario }}
            </div>

            <textarea
              v-model="novoPost"
              placeholder="Compartilhe algo com a comunidade EcoHub..."
            ></textarea>
          </div>

          <div class="create-post-bottom">
            <span class="post-hint">
              Poste ideias, projetos, eventos ou novidades.
            </span>

            <button
              class="publish-button"
              @click="publicarPost"
              :disabled="carregandoPublicacao || !novoPost.trim()"
            >
              {{ carregandoPublicacao ? 'Publicando...' : 'Publicar' }}
            </button>
          </div>
        </div>

        <div class="feed-title">
          <h3>Publicações recentes</h3>
        </div>

        <div v-if="carregandoPosts" class="feed-state">
          <div class="loader"></div>
          <p>Carregando posts...</p>
        </div>

        <div v-else-if="posts.length === 0" class="feed-state">
          <div class="empty-icon">📝</div>
          <p>Nenhum post ainda. Seja o primeiro a publicar.</p>
        </div>

        <div v-else class="posts-list">
          <article v-for="post in posts" :key="post.id" class="post-card">
            <div class="post-card-header">
              <div class="post-author">
                <div class="author-avatar">
                  {{ getInitials(post.nome || 'U') }}
                </div>

                <div class="author-meta">
                  <h4>{{ post.nome || 'Usuário' }}</h4>
                  <span>{{ formatarData(post.data_publicacao) }}</span>
                </div>
              </div>

              <button
                v-if="Number(post.usuario_id) === Number(usuario?.id)"
                class="more-button"
                @click="deletarPost(post.id)"
                title="Deletar post"
              >
                <i class="fa-solid fa-trash"></i>
              </button>
            </div>

            <div class="post-card-body">
              <p>{{ post.conteudo }}</p>
            </div>

            <div class="post-card-footer">
              <button
                class="action-button"
                :class="{ liked: Number(post.curtidoPorMim) === 1 }"
                @click="toggleLike(post)"
              >
                <i class="fa-solid fa-heart"></i>
                {{ Number(post.curtidoPorMim) === 1 ? 'Descurtir' : 'Curtir' }}
                <span class="count-badge">{{ post.likes || 0 }}</span>
              </button>
            </div>
          </article>
        </div>
      </main>

      
      <!-- DIREITA -->
      <aside class="right-column">
        <div class="side-card">
          <h4>Buscar usuários</h4>

          <div class="search-users-box">
            <input
              v-model="buscaUsuarios"
              type="text"
              placeholder="Buscar por nome ou e-mail"
              @input="buscarUsuarios"
            />
          </div>

          <div v-if="carregandoBusca" class="users-state">
            Buscando usuários...
          </div>

          <div
            v-else-if="usuariosEncontrados.length === 0 && buscaUsuarios.trim()"
            class="users-state"
          >
            Nenhum usuário encontrado.
          </div>

          <div v-else class="users-list">
            <div
              v-for="item in usuariosEncontrados"
              :key="item.id"
              class="user-result-card"
            >
              <div class="user-result-left">
                <div class="user-result-avatar">
                  {{ getInitials(item.nome || 'U') }}
                </div>

                <div class="user-result-meta">
                  <strong>{{ item.nome }}</strong>
                  <span>{{ item.email }}</span>
                </div>
              </div>

              <button
                class="follow-button"
                :class="{ following: Number(item.seguindo) === 1 }"
                @click="toggleSeguir(item)"
              >
                {{ Number(item.seguindo) === 1 ? 'Seguindo' : 'Seguir' }}
              </button>
            </div>
          </div>
        </div>

        <div class="side-card">
          <h4>Dicas</h4>
          <p>
            Busque colegas, siga perfis e acompanhe as interações da comunidade.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const usuario = ref(JSON.parse(localStorage.getItem('usuario')) || null)
const token = localStorage.getItem('token') || ''

const posts = ref([])
const novoPost = ref('')
const carregandoPosts = ref(false)
const carregandoPublicacao = ref(false)

const buscaUsuarios = ref('')
const usuariosEncontrados = ref([])
const carregandoBusca = ref(false)
let debounceBusca = null

const iniciaisUsuario = computed(() => {
  return getInitials(usuario.value?.nome || 'Usuário')
})

const authHeaders = computed(() => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
}))

function getInitials(nome) {
  return String(nome)
    .trim()
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(parte => parte[0]?.toUpperCase())
    .join('')
}

function formatarData(data) {
  if (!data) return 'Agora'

  return new Date(data).toLocaleString('pt-BR', {
    dateStyle: 'short',
    timeStyle: 'short'
  })
}

async function carregarPosts() {
  carregandoPosts.value = true

  try {
    const response = await api.get('/api/posts', authHeaders.value)
    posts.value = response.data
  } catch (error) {
    console.error('Erro ao carregar posts:', error)
  } finally {
    carregandoPosts.value = false
  }
}

async function publicarPost() {
  if (!novoPost.value.trim()) return

  carregandoPublicacao.value = true

  try {
    await api.post(
      '/api/posts',
      { conteudo: novoPost.value.trim() },
      authHeaders.value
    )

    novoPost.value = ''
    await carregarPosts()
  } catch (error) {
    console.error('Erro ao publicar post:', error)
  } finally {
    carregandoPublicacao.value = false
  }
}

async function deletarPost(postId) {
  try {
    await api.delete(`/api/posts/${postId}`, authHeaders.value)
    await carregarPosts()
  } catch (error) {
    console.error('Erro ao deletar post:', error)
  }
}

async function toggleLike(post) {
  try {
    const response = await api.post(
      '/api/likes/toggle',
      { post_id: post.id },
      authHeaders.value
    )

    post.curtidoPorMim = response.data.curtidoPorMim ? 1 : 0
    post.likes = response.data.totalCurtidas
  } catch (error) {
    console.error('Erro ao curtir/descurtir post:', error)
  }
}

async function buscarUsuarios() {
  if (debounceBusca) clearTimeout(debounceBusca)

  debounceBusca = setTimeout(async () => {
    if (!buscaUsuarios.value.trim()) {
      usuariosEncontrados.value = []
      return
    }

    carregandoBusca.value = true

    try {
      const response = await api.get(
        `/api/users/search?q=${encodeURIComponent(buscaUsuarios.value.trim())}`,
        authHeaders.value
      )

      usuariosEncontrados.value = response.data
    } catch (error) {
      console.error('Erro ao buscar usuários:', error)
      usuariosEncontrados.value = []
    } finally {
      carregandoBusca.value = false
    }
  }, 300)
}

async function toggleSeguir(item) {
  try {
    if (Number(item.seguindo) === 1) {
      await api.delete(`/api/users/${item.id}/follow`, authHeaders.value)
      item.seguindo = 0
    } else {
      await api.post(`/api/users/${item.id}/follow`, {}, authHeaders.value)
      item.seguindo = 1
    }
  } catch (error) {
    console.error('Erro ao seguir/deixar de seguir:', error)
  }
}

onMounted(() => {
  carregarPosts()
})
</script>

<style>
@import '../assets/css/feed.css';
</style>