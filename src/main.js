import "../node_modules/ag-grid-community/dist/styles/ag-grid.css";
import "../node_modules/ag-grid-community/dist/styles/ag-theme-balham.css";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

import Vue from "vue";
import VueRouter from "vue-router";
import App from "./App.vue";
import routes from "./routes";

// only needed if you use ag-grid enterprise features
import "ag-grid-enterprise";
import { LicenseManager } from "ag-grid-enterprise";
LicenseManager.setLicenseKey(
  "Adcore_Desarrollo_y_Comunicación_S.L_Siturweb_1Devs1_SaaS_18_April_2020__MTU1NTU0MjAwMDAwMA==3c5a3b0fcc94ec4a5bd5452284b614df"
);

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
