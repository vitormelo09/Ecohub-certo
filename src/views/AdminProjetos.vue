<template>
    <main class="admin-page">
  
      <div class="topo">
        <h1>Aprovação de Projetos</h1>
  
        <button
          class="btn-recarregar"
          @click="buscarPendentes"
        >
          Atualizar
        </button>
      </div>
  
      <p v-if="carregando">
        Carregando...
      </p>
  
      <p
        v-else-if="erro"
        class="erro"
      >
        {{ erro }}
      </p>
  
      <div
        v-else
        class="lista"
      >
  
        <div
          v-for="projeto in projetos"
          :key="projeto.id"
          class="card"
        >
  
          <img
            :src="projeto.imagem_url"
            class="imagem"
          >
  
          <div class="conteudo">
  
            <h2>
              {{ projeto.titulo }}
            </h2>
  
            <p>
              {{ projeto.descricao }}
            </p>
  
            <small>
              Autor:
              {{ projeto.autor_nome }}
            </small>
  
            <span class="status">
              {{ projeto.status }}
            </span>
  
          </div>
  
          <div class="acoes">
  
            <button
              class="aprovar"
              @click="aprovar(projeto.id)"
            >
              Aprovar
            </button>
  
            <button
              class="rejeitar"
              @click="rejeitar(projeto.id)"
            >
              Rejeitar
            </button>
  
          </div>
  
        </div>
  
      </div>
  
    </main>
  </template>
  
  <script setup>
  import { ref,onMounted } from "vue"
  import api from "../services/api"
  
  const projetos = ref([])
  
  const carregando = ref(false)
  
  const erro = ref("")
  
  async function buscarPendentes(){
  
  try{
  
  carregando.value=true
  
  const res=
  await api.get(
  "/api/projects/pendentes"
  )
  
  projetos.value=res.data
  
  }
  catch(err){
  
  erro.value=
  err.response?.data?.erro
  ||
  "Erro ao carregar"
  
  }
  finally{
  
  carregando.value=false
  
  }
  
  }
  
  async function aprovar(id){
  
  try{
  
  await api.put(
  `/api/projects/${id}/aprovar`
  )
  
  alert(
  "Projeto aprovado"
  )
  
  buscarPendentes()
  
  }
  catch{
  
  alert(
  "Erro ao aprovar"
  )
  
  }
  
  }
  
  async function rejeitar(id){
  
  const motivo=
  prompt(
  "Motivo da rejeição"
  )
  
  if(
  motivo===null
  )
  return
  
  try{
  
  await api.put(
  `/api/projects/${id}/rejeitar`,
  {
  motivo
  }
  )
  
  alert(
  "Projeto rejeitado"
  )
  
  buscarPendentes()
  
  }
  catch{
  
  alert(
  "Erro ao rejeitar"
  )
  
  }
  
  }
  
  onMounted(
  buscarPendentes
  )
  
  </script>
  
  <style scoped>
  
  .admin-page{
  
  padding:40px;
  
  max-width:1300px;
  
  margin:auto;
  
  }
  
  .topo{
  
  display:flex;
  
  justify-content:
  space-between;
  
  margin-bottom:30px;
  
  }
  
  .btn-recarregar{
  
  padding:12px;
  
  border:none;
  
  background:#2788C8;
  
  color:white;
  
  border-radius:12px;
  
  }
  
  .lista{
  
  display:grid;
  
  gap:20px;
  
  }
  
  .card{
  
  display:flex;
  
  gap:20px;
  
  background:white;
  
  padding:20px;
  
  border-radius:20px;
  
  box-shadow:
  0 5px 20px
  rgba(
  0,
  0,
  0,
  0.08
  );
  
  }
  
  .imagem{
  
  width:250px;
  
  height:180px;
  
  object-fit:cover;
  
  border-radius:16px;
  
  }
  
  .conteudo{
  
  flex:1;
  
  }
  
  .conteudo h2{
  
  margin-bottom:10px;
  
  }
  
  .status{
  
  display:inline-block;
  
  margin-top:10px;
  
  padding:8px;
  
  border-radius:999px;
  
  background:#fef3c7;
  
  }
  
  .acoes{
  
  display:flex;
  
  flex-direction:column;
  
  gap:12px;
  
  justify-content:center;
  
  }
  
  .aprovar{
  
  background:#22c55e;
  
  color:white;
  
  border:none;
  
  padding:12px;
  
  border-radius:12px;
  
  }
  
  .rejeitar{
  
  background:#ef4444;
  
  color:white;
  
  border:none;
  
  padding:12px;
  
  border-radius:12px;
  
  }
  
  @media(
  max-width:900px
  ){
  
  .card{
  
  flex-direction:column;
  
  }
  
  .imagem{
  
  width:100%;
  
  }
  
  }
  /* ==========================
   CARD PROJETO
========================== */

.card{

background:
#ffffff !important;

color:
#111827 !important;

}

.card h2{

color:
#111827 !important;

}

.card p{

color:
#475569 !important;

}

.card small{

color:
#64748b !important;

}

.status{

background:
#fde68a !important;

color:
#92400e !important;

font-weight:
800;

}

/* ==========================
   DARK MODE
========================== */

body.dark .card,
body.dark-mode .card{

background:
#16233f !important;

border:
1px solid #29446f;

}

body.dark .card h2,
body.dark-mode .card h2{

color:
#ffffff !important;

}

body.dark .card p,
body.dark-mode .card p{

color:
#dbeafe !important;

}

body.dark .card small,
body.dark-mode .card small{

color:
#93c5fd !important;

}

body.dark .status,
body.dark-mode .status{

background:
#3b2f00 !important;

color:
#fde68a !important;

}

/* BOTÕES */

.aprovar{

background:
#22c55e !important;

}

.rejeitar{

background:
#ef4444 !important;

}

/* IMAGEM */

.imagem{

border-radius:
18px;

object-fit:
cover;

}
  </style>