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
          <button class="btn-primary" @click="abrirFormulario">
            Publicar projeto
          </button>

          <button class="btn-secondary">
            Ver destaques
          </button>
        </div>
      </div>
    </section>

    <section v-if="mostrarFormulario" class="form-projeto-section">
      <div class="form-projeto-card">
        <div class="form-header">
          <h2>Publicar novo projeto</h2>
          <button class="btn-fechar" @click="fecharFormulario">×</button>
        </div>

        <form class="form-projeto" @submit.prevent="publicarProjeto">
          <div class="form-group">
            <label for="titulo">Título do projeto</label>
            <input
              id="titulo"
              type="text"
              v-model="novoProjeto.titulo"
              placeholder="Ex: EcoTrack"
              required
            >
          </div>

          <div class="form-group">
            <label for="descricao">Descrição</label>
            <textarea
              id="descricao"
              v-model="novoProjeto.descricao"
              placeholder="Descreva o objetivo do projeto"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label for="link_github">Link do GitHub</label>
            <input
              id="link_github"
              type="text"
              v-model="novoProjeto.link_github"
              placeholder="https://github.com/usuario/projeto"
            >
          </div>

          <div class="form-group">
            <label for="tecnologias_usadas">Tecnologias usadas</label>
            <input
              id="tecnologias_usadas"
              type="text"
              v-model="novoProjeto.tecnologias_usadas"
              placeholder="Vue, Node.js, MySQL..."
            >
          </div>

          <div class="form-group">
            <label for="imagem">Imagem do projeto</label>
            <input
              id="imagem"
              type="file"
              accept="image/*"
              @change="selecionarImagem"
            >
          </div>

          <div v-if="mensagemErro" class="mensagem-erro">
            {{ mensagemErro }}
          </div>

          <div v-if="mensagemSucesso" class="mensagem-sucesso">
            {{ mensagemSucesso }}
          </div>

          <div class="form-actions">
            <button type="button" class="btn-secondary" @click="fecharFormulario">
              Cancelar
            </button>

            <button type="submit" class="btn-primary" :disabled="salvando">
              {{ salvando ? 'Publicando...' : 'Publicar projeto' }}
            </button>
          </div>
        </form>
      </div>
    </section>

    <section class="filtros-section">
      <div class="filtros-topo">
        <h2>Projetos em destaque</h2>
        <p>Encontre projetos por título, descrição e tecnologias.</p>
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
      </div>
    </section>

    <section class="stats-projetos">
      <div class="stat-card">
        <h3>{{ projetos.length }}</h3>
        <p>Projetos publicados</p>
      </div>

      <div class="stat-card">
        <h3>{{ projetosComGithub }}</h3>
        <p>Com GitHub</p>
      </div>

      <div class="stat-card">
        <h3>{{ totalCurtidas }}</h3>
        <p>Total de curtidas</p>
      </div>
    </section>

    <section class="projetos-grid-section">
      <div class="grid-header">
        <h2>Lista de projetos</h2>
        <span>{{ projetosFiltrados.length }} projeto(s)</span>
      </div>

      <div v-if="carregando" class="sem-projetos">
        Carregando projetos...
      </div>

      <div v-else class="projetos-grid">
        <article
          v-for="projeto in projetosFiltrados"
          :key="projeto.id"
          class="projeto-card"
        >
          <div class="card-top">
            <span class="tag">
              {{ projeto.tecnologias_usadas || 'Projeto' }}
            </span>

            <span class="nivel">
              {{ projeto.curtidas || 0 }} curtida(s)
            </span>
          </div>

          <img
            v-if="projeto.imagem"
            :src="montarUrlImagem(projeto.imagem)"
            alt="Imagem do projeto"
            class="projeto-imagem"
          >

          <h3>{{ projeto.titulo }}</h3>

          <p class="descricao">
            {{ projeto.descricao }}
          </p>

          <div class="meta">
            <span>
              <strong>Tecnologias:</strong>
              {{ projeto.tecnologias_usadas || 'Não informado' }}
            </span>

            <span>
              <strong>Autor:</strong>
              {{ projeto.autor_nome || projeto.usuario_id || 'Não informado' }}
            </span>
          </div>

          <div class="card-footer">
            <a
              v-if="projeto.link_github"
              :href="projeto.link_github"
              target="_blank"
              class="btn-card"
            >
              GitHub
            </a>

            <button v-else class="btn-card" disabled>
              Sem GitHub
            </button>

            <button
              class="btn-card-outline"
              @click="curtirProjeto(projeto.id)"
              :disabled="curtindoId === projeto.id"
            >
              {{ curtindoId === projeto.id ? 'Curtindo...' : `Curtir (${projeto.curtidas || 0})` }}
            </button>

            <button
              v-if="isDonoProjeto(projeto)"
              class="btn-card-danger"
              @click="excluirProjeto(projeto.id)"
              :disabled="excluindoId === projeto.id"
            >
              {{ excluindoId === projeto.id ? 'Excluindo...' : 'Excluir' }}
            </button>
          </div>
        </article>
      </div>

      <div v-if="!carregando && projetosFiltrados.length === 0" class="sem-projetos">
        Nenhum projeto encontrado com esse filtro.
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

const usuarioLogado = JSON.parse(localStorage.getItem('usuario')) || null

const busca = ref('')

const projetos = ref([])
const carregando = ref(false)
const salvando = ref(false)
const excluindoId = ref(null)
const curtindoId = ref(null)

const mostrarFormulario = ref(false)
const mensagemErro = ref('')
const mensagemSucesso = ref('')

const imagemSelecionada = ref(null)

const novoProjeto = ref({
  titulo: '',
  descricao: '',
  link_github: '',
  tecnologias_usadas: ''
})

const isDonoProjeto = (projeto) => {
  return Number(projeto.usuario_id) === Number(usuarioLogado?.id)
}

const abrirFormulario = () => {
  mostrarFormulario.value = true
  mensagemErro.value = ''
  mensagemSucesso.value = ''
}

const fecharFormulario = () => {
  mostrarFormulario.value = false
  mensagemErro.value = ''
  mensagemSucesso.value = ''
  imagemSelecionada.value = null

  novoProjeto.value = {
    titulo: '',
    descricao: '',
    link_github: '',
    tecnologias_usadas: ''
  }
}

const selecionarImagem = (event) => {
  const arquivo = event.target.files[0]

  if (!arquivo) {
    imagemSelecionada.value = null
    return
  }

  imagemSelecionada.value = arquivo
}

const montarUrlImagem = (imagem) => {
  if (!imagem) return ''

  if (imagem.startsWith('http')) {
    return imagem
  }

  return `http://localhost:3000${imagem}`
}

const carregarProjetos = async () => {
  try {
    carregando.value = true

    const resposta = await api.get('/api/projects')
    projetos.value = resposta.data || []
  } catch (error) {
    console.error('Erro ao carregar projetos:', error)
    projetos.value = []
  } finally {
    carregando.value = false
  }
}

const publicarProjeto = async () => {
  try {
    salvando.value = true
    mensagemErro.value = ''
    mensagemSucesso.value = ''

    const token = localStorage.getItem('token')

    if (!token) {
      mensagemErro.value = 'Você precisa estar logado para publicar um projeto.'
      return
    }

    if (!novoProjeto.value.titulo.trim() || !novoProjeto.value.descricao.trim()) {
      mensagemErro.value = 'Título e descrição são obrigatórios.'
      return
    }

    const formData = new FormData()

    formData.append('titulo', novoProjeto.value.titulo)
    formData.append('descricao', novoProjeto.value.descricao)
    formData.append('link_github', novoProjeto.value.link_github)
    formData.append('tecnologias_usadas', novoProjeto.value.tecnologias_usadas)

    if (imagemSelecionada.value) {
      formData.append('imagem', imagemSelecionada.value)
    }

    await api.post('/api/projects', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    mensagemSucesso.value = 'Projeto publicado com sucesso!'

    await carregarProjetos()

    setTimeout(() => {
      fecharFormulario()
    }, 800)
  } catch (error) {
    console.error('Erro ao publicar projeto:', error)

    mensagemErro.value =
      error.response?.data?.erro ||
      error.response?.data?.mensagem ||
      'Erro ao publicar projeto.'
  } finally {
    salvando.value = false
  }
}

const curtirProjeto = async (id) => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Você precisa estar logado para curtir um projeto.')
      return
    }

    curtindoId.value = id

    await api.post(`/api/projects/${id}/like`)

    await carregarProjetos()
  } catch (error) {
    console.error('Erro ao curtir projeto:', error)

    alert(
      error.response?.data?.erro ||
      error.response?.data?.mensagem ||
      'Erro ao curtir projeto.'
    )
  } finally {
    curtindoId.value = null
  }
}

const excluirProjeto = async (id) => {
  try {
    const token = localStorage.getItem('token')

    if (!token) {
      alert('Você precisa estar logado para excluir um projeto.')
      return
    }

    const confirmar = confirm('Tem certeza que deseja excluir este projeto?')

    if (!confirmar) {
      return
    }

    excluindoId.value = id

    await api.delete(`/api/projects/${id}`)

    projetos.value = projetos.value.filter((projeto) => projeto.id !== id)

    alert('Projeto excluído com sucesso!')
  } catch (error) {
    console.error('Erro ao excluir projeto:', error)

    alert(
      error.response?.data?.erro ||
      error.response?.data?.mensagem ||
      'Erro ao excluir projeto.'
    )
  } finally {
    excluindoId.value = null
  }
}

const projetosFiltrados = computed(() => {
  const textoBusca = busca.value.toLowerCase()

  return projetos.value.filter((projeto) => {
    const titulo = projeto.titulo || ''
    const descricao = projeto.descricao || ''
    const tecnologias = projeto.tecnologias_usadas || ''

    return (
      titulo.toLowerCase().includes(textoBusca) ||
      descricao.toLowerCase().includes(textoBusca) ||
      tecnologias.toLowerCase().includes(textoBusca)
    )
  })
})

const projetosComGithub = computed(() => {
  return projetos.value.filter((projeto) => projeto.link_github).length
})

const totalCurtidas = computed(() => {
  return projetos.value.reduce((total, projeto) => {
    return total + Number(projeto.curtidas || 0)
  }, 0)
})

onMounted(() => {
  carregarProjetos()
})
</script>

<style scoped>
@import "../assets/css/projetos.css";
</style>