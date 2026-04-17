<template>
  <div class="perfil-layout">
    <aside class="sidebar-perfil">
      <div class="card-perfil-main">

        <!-- FOTO CLICÁVEL -->
        <label for="inputFoto">
          <img
            :src="fotoPerfil || '/src/assets/img/perfil.jpg'"
            alt="Foto de Perfil"
            class="foto-grande"
            style="cursor:pointer"
          >
        </label>

        <!-- INPUT OCULTO -->
        <input
          type="file"
          id="inputFoto"
          accept="image/*"
          @change="trocarFoto"
          style="display:none"
        >

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
          <div class="stat"><span>120</span>Seguidores</div>
          <div class="stat"><span>45</span>Seguindo</div>
          <div class="stat"><span>8</span>Posts</div>
        </div>

        <div class="acoes-perfil">
          <button v-if="!perfilEditando" class="btn-editar" @click="abrirEdicao">
            Editar Perfil
          </button>

          <template v-else>
            <button class="btn-editar" @click="salvarPerfil">Salvar</button>
            <button class="btn-secundario" @click="cancelarEdicao">Cancelar</button>
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
            <input type="text" v-model="dadosEditados.nome">
          </div>

          <div class="grupo-campo">
            <label>E-mail</label>
            <input type="email" v-model="dadosEditados.email">
          </div>

          <div class="grupo-campo">
            <label>Curso</label>
            <input type="text" v-model="dadosEditados.curso">
          </div>

          <div class="grupo-campo">
            <label>Semestre</label>
            <input type="text" v-model="dadosEditados.semestre">
          </div>

          <div class="grupo-campo grupo-campo-full">
            <label>Bio</label>
            <textarea v-model="dadosEditados.bio" rows="4"></textarea>
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
            <div class="atividade-icone"><i class="fa-solid fa-pen-to-square"></i></div>
            <div>
              <strong>Perfil atualizado</strong>
              <p>Personalize seus dados para aparecer melhor na comunidade.</p>
            </div>
          </div>

          <div class="atividade-item">
            <div class="atividade-icone"><i class="fa-solid fa-folder-open"></i></div>
            <div>
              <strong>Projetos publicados</strong>
              <p>Mostre seus trabalhos e fortaleça sua presença no EcoHub.</p>
            </div>
          </div>

          <div class="atividade-item">
            <div class="atividade-icone"><i class="fa-solid fa-comments"></i></div>
            <div>
              <strong>Interações na comunidade</strong>
              <p>Acompanhe seu crescimento dentro da plataforma.</p>
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
const fotoPerfil = ref(null)

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

    fotoPerfil.value = usuario.value.foto || null
  } else {
    router.push('/login')
  }
})

const trocarFoto = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()

  reader.onload = () => {
    fotoPerfil.value = reader.result

    const atualizado = {
      ...usuario.value,
      foto: reader.result
    }

    usuario.value = atualizado
    localStorage.setItem('usuario', JSON.stringify(atualizado))
  }

  reader.readAsDataURL(file)
}

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
    bio: dadosEditados.value.bio,
    foto: fotoPerfil.value
  }

  usuario.value = usuarioAtualizado
  localStorage.setItem('usuario', JSON.stringify(usuarioAtualizado))
  perfilEditando.value = false
}

const confirmarLogout = () => {
  localStorage.removeItem('usuario')
  localStorage.removeItem('token')
  router.push('/login')
}
</script>

<style scoped>
@import "../assets/css/geral.css";
@import "../assets/css/perfil.css";
</style>