<template>
  <main class="eventos-page">
    <div class="container">

      <!-- HERO -->
      <section class="hero">
        <h3>Eventos do Ecossistema</h3>

        <p>
          Participe de workshops, palestras e encontros para expandir seus conhecimentos
          e fazer networking com outros estudantes e profissionais.
        </p>
      </section>

      <!-- CARDS -->
      <section class="top-cards">

        <RouterLink to="../calendario" class="small-card">
          <i class="fa-solid fa-calendar-days"></i>

          <h3>Ver Calendário Completo</h3>

          <p>
            Veja todos os eventos programados
          </p>
        </RouterLink>

        <RouterLink to="/meus-eventos" class="small-card">
          <i class="fa-solid fa-users"></i>

          <h3>Meus Eventos</h3>

          <p>
            Eventos que você confirmou presença
          </p>
        </RouterLink>

      </section>

      <!-- FORM -->
      <section
        v-if="podePublicar"
        class="publicar-evento"
      >
        <h2 class="section-title">
          {{ editando ? 'Editar evento' : 'Publicar novo evento' }}
        </h2>

        <form
          class="form-evento"
          @submit.prevent="salvarEvento"
        >

          <!-- TITULO -->
          <label>Título do evento</label>

          <input
            v-model="novoEvento.titulo"
            type="text"
            required
          >

          <!-- DESCRICAO -->
          <label>Descrição do evento</label>

          <textarea
            v-model="novoEvento.descricao"
            required
          ></textarea>

          <!-- TIPO -->
          <label>Tipo do evento</label>

          <input
            v-model="novoEvento.tipo"
            type="text"
          >

          <!-- DATA -->
          <label>Data do evento</label>

          <input
            v-model="novoEvento.data"
            type="date"
            :min="dataMinima"
            required
          >

          <!-- HORARIO -->
          <label>Horário</label>

          <input
            v-model="novoEvento.horario"
            type="text"
          >

          <!-- LOCAL -->
          <label>Local</label>

          <input
            v-model="novoEvento.local"
            type="text"
            required
          >

          <!-- IMAGEM -->
          <label>Imagem do evento</label>

          <input
            type="file"
            accept="image/*"
            :required="!editando"
            @change="selecionarImagem"
          >

          <small
            v-if="editando && novoEvento.imagem"
          >
            A imagem atual será mantida caso você não selecione outra.
          </small>

          <!-- CAPACIDADE -->
          <label>Capacidade</label>

          <input
            v-model="novoEvento.capacidade"
            type="number"
            min="1"
            required
          >

          <!-- BOTAO -->
          <button
            type="submit"
            class="button confirm-btn"
          >
            {{ editando ? 'Salvar edição' : 'Publicar Evento' }}
          </button>

        </form>
      </section>

      <!-- SEM PERMISSAO -->
      <section
        v-else
        class="sem-permissao"
      >
        <p>
          Você pode visualizar os eventos,
          mas não tem permissão para publicar novos eventos.
        </p>
      </section>

      <!-- LISTA -->
      <section>

        <h2 class="section-title">
          Próximos Eventos
        </h2>

        <div
          v-if="eventos.length === 0"
          class="mensagem-eventos"
        >
          Nenhum evento cadastrado ainda.
        </div>

        <div
          v-else
          class="events"
        >

          <div
            v-for="evento in eventos"
            :key="evento.id"
            class="event-card"
          >

            <!-- IMAGEM -->
            <div class="event-image">
              <img
                :src="imagemEvento(evento)"
                alt="Imagem do evento"
              >
            </div>

            <!-- CONTEUDO -->
            <div class="event-content">

              <span class="badge">
                {{ evento.tipo }}
              </span>

              <span class="capacity">
                {{ evento.confirmados || 0 }}/{{ evento.capacidade }}
              </span>

              <h3 class="event-title">
                {{ evento.titulo }}
              </h3>

              <p class="event-desc">
                {{ evento.descricao }}
              </p>

              <p class="event-info">
                📅 {{ formatarData(evento.data_evento) }}
              </p>

              <p class="event-info">
                📍 {{ evento.local }}
              </p>

              <!-- CONFIRMAR -->
              <button
                v-if="!evento.confirmado"
                class="button confirm-btn"
                @click="confirmarPresenca(evento.id)"
              >
                Confirmar Presença
              </button>

              <!-- CANCELAR -->
              <button
                v-else
                class="button cancelar-btn"
                @click="cancelarPresenca(evento.id)"
              >
                Cancelar Presença
              </button>

              <!-- EDITAR -->
              <button
                v-if="podePublicar"
                class="button edit-btn"
                @click="editarEvento(evento)"
              >
                Editar
              </button>

              <!-- EXCLUIR -->
              <button
                v-if="podePublicar"
                class="button delete-btn"
                @click="excluirEvento(evento.id)"
              >
                Excluir Evento
              </button>

            </div>
          </div>

        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import api from '../services/api'

/* ================================
   USUARIO
================================ */
const usuario = ref(
  JSON.parse(localStorage.getItem('usuario')) || null
)

const podePublicar = computed(
  () => usuario.value?.tipo === 'admin'
)

const dataMinima = new Date()
  .toISOString()
  .split('T')[0]

/* ================================
   STATES
================================ */
const eventos = ref([])

const editando = ref(false)

const imagemArquivo = ref(null)

const novoEvento = ref({
  id: null,
  titulo: '',
  descricao: '',
  tipo: '',
  data: '',
  horario: '',
  local: '',
  imagem: '',
  capacidade: ''
})

/* ================================
   CARREGAR EVENTOS
================================ */
const carregarEventos = async () => {
  try {
    const res = await api.get('/api/events')

    eventos.value = res.data
  } catch (error) {
    console.error('Erro ao carregar eventos:', error)
  }
}

/* ================================
   SELECIONAR IMAGEM
================================ */
const selecionarImagem = (event) => {
  const arquivo = event.target.files[0]

  if (!arquivo) {
    imagemArquivo.value = null
    return
  }

  if (!arquivo.type.startsWith('image/')) {
    alert('Selecione apenas imagens.')

    event.target.value = ''

    imagemArquivo.value = null

    return
  }

  imagemArquivo.value = arquivo
}

/* ================================
   SALVAR EVENTO
================================ */
const salvarEvento = async () => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)

  const dataSelecionada = new Date(
    novoEvento.value.data + 'T00:00:00'
  )

  if (dataSelecionada < hoje) {
    alert('Não é permitido criar eventos com data anterior.')
    return
  }

  if (!editando.value && !imagemArquivo.value) {
    alert('Imagem obrigatória')
    return
  }

  try {
    const formData = new FormData()

    formData.append(
      'titulo',
      novoEvento.value.titulo
    )

    formData.append(
      'descricao',
      novoEvento.value.descricao
    )

    formData.append(
      'tipo',
      novoEvento.value.tipo || 'Evento'
    )

    formData.append(
      'data',
      novoEvento.value.data
    )

    formData.append(
      'data_evento',
      novoEvento.value.data
    )

    formData.append(
      'horario',
      novoEvento.value.horario || ''
    )

    formData.append(
      'local',
      novoEvento.value.local
    )

    formData.append(
      'capacidade',
      novoEvento.value.capacidade
    )

    if (imagemArquivo.value) {
      formData.append(
        'imagem',
        imagemArquivo.value
      )
    }

    if (editando.value) {
      await api.put(
        `/api/events/${novoEvento.value.id}`,
        formData
      )

      alert('Evento editado com sucesso!')
    } else {
      await api.post(
        '/api/events',
        formData
      )

      alert('Evento publicado com sucesso!')
    }

    editando.value = false

    imagemArquivo.value = null

    novoEvento.value = {
      id: null,
      titulo: '',
      descricao: '',
      tipo: '',
      data: '',
      horario: '',
      local: '',
      imagem: '',
      capacidade: ''
    }

    await carregarEventos()

  } catch (error) {
    console.error(
      'Erro ao salvar evento:',
      error
    )

    alert(
      error.response?.data?.erro ||
      error.response?.data?.message ||
      error.response?.data?.detalhes ||
      'Erro ao publicar evento'
    )
  }
}

/* ================================
   EDITAR EVENTO
================================ */
const editarEvento = (evento) => {
  novoEvento.value = {
    id: evento.id,
    titulo: evento.titulo || '',
    descricao: evento.descricao || '',
    tipo: evento.tipo || '',
    data: evento.data_evento?.split('T')[0] || '',
    horario: evento.horario || '',
    local: evento.local || '',
    imagem: evento.imagem || evento.imagem_url || '',
    capacidade: evento.capacidade || ''
  }

  imagemArquivo.value = null

  editando.value = true
}

/* ================================
   CONFIRMAR PRESENCA
================================ */
const confirmarPresenca = async (id) => {
  try {
    await api.post(`/api/events/${id}/confirmar`)

    carregarEventos()

  } catch (error) {
    console.error(error)

    alert(
      error.response?.data?.erro ||
      'Erro ao confirmar presença'
    )
  }
}

/* ================================
   CANCELAR PRESENCA
================================ */
const cancelarPresenca = async (id) => {
  try {
    await api.delete(`/api/events/${id}/confirmar`)

    carregarEventos()

  } catch (error) {
    console.error(error)

    alert(
      error.response?.data?.erro ||
      'Erro ao cancelar presença'
    )
  }
}

/* ================================
   EXCLUIR EVENTO
================================ */
const excluirEvento = async (id) => {
  const confirmar = confirm(
    'Deseja realmente excluir este evento?'
  )

  if (!confirmar) return

  try {
    await api.delete(`/api/events/${id}`)

    carregarEventos()

  } catch (error) {
    console.error(error)

    alert(
      error.response?.data?.erro ||
      'Erro ao excluir evento'
    )
  }
}

/* ================================
   FORMATAR DATA
================================ */
const formatarData = (data) => {
  if (!data) return ''

  return new Date(data)
    .toLocaleDateString('pt-BR')
}

/* ================================
   IMAGEM EVENTO
================================ */
const imagemEvento = (evento) => {
  return (
    evento.imagem_url ||
    evento.imagem ||
    ''
  )
}

/* ================================
   ON MOUNT
================================ */
onMounted(() => {
  carregarEventos()
})
</script>

<style scoped>
@import "../assets/css/eventos.css";

/* =================================
   INPUT FILE - IMAGEM DO EVENTO
================================= */

input[type="file"] {
  background: #f8fafc;
  border: 2px dashed #31BADF;
  border-radius: 14px;
  padding: 14px;
  width: 100%;
  cursor: pointer;
  transition: 0.3s;
  color: #053B5E;
  font-weight: 600;
}

input[type="file"]:hover {
  background: #eef9ff;
  border-color: #2788C8;
}

input[type="file"]::file-selector-button {
  background: linear-gradient(
    135deg,
    #2788C8,
    #31BADF
  );
  color: white;
  border: none;
  padding: 10px 18px;
  border-radius: 10px;
  margin-right: 12px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.3s;
}

input[type="file"]::file-selector-button:hover {
  transform: scale(1.05);
  opacity: 0.9;
}

/* DARK MODE */

body.dark-mode input[type="file"] {
  background: #0f172a;
  border-color: #31BADF;
  color: #f8fafc;
}

body.dark-mode input[type="file"]:hover {
  background: #172033;
}
</style>