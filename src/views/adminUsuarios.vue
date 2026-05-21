<template>
  <main class="admin-page">
    <section class="admin-card">
      <div class="admin-header">
        <div>
          <h1>Gerenciar Usuários</h1>
          <p>Gerencie permissões e admins específicos do sistema.</p>
        </div>

        <button class="btn-atualizar" @click="carregarUsuarios">
          Atualizar
        </button>
      </div>

      <p v-if="carregando" class="mensagem">
        Carregando usuários...
      </p>

      <p v-else-if="erro" class="mensagem erro">
        {{ erro }}
      </p>

      <div v-else class="usuarios-lista">
        <div
          v-for="usuarioItem in usuarios"
          :key="usuarioItem.id"
          class="usuario-card"
        >
          <div class="usuario-info">
            <img
              :src="fotoUsuario(usuarioItem)"
              alt="Foto do usuário"
              class="usuario-foto"
            >

            <div>
              <h3>{{ usuarioItem.nome }}</h3>
              <p>{{ usuarioItem.email }}</p>

              <span
                class="badge"
                :class="usuarioItem.tipo"
              >
                {{ formatarTipo(usuarioItem.tipo) }}
              </span>
            </div>
          </div>

          <div class="acoes">
            <button
              v-if="usuarioItem.tipo !== 'admin'"
              class="btn-admin"
              @click="alterarTipo(usuarioItem.id, 'admin')"
            >
              Admin Geral
            </button>

            <button
              v-if="usuarioItem.tipo !== 'admin_eventos'"
              class="btn-eventos"
              @click="alterarTipo(usuarioItem.id, 'admin_eventos')"
            >
              Admin Eventos
            </button>

            <button
              v-if="usuarioItem.tipo !== 'admin_noticias'"
              class="btn-noticias"
              @click="alterarTipo(usuarioItem.id, 'admin_noticias')"
            >
              Admin Notícias
            </button>

            <button
              v-if="usuarioItem.tipo !== 'admin_projetos'"
              class="btn-projetos"
              @click="alterarTipo(usuarioItem.id, 'admin_projetos')"
            >
              Admin Projetos
            </button>

            <button
              v-if="usuarioItem.tipo !== 'admin_feed'"
              class="btn-feed"
              @click="alterarTipo(usuarioItem.id, 'admin_feed')"
            >
              Admin Feed
            </button>

            <button
              v-if="usuarioItem.tipo !== 'professor'"
              class="btn-professor"
              @click="alterarTipo(usuarioItem.id, 'professor')"
            >
              Professor
            </button>

            <button
              v-if="usuarioItem.tipo !== 'aluno'"
              class="btn-aluno"
              @click="alterarTipo(usuarioItem.id, 'aluno')"
            >
              Aluno
            </button>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue"
import api from "../services/api"

const usuarios = ref([])
const carregando = ref(false)
const erro = ref("")

const carregarUsuarios = async () => {
  try {
    carregando.value = true
    erro.value = ""

    const resposta = await api.get("/api/admin/users")

    usuarios.value = resposta.data
  } catch (error) {
    console.error("Erro ao carregar usuários:", error)

    if (error.response) {
      erro.value =
        error.response.data?.detalhes ||
        error.response.data?.erro ||
        "Erro ao carregar usuários."
    } else {
      erro.value = "Erro ao conectar com a API."
    }
  } finally {
    carregando.value = false
  }
}

const alterarTipo = async (id, tipo) => {
  const confirmar = confirm(`Deseja alterar este usuário para ${tipo}?`)

  if (!confirmar) return

  try {
    await api.put(`/api/users/${id}/tipo`, {
      tipo
    })

    alert("Usuário atualizado com sucesso!")
    carregarUsuarios()
  } catch (error) {
    console.error("Erro ao alterar usuário:", error)

    if (error.response) {
      alert(
        error.response.data?.detalhes ||
        error.response.data?.erro ||
        "Erro ao alterar usuário."
      )
    } else {
      alert("Erro ao conectar com a API.")
    }
  }
}

const fotoUsuario = (usuario) => {
  if (usuario.foto_perfil && usuario.foto_perfil !== "perfil.jpg") {
    if (usuario.foto_perfil.startsWith("http")) {
      return usuario.foto_perfil
    }

    return `http://localhost:3000${usuario.foto_perfil}`
  }

  return "https://ui-avatars.com/api/?name=" + encodeURIComponent(usuario.nome || "Usuário")
}

const formatarTipo = (tipo) => {
  const tipos = {
    admin: "ADMIN",
    admin_eventos: "ADMIN EVENTOS",
    admin_noticias: "ADMIN NOTÍCIAS",
    admin_projetos: "ADMIN PROJETOS",
    admin_feed: "ADMIN FEED",
    professor: "PROFESSOR",
    aluno: "ALUNO"
  }

  return tipos[tipo] || tipo
}

onMounted(() => {
  carregarUsuarios()
})
</script>

<style scoped>
.admin-page {
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
  background: #081225;
}

.admin-card {
  max-width: 1300px;
  margin: 0 auto;
  background: #18253d;
  border-radius: 24px;
  padding: 30px;
  border: 1px solid #2d3f61;
}

.admin-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 25px;
}

.admin-header h1 {
  color: #ffffff;
  margin-bottom: 8px;
}

.admin-header p {
  color: #cbd5e1;
}

.btn-atualizar {
  padding: 12px 18px;
  border: none;
  border-radius: 12px;
  background: linear-gradient(135deg, #0b5fa5, #1ca4a6);
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
}

.mensagem {
  padding: 16px;
  border-radius: 12px;
  background: #edf7ff;
  color: #123;
}

.mensagem.erro {
  background: #ffe5e5;
  color: #9f1d1d;
}

.usuarios-lista {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.usuario-card {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 22px;
  border: 1px solid #314568;
  border-radius: 22px;
  background: #1b2942;
}

.usuario-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.usuario-foto {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
}

.usuario-info h3 {
  color: #ffffff;
  margin-bottom: 4px;
  font-size: 20px;
}

.usuario-info p {
  color: #d7e0ec;
  margin-bottom: 10px;
}

.badge {
  display: inline-block;
  padding: 7px 14px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.badge.admin {
  background: #dcfce7;
  color: #166534;
}

.badge.admin_eventos {
  background: #fee2e2;
  color: #b91c1c;
}

.badge.admin_noticias {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge.admin_projetos {
  background: #ede9fe;
  color: #6d28d9;
}

.badge.admin_feed {
  background: #fce7f3;
  color: #be185d;
}

.badge.professor {
  background: #cffafe;
  color: #155e75;
}

.badge.aluno {
  background: #fef3c7;
  color: #92400e;
}

.acoes {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
  justify-content: flex-end;
  max-width: 540px;
}

.acoes button {
  padding: 10px 14px;
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
}

.btn-admin {
  background: #16a34a;
}

.btn-eventos {
  background: #dc2626;
}

.btn-noticias {
  background: #2563eb;
}

.btn-projetos {
  background: #7c3aed;
}

.btn-feed {
  background: #db2777;
}

.btn-professor {
  background: #0891b2;
}

.btn-aluno {
  background: #f59e0b;
}

@media (max-width: 900px) {
  .usuario-card {
    flex-direction: column;
  }

  .acoes {
    justify-content: flex-start;
    max-width: 100%;
  }
}
</style>