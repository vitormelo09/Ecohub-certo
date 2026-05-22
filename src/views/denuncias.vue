<template>
  <main class="denuncias-page">
    <section class="denuncias-card">
      <div class="denuncias-header">
        <div>
          <h1>Denúncias</h1>
          <p>Veja quem denunciou posts e projetos.</p>
        </div>

        <button @click="carregarDenuncias">
          Atualizar
        </button>
      </div>

      <p v-if="carregando" class="mensagem">
        Carregando denúncias...
      </p>

      <p v-else-if="erro" class="mensagem erro">
        {{ erro }}
      </p>

      <div v-else-if="denuncias.length === 0" class="mensagem">
        Nenhuma denúncia encontrada.
      </div>

      <div v-else class="denuncias-lista">
        <article
          v-for="denuncia in denuncias"
          :key="denuncia.id"
          class="denuncia-item"
        >
          <div class="denuncia-topo">
            <span class="badge" :class="denuncia.status">
              {{ denuncia.status }}
            </span>

            <span class="tipo">
              {{ denuncia.tipo }}
            </span>
          </div>

          <h3>{{ denuncia.motivo }}</h3>

          <p v-if="denuncia.descricao" class="descricao">
            {{ denuncia.descricao }}
          </p>

          <div class="info-grid">
            <div>
              <strong>Denunciante:</strong>
              <span>{{ denuncia.denunciante_nome }}</span>
            </div>

            <div>
              <strong>Email:</strong>
              <span>{{ denuncia.denunciante_email }}</span>
            </div>

            <div>
              <strong>Tipo:</strong>
              <span>{{ denuncia.tipo }}</span>
            </div>

            <div>
              <strong>ID denunciado:</strong>
              <span>{{ denuncia.referencia_id }}</span>
            </div>

            <div>
              <strong>Data:</strong>
              <span>{{ formatarData(denuncia.data_criacao) }}</span>
            </div>
          </div>

          <div class="acoes">
            <button
              class="btn-analisado"
              @click="atualizarStatus(denuncia.id, 'analisado')"
            >
              Marcar analisado
            </button>

            <button
              class="btn-removido"
              @click="atualizarStatus(denuncia.id, 'removido')"
            >
              Marcar removido
            </button>

            <button
              class="btn-pendente"
              @click="atualizarStatus(denuncia.id, 'pendente')"
            >
              Voltar pendente
            </button>
          </div>
        </article>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import api from '../services/api'

const denuncias = ref([])
const carregando = ref(false)
const erro = ref('')

const carregarDenuncias = async () => {
  try {
    carregando.value = true
    erro.value = ''

    const resposta = await api.get('/api/reports')

    denuncias.value = resposta.data
  } catch (error) {
    console.error('Erro ao carregar denúncias:', error)

    erro.value =
      error.response?.data?.erro ||
      error.response?.data?.message ||
      'Erro ao carregar denúncias.'
  } finally {
    carregando.value = false
  }
}

const atualizarStatus = async (id, status) => {
  try {
    await api.put(`/api/reports/${id}/status`, {
      status
    })

    await carregarDenuncias()
  } catch (error) {
    console.error('Erro ao atualizar denúncia:', error)

    alert(
      error.response?.data?.erro ||
      error.response?.data?.message ||
      'Erro ao atualizar denúncia.'
    )
  }
}

const formatarData = (data) => {
  if (!data) return 'Data não informada'

  return new Date(data).toLocaleString('pt-BR')
}

onMounted(() => {
  carregarDenuncias()
})
</script>

<style scoped>
@import '../assets/css/denuncias.css';

</style>