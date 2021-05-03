require([
   "dojo/_base/lang",
   "dojo/dom",
   "dojo/on",
   "dojo/mouse",
   "dojo/request",
   "dojo/parser",
   "dojo/dom-construct",
   "dijit/registry",
   "dojo/_base/connect",
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
   lang,
   dom,
   on,
   mouse,
   request,
   parser,
   domConstruct,
   registry,
   connect,
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
   let botonSalarios = dom.byId("botonSalarios");
   const urlSalarios = "https://5f7e1dfc0198da0016893544.mockapi.io/Salarios";

   on(botonSalarios, "mousedown", function (event) {
      if (mouse.isLeft(event)) {
         tablaHtml();
      }
   });

   /* Tabla Manual */
   const tablaHtml = () => {
      request(urlSalarios).then(
         function (res) {
            let empleados = JSON.parse(res);
            armarTablaSalarios(empleados);
         },
         function (error) {
            console.log(error);
         }
      );
   };

   const armarTablaSalarios = (empleados) => {
      let tablaDatos = dom.byId("tablaDatos");

      empleados.forEach((empleado) => {
         let node = domConstruct.create("tr", {
            innerHTML: `<th scope="row">${empleado.id}</th> <td>${empleado.nombre}</td> <td>USD ${empleado.sueldo}</td> <td>${empleado.btcAdress}</td>`,
         });
         domConstruct.place(node, tablaDatos, "before");
      });

      dojo.setAttr(tablaSalarios, "style", { visibility: "visible" });
   };
});
