<template>
  <main class="eventos-page">
    <div class="container">

      <section class="hero">
        <h3>Meus Eventos</h3>
        <p>Veja os eventos em que você confirmou presença.</p>
      </section>

      <section>
        <h2 class="section-title">Eventos Confirmados</h2>

        <p v-if="carregando" class="mensagem-eventos">
          Carregando seus eventos...
        </p>

        <p v-else-if="erroEventos" class="mensagem-erro">
          {{ erroEventos }}
        </p>

        <p v-else-if="eventos.length === 0" class="mensagem-eventos">
          Você ainda não confirmou presença em nenhum evento.
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
                class="button cancelar-btn"
                @click="cancelarPresenca(evento.id)"
              >
                Cancelar Presença
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const eventos = ref([])
const carregando = ref(false)
const erroEventos = ref('')

const carregarMeusEventos = async () => {
  try {
    carregando.value = true
    erroEventos.value = ''

    const resposta = await api.get('/api/events/meus-eventos')

    eventos.value = resposta.data
  } catch (erro) {
    console.error('Erro ao carregar meus eventos:', erro)

    if (erro.response) {
      erroEventos.value =
        erro.response.data?.detalhes ||
        erro.response.data?.erro ||
        'Não foi possível carregar seus eventos.'
    } else {
      erroEventos.value = 'Não foi possível conectar com a API.'
    }
  } finally {
    carregando.value = false
  }
}

const cancelarPresenca = async (id) => {
  const confirmar = confirm('Deseja cancelar sua presença neste evento?')

  if (!confirmar) return

  try {
    await api.delete(`/api/events/${id}/confirmar`)

    carregarMeusEventos()
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
  carregarMeusEventos()
})
</script>

<style scoped>
@import "../assets/css/eventos.css";

</style>