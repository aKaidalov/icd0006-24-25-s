import { createRouter, createWebHashHistory } from 'vue-router';
import LandingView from '@/views/LandingView.vue';
import GameView from '@/views/GameView.vue';

const routes = [
    { path: '/', name: 'Landing', component: LandingView },
    { path: '/game/:mode', name: 'Game', component: GameView },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
