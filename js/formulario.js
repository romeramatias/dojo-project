require([
   "dojo/ready",
   "dojo/parser",
   "dojo/dom",
   "dojo/dom-construct",
   "dojo/dom-attr",
   "dijit/form/Button",
   "dijit/form/DateTextBox",
   "dijit/form/TextBox",
   "dijit/form/ComboBox",
   "dojox/grid/EnhancedGrid",
   "dijit/form/Select",
   "dijit/form/ValidationTextBox",
   "dijit/form/FilteringSelect",
   "dojox/validate/web",
   "dijit/Dialog",
   "dojo/store/Memory",
   "dojo/domReady!",
], function (
   ready,
   parser,
   dom,
   domConstruct,
   domAttr,
   Button,
   DateTextBox,
   TextBox,
   ComboBox,
   EnhancedGrid,
   Select,
   ValidationTextBox,
   FilteringSelect,
   web,
   Dialog,
   Memory,
   domReady
) {
   // ID's para usuario y tablas
   let id = 100;
   let idGridIngreso = 200;

   // Botones y Select
   ready(function () {
      // Boton de confirmar al ingresar un empleado que abre el dialog
      let botonIngresar = new Button(
         {
            label: "Confirmar",
            onClick: function () {
               domConstruct.empty("resultado");
               let empleado = {
                  id: String(id),
                  nombre: dom.byId("nombres").value,
                  apellido: dom.byId("apellido").value,
                  pais: dom.byId("pais").value,
                  direccion: dom.byId("direccion").value,
                  ciudad: dom.byId("ciudad").value,
                  empresa: selectEmpresa.get("value") === "Capgemini" ? true : false,
                  fechaIngreso: dom.byId("fechaIngreso").value,
                  email: dom.byId("email").value,
                  dni: dom.byId("dni").value,
               };

               ingresarEmpleado(empleado);
               vaciarCamposFormulario();
               confirmacionEmpleado.hide();

               dom.byId("resultado").innerHTML += "Se ha ingresado el siguiente empleado";
            },
         },
         "botonIngresar"
      );
      // Boton que abre el dialog y muestra al empleado
      let botonDialog = new Button(
         {
            label: "Ingresar Empleado",
            onClick: function () {
               let empleado = {
                  id: String(id),
                  nombre: dom.byId("nombres").value,
                  apellido: dom.byId("apellido").value,
                  pais: dom.byId("pais").value,
                  direccion: dom.byId("direccion").value,
                  ciudad: dom.byId("ciudad").value,
                  empresa: selectEmpresa.get("value") === "Capgemini" ? true : false,
                  fechaIngreso: dom.byId("fechaIngreso").value,
                  email: dom.byId("email").value,
                  dni: dom.byId("dni").value,
               };

               if (camposLLenos(empleado)) {
                  confirmacionEmpleado.show();
                  let empleados = [];
                  empleados.push(empleado);
                  tablaEmpleado(empleados, "gridDivVerificarEmpleado");
               } else {
                  dialogFaltanCampos.show();
               }
            },
         },
         "botonDialog"
      );
      let botonVaciar = new Button(
         {
            label: "Vaciar Campos",
            onClick: function () {
               vaciarCamposFormulario();
            },
         },
         "botonVaciar"
      );

      // Select de empresa para el formulario de empleado
      let selectEmpresa = new Select(
         {
            name: "selectEmpresa",
            options: [
               { label: "Capgemini", value: "Capgemini", selected: true },
               { label: "Sogeti", value: "Sogeti" },
            ],
         },
         "selectEmpresa"
      );
      selectEmpresa.startup();
   });

   // Dialogs

   // Ventana de dialog de confirmacion de empleados
   confirmacionEmpleado = new Dialog({
      title: "confirmacionEmpleado",
      style: "width: 100px",
   });

   // Dialogo de campos faltantes
   dialogFaltanCampos = new Dialog({
      title: "dialogFaltanCampos",
      style: "width: 100px",
   });

   // Funcion que hace el post a la API y llama a la creacion de la tabla
   const ingresarEmpleado = (empleado) => {
      id = id + 1;

      let xhrArgs = {
         url: `https://5f7e1dfc0198da0016893544.mockapi.io/Users`,
         postData: empleado,
         handleAs: "json",
         load: function (data) {},
         error: function (error) {
            console.log("error");
         },
      };

      dojo.xhrPost(xhrArgs);
      let empleados = [];
      empleados.push(empleado);
      tablaEmpleado(empleados, "gridDivIngresoEmpleado");
   };

   const tablaEmpleado = (empleado, divGrid) => {
      domConstruct.empty(divGrid);

      let data = {
         identifier: "id",
         items: empleado,
      };

      let store = new dojo.data.ItemFileWriteStore({ data: data });

      /* Seteando en layout */
      let layout = [
         [
            { name: "Nombre", field: "nombre", width: "90px" },
            { name: "Apellido", field: "apellido", width: "90px" },
            {
               name: "Empresa",
               field: "empresa",
               width: "80px",
               formatter: (field) => {
                  // let cap = "<span> <img style='width: 40px' src='./www/logo.png' /></span>";
                  // let sog = "<span> <img style='width: 40px' src='./www/sog.png' /></span>";
                  // return field ? cap : sog;
                  return `<span> <img style='width: 40px' src=${field ? "./www/logo.png" : "./www/sog.png"} /></span>`;
               },
            },
            { name: "DNI", field: "dni", width: "80px" },
            { name: "Email", field: "email", width: "170px" },
            { name: "Fecha de Ingreso", field: "fechaIngreso", width: "130px" },

            { name: "Direccion", field: "direccion", width: "150px" },
            { name: "Ciudad", field: "ciudad", width: "100px" },
            {
               name: "Pais",
               field: "pais",
               width: "100px",
            },
         ],
      ];

      /* Creacion de la Tabla*/
      let grid = new EnhancedGrid({
         id: divGrid + idGridIngreso,
         store: store,
         plugins: {
            pagination: {
               position: "bottom",
               sizeSwitch: false,
               gotoButton: true,
               defaultPageSize: 12,
            },
         },
         autoWidth: true,
         autoHeight: true,
         structure: layout,
         rowSelector: "20px",
      });

      grid.placeAt(divGrid);
      grid.startup();
      idGridIngreso = idGridIngreso + 2;
   };

   const vaciarCamposFormulario = () => {
      domAttr.set(dom.byId("nombres"), "value", "");
      domAttr.set(dom.byId("apellido"), "value", "");
      domAttr.set(dom.byId("pais"), "value", "");
      domAttr.set(dom.byId("direccion"), "value", "");
      domAttr.set(dom.byId("ciudad"), "value", "");
      domAttr.set(dom.byId("fechaIngreso"), "value", "");
      domAttr.set(dom.byId("email"), "value", "");
      domAttr.set(dom.byId("dni"), "value", "");
   };

   const camposLLenos = (empleado) => {
      let camposLlenos = true;

      for (const property in empleado) {
         if (empleado[property] === "") {
            camposLlenos = false;
         }
      }

      return camposLlenos;
   };
});
