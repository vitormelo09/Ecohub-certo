<template>
  <main class="perfil-publico-page">
    <section v-if="carregando" class="perfil-publico-card estado">
      <div class="loader"></div>
      <p>Carregando perfil...</p>
    </section>

    <section v-else-if="erro" class="perfil-publico-card estado">
      <h2>Perfil não encontrado</h2>
      <p>{{ erro }}</p>

      <RouterLink to="/feed" class="btn-voltar">
        Voltar para o Feed
      </RouterLink>
    </section>

    <section v-else class="perfil-publico-layout">
      <aside class="perfil-publico-card perfil-info">
        <div class="perfil-cover"></div>

        <div class="perfil-conteudo">
          <div class="foto-publica">
            <img
              v-if="fotoPerfil"
              :src="fotoPerfil"
              alt="Foto do perfil"
            >

            <span v-else>
              {{ getInitials(perfil.nome || 'U') }}
            </span>
          </div>

          <h1>{{ perfil.nome || 'Usuário' }}</h1>

          <p class="perfil-email">
            @{{ perfil.email?.split('@')[0] || 'usuario' }}
          </p>

          <p class="perfil-bio">
            {{ perfil.bio || 'Este usuário ainda não adicionou uma bio.' }}
          </p>

          <div class="perfil-stats">
            <div class="stat">
              <strong>{{ perfil.seguidores || 0 }}</strong>
              <span>Seguidores</span>
            </div>

            <div class="stat">
              <strong>{{ perfil.seguindo || 0 }}</strong>
              <span>Seguindo</span>
            </div>

            <div class="stat">
              <strong>{{ perfil.posts || 0 }}</strong>
              <span>Posts</span>
            </div>
          </div>

          <button
            v-if="!souEu"
            class="btn-seguir"
            :class="{ seguindo: Number(perfil.euSigo) === 1 }"
            @click="toggleSeguir"
          >
            {{ Number(perfil.euSigo) === 1 ? 'Seguindo' : 'Seguir' }}
          </button>

          <RouterLink
            v-else
            to="/perfil"
            class="btn-voltar"
          >
            Ir para meu perfil
          </RouterLink>
        </div>
      </aside>

      <section class="perfil-publico-card perfil-detalhes">
        <div class="section-head">
          <h2>Sobre</h2>
          <span>EcoHub</span>
        </div>

        <div class="info-lista">
          <div class="info-item">
            <i class="fa-solid fa-user"></i>
            <span>{{ perfil.nome || 'Usuário' }}</span>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-envelope"></i>
            <span>{{ perfil.email || 'E-mail não informado' }}</span>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-align-left"></i>
            <span>{{ perfil.bio || 'Nenhuma bio cadastrada.' }}</span>
          </div>
        </div>

        <RouterLink to="/feed" class="btn-voltar">
          Voltar para o Feed
        </RouterLink>
      </section>
    </section>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import api from '../services/api'

const route = useRoute()

const perfil = ref({})
const carregando = ref(false)
const erro = ref('')

const token = localStorage.getItem('token') || ''
const usuarioLogado = ref(JSON.parse(localStorage.getItem('usuario')) || null)

const API_URL = 'http://localhost:3000'

const authHeaders = computed(() => ({
  headers: {
    Authorization: `Bearer ${token}`
  }
}))

const souEu = computed(() => {
  return Number(usuarioLogado.value?.id) === Number(route.params.id)
})

const fotoPerfil = computed(() => {
  return montarUrlFoto(perfil.value)
})

function montarUrlFoto(user) {
  if (!user) return null

  if (user.foto_perfil_url) {
    return user.foto_perfil_url
  }

  if (user.foto_perfil && user.foto_perfil.startsWith('http')) {
    return user.foto_perfil
  }

  if (user.foto_perfil && user.foto_perfil.startsWith('/uploads')) {
    return `${API_URL}${user.foto_perfil}`
  }

  if (user.foto && user.foto.startsWith('data:image')) {
    return user.foto
  }

  return null
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

async function carregarPerfilPublico() {
  carregando.value = true
  erro.value = ''

  try {
    const response = await api.get(
      `/api/users/${route.params.id}/profile`,
      authHeaders.value
    )

    perfil.value = response.data
  } catch (error) {
    console.error('Erro ao carregar perfil público:', error)
    erro.value = 'Não foi possível carregar esse perfil.'
  } finally {
    carregando.value = false
  }
}

async function toggleSeguir() {
  try {
    if (Number(perfil.value.euSigo) === 1) {
      await api.delete(`/api/users/${perfil.value.id}/follow`, authHeaders.value)

      perfil.value.euSigo = 0
      perfil.value.seguidores = Math.max(Number(perfil.value.seguidores || 0) - 1, 0)
    } else {
      await api.post(`/api/users/${perfil.value.id}/follow`, {}, authHeaders.value)

      perfil.value.euSigo = 1
      perfil.value.seguidores = Number(perfil.value.seguidores || 0) + 1
    }
  } catch (error) {
    console.error('Erro ao seguir/deixar de seguir:', error)
    alert('Erro ao seguir/deixar de seguir usuário.')
  }
}

onMounted(() => {
  carregarPerfilPublico()
})
</script>

<style>
.perfil-publico-page {
  min-height: calc(100vh - 70px);
  padding: 32px 20px;
  background:
    radial-gradient(circle at top left, rgba(28, 164, 166, 0.08), transparent 22%),
    linear-gradient(180deg, #f4f8fb 0%, #edf2f7 100%);
}

.perfil-publico-layout {
  max-width: 1100px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 360px 1fr;
  gap: 24px;
  align-items: start;
}

.perfil-publico-card {
  background: #ffffff;
  border: 1px solid #e5edf4;
  border-radius: 24px;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.07);
  overflow: hidden;
}

.perfil-publico-card.estado {
  max-width: 600px;
  margin: 80px auto;
  padding: 40px;
  text-align: center;
}

.perfil-cover {
  height: 120px;
  background: linear-gradient(135deg, #0b5fa5, #1ca4a6);
}

.perfil-conteudo {
  padding: 0 26px 26px;
  text-align: center;
}

.foto-publica {
  width: 120px;
  height: 120px;
  margin: -60px auto 16px;
  border-radius: 50%;
  border: 5px solid #ffffff;
  background: linear-gradient(135deg, #0b5fa5, #1ca4a6);
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  font-size: 36px;
  font-weight: 800;
  box-shadow: 0 12px 24px rgba(11, 95, 165, 0.22);
}

.foto-publica img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.perfil-conteudo h1 {
  color: #122033;
  font-size: 26px;
  margin-bottom: 6px;
}

.perfil-email {
  color: #0b5fa5;
  font-weight: 700;
  margin-bottom: 14px;
}

.perfil-bio {
  color: #6b7280;
  line-height: 1.7;
  margin-bottom: 20px;
}

.perfil-stats {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #edf2f7;
  border-bottom: 1px solid #edf2f7;
  padding: 18px 0;
  margin-bottom: 20px;
}

.stat {
  flex: 1;
}

.stat strong {
  display: block;
  color: #122033;
  font-size: 22px;
}

.stat span {
  color: #6b7280;
  font-size: 13px;
}

.btn-seguir,
.btn-voltar {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  width: 100%;
  border: none;
  border-radius: 14px;
  padding: 13px 18px;
  background: linear-gradient(135deg, #0b5fa5, #1ca4a6);
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
  transition: 0.2s ease;
}

.btn-seguir:hover,
.btn-voltar:hover {
  transform: translateY(-1px);
}

.btn-seguir.seguindo {
  background: #eef5fb;
  color: #0b5fa5;
  border: 1px solid #dbe5ee;
}

.perfil-detalhes {
  padding: 26px;
}

.section-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 22px;
}

.section-head h2 {
  color: #122033;
  font-size: 22px;
}

.section-head span {
  background: rgba(11, 95, 165, 0.08);
  color: #0b5fa5;
  padding: 7px 13px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
}

.info-lista {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 24px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f8fbfd;
  border: 1px solid #dbe5ee;
  border-radius: 14px;
  padding: 14px;
  color: #445164;
}

.info-item i {
  color: #1ca4a6;
}

/* DARK MODE */
body.dark-mode .perfil-publico-page {
  background:
    radial-gradient(circle at top left, rgba(28, 164, 166, 0.16), transparent 25%),
    linear-gradient(180deg, #0f172a 0%, #020617 100%);
}

body.dark-mode .perfil-publico-card {
  background: #1e293b;
  border-color: #334155;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.38);
}

body.dark-mode .foto-publica {
  border-color: #1e293b;
}

body.dark-mode .perfil-conteudo h1,
body.dark-mode .stat strong,
body.dark-mode .section-head h2 {
  color: #f8fafc;
}

body.dark-mode .perfil-bio,
body.dark-mode .stat span {
  color: #94a3b8;
}

body.dark-mode .perfil-email {
  color: #38bdf8;
}

body.dark-mode .perfil-stats {
  border-top-color: #334155;
  border-bottom-color: #334155;
}

body.dark-mode .info-item {
  background: #0f172a;
  border-color: #334155;
  color: #cbd5e1;
}

body.dark-mode .section-head span {
  background: rgba(56, 189, 248, 0.14);
  color: #38bdf8;
}

body.dark-mode .btn-seguir.seguindo {
  background: #0f172a;
  color: #38bdf8;
  border-color: #334155;
}

@media (max-width: 900px) {
  .perfil-publico-layout {
    grid-template-columns: 1fr;
  }
}
</style>