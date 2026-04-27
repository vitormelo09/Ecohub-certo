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

      <section v-if="podePublicar" class="publicar-evento">
        <h2 class="section-title">Publicar novo evento</h2>

        <form class="form-evento" @submit.prevent="publicarEvento">
          <input
            v-model="novoEvento.titulo"
            type="text"
            placeholder="Título do evento"
            required
          >

          <textarea
            v-model="novoEvento.descricao"
            placeholder="Descrição do evento"
            required
          ></textarea>

          <input
            v-model="novoEvento.tipo"
            type="text"
            placeholder="Tipo do evento. Ex: Workshop, Palestra"
          >

          <input
            v-model="novoEvento.data"
            type="date"
            required
          >

          <input
            v-model="novoEvento.horario"
            type="text"
            placeholder="Horário. Ex: 14:00 - 18:00"
          >

          <input
            v-model="novoEvento.local"
            type="text"
            placeholder="Local do evento"
            required
          >

          <input
            v-model="novoEvento.imagem"
            type="text"
            placeholder="Link da imagem do evento"
          >

          <input
            v-model="novoEvento.capacidade"
            type="number"
            placeholder="Capacidade total. Ex: 70"
          >

          <button type="submit" class="button confirm-btn">
            Publicar Evento
          </button>
        </form>
      </section>

      <section v-else class="sem-permissao">
        <p>Você pode visualizar os eventos, mas não tem permissão para publicar novos eventos.</p>
      </section>

      <section>
        <h2 class="section-title">Próximos Eventos</h2>

        <p v-if="carregando" class="mensagem-eventos">
          Carregando eventos...
        </p>

        <p v-else-if="erroEventos" class="mensagem-erro">
          {{ erroEventos }}
        </p>

        <p v-else-if="eventos.length === 0" class="mensagem-eventos">
          Nenhum evento cadastrado ainda.
        </p>

        <div v-else class="events">
          <div
            v-for="evento in eventos"
            :key="evento.id"
            class="event-card"
          >
            <div class="event-image">
              <img :src="imagemEvento(evento)" alt="Imagem do evento">
            </div>

            <div class="event-content">
              <span class="badge">{{ evento.tipo || 'Evento' }}</span>
              <span class="capacity">
                {{ evento.participantes || 0 }}/{{ capacidadeTotal(evento.capacidade) }}
              </span>

              <h3 class="event-title">{{ evento.titulo }}</h3>

              <p class="event-desc">{{ evento.descricao }}</p>

              <p class="event-info">
                📅 {{ formatarData(evento.data || evento.data_evento) }}
              </p>

              <p v-if="evento.horario" class="event-info">
                ⏰ {{ evento.horario }}
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
const token = localStorage.getItem('token')

const podePublicar = computed(() => {
  if (!usuario.value) return false

  return usuario.value.tipo === 'admin'
})

const eventos = ref([])
const meusEventosIds = ref([])
const carregando = ref(false)
const erroEventos = ref('')

const novoEvento = ref({
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
  try {
    carregando.value = true
    erroEventos.value = ''

    const resposta = await api.get('/api/events')
    let listaEventos = resposta.data

    if (token) {
      const meusEventosResposta = await api.get('/api/events/meus-eventos')
      meusEventosIds.value = meusEventosResposta.data.map(evento => evento.id)

      listaEventos = listaEventos.map(evento => {
        return {
          ...evento,
          confirmado: meusEventosIds.value.includes(evento.id)
        }
      })
    }

    eventos.value = listaEventos
  } catch (erro) {
    console.error('Erro ao carregar eventos:', erro)

    if (erro.response) {
      erroEventos.value =
        erro.response.data?.detalhes ||
        erro.response.data?.erro ||
        'Não foi possível carregar os eventos.'
    } else {
      erroEventos.value = 'Não foi possível conectar com a API. Verifique se a API está ligada.'
    }
  } finally {
    carregando.value = false
  }
}

const publicarEvento = async () => {
  if (!podePublicar.value) {
    alert('Você não tem permissão para publicar eventos.')
    return
  }

  try {
    await api.post('/api/events', {
      titulo: novoEvento.value.titulo,
      descricao: novoEvento.value.descricao,
      tipo: novoEvento.value.tipo || 'Evento',
      data: novoEvento.value.data,
      horario: novoEvento.value.horario,
      local: novoEvento.value.local,
      imagem: novoEvento.value.imagem,
      capacidade: novoEvento.value.capacidade
    })

    novoEvento.value = {
      titulo: '',
      descricao: '',
      tipo: '',
      data: '',
      horario: '',
      local: '',
      imagem: '',
      capacidade: ''
    }

    alert('Evento publicado com sucesso!')
    carregarEventos()
  } catch (erro) {
    console.error('Erro ao publicar evento:', erro)

    if (erro.response) {
      alert(
        erro.response.data?.detalhes ||
        erro.response.data?.erro ||
        'Erro ao publicar evento.'
      )
    } else {
      alert('Erro ao conectar com a API. Verifique se a API está ligada.')
    }
  }
}

const confirmarPresenca = async (id) => {
  if (!token) {
    alert('Você precisa estar logado para confirmar presença.')
    return
  }

  try {
    await api.post(`/api/events/${id}/confirmar`)

    await carregarEventos()
  } catch (erro) {
    console.error('Erro ao confirmar presença:', erro)

    if (erro.response) {
      alert(
        erro.response.data?.detalhes ||
        erro.response.data?.erro ||
        'Erro ao confirmar presença.'
      )
    } else {
      alert('Erro ao conectar com a API.')
    }
  }
}

const cancelarPresenca = async (id) => {
  if (!token) {
    alert('Você precisa estar logado.')
    return
  }

  try {
    await api.delete(`/api/events/${id}/confirmar`)

    await carregarEventos()
  } catch (erro) {
    console.error('Erro ao cancelar presença:', erro)

    if (erro.response) {
      alert(
        erro.response.data?.detalhes ||
        erro.response.data?.erro ||
        'Erro ao cancelar presença.'
      )
    } else {
      alert('Erro ao conectar com a API.')
    }
  }
}

const excluirEvento = async (id) => {
  if (!podePublicar.value) {
    alert('Você não tem permissão para excluir eventos.')
    return
  }

  const confirmar = confirm('Tem certeza que deseja excluir este evento?')

  if (!confirmar) return

  try {
    await api.delete(`/api/events/${id}`)

    alert('Evento excluído com sucesso!')
    carregarEventos()
  } catch (erro) {
    console.error('Erro ao excluir evento:', erro)

    if (erro.response) {
      alert(
        erro.response.data?.detalhes ||
        erro.response.data?.erro ||
        'Erro ao excluir evento.'
      )
    } else {
      alert('Erro ao conectar com a API.')
    }
  }
}

const formatarData = (data) => {
  if (!data) return 'Data não informada'

  const dataLimpa = String(data).split('T')[0]
  const dataFormatada = new Date(dataLimpa + 'T00:00:00')

  return dataFormatada.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

const imagemEvento = (evento) => {
  if (evento.imagem && evento.imagem.trim() !== '') {
    return evento.imagem
  }

  if (evento.imagem_url && evento.imagem_url.trim() !== '') {
    return evento.imagem_url
  }

  return 'https://images.unsplash.com/photo-1519389950473-47ba0277781c'
}

const capacidadeTotal = (capacidade) => {
  if (!capacidade) return '∞'

  const texto = String(capacidade)

  if (texto.includes('/')) {
    return texto.split('/')[1]
  }

  return texto
}

onMounted(() => {
  carregarEventos()
})
</script>

<style scoped>
@import "../assets/css/eventos.css";

.eventos-page .event-image {
  width: 100%;
  height: 230px;
  overflow: hidden;
}

.eventos-page .event-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* ================= PUBLICAR EVENTO ================= */

.eventos-page .publicar-evento {
  margin-top: 30px;
  margin-bottom: 40px;
  padding: 25px;
  border-radius: 16px;
  background: #ffffff;
  border: 1px solid #e5edf4;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.07);
}

.eventos-page .form-evento {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.eventos-page .form-evento input,
.eventos-page .form-evento textarea {
  width: 100%;
  padding: 13px 15px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  font-size: 15px;
  outline: none;
}

.eventos-page .form-evento textarea {
  min-height: 100px;
  resize: vertical;
}

.eventos-page .form-evento input:focus,
.eventos-page .form-evento textarea:focus {
  border-color: #1ca4a6;
}

/* ================= AVISOS ================= */

.eventos-page .sem-permissao {
  margin: 25px 0;
  padding: 15px;
  border-radius: 12px;
  background: #fff3cd;
  color: #856404;
  font-weight: 500;
}

.eventos-page .mensagem-eventos {
  padding: 18px;
  border-radius: 12px;
  background: #ffffff;
  color: #445164;
  border: 1px solid #e5edf4;
}

.eventos-page .mensagem-erro {
  padding: 18px;
  border-radius: 12px;
  background: #ffe5e5;
  color: #9f1d1d;
  border: 1px solid #ffb4b4;
  font-weight: 600;
}

/* ================= BOTÕES ================= */

.eventos-page .cancelar-btn {
  background: #f59e0b;
  box-shadow: 0 12px 24px rgba(245, 158, 11, 0.18);
}

.eventos-page .cancelar-btn:hover {
  background: #d97706;
  box-shadow: 0 16px 30px rgba(245, 158, 11, 0.25);
}

.eventos-page .delete-btn {
  margin-top: 10px;
  background: #dc3545;
  box-shadow: 0 12px 24px rgba(220, 53, 69, 0.18);
}

.eventos-page .delete-btn:hover {
  background: #b02a37;
  box-shadow: 0 16px 30px rgba(220, 53, 69, 0.25);
}

/* ================= MODO ESCURO ================= */

body.dark-mode .eventos-page .publicar-evento,
body.dark-mode .eventos-page .mensagem-eventos {
  background: #1e293b;
  color: #e2e8f0;
  border-color: #334155;
  box-shadow: 0 14px 40px rgba(0, 0, 0, 0.38);
}

body.dark-mode .eventos-page .form-evento input,
body.dark-mode .eventos-page .form-evento textarea {
  background: #0f172a;
  color: #f8fafc;
  border-color: #334155;
}

body.dark-mode .eventos-page .form-evento input::placeholder,
body.dark-mode .eventos-page .form-evento textarea::placeholder {
  color: #94a3b8;
}

body.dark-mode .eventos-page .sem-permissao {
  background: rgba(234, 179, 8, 0.16);
  color: #fde68a;
}

body.dark-mode .eventos-page .mensagem-erro {
  background: rgba(220, 38, 38, 0.18);
  color: #fecaca;
  border-color: rgba(248, 113, 113, 0.35);
}

@media (max-width: 480px) {
  .eventos-page .event-image {
    height: 190px;
  }
}
</style>