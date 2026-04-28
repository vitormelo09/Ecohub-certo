<template>
  <main class="container">
    <section class="hero">
      <h1>Calendário de Eventos</h1>
      <p>Veja todos os eventos da comunidade Ecossistema Academy.</p>
    </section>

    <section class="calendar-section">
      <!-- Painéis laterais -->
      <div class="left-panels">
        <div class="panel">
          <h3>Próximos Eventos</h3>

          <div v-if="proximosEventos.length">
            <div
              v-for="evento in proximosEventos"
              :key="evento.date + evento.title"
              class="mini-evento"
            >
              <strong>{{ evento.title }}</strong>
              <p>{{ formatDate(evento.date) }}</p>
            </div>
          </div>

          <div v-else>
            <p>Nenhum próximo evento.</p>
          </div>
        </div>

        <div class="panel">
          <h3>Meus lembretes</h3>

          <div v-if="meusProximosEventos.length">
            <div
              v-for="evento in meusProximosEventos"
              :key="evento.date + evento.title"
              class="mini-evento pessoal"
            >
              <strong>{{ evento.title }}</strong>
              <p>{{ formatDate(evento.date) }}</p>
            </div>
          </div>

          <div v-else>
            <p>Você ainda não adicionou lembretes.</p>
          </div>
        </div>

        <div class="panel">
          <h3>Legenda</h3>
          <p><span class="legenda-dot eniac"></span> Evento ENIAC</p>
          <p><span class="legenda-dot feriado"></span> Feriado</p>
          <p><span class="legenda-dot pessoal"></span> Meu lembrete</p>
        </div>
      </div>

      <!-- Calendário -->
      <div class="calendar">
        <div class="calendar-header">
          <button @click="prevMonth">❮</button>
          <h2>{{ monthYear }}</h2>
          <button @click="nextMonth">❯</button>
        </div>

        <div class="weekdays">
          <div>Dom</div>
          <div>Seg</div>
          <div>Ter</div>
          <div>Qua</div>
          <div>Qui</div>
          <div>Sex</div>
          <div>Sáb</div>
        </div>

        <div class="days">
          <div
            v-for="day in calendarDays"
            :key="day.fullDate"
            class="day"
            :class="{
              today: isToday(day.fullDate),
              selected: isSelected(day.fullDate),
              holiday: day.type === 'feriado',
              'event-day': day.type === 'eniac',
              'personal-day': day.type === 'pessoal',
              empty: day.fullDate.includes('empty')
            }"
            @click="selectDay(day.fullDate)"
          >
            <span>{{ day.day }}</span>

            <small v-if="day.type === 'eniac'" class="day-dot eniac"></small>
            <small v-if="day.type === 'feriado'" class="day-dot feriado"></small>
            <small v-if="day.type === 'pessoal'" class="day-dot pessoal"></small>
          </div>
        </div>
      </div>

      <!-- Eventos -->
      <div class="event-panel">
        <h3>Eventos do Dia</h3>

        <div v-if="carregandoEventos">
          <p>Carregando eventos...</p>
        </div>

        <div v-else-if="!selectedDate">
          <p>Selecione um dia para ver ou adicionar eventos.</p>
        </div>

        <div v-else>
          <p class="data-selecionada">
            {{ formatDate(selectedDate) }}
          </p>

          <div v-if="eventosDoDia.length === 0">
            <p>Nenhum evento neste dia.</p>
          </div>

          <div v-else>
            <div
              v-for="evento in eventosDoDia"
              :key="evento.id"
              class="event-item"
              :class="evento.type"
            >
              <strong>{{ evento.title }}</strong>

              <span v-if="evento.type === 'eniac'" class="tipo-evento">
                Evento ENIAC
              </span>

              <span v-if="evento.type === 'feriado'" class="tipo-evento">
                Feriado
              </span>

              <span v-if="evento.type === 'pessoal'" class="tipo-evento">
                Meu lembrete
              </span>

              <p v-if="evento.descricao">
                {{ evento.descricao }}
              </p>

              <p v-if="evento.horario">
                Horário: {{ evento.horario }}
              </p>

              <p v-if="evento.local">
                Local: {{ evento.local }}
              </p>

              <button
                v-if="evento.type === 'pessoal'"
                class="btn-excluir-evento"
                @click="excluirEventoPessoal(evento.id)"
              >
                Excluir
              </button>
            </div>
          </div>

          <div class="form-evento-pessoal">
            <h4>Adicionar meu lembrete</h4>

            <input
              type="text"
              v-model="novoEventoTitulo"
              placeholder="Ex: Entregar atividade, estudar, reunião..."
              @keyup.enter="adicionarEventoPessoal"
            >

            <button @click="adicionarEventoPessoal">
              Adicionar
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script>
import api from "../services/api"

export default {
  name: "CalendarioEventos",

  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,
      novoEventoTitulo: "",
      carregandoEventos: false,

      eventosApi: {},
      feriados: {},
      eventosPessoais: {}
    }
  },

  computed: {
    usuarioKey() {
      const usuario = JSON.parse(localStorage.getItem("usuario")) || {}

      return usuario.id || usuario.email || "usuario-sem-login"
    },

    chaveLocalStorage() {
      return `eventos-calendario-${this.usuarioKey}`
    },

    todosEventos() {
      const eventosJuntos = {}

      Object.keys(this.eventosApi).forEach((data) => {
        eventosJuntos[data] = [...this.eventosApi[data]]
      })

      Object.keys(this.feriados).forEach((data) => {
        if (!eventosJuntos[data]) {
          eventosJuntos[data] = []
        }

        eventosJuntos[data].push(...this.feriados[data])
      })

      Object.keys(this.eventosPessoais).forEach((data) => {
        if (!eventosJuntos[data]) {
          eventosJuntos[data] = []
        }

        eventosJuntos[data].push(...this.eventosPessoais[data])
      })

      return eventosJuntos
    },

    monthYear() {
      return this.currentDate.toLocaleDateString("pt-BR", {
        month: "long",
        year: "numeric"
      })
    },

    calendarDays() {
      const year = this.currentDate.getFullYear()
      const month = this.currentDate.getMonth()

      const firstDay = new Date(year, month, 1).getDay()
      const lastDate = new Date(year, month + 1, 0).getDate()

      const days = []

      for (let i = 0; i < firstDay; i++) {
        days.push({
          day: "",
          fullDate: `empty-${i}`,
          type: null
        })
      }

      for (let day = 1; day <= lastDate; day++) {
        const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

        let type = null

        if (this.todosEventos[fullDate]) {
          const eventosDoDia = this.todosEventos[fullDate]

          if (eventosDoDia.some((evento) => evento.type === "pessoal")) {
            type = "pessoal"
          } else if (eventosDoDia.some((evento) => evento.type === "eniac")) {
            type = "eniac"
          } else if (eventosDoDia.some((evento) => evento.type === "feriado")) {
            type = "feriado"
          }
        }

        days.push({
          day,
          fullDate,
          type
        })
      }

      return days
    },

    eventosDoDia() {
      if (!this.selectedDate) {
        return []
      }

      return this.todosEventos[this.selectedDate] || []
    },

    proximosEventos() {
      const hoje = new Date().toISOString().split("T")[0]

      return Object.entries(this.eventosApi)
        .filter(([date, eventos]) => {
          return date >= hoje && eventos.some((evento) => evento.type === "eniac")
        })
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(0, 3)
        .map(([date, eventos]) => ({
          date,
          title: eventos[0].title
        }))
    },

    meusProximosEventos() {
      const hoje = new Date().toISOString().split("T")[0]

      return Object.entries(this.eventosPessoais)
        .filter(([date]) => date >= hoje)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .slice(0, 4)
        .map(([date, eventos]) => ({
          date,
          title: eventos[0].title
        }))
    }
  },

  methods: {
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1,
        1
      )

      this.loadHolidays()
    },

    prevMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1,
        1
      )

      this.loadHolidays()
    },

    selectDay(date) {
      if (date.includes("empty")) return

      this.selectedDate = date
      this.novoEventoTitulo = ""
    },

    isToday(date) {
      const today = new Date().toISOString().split("T")[0]
      return today === date
    },

    isSelected(date) {
      return this.selectedDate === date
    },

    formatDate(date) {
      if (!date) return "Data não informada"

      const dataLimpa = String(date).split("T")[0]
      const dataFormatada = new Date(dataLimpa + "T00:00:00")

      if (Number.isNaN(dataFormatada.getTime())) {
        return "Data inválida"
      }

      return dataFormatada.toLocaleDateString("pt-BR")
    },

    limparData(data) {
      if (!data) return ""

      return String(data).split("T")[0]
    },

    pegarListaDaResposta(dados) {
      if (Array.isArray(dados)) return dados
      if (Array.isArray(dados.eventos)) return dados.eventos
      if (Array.isArray(dados.events)) return dados.events
      if (Array.isArray(dados.data)) return dados.data
      if (Array.isArray(dados.results)) return dados.results
      return []
    },

    async carregarEventosDaApi() {
      try {
        this.carregandoEventos = true

        const response = await api.get("/api/events")
        const eventosBanco = this.pegarListaDaResposta(response.data)

        const eventosOrganizados = {}

        eventosBanco.forEach((evento) => {
          const dataEvento = this.limparData(
            evento.data_evento ||
            evento.data ||
            evento.dataEvento ||
            evento.date
          )

          if (!dataEvento) return

          if (!eventosOrganizados[dataEvento]) {
            eventosOrganizados[dataEvento] = []
          }

          eventosOrganizados[dataEvento].push({
            id: `api-${evento.id}`,
            title: evento.titulo || evento.title || "Evento sem título",
            type: "eniac",
            horario: evento.horario || evento.hora || "",
            local: evento.local || "",
            descricao: evento.descricao || ""
          })
        })

        this.eventosApi = eventosOrganizados
      } catch (error) {
        console.error("Erro ao carregar eventos da API:", error)
      } finally {
        this.carregandoEventos = false
      }
    },

    carregarEventosPessoais() {
      const eventosSalvos = localStorage.getItem(this.chaveLocalStorage)

      if (eventosSalvos) {
        try {
          this.eventosPessoais = JSON.parse(eventosSalvos) || {}
        } catch (error) {
          console.error("Erro ao ler lembretes salvos:", error)
          this.eventosPessoais = {}
        }
      }
    },

    salvarEventosPessoais() {
      localStorage.setItem(
        this.chaveLocalStorage,
        JSON.stringify(this.eventosPessoais)
      )
    },

    adicionarEventoPessoal() {
      if (!this.selectedDate) {
        alert("Selecione um dia no calendário.")
        return
      }

      if (!this.novoEventoTitulo.trim()) {
        alert("Digite o nome do lembrete.")
        return
      }

      const novoEvento = {
        id: `pessoal-${Date.now()}`,
        title: this.novoEventoTitulo.trim(),
        type: "pessoal"
      }

      const eventosDoDia = this.eventosPessoais[this.selectedDate]
        ? [...this.eventosPessoais[this.selectedDate]]
        : []

      eventosDoDia.push(novoEvento)

      this.eventosPessoais = {
        ...this.eventosPessoais,
        [this.selectedDate]: eventosDoDia
      }

      this.salvarEventosPessoais()
      this.novoEventoTitulo = ""
    },

    excluirEventoPessoal(id) {
      if (!this.selectedDate) return

      const confirmar = confirm("Deseja excluir este lembrete?")

      if (!confirmar) return

      const eventosDoDia = this.eventosPessoais[this.selectedDate] || []

      const eventosAtualizados = eventosDoDia.filter((evento) => evento.id !== id)

      const novosEventosPessoais = {
        ...this.eventosPessoais
      }

      if (eventosAtualizados.length === 0) {
        delete novosEventosPessoais[this.selectedDate]
      } else {
        novosEventosPessoais[this.selectedDate] = eventosAtualizados
      }

      this.eventosPessoais = novosEventosPessoais

      this.salvarEventosPessoais()
    },

    async loadHolidays() {
      const year = this.currentDate.getFullYear()

      try {
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)
        const data = await response.json()

        const feriadosOrganizados = { ...this.feriados }

        data.forEach((feriado) => {
          if (!feriadosOrganizados[feriado.date]) {
            feriadosOrganizados[feriado.date] = []
          }

          const jaExiste = feriadosOrganizados[feriado.date].some(
            (evento) => evento.title === feriado.name
          )

          if (!jaExiste) {
            feriadosOrganizados[feriado.date].push({
              id: `feriado-${feriado.date}`,
              title: feriado.name,
              type: "feriado"
            })
          }
        })

        this.feriados = feriadosOrganizados
      } catch (e) {
        console.log("Erro ao carregar feriados", e)
      }
    }
  },

  mounted() {
    this.carregarEventosPessoais()
    this.carregarEventosDaApi()
    this.loadHolidays()
  }
}
</script>

<style scoped>
@import "../assets/css/calendario.css";
</style>