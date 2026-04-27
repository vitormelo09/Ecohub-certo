import { createRouter, createWebHistory } from 'vue-router'

import Inicio from '../views/inicio.vue'
import Feed from '../views/feed.vue'
import Eventos from '../views/eventos.vue'
import MeusEventos from '../views/meusEventos.vue'
import Noticias from '../views/noticias.vue'
import Login from '../views/login.vue'
import Cadastro from '../views/cadastro.vue'
import Calendario from '../views/calendario.vue'
import Sobre from '../views/sobre.vue'
import Esqueci from '../views/esqueci.vue'
import Perfil from '../views/perfil.vue'
import Projetos from '../views/projetos.vue'
import Perfilpublico from '../views/perfilpublico.vue'
import AdminUsuarios from '../views/adminUsuarios.vue'

const routes = [
  { path: '/', redirect: '/inicio' },

  { path: '/inicio', name: 'inicio', component: Inicio },
  { path: '/feed', name: 'feed', component: Feed },
  { path: '/eventos', name: 'eventos', component: Eventos },
  { path: '/meus-eventos', name: 'meus-eventos', component: MeusEventos },
  { path: '/noticias', name: 'noticias', component: Noticias },
  { path: '/login', name: 'login', component: Login },
  { path: '/cadastro', name: 'cadastro', component: Cadastro },
  { path: '/calendario', name: 'calendario', component: Calendario },
  { path: '/sobre', name: 'sobre', component: Sobre },
  { path: '/esqueci', name: 'esqueci', component: Esqueci },
  { path: '/perfil', name: 'perfil', component: Perfil },
  { path: '/projetos', name: 'projetos', component: Projetos },
  { path: '/admin-usuarios', name: 'admin-usuarios', component: AdminUsuarios },

  { path: '/perfil/:id', name: 'perfilpublico', component: Perfilpublico }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router