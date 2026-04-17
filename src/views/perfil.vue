<template>
  <div class="perfil-layout">
    <aside class="sidebar-perfil">
      <div class="card-perfil-main">
        <img src="../assets/img/perfil.jpg" alt="Foto de Perfil" class="foto-grande">

        <div class="perfil-badge">Meu Perfil</div>

        <h2>{{ perfilEditando ? dadosEditados.nome : (usuario?.nome || 'Usuário') }}</h2>

        <p class="username">
          @{{ (perfilEditando ? dadosEditados.email : usuario?.email)?.split('@')[0] || 'usuario' }}
        </p>

        <p class="bio">
          {{ perfilEditando ? dadosEditados.bio : (usuario?.bio || 'Adicione uma bio para contar mais sobre você no EcoHub.') }}
        </p>

        <div class="perfil-info-list">
          <div class="info-item">
            <i class="fa-solid fa-envelope"></i>
            <span>{{ perfilEditando ? dadosEditados.email : (usuario?.email || 'email@exemplo.com') }}</span>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-graduation-cap"></i>
            <span>{{ perfilEditando ? dadosEditados.curso : (usuario?.curso || 'Curso não informado') }}</span>
          </div>

          <div class="info-item">
            <i class="fa-solid fa-layer-group"></i>
            <span>{{ perfilEditando ? dadosEditados.semestre : (usuario?.semestre || 'Semestre não informado') }}</span>
          </div>
        </div>

        <div class="perfil-stats">
          <div class="stat">
            <span>120</span>
            Seguidores
          </div>
          <div class="stat">
            <span>45</span>
            Seguindo
          </div>
          <div class="stat">
            <span>8</span>
            Posts
          </div>
        </div>

        <div class="acoes-perfil">
          <button
            v-if="!perfilEditando"
            class="btn-editar"
            @click="abrirEdicao"
          >
            Editar Perfil
          </button>

          <template v-else>
            <button class="btn-editar" @click="salvarPerfil">
              Salvar
            </button>
            <button class="btn-secundario" @click="cancelarEdicao">
              Cancelar
            </button>
          </template>

          <button class="btn-sair" @click="confirmarLogout">
            Sair (Logout)
          </button>
        </div>
      </div>
    </aside>

    <main class="perfil-timeline">
      <div class="tweet-card-fake destaque-card">
        <div class="section-head">
          <h3>Resumo do Perfil</h3>
          <span class="tag-status">{{ perfilEditando ? 'Editando' : 'Ativo' }}</span>
        </div>

        <p class="tweet-text-fake">
          Gerencie seus dados, personalize sua apresentação e mantenha seu perfil atualizado dentro do EcoHub.
        </p>
      </div>

      <div class="tweet-card-fake" v-if="perfilEditando">
        <div class="section-head">
          <h3>Editar informações</h3>
        </div>

        <div class="form-grid">
          <div class="grupo-campo">
            <label>Nome</label>
            <input type="text" v-model="dadosEditados.nome" placeholder="Seu nome completo">
          </div>

          <div class="grupo-campo">
            <label>E-mail</label>
            <input type="email" v-model="dadosEditados.email" placeholder="seu.email@eniac.edu.br">
          </div>

          <div class="grupo-campo">
            <label>Curso</label>
            <input type="text" v-model="dadosEditados.curso" placeholder="Seu curso">
          </div>

          <div class="grupo-campo">
            <label>Semestre</label>
            <input type="text" v-model="dadosEditados.semestre" placeholder="Seu semestre">
          </div>

          <div class="grupo-campo grupo-campo-full">
            <label>Bio</label>
            <textarea
              v-model="dadosEditados.bio"
              rows="4"
              placeholder="Fale um pouco sobre você"
            ></textarea>
          </div>
        </div>
      </div>

      <div class="tweet-card-fake">
        <div class="section-head">
          <h3>Minha Atividade Recente</h3>
          <span class="tag-status">Últimas ações</span>
        </div>

        <div class="atividade-lista">
          <div class="atividade-item">
            <div class="atividade-icone">
              <i class="fa-solid fa-pen-to-square"></i>
            </div>
            <div>
              <strong>Perfil atualizado</strong>
              <p>Personalize seus dados para aparecer melhor na comunidade.</p>
            </div>
          </div>

          <div class="atividade-item">
            <div class="atividade-icone">
              <i class="fa-solid fa-folder-open"></i>
            </div>
            <div>
              <strong>Projetos publicados</strong>
              <p>Mostre seus trabalhos e fortaleça sua presença no EcoHub.</p>
            </div>
          </div>

          <div class="atividade-item">
            <div class="atividade-icone">
              <i class="fa-solid fa-comments"></i>
            </div>
            <div>
              <strong>Interações na comunidade</strong>
              <p>Acompanhe seu crescimento e participação dentro da plataforma.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const usuario = ref(null)
const perfilEditando = ref(false)

const dadosEditados = ref({
  nome: '',
  email: '',
  curso: '',
  semestre: '',
  bio: ''
})

onMounted(() => {
  const userStorage = localStorage.getItem('usuario')

  if (userStorage) {
    usuario.value = JSON.parse(userStorage)

    dadosEditados.value = {
      nome: usuario.value.nome || '',
      email: usuario.value.email || '',
      curso: usuario.value.curso || '',
      semestre: usuario.value.semestre || '',
      bio: usuario.value.bio || ''
    }
  } else {
    router.push('/login')
  }
})

const abrirEdicao = () => {
  perfilEditando.value = true
}

const cancelarEdicao = () => {
  if (!usuario.value) return

  dadosEditados.value = {
    nome: usuario.value.nome || '',
    email: usuario.value.email || '',
    curso: usuario.value.curso || '',
    semestre: usuario.value.semestre || '',
    bio: usuario.value.bio || ''
  }

  perfilEditando.value = false
}

const salvarPerfil = () => {
  const usuarioAtualizado = {
    ...usuario.value,
    nome: dadosEditados.value.nome,
    email: dadosEditados.value.email,
    curso: dadosEditados.value.curso,
    semestre: dadosEditados.value.semestre,
    bio: dadosEditados.value.bio
  }

  usuario.value = usuarioAtualizado
  localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado))
  perfilEditando.value = false
}

const confirmarLogout = () => {
  const overlay = document.createElement('div')
  overlay.style.position = 'fixed'
  overlay.style.top = '0'
  overlay.style.left = '0'
  overlay.style.width = '100%'
  overlay.style.height = '100%'
  overlay.style.background = 'rgba(5, 29, 64, 0.6)'
  overlay.style.display = 'flex'
  overlay.style.alignItems = 'center'
  overlay.style.justifyContent = 'center'
  overlay.style.zIndex = '9999'

  const box = document.createElement('div')
  box.style.background = '#fff'
  box.style.padding = '25px'
  box.style.borderRadius = '16px'
  box.style.width = '320px'
  box.style.textAlign = 'center'
  box.style.boxShadow = '0 20px 50px rgba(0,0,0,0.2)'

  box.innerHTML = `
    <div style="font-size:28px;color:#2788C8;margin-bottom:10px;">
      <i class="fa-solid fa-right-from-bracket"></i>
    </div>
    <h3 style="margin-bottom:8px;color:#051D40;">Sair da conta?</h3>
    <p style="font-size:14px;color:#666;margin-bottom:20px;">
      Tem certeza que deseja encerrar sua sessão?
    </p>
    <div style="display:flex;gap:10px;">
      <button id="cancelarLogout" style="
        flex:1;
        height:40px;
        border-radius:10px;
        border:none;
        background:#f1f5f9;
        cursor:pointer;
      ">Cancelar</button>

      <button id="confirmarLogoutBtn" style="
        flex:1;
        height:40px;
        border-radius:10px;
        border:none;
        background:#051D40;
        color:#fff;
        cursor:pointer;
      ">Sair</button>
    </div>
  `

  overlay.appendChild(box)
  document.body.appendChild(overlay)

  box.querySelector('#cancelarLogout').onclick = () => {
    document.body.removeChild(overlay)
  }

  box.querySelector('#confirmarLogoutBtn').onclick = () => {
    localStorage.removeItem('usuario')
    localStorage.removeItem('token')
    document.body.removeChild(overlay)
    router.push('/login')
  }
}
</script>

<style scoped>
@import "../assets/css/geral.css";
@import "../assets/css/perfil.css";
</style>