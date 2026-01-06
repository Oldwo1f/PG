import { defineNuxtPlugin } from "#app";
import { PerfectScrollbar } from "vue3-perfect-scrollbar";
import "~/assets/css/perfect-scrollbar.css";

export default defineNuxtPlugin((nuxtApp) => {
	nuxtApp.vueApp.component("PerfectScrollbar", PerfectScrollbar);
});
