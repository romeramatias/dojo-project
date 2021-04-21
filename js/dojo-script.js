require([
   "dojo/_base/lang",
   "dojo/dom",
   "dojo/on",
   "dojo/mouse",
   "dojo/request",
   "dojo/parser",
   "dojo/dom-construct",
   "dijit/registry",
   "dojo/dom-attr",
   "dijit/layout/ContentPane",
   "dijit/layout/BorderContainer",
   "dijit/layout/TabContainer",
   "dojox/grid/EnhancedGrid",
   "dojo/data/ItemFileWriteStore",
   "dijit/layout/StackController",
   "dijit/layout/StackContainer",
   "dojo/domReady!",
], function (
   lang,
   dom,
   on,
   mouse,
   request,
   parser,
   domConstruct,
   registry,
   domAttr,
   ContentPane,
   BorderContainer,
   TabContainer,
   EnhancedGrid,
   ItemFileWriteStore,
   StackController,
   StackContainer,
   domReady
) {
   /* Variables */
   const urlMarzo = "https://5f7e1dfc0198da0016893544.mockapi.io/Users";
   const urlAbril = "https://5f7e1dfc0198da0016893544.mockapi.io/Users2";

   let botonEmpleadosMarzo = dom.byId("botonEmpleadosMarzo");
   let botonEmpleadosAbril = dom.byId("botonEmpleadosAbril");

   let spinner = dom.byId("spinner");

   /* Eventos */
   /* Solicitud a la Api de los empleados de Marzo */
   on(botonEmpleadosMarzo, "mousedown", function (event) {
      domAttr.set(spinner, "style", { visibility: "visible" });
      domConstruct.empty("gridDiv");
      if (mouse.isLeft(event)) {
         request(urlMarzo).then(
            function (res) {
               let users = JSON.parse(res);
               //users.forEach((user) => empleados.push(user));
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
               armarTabla(users);
               domAttr.set(spinner, "style", { visibility: "hidden" });
            },
            function (error) {
               console.log(error);
            }
         );
      }
   });

   /* Funciones */
   const armarTabla = (empleados) => {
      console.log(empleados);

      let data = {
         identifier: "id",
         items: empleados,
      };

      let store = new dojo.data.ItemFileWriteStore({ data: data });

      /* Seteando en layout */
      let layout = [
         [
            { name: "Nombre", field: "nombre", width: "230px" },
            { name: "Apellido", field: "apellido", width: "230px" },
            { name: "Direccion", field: "direccion", width: "230px" },
            { name: "Ciudad", field: "ciudad", width: "230px" },
            { name: "Pais", field: "pais", width: "230px" },
         ],
      ];

      /* Creacion de la Tabla*/
      let grid = new EnhancedGrid({
         id: "grid",
         store: store,
         structure: layout,
         rowSelector: "20px",
      });

      /*append the new grid to the div*/
      grid.placeAt("gridDiv");

      /*Call startup() to render the grid*/
      grid.startup();
   };
   
});
