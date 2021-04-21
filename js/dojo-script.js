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
   "dojox/grid/enhanced/plugins/Pagination",
   "dojo/data/ItemFileWriteStore",
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
   Pagination,
   ItemFileWriteStore,
   domReady
) {
   /* Variables */
   const urlMarzo = "https://5f7e1dfc0198da0016893544.mockapi.io/Users";
   const urlAbril = "https://5f7e1dfc0198da0016893544.mockapi.io/Users2";
   const urlSalarios = "https://5f7e1dfc0198da0016893544.mockapi.io/Salarios";

   let botonEmpleadosMarzo = dom.byId("botonEmpleadosMarzo");
   let botonEmpleadosAbril = dom.byId("botonEmpleadosAbril");
   let botonSalarios = dom.byId("botonSalarios");

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

   on(botonSalarios, "mousedown", function (event) {
      if (mouse.isLeft(event)) {
         request(urlSalarios).then(
            function (res) {
               let empleados = JSON.parse(res);
               armarTablaSalarios(empleados);
            },
            function (error) {
               console.log(error);
            }
         );
      }
   });

   /* Funciones */
   const armarTablaSalarios = (empleados) => {
      let tablaDatos = dom.byId("tablaDatos");

      empleados.forEach((empleado) => {
         let node = domConstruct.create("tr", {
            innerHTML: `<th scope="row">${empleado.id}</th> <td>${empleado.nombre}</td> <td>USD ${empleado.sueldo}</td> <td>${empleado.btcAdress}</td>`,
         });
         domConstruct.place(node, tablaDatos, "before");
      });

      domAttr.set(tablaSalarios, "style", { visibility: "visible" });
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
            { name: "Apellido", field: "apellido", width: "230px" },
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
         id: "grid",
         store: store,
         plugins: {
            pagination: {
               position: "bottom",
               sizeSwitch: false,
               gotoButton: true,
               defaultPageSize: 10,
            },
         },
         autoWidth: true,
         autoHeight: true,
         structure: layout,
         rowSelector: "20px",
      });

      /*append the new grid to the div*/
      grid.placeAt("gridDiv");

      /*Call startup() to render the grid*/
      grid.startup();
   };
});
