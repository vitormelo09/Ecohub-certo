<template>
  <main class="admin-page">
    <section class="admin-card">
      <div class="admin-header">
        <div>
          <h1>Gerenciar Usuários</h1>
          <p>Promova usuários para admin ou altere o tipo da conta.</p>
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
                {{ usuarioItem.tipo }}
              </span>
            </div>
          </div>

          <div class="acoes">
            <button
              v-if="usuarioItem.tipo !== 'admin'"
              class="btn-admin"
              @click="alterarTipo(usuarioItem.id, 'admin')"
            >
              Tornar admin
            </button>

            <button
              v-if="usuarioItem.tipo !== 'professor'"
              class="btn-professor"
              @click="alterarTipo(usuarioItem.id, 'professor')"
            >
              Tornar professor
            </button>

            <button
              v-if="usuarioItem.tipo !== 'aluno'"
              class="btn-aluno"
              @click="alterarTipo(usuarioItem.id, 'aluno')"
            >
              Tornar aluno
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
    await api.put(`/api/admin/users/${id}/tipo`, {
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

onMounted(() => {
  carregarUsuarios()
})
</script>

<style scoped>
.admin-page {
  min-height: calc(100vh - 70px);
  padding: 40px 20px;
  background: #f4f8fb;
}

.admin-card {
  max-width: 1100px;
  margin: 0 auto;
  background: #ffffff;
  border-radius: 24px;
  padding: 30px;
  border: 1px solid #e5edf4;
  box-shadow: 0 14px 40px rgba(15, 23, 42, 0.07);
}

.admin-header {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  align-items: center;
  margin-bottom: 25px;
}

.admin-header h1 {
  color: #122033;
  margin-bottom: 8px;
}

.admin-header p {
  color: #6b7280;
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
  gap: 16px;
}

.usuario-card {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 18px;
  border: 1px solid #e5edf4;
  border-radius: 18px;
  background: #ffffff;
}

.usuario-info {
  display: flex;
  align-items: center;
  gap: 14px;
}

.usuario-foto {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  object-fit: cover;
}

.usuario-info h3 {
  color: #122033;
  margin-bottom: 4px;
}

.usuario-info p {
  color: #6b7280;
  margin-bottom: 8px;
}

.badge {
  display: inline-block;
  padding: 5px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.badge.admin {
  background: #dcfce7;
  color: #166534;
}

.badge.professor {
  background: #dbeafe;
  color: #1d4ed8;
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
}

.acoes button {
  padding: 10px 13px;
  border: none;
  border-radius: 12px;
  color: #ffffff;
  font-weight: 800;
  cursor: pointer;
}

.btn-admin {
  background: #16a34a;
}

.btn-professor {
  background: #2563eb;
}

.btn-aluno {
  background: #f59e0b;
}

body.dark-mode .admin-page {
  background: #0f172a;
}

body.dark-mode .admin-card,
body.dark-mode .usuario-card {
  background: #1e293b;
  border-color: #334155;
}

body.dark-mode .admin-header h1,
body.dark-mode .usuario-info h3 {
  color: #f8fafc;
}

body.dark-mode .admin-header p,
body.dark-mode .usuario-info p {
  color: #cbd5e1;
}

@media (max-width: 768px) {
  .admin-header,
  .usuario-card {
    flex-direction: column;
    align-items: stretch;
  }

  .acoes {
    justify-content: flex-start;
  }
}
</style>