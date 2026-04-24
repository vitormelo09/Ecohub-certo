<template>
  <div class="feed-page">
    <div class="feed-layout">
      <!-- ESQUERDA -->
      <aside class="left-column">
        <div class="profile-card">
          <div class="profile-cover"></div>

          <div class="profile-content">
            <div class="profile-avatar">
              <img
                v-if="fotoUsuario"
                :src="fotoUsuario"
                alt="Foto do perfil"
                class="avatar-img"
              >

              <span v-else>
                {{ iniciaisUsuario }}
              </span>
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
              <img
                v-if="fotoUsuario"
                :src="fotoUsuario"
                alt="Foto do perfil"
                class="avatar-img"
              >

              <span v-else>
                {{ iniciaisUsuario }}
              </span>
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
          <h3>Publicações em destaque</h3>
          <span>Posts com mais curtidas aparecem primeiro</span>
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
                  <img
                    v-if="getFotoPost(post)"
                    :src="getFotoPost(post)"
                    alt="Foto do autor"
                    class="avatar-img"
                  >

                  <span v-else>
                    {{ getInitials(post.nome || 'U') }}
                  </span>
                </div>

                <div class="author-meta">
                  <h4>{{ post.nome || 'Usuário' }}</h4>
                  <span>{{ formatarData(post.data_publicacao) }}</span>
                </div>
              </div>

              <div v-if="isDonoPost(post)" class="post-actions-top">
                <button
                  class="post-action-edit"
                  @click="editarPost(post)"
                  title="Editar post"
                >
                  Editar
                </button>

                <button
                  class="post-action-delete"
                  @click="deletarPost(post.id)"
                  title="Excluir post"
                >
                  Excluir
                </button>
              </div>
            </div>

            <div class="post-card-body">
              <template v-if="post.editando">
                <textarea
                  v-model="post.conteudoEditado"
                  class="post-edit-textarea"
                  placeholder="Edite seu post..."
                ></textarea>

                <div class="post-edit-actions">
                  <button
                    class="post-save-button"
                    @click="salvarEdicaoPost(post)"
                  >
                    Salvar
                  </button>

                  <button
                    class="post-cancel-button"
                    @click="cancelarEdicaoPost(post)"
                  >
                    Cancelar
                  </button>
                </div>
              </template>

              <template v-else>
                <p>{{ post.conteudo }}</p>
              </template>
            </div>

            <!-- FOOTER -->
            <div class="post-card-footer">
              <button
                class="action-button"
                :class="{ liked: Number(post.curtidoPorMim) === 1 }"
                @click="toggleLike(post)"
              >
                <i class="fa-solid fa-heart"></i>
                {{ Number(post.curtidoPorMim) === 1 ? 'Curtido' : 'Curtir' }}
                <span class="count-badge">{{ post.likes || 0 }}</span>
              </button>

              <button class="action-button" @click="toggleComentarios(post)">
                <i class="fa-solid fa-comment"></i> Comentar
              </button>
            </div>

            <!-- COMENTÁRIOS -->
            <div v-if="post.mostrarComentarios" class="comentarios-box">
              <div class="comentario-input">
                <input
                  v-model="post.novoComentario"
                  placeholder="Escreva um comentário..."
                  @keyup.enter="adicionarComentario(post)"
                />

                <button
                  @click="adicionarComentario(post)"
                  :disabled="post.carregandoComentario || !post.novoComentario.trim()"
                >
                  {{ post.carregandoComentario ? 'Enviando...' : 'Enviar' }}
                </button>
              </div>

              <div v-if="post.carregandoComentarios" class="sem-comentarios">
                Carregando comentários...
              </div>

              <div v-else-if="post.comentarios.length" class="lista-comentarios">
                <div
                  v-for="comentario in post.comentarios"
                  :key="comentario.id"
                  class="comentario-item"
                >
                  <div class="comentario-avatar">
                    <img
                      v-if="getFotoComentario(comentario)"
                      :src="getFotoComentario(comentario)"
                      alt="Foto do comentário"
                      class="avatar-img"
                    >

                    <span v-else>
                      {{ getInitials(comentario.nome || 'U') }}
                    </span>
                  </div>

                  <div class="comentario-conteudo">
                    <div class="comentario-topo">
                      <strong>{{ comentario.nome || 'Usuário' }}</strong>
                      <span>{{ formatarData(comentario.data_criacao) }}</span>
                    </div>

                    <template v-if="comentario.editando">
                      <input
                        v-model="comentario.textoEditado"
                        class="comentario-edit-input"
                        @keyup.enter="salvarEdicaoComentario(comentario)"
                      />

                      <div class="comentario-acoes-edicao">
                        <button
                          class="comentario-btn salvar"
                          @click="salvarEdicaoComentario(comentario)"
                        >
                          Salvar
                        </button>

                        <button
                          class="comentario-btn cancelar"
                          @click="cancelarEdicaoComentario(comentario)"
                        >
                          Cancelar
                        </button>
                      </div>
                    </template>

                    <template v-else>
                      <p>{{ comentario.texto }}</p>

                      <div
                        v-if="isDonoComentario(comentario)"
                        class="comentario-acoes"
                      >
                        <button
                          class="comentario-btn editar"
                          @click="editarComentario(comentario)"
                        >
                          Editar
                        </button>

                        <button
                          class="comentario-btn excluir"
                          @click="excluirComentario(post, comentario.id)"
                        >
                          Excluir
                        </button>
                      </div>
                    </template>
                  </div>
                </div>
              </div>

              <div v-else class="sem-comentarios">
                Nenhum comentário ainda.
              </div>
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
              <RouterLink
                :to="`/perfil/${item.id}`"
                class="user-result-left user-result-link"
              >
                <div class="user-result-avatar">
                  <img
                    v-if="getFotoGenerica(item)"
                    :src="getFotoGenerica(item)"
                    alt="Foto do usuário"
                    class="avatar-img"
                  >

                  <span v-else>
                    {{ getInitials(item.nome || 'U') }}
                  </span>
                </div>

                <div class="user-result-meta">
                  <strong>{{ item.nome }}</strong>
                  <span>{{ item.email }}</span>
                </div>
              </RouterLink>

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
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import api from '../services/api'

const usuario = ref(JSON.parse(localStorage.getItem('usuario')) || null)
const token = localStorage.getItem('token') || ''
const API_URL = 'http://localhost:3000'

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

const fotoUsuario = computed(() => {
  return montarUrlFoto(usuario.value)
})

const authHeaders = computed(() => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
}))

function atualizarUsuarioLocal() {
  usuario.value = JSON.parse(localStorage.getItem('usuario')) || null
}

function montarUrlFoto(item) {
  if (!item) return null

  if (item.foto_perfil_url) {
    return item.foto_perfil_url
  }

  if (item.foto_perfil && item.foto_perfil.startsWith('http')) {
    return item.foto_perfil
  }

  if (item.foto_perfil && item.foto_perfil.startsWith('/uploads')) {
    return `${API_URL}${item.foto_perfil}`
  }

  if (item.foto && item.foto.startsWith('http')) {
    return item.foto
  }

  if (item.foto && item.foto.startsWith('data:image')) {
    return item.foto
  }

  if (item.foto && item.foto.startsWith('/uploads')) {
    return `${API_URL}${item.foto}`
  }

  return null
}

function getFotoGenerica(item) {
  return montarUrlFoto(item)
}

function getFotoPost(post) {
  if (isDonoPost(post) && fotoUsuario.value) {
    return fotoUsuario.value
  }

  return montarUrlFoto(post)
}

function getFotoComentario(comentario) {
  if (isDonoComentario(comentario) && fotoUsuario.value) {
    return fotoUsuario.value
  }

  return montarUrlFoto(comentario)
}

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

function pegarIdUsuarioLogado() {
  return usuario.value?.id || usuario.value?._id || usuario.value?.usuario_id
}

function pegarIdDonoPost(post) {
  return post.usuario_id || post.userId || post.user_id || post.autor_id
}

function isDonoPost(post) {
  return Number(pegarIdDonoPost(post)) === Number(pegarIdUsuarioLogado())
}

function isDonoComentario(comentario) {
  return Number(comentario.usuario_id) === Number(pegarIdUsuarioLogado())
}

function ordenarPostsPorCurtidas() {
  posts.value.sort((a, b) => {
    const likesA = Number(a.likes || 0)
    const likesB = Number(b.likes || 0)

    if (likesB !== likesA) {
      return likesB - likesA
    }

    const dataA = new Date(a.data_publicacao || 0).getTime()
    const dataB = new Date(b.data_publicacao || 0).getTime()

    return dataB - dataA
  })
}

/* ================================
   POSTS
================================ */
async function carregarPosts() {
  carregandoPosts.value = true

  try {
    const response = await api.get('/api/posts', authHeaders.value)

    posts.value = response.data.map(post => ({
      ...post,
      comentarios: [],
      novoComentario: '',
      mostrarComentarios: false,
      carregandoComentarios: false,
      carregandoComentario: false,
      editando: false,
      conteudoEditado: post.conteudo || ''
    }))

    ordenarPostsPorCurtidas()
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

function editarPost(post) {
  post.conteudoEditado = post.conteudo
  post.editando = true
}

async function salvarEdicaoPost(post) {
  if (!post.conteudoEditado.trim()) {
    alert('O post não pode ficar vazio.')
    return
  }

  try {
    await api.put(
      `/api/posts/${post.id}`,
      { conteudo: post.conteudoEditado.trim() },
      authHeaders.value
    )

    post.conteudo = post.conteudoEditado.trim()
    post.editando = false
    ordenarPostsPorCurtidas()
  } catch (error) {
    console.error('Erro ao editar post:', error)
    alert('A API ainda não tem a rota para editar post. Depois fazemos essa parte.')
  }
}

function cancelarEdicaoPost(post) {
  post.conteudoEditado = post.conteudo
  post.editando = false
}

async function deletarPost(postId) {
  const confirmar = confirm('Tem certeza que deseja excluir este post?')

  if (!confirmar) return

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

    ordenarPostsPorCurtidas()
  } catch (error) {
    console.error('Erro ao curtir/descurtir post:', error)
  }
}

/* ================================
   COMENTÁRIOS COM BANCO
================================ */
async function toggleComentarios(post) {
  post.mostrarComentarios = !post.mostrarComentarios

  if (post.mostrarComentarios) {
    await carregarComentarios(post)
  }
}

async function carregarComentarios(post) {
  post.carregandoComentarios = true

  try {
    const response = await api.get(
      `/api/comments/post/${post.id}`,
      authHeaders.value
    )

    post.comentarios = response.data.map(comentario => ({
      ...comentario,
      textoEditado: comentario.texto,
      editando: false
    }))
  } catch (error) {
    console.error('Erro ao carregar comentários:', error)
    post.comentarios = []
  } finally {
    post.carregandoComentarios = false
  }
}

async function adicionarComentario(post) {
  if (!post.novoComentario?.trim()) return

  post.carregandoComentario = true

  try {
    await api.post(
      '/api/comments',
      {
        post_id: post.id,
        texto: post.novoComentario.trim()
      },
      authHeaders.value
    )

    post.novoComentario = ''
    await carregarComentarios(post)
  } catch (error) {
    console.error('Erro ao adicionar comentário:', error)
    alert('Erro ao adicionar comentário.')
  } finally {
    post.carregandoComentario = false
  }
}

function editarComentario(comentario) {
  if (!isDonoComentario(comentario)) return

  comentario.textoEditado = comentario.texto
  comentario.editando = true
}

async function salvarEdicaoComentario(comentario) {
  if (!isDonoComentario(comentario)) return

  if (!comentario.textoEditado.trim()) {
    alert('O comentário não pode ficar vazio.')
    return
  }

  try {
    await api.put(
      `/api/comments/${comentario.id}`,
      {
        texto: comentario.textoEditado.trim()
      },
      authHeaders.value
    )

    comentario.texto = comentario.textoEditado.trim()
    comentario.editando = false
  } catch (error) {
    console.error('Erro ao editar comentário:', error)
    alert('Erro ao editar comentário.')
  }
}

function cancelarEdicaoComentario(comentario) {
  if (!isDonoComentario(comentario)) return

  comentario.textoEditado = comentario.texto
  comentario.editando = false
}

async function excluirComentario(post, comentarioId) {
  const confirmar = confirm('Tem certeza que deseja excluir este comentário?')

  if (!confirmar) return

  try {
    await api.delete(`/api/comments/${comentarioId}`, authHeaders.value)

    post.comentarios = post.comentarios.filter(
      comentario => Number(comentario.id) !== Number(comentarioId)
    )
  } catch (error) {
    console.error('Erro ao excluir comentário:', error)
    alert('Erro ao excluir comentário.')
  }
}

/* ================================
   BUSCAR USUÁRIOS
================================ */
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
  atualizarUsuarioLocal()
  carregarPosts()

  window.addEventListener('usuario-atualizado', atualizarUsuarioLocal)
  window.addEventListener('storage', atualizarUsuarioLocal)
})

onBeforeUnmount(() => {
  window.removeEventListener('usuario-atualizado', atualizarUsuarioLocal)
  window.removeEventListener('storage', atualizarUsuarioLocal)
})
</script>

<style>
@import '../assets/css/feed.css';
</style>