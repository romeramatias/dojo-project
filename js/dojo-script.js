require([
   "dojo/dom",
   "dojo/on",
   "dojo/mouse",
   "dojo/ready",
   "dojo/request",
   "dojo/parser",
   "dojo/dom-construct",
   "dojo/dom-attr",
   "dijit/layout/ContentPane",
   "dijit/layout/BorderContainer",
   "dijit/layout/TabContainer",
   "dojox/grid/EnhancedGrid",
   "dojox/grid/enhanced/plugins/Pagination",
   "dojo/data/ItemFileWriteStore",
   "dijit/form/Form",
   "dijit/form/Button",
   "dijit/form/TextBox",
   "dijit/Dialog",
   "dojo/domReady!",
], function (
   dom,
   on,
   mouse,
   ready,
   request,
   parser,
   domConstruct,
   domAttr,
   ContentPane,
   BorderContainer,
   TabContainer,
   EnhancedGrid,
   Pagination,
   ItemFileWriteStore,
   Form,
   Button,
   TextBox,
   Dialog,
   domReady
) {
   /* Variables */
   const urlMarzo = "https://5f7e1dfc0198da0016893544.mockapi.io/Users";
   const urlAbril = "https://5f7e1dfc0198da0016893544.mockapi.io/Users2";

   let botonEmpleadosMarzo = dom.byId("botonEmpleadosMarzo");
   let botonEmpleadosAbril = dom.byId("botonEmpleadosAbril");

   let spinner = dom.byId("spinner");

   let idGridBusqueda = 0;

   let divUser = dom.byId("user");

   // User del SessionStorage
   ready(function () {
      let user = {};
      user.username = sessionStorage.getItem("username");
      user.nombre = sessionStorage.getItem("nombre");
      user.rol = sessionStorage.getItem("rol");
      console.log(user);
      setBienvenida(user);
      verificarRol(user);

      let botonCerrarSesion = new Button(
         {
            label: "Cerrar Sesion",
            onClick: function () {
               cerrarSesion();
            },
         },
         "botonCerrarSesion"
      );
   });

   /* Eventos */
   /* Solicitud a la Api de los empleados de Marzo */
   on(botonEmpleadosMarzo, "mousedown", function (event) {
      domAttr.set(spinner, "style", { visibility: "visible" });
      domConstruct.empty("gridDiv");
      if (mouse.isLeft(event)) {
         request(urlMarzo).then(
            function (res) {
               let users = JSON.parse(res);
               idGridBusqueda = idGridBusqueda + 1;
               armarTabla(users);
               domAttr.set(spinner, "style", { visibility: "hidden" });
            },
            function (error) {
               console.log(error);
            }
         );
      }
   });

   /* Solicitud a la Api de los empleados de Abril */
   on(botonEmpleadosAbril, "mousedown", function (event) {
      domAttr.set(spinner, "style", { visibility: "visible" });
      domConstruct.empty("gridDiv");
      if (mouse.isLeft(event)) {
         request(urlAbril).then(
            function (res) {
               let users = JSON.parse(res);
               idGridBusqueda = idGridBusqueda + 1;
               armarTabla(users);
               domAttr.set(spinner, "style", { visibility: "hidden" });
            },
            function (error) {
               console.log(error);
            }
         );
      }
   });

   /* Tabla de EnhancedGrid */
   const verificarRol = (user) => {
      if (user.rol === "it") {
         dojo.style(dijit.byId("tabIngresar").controlButton.domNode, { display: "none" });
      }
   };

   const setBienvenida = (user) => {
      divUser.innerHTML = `<p class="bienvenidaParrafo"> Hola <strong>${user.nombre}</strong>!</p>`;
   };

   const cerrarSesion = () => {
      sessionStorage.clear();
      window.location.href = "./login.html";
   };

   const armarTabla = (empleados) => {
      let data = {
         identifier: "id",
         items: empleados,
      };

      let store = new dojo.data.ItemFileWriteStore({ data: data });

      /* Seteando en layout */
      let layout = [
         [
            { name: "Nombre", field: "nombre", width: "230px" },
            { name: "Apellido", field: "apellido", width: "200px" },
            {
               name: "Empresa",
               field: "empresa",
               width: "80px",
               formatter: (field) => {
                  let cap = "<span> <img style='width: 40px' src='./www/logo.png' /></span>";
                  let sog = "<span> <img style='width: 40px' src='./www/sog.png' /></span>";
                  return field ? cap : sog;
               },
            },
            { name: "Direccion", field: "direccion", width: "230px" },
            { name: "Ciudad", field: "ciudad", width: "230px" },
            {
               name: "Pais",
               field: "pais",
               width: "230px",
               formatter: (field) => {
                  if (field.toLowerCase() === "argentina") {
                     return "<span style='background-color:lightblue;'> ARGENTINA!!! 🦧 </span>";
                  }
                  return field;
               },
            },
         ],
      ];

      /* Creacion de la Tabla*/
      let grid = new EnhancedGrid({
         id: "grid" + idGridBusqueda,
         store: store,
         plugins: {
            pagination: {
               position: "bottom",
               sizeSwitch: false,
               gotoButton: true,
               defaultPageSize: 15,
            },
         },
         autoWidth: true,
         autoHeight: true,
         structure: layout,
         rowSelector: "20px",
      });

      grid.placeAt("gridDiv");
      grid.startup();
   };
});
