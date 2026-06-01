<template>
  <main class="denuncias-page">
    <section class="denuncias-card">
      <div class="denuncias-header">
        <div>
          <h1>Denúncias</h1>
          <p>Veja quem denunciou posts, projetos e perfis.</p>
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

<span
  class="badge"
  :class="denuncia.status"
>
  {{ denuncia.status }}
</span>

<span
  class="tipo"
  :class="denuncia.tipo"
>
  {{ formatarTipo(denuncia) }}
</span>

</div>

          <div class="usuario-denunciado-box">
            <img
              :src="fotoDenunciado(denuncia)"
              alt="Foto do denunciado"
              class="foto-denunciado"
            >

            <div>
              <strong>
                {{ denuncia.denunciado_nome || 'Usuário denunciado' }}
              </strong>

              <span>
                {{ denuncia.denunciado_email || 'E-mail não informado' }}
              </span>

              <small>
                {{ textoTipoDenunciado(denuncia) }}
              </small>
            </div>
          </div>

          <h3>{{ denuncia.motivo }}</h3>

          <p v-if="denuncia.descricao" class="descricao">
            {{ denuncia.descricao }}
          </p>

          <div class="info-grid">

<div>
  <strong>Denunciante:</strong>

  <span>
    {{ denuncia.denunciante_nome }}
  </span>
</div>

<div>
  <strong>Email:</strong>

  <span>
    {{ denuncia.denunciante_email }}
  </span>
</div>

<div>

  <strong>Tipo:</strong>

  <span
    class="tipo-info"
    :class="denuncia.tipo"
  >
    {{ formatarTipo(denuncia) }}
  </span>

</div>

<div>
  <strong>ID denunciado:</strong>

  <span>
    {{ denuncia.referencia_id }}
  </span>
</div>

<div>
  <strong>Data:</strong>

  <span>
    {{ formatarData(denuncia.data_criacao) }}
  </span>
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

const API_URL = 'http://localhost:3000'

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

const montarUrlFoto = (foto) => {
  if (!foto) return null

  if (String(foto).startsWith('http')) {
    return foto
  }

  if (String(foto).startsWith('/uploads')) {
    return `${API_URL}${foto}`
  }

  if (String(foto).startsWith('uploads')) {
    return `${API_URL}/${foto}`
  }

  return null
}

const fotoDenunciado = (denuncia) => {
  const foto =
    denuncia.denunciado_foto_url ||
    denuncia.denunciado_foto_perfil_url ||
    denuncia.denunciado_foto ||
    denuncia.denunciado_foto_perfil ||
    denuncia.foto_denunciado ||
    denuncia.foto_perfil_denunciado ||
    null

  const url = montarUrlFoto(foto)

  if (url) return url

  return (
    'https://ui-avatars.com/api/?name=' +
    encodeURIComponent(denuncia.denunciado_nome || 'Usuário')
  )
}

const textoTipoDenunciado = (denuncia) => {
  if (denuncia.tipo === 'perfil') {
    return 'Perfil denunciado'
  }

  if (denuncia.tipo === 'post') {
    return 'Dono do post denunciado'
  }

  if (denuncia.tipo === 'projeto') {
    return 'Dono do projeto denunciado'
  }

  return 'Item denunciado'
}

const formatarData = (data) => {
  if (!data) return 'Data não informada'

  return new Date(data).toLocaleString('pt-BR')
}
function formatarTipo(
denuncia
){

if(
denuncia.tipo==="perfil"
){

return "👤 Perfil denunciado"

}

if(
denuncia.tipo==="post"
){

return "📝 Post denunciado"

}

if(
denuncia.tipo==="projeto"
){

return "📁 Projeto denunciado"

}

return denuncia.tipo

}
onMounted(() => {
  carregarDenuncias()
})
</script>

<style scoped>
@import '../assets/css/denuncias.css';

.usuario-denunciado-box {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px;
  margin: 14px 0;
  border-radius: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
}

.foto-denunciado {
  width: 62px;
  height: 62px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  box-shadow: 0 4px 12px rgba(15, 23, 42, 0.16);
}

.usuario-denunciado-box strong {
  display: block;
  color: #0f172a;
  font-size: 16px;
  margin-bottom: 3px;
}

.usuario-denunciado-box span {
  display: block;
  color: #475569;
  font-size: 14px;
  margin-bottom: 4px;
}

.usuario-denunciado-box small {
  color: #0b5fa5;
  font-weight: 800;
}

body.dark .usuario-denunciado-box,
body.dark-mode .usuario-denunciado-box {
  background: #0f172a;
  border-color: #334155;
}

body.dark .usuario-denunciado-box strong,
body.dark-mode .usuario-denunciado-box strong {
  color: #f8fafc;
}

body.dark .usuario-denunciado-box span,
body.dark-mode .usuario-denunciado-box span {
  color: #cbd5e1;
}

body.dark .usuario-denunciado-box small,
body.dark-mode .usuario-denunciado-box small {
  color: #38bdf8;
}

/* ==========================
TIPOS
========================== */

.tipo,
.tipo-info{

display:inline-flex;

align-items:center;

padding:8px 14px;

border-radius:999px;

font-size:13px;

font-weight:800;

}

/* PERFIL */

.tipo.perfil,
.tipo-info.perfil{

background:#ede9fe;

color:#6d28d9;

}

/* POST */

.tipo.post,
.tipo-info.post{

background:#dbeafe;

color:#1d4ed8;

}

/* PROJETO */

.tipo.projeto,
.tipo-info.projeto{

background:#dcfce7;

color:#166534;

}

/* DARK */

body.dark .tipo,
body.dark .tipo-info,
body.dark-mode .tipo,
body.dark-mode .tipo-info{

border:none;

}

body.dark .tipo.perfil,
body.dark .tipo-info.perfil,
body.dark-mode .tipo.perfil,
body.dark-mode .tipo-info.perfil{

background:#2e1065;

color:#c4b5fd;

}

body.dark .tipo.post,
body.dark .tipo-info.post,
body.dark-mode .tipo.post,
body.dark-mode .tipo-info.post{

background:#172554;

color:#93c5fd;

}

body.dark .tipo.projeto,
body.dark .tipo-info.projeto,
body.dark-mode .tipo.projeto,
body.dark-mode .tipo-info.projeto{

background:#052e16;

color:#86efac;

}
</style>