import { createApp } from "vue";
import App from "./App.vue";
import "./tailwind.css";
import router from "@/router/";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

library.add(fas);

const app = createApp(App);
app.use(router);
app.component("FaIcon", FontAwesomeIcon);

app.mount("#app");
