<template>
  <main class="container">

    <section class="hero">
      <h1>Calendário de Eventos</h1>
      <p>Veja todos os eventos da comunidade Ecossistema Academy.</p>
    </section>

    <section class="calendar-section">

      <!-- Painéis laterais -->
      <div class="left-panels">
        <div class="panel">Painel 1</div>
        <div class="panel">Painel 2</div>
        <div class="panel">Painel 3</div>
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
              'event-day': day.type === 'eniac'
            }"
            @click="selectDay(day.fullDate)"
          >
            {{ day.day }}
          </div>
        </div>

      </div>

      <!-- Eventos -->
      <div class="event-panel">
        <h3>Eventos do Dia</h3>

        <div v-if="!selectedDate">
          <p>Selecione um dia para ver os eventos.</p>
        </div>

        <div v-else-if="!events[selectedDate]">
          <p>Nenhum evento neste dia.</p>
        </div>

        <div v-else>
          <div class="event-item">
            <strong>{{ events[selectedDate].title }}</strong>
          </div>
        </div>
      </div>

    </section>

  </main>
</template>

<style  scoped>
@import "../assets/css/geral.css";
@import "../assets/css/calendario.css";
</style>

<script>
export default {
  data() {
    return {
      currentDate: new Date(),
      selectedDate: null,

      events: {
        "2026-05-17": {
          title: "Workshop de React Native - ENIAC",
          type: "eniac"
        },
        "2026-05-20": {
          title: "Palestra UX/UI Design - ENIAC",
          type: "eniac"
        }
      }
    }
  },

  computed: {
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

      // espaços vazios
      for (let i = 0; i < firstDay; i++) {
        days.push({ day: "", fullDate: `empty-${i}` })
      }

      // dias do mês
      for (let day = 1; day <= lastDate; day++) {
        const fullDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`

        let type = null
        if (this.events[fullDate]) {
          type = this.events[fullDate].type
        }

        days.push({
          day,
          fullDate,
          type
        })
      }

      return days
    }
  },

  methods: {
    nextMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() + 1
      )
      this.loadHolidays()
    },

    prevMonth() {
      this.currentDate = new Date(
        this.currentDate.getFullYear(),
        this.currentDate.getMonth() - 1
      )
      this.loadHolidays()
    },

    selectDay(date) {
      if (date.includes("empty")) return
      this.selectedDate = date
    },

    isToday(date) {
      const today = new Date().toISOString().split("T")[0]
      return today === date
    },

    isSelected(date) {
      return this.selectedDate === date
    },

    async loadHolidays() {
      const year = this.currentDate.getFullYear()

      try {
        const response = await fetch(`https://brasilapi.com.br/api/feriados/v1/${year}`)
        const data = await response.json()

        data.forEach(f => {
          this.events[f.date] = {
            title: f.name,
            type: "feriado"
          }
        })

      } catch (e) {
        console.log("Erro ao carregar feriados", e)
      }
    }
  },

  mounted() {
    this.loadHolidays()
  }
}
</script>