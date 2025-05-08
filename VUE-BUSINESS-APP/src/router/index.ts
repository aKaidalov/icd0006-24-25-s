import {createRouter, createWebHistory} from "vue-router";
import Home from "../views/Home.vue";
import Page1 from "../views/Page1.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import GpsSession from "../views/GpsSession.vue";
import GpsSessionCreate from "../views/GpsSessionCreate.vue";


const routes = [
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/page1",
        name: "Page1",
        component: Page1,
    },
    {
        path: "/gps-session",
        name: "GpsSession",
        component: GpsSession,
    },
    {
        path: "/gps-session-create",
        name: "GpsSessionCreate",
        component: GpsSessionCreate,
    },
    {
        path: "/register",
        name: "Register",
        component: Register,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router;
