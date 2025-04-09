import { createRouter, createWebHistory } from 'vue-router';
import LandingView from '../views/LandingView.vue';
import GameView from '../views/GameView.vue';

const routes = [
    { path: '/', name: 'Landing', component: LandingView },
    { path: '/game', name: 'Game', component: GameView }, //TODO: /game/mode
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
