import { createRouter, createWebHistory } from 'vue-router'

import Inicio from '../views/inicio.vue'
import Feed from '../views/feed.vue'
import Eventos from '../views/eventos.vue'
import Noticias from '../views/noticias.vue'
import Login from '../views/login.vue'
import Cadastro from '../views/cadastro.vue'
import calendario from '../views/calendario.vue'
import sobre from '../views/sobre.vue'
import esqueci from '../views/esqueci.vue'
import perfil from '../views/perfil.vue'
import Projetos from '../views/projetos.vue'

const routes = [
  { path: '/', redirect: '/inicio' },
  { path: '/inicio', name: 'inicio', component: Inicio },
  { path: '/feed', name: 'feed', component: Feed },
  { path: '/eventos', name: 'eventos', component: Eventos },
  { path: '/noticias', name: 'noticias', component: Noticias },
  { path: '/login', name: 'login', component: Login },
  { path: '/cadastro', name: 'cadastro', component: Cadastro },
  { path: '/calendario', name: 'calendario', component: calendario },
  { path: '/sobre', name: 'sobre', component: sobre },
  { path: '/esqueci', name: 'esqueci', component: esqueci },
  { path: '/perfil', name: 'perfil', component: perfil },
  { path: '/projetos', name: 'projetos', component: Projetos }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router