<template>
  <main class="vermais-page">

    <section v-if="carregando" class="estado">
      Carregando notícia...
    </section>

    <section v-else-if="erro" class="estado erro">
      {{ erro }}
    </section>

    <article
      v-else-if="noticia"
      class="noticia-detalhe"
    >

      <img
        :src="imagemNoticia(noticia)"
        :alt="noticia.titulo"
        class="noticia-imagem"
      >

      <div class="noticia-conteudo">

        <span class="categoria">
          {{ noticia.categoria || 'Geral' }}
        </span>

        <h1>
          {{ noticia.titulo }}
        </h1>

        <p class="data">
          {{ formatarData(
            noticia.data_publicacao ||
            noticia.data_noticia ||
            noticia.data
          ) }}
        </p>

        <p class="resumo">
          {{ noticia.resumo }}
        </p>

        <div class="texto-completo">
          {{ noticia.conteudo || noticia.conteudo_completo }}
        </div>

        <div class="acoes">

          <button
            class="btn-curtir"
            @click="curtirNoticia"
          >
            Curtir
          </button>

          <RouterLink
            to="/noticias"
            class="btn-voltar"
          >
            Voltar para notícias
          </RouterLink>

          <RouterLink
            to="/fontes"
            class="btn-fonte"
          >
            Ver fontes
          </RouterLink>

        </div>

      </div>

    </article>

  </main>
</template>

<script>
import api from "../services/api"

export default {
  name: "VerMais",

  data() {
    return {
      noticia: null,
      carregando: false,
      erro: ""
    }
  },

  methods: {

    async carregarNoticia() {

      try {

        this.carregando = true
        this.erro = ""

        const id = this.$route.params.id

        const resposta =
          await api.get(`/api/news/${id}`)

        this.noticia =
          resposta.data?.noticia ||
          resposta.data

      } catch (erro) {

        console.error(
          "Erro ao carregar notícia:",
          erro
        )

        this.erro =
          "Não foi possível carregar essa notícia."

      } finally {

        this.carregando = false

      }

    },

    async curtirNoticia() {

      const token =
        localStorage.getItem("token")

      if (!token) {

        alert(
          "Você precisa estar logado para curtir notícias."
        )

        return

      }

      try {

        await api.post(
          `/api/news/${this.noticia.id}/like`
        )

        await this.carregarNoticia()

      } catch {

        alert(
          "Erro ao curtir notícia."
        )

      }

    },

    formatarData(data) {

      if (!data)
        return "Data não informada"

      const dataLimpa =
        String(data)
          .split("T")[0]

      const dataFormatada =
        new Date(
          dataLimpa + "T00:00:00"
        )

      if (
        Number.isNaN(
          dataFormatada.getTime()
        )
      ) {
        return "Data inválida"
      }

      return dataFormatada
        .toLocaleDateString(
          "pt-BR"
        )

    },

    imagemNoticia(noticia) {

      if (
        noticia.imagem
      ) {
        return noticia.imagem
      }

      if (
        noticia.imagem_url
      ) {
        return noticia.imagem_url
      }

      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"

    }

  },

  mounted() {

    this.carregarNoticia()

  }
}
</script>

<style scoped>

.vermais-page{
max-width:1100px;
margin:40px auto;
padding:0 20px;
}

.estado{
text-align:center;
font-size:18px;
color:#475569;
}

.erro{
color:#dc2626;
}

.noticia-detalhe{
background:#ffffff;
border-radius:24px;
overflow:hidden;
box-shadow:
0 12px 35px
rgba(0,0,0,.08);
}

.noticia-imagem{
width:100%;
height:420px;
object-fit:cover;
display:block;
}

.noticia-conteudo{
padding:35px;
}

.categoria{
display:inline-block;
background:#2788C8;
color:#fff;
padding:8px 14px;
border-radius:999px;
font-size:14px;
font-weight:700;
margin-bottom:18px;
}

.noticia-conteudo h1{
color:#051D40;
font-size:36px;
margin-bottom:10px;
}

.data{
color:#64748b;
margin-bottom:20px;
}

.resumo{
font-size:20px;
color:#334155;
font-weight:600;
margin-bottom:24px;
line-height:1.6;
}

.texto-completo{
color:#475569;
font-size:17px;
line-height:1.8;
white-space:pre-line;
}

.acoes{
display:flex;
gap:14px;
flex-wrap:wrap;
margin-top:30px;
}

.btn-curtir,
.btn-voltar,
.btn-fonte{
border:none;
text-decoration:none;
padding:13px 18px;
border-radius:12px;
font-weight:700;
cursor:pointer;
color:white;
}

.btn-curtir{
background:#2788C8;
}

.btn-voltar{
background:#051D40;
}

.btn-fonte{
background:#16a34a;
}

body.dark-mode .noticia-detalhe{
background:#1e2c46;
color:white;
}

body.dark-mode .noticia-conteudo h1{
color:white;
}

body.dark-mode .data,
body.dark-mode .resumo,
body.dark-mode .texto-completo{
color:#dbeafe;
}

@media(max-width:768px){

.noticia-imagem{
height:260px;
}

.noticia-conteudo{
padding:24px;
}

.noticia-conteudo h1{
font-size:28px;
}

}

</style>