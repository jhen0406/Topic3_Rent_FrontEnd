import './assets/main.scss'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia';

const app = createApp(App)
const pinia = createPinia();
router.afterEach((to, from, next) => {
	window.scrollTo(0, 0);
});

app.use(router);
app.use(pinia);


app.mount('#app')
