require([
   "dojo/_base/lang",
   "dojo/on",
   "dojo/ready",
   "dojo/parser",
   "dojo/_base/fx",
   "dojo/dom",
   "dojo/dom-construct",
   "dojo/dom-attr",
   "dojo/dom-style",
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
   fx,
   dom,
   domConstruct,
   domAttr,
   style,
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
   let error = "Error";

   // Dialogs
   dialogPasswordIncorrecto = new Dialog({
      title: error,
      content: "La contraseña es incorrecta 🤔",
      class: "dialogError",
   });

   dialogCamposVacios = new Dialog({
      title: error,
      content: "Todos los campos deben ser completados 🤦‍♂️",
      class: "dialogError",
   });

   dialogUserVacio = new Dialog({
      title: error,
      content: "Debe colocar un usuario 👨🏻‍🦯",
      class: "dialogError",
   });

   dialogPassVacia = new Dialog({
      title: error,
      content: "Coloque su contraseña 🤞",
      class: "dialogError",
   });

   dialogUserIncorrecto = new Dialog({
      title: error,
      content: "Debe llenar el campo de usuario 😒",
      class: "dialogError",
   });

   dialogWaiter = new Dialog({});

   // Boton
   ready(function () {
      botonLogin = new Button(
         {
            onClick: function () {
               login();
            },
            onSubmit: function () {
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
            verificarPassword(usuario, password) ? loginExitoso(usuario) : mostrarDialogPasswordIncorrecto();
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
      mostrarDialogWaiter();

      setTimeout(function () {
         sessionStorage.setItem("username", usuario.username);
         sessionStorage.setItem("rol", usuario.rol);
         sessionStorage.setItem("nombre", usuario.nombre);
         window.location.href = "./index.html";
      }, 4000);
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

   const mostrarDialogPasswordIncorrecto = () => {
      dialogPasswordIncorrecto.show();
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

   const mostrarDialogWaiter = () => {
      dialogWaiter.show();
      mostrarLogo();
   };

   const mostrarLogo = () => {
      style.set("logo", "opacity", "0");
      var fadeArgs = {
         node: "logo",
         duration: 2000,
      };

      fx.fadeIn(fadeArgs).play();
      setTimeout(function () {
         fx.fadeOut(fadeArgs).play();
      }, 2000);
   };
})
