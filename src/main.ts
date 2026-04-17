import { createApp } from 'vue'
import App from './App.vue'
import router from './router' // Isso aponta para src/router/index.ts

const app = createApp(App)

app.use(router) // OBRIGATÓRIO
app.mount('#app')