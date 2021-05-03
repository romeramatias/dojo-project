require([
   "dojo/_base/lang",
   "dojo/dom",
   "dojo/on",
   "dojo/ready",
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
   "dijit/form/FilteringSelect",
   "dijit/Dialog",
   "dojo/store/Memory",
   "dojo/domReady!",
], function (
   lang,
   dom,
   on,
   ready,
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
   FilteringSelect,
   Dialog,
   Memory,
   domReady
) {
   // Variables
   const urlEmpleados = "https://5f7e1dfc0198da0016893544.mockapi.io/Users";
   let botonBuscarEmpleados = dom.byId("buscarEmpleados");
   let spinnerBusqueda = dom.byId("spinnerBusqueda");
   let idGridBusqueda = 100;

   // Dialog
   sinResultados = new Dialog({
      title: "sinResultados",
      style: "width: 100px",
   });

   // Store de paises disponibles
   var stateStore = new Memory({
      data: [
         { name: "Argentina", id: "Argentina" },
         { name: "Brasil", id: "Brasil" },
         { name: "Chile", id: "Chile" },
         { name: "España", id: "España" },
         { name: "Francia", id: "Francia" },
         { name: "Venezuela", id: "Venezuela" },
         { name: "-- Todos -- ", id: "Todos" },
      ],
   });

   // FilteringSelect para la busqueda de empleados

   ready(function () {
      filteringSelect = new FilteringSelect(
         {
            id: "inputPais",
            name: "state",
            value: "Todos",
            store: stateStore,
            searchAttr: "name",
         },
         "inputPais"
      );
   });

   // Listener del boton de buscar
   on(botonBuscarEmpleados, "mousedown", function (event) {
      if (mouse.isLeft(event)) {
         eventoBuscarEmpleado();
      }
   });

   // Funciones

   // Llamada por el listener
   const eventoBuscarEmpleado = () => {
      // Variables de la busqueda
      let pais = dom.byId("inputPais").value.trim().toLowerCase();
      let empresa = verificarEmpresa();
      let nombre = dom.byId("inputNombre").value;

      domConstruct.empty("gridDivBusqueda");
      domAttr.set(spinnerBusqueda, "style", { visibility: "visible" });

      // Solicitud a la API
      request(urlEmpleados).then(
         function (res) {
            let users = JSON.parse(res);
            buscarEmpleados(users, pais, empresa, nombre);
            domAttr.set(spinnerBusqueda, "style", { visibility: "hidden" });
         },
         function (error) {
            console.log(error);
         }
      );
   };

   // Filtrando la lista de empleado
   const buscarEmpleados = (empleados, pais, empresa, nombre) => {
      if (pais != "" && pais != "-- todos --") {
         empleados = empleados.filter((element) => element.pais.toLowerCase() == pais);
      }

      if (nombre != "") {
         //empleados = empleados.filter((element) => element.nombre.toLowerCase() == nombre.toLowerCase());
         empleados = empleados.filter((element) => element.nombre.toLowerCase().indexOf(nombre.toLowerCase()) > -1);
      }

      empleados.forEach((element) => {
         if (typeof element.empresa === "string") {
            element.empresa = element.empresa == "true" ? true : false;
         }
      });

      if (empresa != null) {
         if (empresa === "capgemini") {
            empleados = empleados.filter((element) => element.empresa == true);
         } else {
            empleados = empleados.filter((element) => element.empresa == false);
         }
      }

      if (empleados.length < 1) {
         domConstruct.empty("gridDivBusqueda");
         sinResultados.show();
      } else {
         idGridBusqueda = idGridBusqueda + 1;
         armarTablaBusqueda(empleados, idGridBusqueda);
      }
   };

   const armarTablaBusqueda = (empleados, idGridBusqueda) => {
      domConstruct.empty("gridDivBusqueda");

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
               defaultPageSize: 10,
            },
         },
         autoWidth: true,
         autoHeight: true,
         structure: layout,
         rowSelector: "20px",
      });

      grid.placeAt("gridDivBusqueda");
      grid.startup();
   };

   const verificarEmpresa = () => {
      let checkedCap = dom.byId("inputEmpresaCap").checked;
      let checkedSog = dom.byId("inputEmpresaSog").checked;

      if (!checkedCap && !checkedSog) {
         return null;
      }

      return checkedCap ? "capgemini" : "sogeti";
   };
});
