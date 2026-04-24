<template>
  <div class="pagina-inicio">
    <section class="hero">
      <div class="hero-bg-circle c1"></div>
      <div class="hero-bg-circle c2"></div>

      <div class="hero-content">
        <div class="badge">
          <span class="badge-dot"></span> Plataforma ativa — Semestre 2026.1
        </div>

        <h1>Bem-vindo ao <span class="hero-destaque">EcoHub</span></h1>

        <p class="subtitulo">
          A plataforma que conecta alunos, projetos e eventos da Faculdade Eniac.
          Compartilhe suas conquistas e faça parte da comunidade de inovação.
        </p>

        <div class="hero-btns">
          <RouterLink to="/projetos" class="btn-primary">Explorar Projetos</RouterLink>
          <RouterLink to="/calendario" class="btn-ghost">Ver Eventos</RouterLink>
        </div>
      </div>
    </section>

    <section class="estatisticas">
      <div class="stat-card blue">
        <div class="stat-icon blue">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
          </svg>
        </div>

        <h2>{{ totalAlunos }}</h2>
        <p>Alunos Ativos</p>
      </div>

      <RouterLink to="/projetos" class="stat-card-link">
        <div class="stat-card teal">
          <div class="stat-icon teal">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>

          <h2>{{ totalProjetos }}</h2>
          <p>Projetos Publicados</p>
        </div>
      </RouterLink>

      <RouterLink to="/calendario" class="stat-card-link">
        <div class="stat-card green">
          <div class="stat-icon green">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
          </div>

          <h2>{{ eventosMes }}</h2>
          <p>Eventos este Mês</p>
        </div>
      </RouterLink>

      <div class="stat-card amber">
        <div class="stat-icon amber">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
          </svg>
        </div>

        <h2>{{ taxaEmpregabilidade }}%</h2>
        <p>Taxa de Empregabilidade</p>
      </div>
    </section>

    <section class="secao-noticias">
      <div class="titulo-secao">
        <h2 class="section-title">Últimas Notícias</h2>
        <RouterLink to="/noticias" class="ver-tudo">Ver todas →</RouterLink>
      </div>

      <div v-if="carregando" class="grade-noticias">
        <div class="card-noticia">
          <div class="card-body">
            <h3>Carregando informações...</h3>
            <p>Aguarde enquanto buscamos os dados do banco.</p>
          </div>
        </div>
      </div>

      <div v-else-if="erro" class="grade-noticias">
        <div class="card-noticia">
          <div class="card-body">
            <span class="card-tag">Erro</span>
            <h3>Não foi possível carregar os dados</h3>
            <p>Verifique se a API está ligada e se a rota /api/home está funcionando.</p>
          </div>
        </div>
      </div>

      <div v-else-if="noticias.length === 0" class="grade-noticias">
        <div class="card-noticia">
          <div class="card-body">
            <span class="card-tag">Aviso</span>
            <h3>Nenhuma notícia encontrada</h3>
            <p>Ainda não existem notícias cadastradas no banco.</p>
          </div>
        </div>
      </div>

      <div v-else class="grade-noticias">
        <div
          v-for="noticia in noticias"
          :key="noticia.id"
          class="card-noticia"
        >
          <div class="card-faixa c1"></div>

          <div class="card-body">
            <span class="card-tag">Notícia</span>

            <h3>{{ noticia.titulo }}</h3>

            <p>
              {{ noticia.resumo || noticia.conteudo_completo || 'Sem descrição disponível.' }}
            </p>

            <RouterLink to="/noticias" class="news-link">
              Ler mais <span class="arrow">→</span>
            </RouterLink>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const totalAlunos = ref(0)
const totalProjetos = ref(0)
const eventosMes = ref(0)
const taxaEmpregabilidade = ref(94)

const noticias = ref([])
const carregando = ref(true)
const erro = ref(false)

const carregarDadosInicio = async () => {
  try {
    carregando.value = true
    erro.value = false

   const resposta = await api.get('/api/home')

    totalAlunos.value = resposta.data.totalAlunos || 0
    totalProjetos.value = resposta.data.totalProjetos || 0
    eventosMes.value = resposta.data.eventosMes || 0
    taxaEmpregabilidade.value = resposta.data.taxaEmpregabilidade || 94
    noticias.value = resposta.data.noticias || []
  } catch (error) {
    console.error('Erro ao carregar dados do início:', error)
    erro.value = true
  } finally {
    carregando.value = false
  }
}

onMounted(() => {
  carregarDadosInicio()
})
</script>
<style>
@import "../assets/css/geral.css";
@import "../assets/css/inicio.css";
</style>