<template>
  <div class="noticias-page">
    <section class="noticias-hero">
      <div class="hero-container">
        <div class="hero-texto">
          <span class="hero-badge">EcoHub News</span>
          <h1>Fique por dentro das novidades</h1>
          <p>
            Acompanhe notícias sobre tecnologia, inovação, educação e os destaques
            da comunidade acadêmica.
          </p>
        </div>

        <div class="hero-info-card">
          <span class="mini-label">Atualizações</span>
          <h3>{{ noticias.length }} notícias disponíveis</h3>
          <p>
            Explore conteúdos em destaque, filtre por assunto e leia os detalhes
            de cada publicação.
          </p>
        </div>
      </div>
    </section>

    <section class="noticias-conteudo">

      <!-- FORMULÁRIO DE PUBLICAR NOTÍCIA -->
      <section v-if="podePublicar" class="publicar-noticia">
        <h2>Publicar nova notícia</h2>

        <form class="form-noticia" @submit.prevent="publicarNoticia">
          <input
            v-model="novaNoticia.titulo"
            type="text"
            placeholder="Título da notícia"
            required
          >

          <input
            v-model="novaNoticia.categoria"
            type="text"
            placeholder="Categoria. Ex: Tecnologia, Educação, Eventos"
          >

          <input
            v-model="novaNoticia.data_publicacao"
            type="date"
          >

          <input
            v-model="novaNoticia.imagem"
            type="text"
            placeholder="Link da imagem"
          >

          <input
            v-model="novaNoticia.link"
            type="text"
            placeholder="Link da fonte da notícia"
          >

          <textarea
            v-model="novaNoticia.resumo"
            placeholder="Resumo da notícia"
            required
          ></textarea>

          <textarea
            v-model="novaNoticia.conteudo"
            placeholder="Conteúdo completo da notícia"
            required
          ></textarea>

          <button type="submit" class="btn-publicar" :disabled="publicando">
            {{ publicando ? 'Publicando...' : 'Publicar Notícia' }}
          </button>
        </form>
      </section>

      <section v-else class="sem-permissao-noticia">
        <p>Você pode visualizar as notícias, mas não tem permissão para publicar.</p>
      </section>

      <div class="top-bar">
        <div>
          <h2>Últimas notícias</h2>
          <p>Veja os principais conteúdos publicados na plataforma.</p>
        </div>

        <div class="busca-box">
          <input
            v-model="busca"
            type="text"
            placeholder="Buscar notícia..."
          >
        </div>
      </div>

      <p v-if="carregando" class="mensagem-noticia">
        Carregando notícias...
      </p>

      <p v-else-if="erroNoticias" class="mensagem-erro-noticia">
        {{ erroNoticias }}
      </p>

      <section
        v-else-if="noticiaPrincipal"
        class="noticia-destaque"
      >
        <div class="destaque-imagem">
          <img :src="imagemNoticia(noticiaPrincipal)" :alt="noticiaPrincipal.titulo">
        </div>

        <div class="destaque-conteudo">
          <span class="tag-destaque">
            {{ noticiaPrincipal.categoria || 'Geral' }}
          </span>

          <h2>{{ noticiaPrincipal.titulo }}</h2>

          <p class="destaque-resumo">
            {{ noticiaPrincipal.resumo }}
          </p>

          <p class="destaque-texto">
            {{ noticiaPrincipal.conteudo || noticiaPrincipal.conteudo_completo }}
          </p>

          <div class="destaque-footer">
            <span>
              {{ formatarData(noticiaPrincipal.data_noticia || noticiaPrincipal.data || noticiaPrincipal.data_publicacao) }}
            </span>

            <a
              :href="linkNoticia(noticiaPrincipal)"
              target="_blank"
              rel="noopener noreferrer"
            >
              Ler notícia completa →
            </a>
          </div>

          <button
            v-if="podePublicar"
            class="btn-excluir-noticia"
            @click="excluirNoticia(noticiaPrincipal.id)"
          >
            Excluir Notícia
          </button>
        </div>
      </section>

      <section class="lista-section">
        <div class="lista-header">
          <h3>Mais notícias</h3>
          <span>{{ noticiasFiltradas.length }} resultado(s)</span>
        </div>

        <div v-if="noticiasFiltradas.length" class="noticias-grid">
          <article
            v-for="noticia in noticiasFiltradas"
            :key="noticia.id"
            class="card-noticia"
          >
            <div class="card-imagem">
              <img :src="imagemNoticia(noticia)" :alt="noticia.titulo">
            </div>

            <div class="card-body">
              <div class="card-meta">
                <span class="tag">{{ noticia.categoria || 'Geral' }}</span>

                <span class="data">
                  {{ formatarData(noticia.data_noticia || noticia.data || noticia.data_publicacao) }}
                </span>
              </div>

              <h3>{{ noticia.titulo }}</h3>

              <p class="resumo">
                {{ noticia.resumo }}
              </p>

              <transition name="fade-expand">
                <div v-if="noticia.ativo" class="conteudo-extra">
                  <p>{{ noticia.conteudo || noticia.conteudo_completo }}</p>
                </div>
              </transition>

              <div class="card-acoes">
                <button class="btn-vermais" @click="toggleConteudo(noticia.id)">
                  {{ noticia.ativo ? 'Ver menos' : 'Ver mais' }}
                </button>

                <a
                  :href="linkNoticia(noticia)"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-externo"
                >
                  Acessar fonte
                </a>
              </div>

              <button
                v-if="podePublicar"
                class="btn-excluir-noticia"
                @click="excluirNoticia(noticia.id)"
              >
                Excluir
              </button>
            </div>
          </article>
        </div>

        <div v-else-if="!carregando && !erroNoticias" class="sem-noticias">
          Nenhuma notícia encontrada com esse filtro.
        </div>
      </section>
    </section>
  </div>
</template>

<script>
import api from "../services/api"

export default {
  name: "NewsSection",

  data() {
    return {
      busca: "",
      noticias: [],
      carregando: false,
      publicando: false,
      erroNoticias: "",

      novaNoticia: {
        titulo: "",
        resumo: "",
        conteudo: "",
        imagem: "",
        link: "",
        categoria: "",
        data_publicacao: ""
      }
    }
  },

  computed: {
    usuario() {
      return JSON.parse(localStorage.getItem("usuario")) || null
    },

    podePublicar() {
      if (!this.usuario) return false
      return this.usuario.tipo === "admin"
    },

    noticiaPrincipal() {
      return this.noticiasFiltradas[0] || null
    },

    noticiasFiltradas() {
      const termo = this.busca.toLowerCase().trim()

      if (!termo) {
        return this.noticias
      }

      return this.noticias.filter((noticia) => {
        return (
          String(noticia.titulo || "").toLowerCase().includes(termo) ||
          String(noticia.resumo || "").toLowerCase().includes(termo) ||
          String(noticia.categoria || "").toLowerCase().includes(termo) ||
          String(noticia.conteudo || "").toLowerCase().includes(termo) ||
          String(noticia.conteudo_completo || "").toLowerCase().includes(termo)
        )
      })
    }
  },

  methods: {
    pegarListaDaResposta(dados) {
      if (Array.isArray(dados)) return dados
      if (Array.isArray(dados.news)) return dados.news
      if (Array.isArray(dados.noticias)) return dados.noticias
      if (Array.isArray(dados.data)) return dados.data
      if (Array.isArray(dados.results)) return dados.results
      return []
    },

    async carregarNoticias() {
      try {
        this.carregando = true
        this.erroNoticias = ""

        const resposta = await api.get("/api/news")
        const listaNoticias = this.pegarListaDaResposta(resposta.data)

        this.noticias = listaNoticias.map((noticia) => {
          return {
            ...noticia,
            ativo: false,
            conteudo: noticia.conteudo || noticia.conteudo_completo || "",
            imagem: noticia.imagem || noticia.imagem_url || "",
            link: noticia.link || noticia.link_fonte || noticia.fonte_url || noticia.fonte || "",
            data_publicacao:
              noticia.data_publicacao ||
              noticia.data_noticia ||
              noticia.data ||
              noticia.created_at ||
              noticia.data_criacao
          }
        })
      } catch (erro) {
        console.error("Erro ao carregar notícias:", erro)

        if (erro.response) {
          this.erroNoticias =
            erro.response.data?.detalhes ||
            erro.response.data?.erro ||
            erro.response.data?.message ||
            "Não foi possível carregar as notícias."
        } else {
          this.erroNoticias = "Não foi possível conectar com a API."
        }
      } finally {
        this.carregando = false
      }
    },

    async publicarNoticia() {
      if (!this.podePublicar) {
        alert("Você não tem permissão para publicar notícias.")
        return
      }

      try {
        this.publicando = true

        const dataNoticia = this.novaNoticia.data_publicacao || null

        await api.post("/api/news", {
          titulo: this.novaNoticia.titulo,
          resumo: this.novaNoticia.resumo,

          conteudo: this.novaNoticia.conteudo,
          conteudo_completo: this.novaNoticia.conteudo,

          imagem: this.novaNoticia.imagem,
          imagem_url: this.novaNoticia.imagem,

          link: this.novaNoticia.link,
          fonte: this.novaNoticia.link,
          link_fonte: this.novaNoticia.link,
          fonte_url: this.novaNoticia.link,

          categoria: this.novaNoticia.categoria || "Geral",

          data_publicacao: dataNoticia,
          data_noticia: dataNoticia,
          data: dataNoticia
        })

        this.novaNoticia = {
          titulo: "",
          resumo: "",
          conteudo: "",
          imagem: "",
          link: "",
          categoria: "",
          data_publicacao: ""
        }

        await this.carregarNoticias()

        alert("Notícia publicada com sucesso!")
      } catch (erro) {
        console.error("Erro ao publicar notícia:", erro)

        if (erro.response) {
          alert(
            erro.response.data?.detalhes ||
            erro.response.data?.erro ||
            erro.response.data?.message ||
            "Erro ao publicar notícia."
          )
        } else {
          alert("Erro ao conectar com a API.")
        }
      } finally {
        this.publicando = false
      }
    },

    async excluirNoticia(id) {
      if (!this.podePublicar) {
        alert("Você não tem permissão para excluir notícias.")
        return
      }

      const confirmar = confirm("Tem certeza que deseja excluir esta notícia?")

      if (!confirmar) return

      try {
        await api.delete(`/api/news/${id}`)

        await this.carregarNoticias()

        alert("Notícia excluída com sucesso!")
      } catch (erro) {
        console.error("Erro ao excluir notícia:", erro)

        if (erro.response) {
          alert(
            erro.response.data?.detalhes ||
            erro.response.data?.erro ||
            erro.response.data?.message ||
            "Erro ao excluir notícia."
          )
        } else {
          alert("Erro ao conectar com a API.")
        }
      }
    },

    toggleConteudo(id) {
      this.noticias = this.noticias.map((noticia) => {
        if (Number(noticia.id) === Number(id)) {
          return {
            ...noticia,
            ativo: !noticia.ativo
          }
        }

        return noticia
      })
    },

    formatarData(data) {
      if (!data) return "Data não informada"

      const dataLimpa = String(data).split("T")[0]
      const dataFormatada = new Date(dataLimpa + "T00:00:00")

      if (Number.isNaN(dataFormatada.getTime())) {
        return "Data inválida"
      }

      return dataFormatada.toLocaleDateString("pt-BR")
    },

    imagemNoticia(noticia) {
      if (noticia.imagem && String(noticia.imagem).trim() !== "") {
        return noticia.imagem
      }

      if (noticia.imagem_url && String(noticia.imagem_url).trim() !== "") {
        return noticia.imagem_url
      }

      return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80"
    },

    linkNoticia(noticia) {
      return (
        noticia.link ||
        noticia.link_fonte ||
        noticia.fonte_url ||
        noticia.fonte ||
        "#"
      )
    }
  },

  mounted() {
    this.carregarNoticias()
  }
}
</script>

<style scoped>
@import "../assets/css/noticias.css";

.btn-publicar:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>