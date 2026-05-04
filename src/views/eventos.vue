<template>
  <main class="eventos-page">
    <div class="container">

      <section class="hero">
        <h3>Eventos do Ecossistema</h3>
        <p>
          Participe de workshops, palestras e encontros para expandir seus conhecimentos
          e fazer networking com outros estudantes e profissionais.
        </p>
      </section>

      <section class="top-cards">
        <RouterLink to="../calendario" class="small-card">
          <i class="fa-solid fa-calendar-days"></i>
          <h3>Ver Calendário Completo</h3>
          <p>Veja todos os eventos programados</p>
        </RouterLink>

        <RouterLink to="/meus-eventos" class="small-card">
          <i class="fa-solid fa-users"></i>
          <h3>Meus Eventos</h3>
          <p>Eventos que você confirmou presença</p>
        </RouterLink>
      </section>

      <!-- ================= FORM ================= -->
      <section v-if="podePublicar" class="publicar-evento">
        <h2 class="section-title">
          {{ editando ? 'Editar evento' : 'Publicar novo evento' }}
        </h2>

        <form class="form-evento" @submit.prevent="salvarEvento">

          <label>Título do evento</label>
          <input v-model="novoEvento.titulo" type="text" required>

          <label>Descrição do evento</label>
          <textarea v-model="novoEvento.descricao" required></textarea>

          <label>Tipo do evento</label>
          <input v-model="novoEvento.tipo" type="text">

          <label>Data do evento</label>
          <input v-model="novoEvento.data" type="date" required>

          <label>Horário</label>
          <input v-model="novoEvento.horario" type="text">

          <label>Local</label>
          <input v-model="novoEvento.local" type="text" required>

          <label>Imagem (URL)</label>
          <input v-model="novoEvento.imagem" type="text" required>

          <label>Capacidade</label>
          <input v-model="novoEvento.capacidade" type="number" required>

          <button type="submit" class="button confirm-btn">
            {{ editando ? 'Salvar edição' : 'Publicar Evento' }}
          </button>

        </form>
      </section>

      <section v-else class="sem-permissao">
        <p>Você pode visualizar os eventos, mas não tem permissão para publicar novos eventos.</p>
      </section>

      <!-- ================= LISTA ================= -->
      <section>
        <h2 class="section-title">Próximos Eventos</h2>

        <div v-if="eventos.length === 0" class="mensagem-eventos">
          Nenhum evento cadastrado ainda.
        </div>

        <div v-else class="events">
          <div v-for="evento in eventos" :key="evento.id" class="event-card">

            <div class="event-image">
              <img :src="imagemEvento(evento)">
            </div>

            <div class="event-content">

              <span class="badge">{{ evento.tipo }}</span>

              <!-- 🔥 CONTADOR CORRIGIDO -->
              <span class="capacity">
                {{ evento.confirmados || 0 }}/{{ evento.capacidade }}
              </span>

              <h3 class="event-title">{{ evento.titulo }}</h3>

              <p class="event-desc">{{ evento.descricao }}</p>

              <p class="event-info">
                📅 {{ formatarData(evento.data_evento) }}
              </p>

              <p class="event-info">
                📍 {{ evento.local }}
              </p>

              <button
                v-if="!evento.confirmado"
                class="button confirm-btn"
                @click="confirmarPresenca(evento.id)"
              >
                Confirmar Presença
              </button>

              <button
                v-else
                class="button cancelar-btn"
                @click="cancelarPresenca(evento.id)"
              >
                Cancelar Presença
              </button>

              <!-- ✅ EDITAR -->
              <button
                v-if="podePublicar"
                class="button edit-btn"
                @click="editarEvento(evento)"
              >
                Editar
              </button>

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

const usuario = ref(JSON.parse(localStorage.getItem('usuario')) || null)
const podePublicar = computed(() => usuario.value?.tipo === 'admin')

const eventos = ref([])
const editando = ref(false)

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

const carregarEventos = async () => {
  const res = await api.get('/api/events')
  eventos.value = res.data
}

const salvarEvento = async () => {
  if (!novoEvento.value.imagem) {
    alert("Imagem obrigatória")
    return
  }

  if (editando.value) {
    await api.put(`/api/events/${novoEvento.value.id}`, novoEvento.value)
  } else {
    await api.post('/api/events', novoEvento.value)
  }

  editando.value = false

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

  carregarEventos()
}

const editarEvento = (evento) => {
  novoEvento.value = {
    ...evento,
    data: evento.data_evento?.split('T')[0]
  }
  editando.value = true
}

const confirmarPresenca = async (id) => {
  await api.post(`/api/events/${id}/confirmar`)
  carregarEventos()
}

const cancelarPresenca = async (id) => {
  await api.delete(`/api/events/${id}/confirmar`)
  carregarEventos()
}

const excluirEvento = async (id) => {
  await api.delete(`/api/events/${id}`)
  carregarEventos()
}

const formatarData = (data) => {
  return new Date(data).toLocaleDateString('pt-BR')
}

const imagemEvento = (evento) => {
  return evento.imagem || evento.imagem_url
}

onMounted(carregarEventos)
</script>

<style scoped>
@import "../assets/css/eventos.css";
</style>