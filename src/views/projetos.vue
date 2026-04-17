<template>
  <div class="projetos-page">
    <section class="projetos-hero">
      <div class="hero-content">
        <p class="hero-badge">EcoHub • Projetos</p>
        <h1>Explore projetos da comunidade</h1>
        <p class="hero-text">
          Descubra ideias, trabalhos acadêmicos e soluções criadas por alunos da Eniac.
        </p>

        <div class="hero-actions">
          <button class="btn-primary">Publicar projeto</button>
          <button class="btn-secondary">Ver destaques</button>
        </div>
      </div>
    </section>

    <section class="filtros-section">
      <div class="filtros-topo">
        <h2>Projetos em destaque</h2>
        <p>Encontre projetos por curso, categoria e nível.</p>
      </div>

      <div class="filtros-grid">
        <div class="filtro-box">
          <label for="busca">Buscar projeto</label>
          <input
            id="busca"
            type="text"
            v-model="busca"
            placeholder="Digite o nome do projeto"
          >
        </div>

        <div class="filtro-box">
          <label for="curso">Curso</label>
          <select id="curso" v-model="cursoSelecionado">
            <option value="">Todos</option>
            <option value="Engenharia de Software">Engenharia de Software</option>
            <option value="Ciência da Computação">Ciência da Computação</option>
            <option value="Sistemas de Informação">Sistemas de Informação</option>
            <option value="ADS">ADS</option>
            <option value="Redes">Redes</option>
          </select>
        </div>

        <div class="filtro-box">
          <label for="categoria">Categoria</label>
          <select id="categoria" v-model="categoriaSelecionada">
            <option value="">Todas</option>
            <option value="Sustentabilidade">Sustentabilidade</option>
            <option value="Web">Web</option>
            <option value="Mobile">Mobile</option>
            <option value="IA">IA</option>
            <option value="Banco de Dados">Banco de Dados</option>
          </select>
        </div>
      </div>
    </section>

    <section class="stats-projetos">
      <div class="stat-card">
        <h3>+120</h3>
        <p>Projetos publicados</p>
      </div>
      <div class="stat-card">
        <h3>+45</h3>
        <p>Alunos ativos</p>
      </div>
      <div class="stat-card">
        <h3>18</h3>
        <p>Projetos premiados</p>
      </div>
    </section>

    <section class="projetos-grid-section">
      <div class="grid-header">
        <h2>Lista de projetos</h2>
        <span>{{ projetosFiltrados.length }} projeto(s)</span>
      </div>

      <div class="projetos-grid">
        <article
          v-for="projeto in projetosFiltrados"
          :key="projeto.id"
          class="projeto-card"
        >
          <div class="card-top">
            <span class="tag">{{ projeto.categoria }}</span>
            <span class="nivel">{{ projeto.nivel }}</span>
          </div>

          <h3>{{ projeto.titulo }}</h3>
          <p class="descricao">
            {{ projeto.descricao }}
          </p>

          <div class="meta">
            <span><strong>Curso:</strong> {{ projeto.curso }}</span>
            <span><strong>Autor:</strong> {{ projeto.autor }}</span>
          </div>

          <div class="card-footer">
            <button class="btn-card">Ver detalhes</button>
            <button class="btn-card-outline">Curtir</button>
          </div>
        </article>
      </div>

      <div v-if="projetosFiltrados.length === 0" class="sem-projetos">
        Nenhum projeto encontrado com esse filtro.
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const darkMode = ref(false)
const busca = ref('')
const cursoSelecionado = ref('')
const categoriaSelecionada = ref('')

const projetos = ref([
  {
    id: 1,
    titulo: 'EcoTrack',
    descricao: 'Plataforma para monitoramento de reciclagem e descarte consciente dentro da faculdade.',
    categoria: 'Sustentabilidade',
    curso: 'Engenharia de Software',
    autor: 'Ana Souza',
    nivel: 'Intermediário'
  },
  {
    id: 2,
    titulo: 'Hub de Eventos Acadêmicos',
    descricao: 'Sistema web para divulgar palestras, workshops e eventos internos da instituição.',
    categoria: 'Web',
    curso: 'ADS',
    autor: 'Lucas Ferreira',
    nivel: 'Iniciante'
  },
  {
    id: 3,
    titulo: 'Assistente de Estudos com IA',
    descricao: 'Ferramenta inteligente para organizar resumos, sugerir cronogramas e apoiar revisões.',
    categoria: 'IA',
    curso: 'Ciência da Computação',
    autor: 'Mariana Lima',
    nivel: 'Avançado'
  },
  {
    id: 4,
    titulo: 'App de Carona Universitária',
    descricao: 'Aplicativo mobile para conectar alunos da mesma região e facilitar o deslocamento.',
    categoria: 'Mobile',
    curso: 'Sistemas de Informação',
    autor: 'Gabriel Costa',
    nivel: 'Intermediário'
  },
  {
    id: 5,
    titulo: 'Painel de Indicadores Acadêmicos',
    descricao: 'Dashboard com dados de desempenho estudantil usando relatórios e gráficos interativos.',
    categoria: 'Banco de Dados',
    curso: 'ADS',
    autor: 'Juliana Rocha',
    nivel: 'Avançado'
  },
  {
    id: 6,
    titulo: 'Laboratório Virtual de Redes',
    descricao: 'Ambiente de apoio para prática de topologias, protocolos e simulações em redes.',
    categoria: 'Web',
    curso: 'Redes',
    autor: 'Rafael Martins',
    nivel: 'Intermediário'
  }
])

onMounted(() => {
  const temaSalvo = localStorage.getItem('theme')

  if (temaSalvo === 'dark') {
    document.body.classList.add('dark-mode')
    darkMode.value = true
  }
})

const projetosFiltrados = computed(() => {
  return projetos.value.filter((projeto) => {
    const bateBusca =
      projeto.titulo.toLowerCase().includes(busca.value.toLowerCase()) ||
      projeto.descricao.toLowerCase().includes(busca.value.toLowerCase())

    const bateCurso =
      !cursoSelecionado.value || projeto.curso === cursoSelecionado.value

    const bateCategoria =
      !categoriaSelecionada.value || projeto.categoria === categoriaSelecionada.value

    return bateBusca && bateCurso && bateCategoria
  })
})
</script>

<style scoped>
@import "../assets/css/projetos.css";
</style>