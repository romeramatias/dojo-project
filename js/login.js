require([
   "dojo/_base/lang",
   "dojo/on",
   "dojo/ready",
   "dojo/parser",
   "dojo/dom",
   "dojo/dom-construct",
   "dojo/dom-attr",
   "dijit/layout/ContentPane",
   "dijit/layout/BorderContainer",
   "dijit/layout/TabContainer",
   "dijit/form/Button",
   "dijit/form/DateTextBox",
   "dijit/form/TextBox",
   "dijit/form/ComboBox",
   "dojox/grid/EnhancedGrid",
   "dijit/form/Select",
   "dijit/form/ValidationTextBox",
   "dijit/form/FilteringSelect",
   "dijit/Dialog",
   "dojo/store/Memory",
   "dojo/domReady!",
], function (
   lang,
   on,
   ready,
   parser,
   dom,
   domConstruct,
   domAttr,
   ContentPane,
   BorderContainer,
   TabContainer,
   Button,
   DateTextBox,
   TextBox,
   ComboBox,
   EnhancedGrid,
   Select,
   ValidationTextBox,
   FilteringSelect,
   Dialog,
   Memory,
   domReady
) {
   // Variables
   let username;
   let password;
   let error = "Error 🕺🏻";

   // Dialogs
   dialogPassword = new Dialog({
      title: error,
      style: "width: 100px",
   });

   dialogCamposVacios = new Dialog({
      title: error,
      content: "Todos los campos deben ser completados 🤦‍♂️",
   });

   dialogUserVacio = new Dialog({
      title: error,
      content: "La contraseña es incorrecta 🤔",
   });

   dialogPassVacia = new Dialog({
      title: error,
      content: "Coloque su contraseña 🤞",
   });

   dialogUserIncorrecto = new Dialog({
      title: error,
      content: "Debe llenar el campo de usuario 😒",
   });

   // Store
   let usuarios = [
      { id: 1, username: "mati", nombre: "Matias Romera", edad: "24", password: "123", role: "it" },
      { id: 2, username: "fer", nombre: "Fernando Scroppo", edad: "24", password: "123", role: "it" },
      { id: 3, username: "noe", nombre: "Noelia Escalier", edad: "24", password: "123", role: "it" },
      { id: 4, username: "braian", nombre: "Braian Almada", edad: "24", password: "123", role: "it" },
      { id: 5, username: "gonza", nombre: "Gonzalo Delgado", edad: "24", password: "123", role: "it" },
      { id: 6, username: "rocio", nombre: "Rocio Badessi", edad: "24", password: "123", role: "hr" },
      { id: 7, username: "flor", nombre: "Florencia Mazza", edad: "24", password: "123", role: "hr" },
   ];

   store = new Memory({ data: usuarios });

   // Boton
   ready(function () {
      let botonLogin = new Button(
         {
            style: "display: block;",
            onClick: function () {
               login();
            },
         },
         "botonLogin"
      );
   });

   // Funciones
   const login = () => {
      username = dom.byId("inputUser").value;
      password = dom.byId("inputPassword").value;

      if (verificarCampos(username, password)) {
         let usuario = buscarUsuario(username);
         if (usuario) {
            verificarPassword(usuario, password) ? loginExitoso(usuario) : mostrarDialogPassword();
         }
      }
   };

   const buscarUsuario = (username) => {
      let usuario = store.data.find((user) => user.username === username);
      if (!usuario) {
         mostrarDialogUserIncorrecto();
      } else {
         return usuario;
      }
   };

   const verificarPassword = (usuario, password) => {
      return usuario.password === password;
   };

   const loginExitoso = (usuario) => {
      sessionStorage.setItem("username", usuario.username);
      sessionStorage.setItem("role", usuario.role);
      sessionStorage.setItem("nombre", usuario.nombre);

      window.location.href = "./index.html";
   };

   const verificarCampos = (username, password) => {
      if (username === "" && password === "") {
         mostrarDialogCamposVacios();
      } else if (username === "") {
         mostrarDialogUserVacio();
      } else if (password === "") {
         mostrarDialogPassVacia();
      } else {
         return true;
      }
   };

   const vaciarCamposFormulario = () => {
      domAttr.set(dom.byId("inputUser"), "value", "");
      domAttr.set(dom.byId("inputPassword"), "value", "");
   };

   const mostrarDialogPassword = () => {
      dialogPassword.show();
      domAttr.set(dom.byId("inputPassword"), "value", "");
   };

   const mostrarDialogCamposVacios = () => {
      dialogCamposVacios.show();
   };

   const mostrarDialogUserVacio = () => {
      dialogUserVacio.show();
      vaciarCamposFormulario();
   };

   const mostrarDialogPassVacia = () => {
      dialogPassVacia.show();
   };

   const mostrarDialogUserIncorrecto = () => {
      console.log(dialogUserIncorrecto);
      dialogUserIncorrecto.setContent(`No se ha encontrado el usuario con nombre '${username}' 🤷‍♀️`);
      dialogUserIncorrecto.show();
      vaciarCamposFormulario();
   };
});
