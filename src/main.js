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
  "Evaluation_License_Not_For_Production_29_December_2019__MTU3NzU3NzYwMDAwMA==a3a7a7e770dea1c09a39018caf2c839c"
);

Vue.use(VueRouter);

const router = new VueRouter({
  routes
});

new Vue({
  router,
  render: h => h(App)
}).$mount("#app");
