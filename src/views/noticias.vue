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

      <section
        v-if="noticiaPrincipal"
        class="noticia-destaque"
      >
        <div class="destaque-imagem">
          <img :src="noticiaPrincipal.imagem" :alt="noticiaPrincipal.titulo">
        </div>

        <div class="destaque-conteudo">
          <span class="tag-destaque">{{ noticiaPrincipal.categoria }}</span>
          <h2>{{ noticiaPrincipal.titulo }}</h2>
          <p class="destaque-resumo">{{ noticiaPrincipal.resumo }}</p>
          <p class="destaque-texto">{{ noticiaPrincipal.conteudo }}</p>

          <div class="destaque-footer">
            <span>{{ noticiaPrincipal.data }}</span>
            <a :href="noticiaPrincipal.link" target="_blank" rel="noopener noreferrer">
              Ler notícia completa →
            </a>
          </div>
        </div>
      </section>

      <section class="lista-section">
        <div class="lista-header">
          <h3>Mais notícias</h3>
          <span>{{ noticiasFiltradas.length }} resultado(s)</span>
        </div>

        <div v-if="noticiasFiltradas.length" class="noticias-grid">
          <article
            v-for="(noticia, index) in noticiasFiltradas"
            :key="index"
            class="card-noticia"
          >
            <div class="card-imagem">
              <img :src="noticia.imagem" :alt="noticia.titulo">
            </div>

            <div class="card-body">
              <div class="card-meta">
                <span class="tag">{{ noticia.categoria }}</span>
                <span class="data">{{ noticia.data }}</span>
              </div>

              <h3>{{ noticia.titulo }}</h3>
              <p class="resumo">{{ noticia.resumo }}</p>

              <transition name="fade-expand">
                <div v-if="noticia.ativo" class="conteudo-extra">
                  <p>{{ noticia.conteudo }}</p>
                </div>
              </transition>

              <div class="card-acoes">
                <button class="btn-vermais" @click="toggleConteudo(index)">
                  {{ noticia.ativo ? 'Ver menos' : 'Ver mais' }}
                </button>

                <a
                  :href="noticia.link"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="link-externo"
                >
                  Acessar fonte
                </a>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="sem-noticias">
          Nenhuma notícia encontrada com esse filtro.
        </div>
      </section>
    </section>
  </div>
</template>

<script>
export default {
  name: "NewsSection",
  data() {
    return {
      busca: "",
      noticias: [
        {
          titulo: "Nova tecnologia revoluciona o mercado",
          resumo: "Uma inovação promete mudar a forma como empresas e estudantes usam soluções digitais.",
          conteudo: "A nova tecnologia tem chamado atenção por unir desempenho, acessibilidade e inovação. Especialistas apontam que ela pode transformar processos em diferentes áreas, desde educação até gestão empresarial.",
          imagem: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
          link: "#",
          categoria: "Tecnologia",
          data: "15 Abr 2026",
          ativo: false
        },
        {
          titulo: "Economia cresce acima do esperado",
          resumo: "Novos indicadores mostram melhora no cenário econômico e mais confiança no mercado.",
          conteudo: "Os dados mais recentes mostram um crescimento acima das projeções iniciais. O resultado fortalece debates sobre investimentos, empregabilidade e desenvolvimento em diferentes setores.",
          imagem: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
          link: "#",
          categoria: "Economia",
          data: "12 Abr 2026",
          ativo: false
        },
        {
          titulo: "Evento importante acontece na cidade",
          resumo: "O encontro reuniu especialistas, estudantes e empresas para discutir inovação e futuro digital.",
          conteudo: "Durante o evento, foram apresentados projetos, palestras e debates sobre transformação digital. A participação de estudantes foi um dos pontos altos, com destaque para trabalhos acadêmicos.",
          imagem: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
          link: "#",
          categoria: "Eventos",
          data: "10 Abr 2026",
          ativo: false
        },
        {
          titulo: "Inteligência artificial ganha espaço nas universidades",
          resumo: "Ferramentas baseadas em IA estão sendo usadas para apoio ao ensino e pesquisa.",
          conteudo: "Universidades vêm ampliando o uso de inteligência artificial em projetos de pesquisa, automação de tarefas e apoio ao aprendizado. A tendência é de crescimento nos próximos anos.",
          imagem: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80",
          link: "#",
          categoria: "IA",
          data: "08 Abr 2026",
          ativo: false
        },
        {
          titulo: "Sustentabilidade vira prioridade em novos projetos",
          resumo: "Cada vez mais iniciativas colocam impacto ambiental e responsabilidade social no centro.",
          conteudo: "Empresas e instituições de ensino têm incentivado projetos sustentáveis, com foco em energia limpa, reciclagem, consumo consciente e inovação verde.",
          imagem: "https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?auto=format&fit=crop&w=1200&q=80",
          link: "#",
          categoria: "Sustentabilidade",
          data: "05 Abr 2026",
          ativo: false
        },
        {
          titulo: "Comunidade acadêmica compartilha projetos em alta",
          resumo: "Plataformas colaborativas ajudam alunos a divulgar trabalhos e construir portfólio.",
          conteudo: "O compartilhamento de projetos tem fortalecido a integração entre estudantes, professores e empresas. Além da visibilidade, isso cria oportunidades de networking e aprendizado prático.",
          imagem: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
          link: "#",
          categoria: "Educação",
          data: "03 Abr 2026",
          ativo: false
        }
      ]
    }
  },
  computed: {
    noticiaPrincipal() {
      return this.noticiasFiltradas[0] || null
    },
    noticiasFiltradas() {
      const lista = this.noticias.filter((noticia) => {
        const termo = this.busca.toLowerCase()
        return (
          noticia.titulo.toLowerCase().includes(termo) ||
          noticia.resumo.toLowerCase().includes(termo) ||
          noticia.categoria.toLowerCase().includes(termo)
        )
      })

      return lista
    }
  },
  methods: {
    toggleConteudo(index) {
      const titulo = this.noticiasFiltradas[index]?.titulo

      this.noticias = this.noticias.map((noticia) => {
        if (noticia.titulo === titulo) {
          return { ...noticia, ativo: !noticia.ativo }
        }
        return noticia
      })
    }
  }
}
</script>

<style scoped>
@import "../assets/css/noticias.css";
</style>