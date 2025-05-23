import {createRouter, createWebHistory} from "vue-router";
import Types from "../views/Types.vue";
import Register from "../views/Register.vue";
import Login from "../views/Login.vue";
import GpsSession from "../views/GpsSession.vue";
import GpsSessionCreate from "../views/GpsSessionCreate.vue";
import GpsSessionDetails from "../views/GpsSessionDetails.vue";
import GpsSessionEdit from "../views/GpsSessionEdit.vue";
import GpsSessionDelete from "../views/GpsSessionDelete.vue";
import Logout from "../views/Logout.vue";
import Account from "../views/Account.vue";
import MapView from "../views/MapView.vue";
import GpsLocationMapView from "../views/GpsLocationMapView.vue";
import AccountEdit from "../views/AccountEdit.vue";


const routes = [
    {
        path: "/",
        name: "Home",
        component: MapView,
    },
    {
        path: "/types",
        name: "Types",
        component: Types,
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
        path: "/gps-session-edit/:id",
        name: "GpsSessionEdit",
        component: GpsSessionEdit,
    },
    {
        path: "/gps-session-details/:id",
        name: "GpsSessionDetails",
        component: GpsSessionDetails,
    },
    {
        path: "/gps-session-delete/:id",
        name: "GpsSessionDelete",
        component: GpsSessionDelete,
    },
    {
        path: "/gps-locations-session/:gpsSessionId",
        name: "GpsLocationsSession",
        // component: GpsLocation,
        component: GpsLocationMapView,
    },
    {
        path: "/account/register",
        name: "Register",
        component: Register,
    },
    {
        path: "/account/login",
        name: "Login",
        component: Login,
    },
    {
        path: "/account/logout",
        name: "Logout",
        component: Logout,
    },
    {
        path: "/account",
        name: "Account",
        component: Account,
    },
    {
        path: "/account-edit",
        name: "AccountEdit",
        component: AccountEdit,
    },
]

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
})

export default router;
