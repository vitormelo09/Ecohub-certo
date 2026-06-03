```vue
<template>
  <main class="fontes-page">

    <section class="fontes-header">

      <h1>
        Fontes de Informação
      </h1>

      <p>
        Aqui ficam os links utilizados nas notícias publicadas no EcoHub.
      </p>

    </section>

    <section class="fontes-card">

      <div
        v-if="carregando"
        class="estado"
      >
        Carregando fontes...
      </div>

      <div
        v-else-if="erro"
        class="estado erro"
      >
        {{ erro }}
      </div>

      <div
        v-else-if="fontes.length === 0"
        class="estado"
      >
        Nenhuma fonte cadastrada nas notícias.
      </div>

      <div
        v-else
        class="fontes-lista"
      >

        <article
          v-for="fonte in fontes"
          :key="fonte.id"
          class="fonte-item"
        >

          <h2>
            {{ fonte.titulo }}
          </h2>

          <p
            v-if="fonte.resumo"
          >
            {{ fonte.resumo }}
          </p>

          <!-- LINK VÁLIDO -->
          <a
            v-if="linkValido(fonte.link)"
            :href="fonte.link"
            target="_blank"
            rel="noopener noreferrer"
            class="texto-link"
          >
            {{ fonte.link }}
          </a>

          <!-- TEXTO NORMAL -->
          <span
            v-else
            class="fonte-invalida"
          >
            Fonte inválida ou indisponível
          </span>

        </article>

      </div>

    </section>

  </main>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "../services/api"

const noticias = ref([])

const fontes = ref([])

const carregando = ref(false)

const erro = ref("")

function linkValido(link){

if(!link)
return false

try{

const url =
new URL(link)

return (
url.protocol === "http:" ||
url.protocol === "https:"
)

}

catch{

return false

}

}

async function carregarFontes(){

carregando.value = true

erro.value = ""

try{

const response =
await api.get("/api/news")

noticias.value =
Array.isArray(response.data)
? response.data
: response.data.noticias ||
response.data.news ||
[]

fontes.value =
noticias.value.filter(
noticia =>
noticia.link &&
noticia.link.trim() !== ""
)

}

catch(error){

console.error(error)

erro.value =
"Não foi possível carregar as fontes."

}

finally{

carregando.value = false

}

}

onMounted(()=>{

carregarFontes()

})
</script>

<style scoped>

.fontes-page{
min-height:calc(100vh - 70px);
padding:40px 20px;
background:#f4f8fb;
}

.fontes-header{
max-width:1100px;
margin:0 auto 28px;
text-align:center;
}

.fontes-header h1{
font-size:34px;
color:#122033;
margin-bottom:10px;
}

.fontes-header p{
color:#64748b;
}

.fontes-card{
max-width:1100px;
margin:auto;
background:#fff;
border:1px solid #e5edf4;
border-radius:22px;
padding:26px;
}

.fontes-lista{
display:flex;
flex-direction:column;
gap:16px;
}

.fonte-item{
background:#f8fbfd;
border:1px solid #dbe5ee;
border-radius:16px;
padding:18px;
}

.fonte-item h2{
margin-bottom:10px;
color:#122033;
}

.fonte-item p{
margin-bottom:14px;
color:#64748b;
}

.texto-link{
word-break:break-word;
color:#2788C8;
text-decoration:none;
font-weight:700;
}

.texto-link:hover{
text-decoration:underline;
}

.fonte-invalida{
color:#94a3b8;
font-style:italic;
font-weight:600;
}

.estado{
text-align:center;
padding:24px;
}

.erro{
color:#dc2626;
}

/* DARK */

body.dark-mode .fontes-page,
body.dark .fontes-page{
background:#0f172a;
}

body.dark-mode .fontes-card,
body.dark .fontes-card{
background:#1e293b;
border-color:#334155;
}

body.dark-mode .fonte-item,
body.dark .fonte-item{
background:#0f172a;
border-color:#334155;
}

body.dark-mode .fonte-item h2,
body.dark .fonte-item h2{
color:#f8fafc;
}

body.dark-mode .fonte-item p,
body.dark .fonte-item p{
color:#94a3b8;
}

body.dark-mode .texto-link,
body.dark .texto-link{
color:#38bdf8;
}

body.dark-mode .fonte-invalida,
body.dark .fonte-invalida{
color:#94a3b8;
}

/* TITULO */

body.dark-mode .fontes-header h1,
body.dark .fontes-header h1{
color:#f8fafc;
}

</style>
