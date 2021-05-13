require([
   "dojo/_base/lang",
   "dojo/on",
   "dojo/ready",
   "dojo/parser",
   "dojo/_base/fx",
   "dojo/fx/Toggler",
   "dojo/dom",
   "dojo/dom-construct",
   "dojo/dom-attr",
   "dojo/dom-style",
   "dojo/dom-class",
   "dijit/form/ValidationTextBox",
   "dojox/validate/web",
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
   Toggler,
   dom,
   domConstruct,
   domAttr,
   style,
   domClass,
   ValidationTextBox,
   web,
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
   let dialogs = dom.byId("dialogs")

   let userObject = {};

   let nombre = "";
   let nombreNoValido = dom.byId('nombreNoValido');
   let nombreValido = false;

   let usuario = "";
   let usernameNoValido = dom.byId("usernameNoValido");
   let userValido = false;

   let password = "";
   let passwordNoValida = dom.byId("passwordNoValida");
   let passwordNoValida2 = dom.byId("passwordNoValida2");
   let passValida = false;
   let passCoinciden = false;

   let rol;

   let formLegajo = dom.byId("legajo");
   let legajoValido = false;
   let legajoNoValido = dom.byId("legajoNoValido");

   let email = "";
   let emailNoValido = dom.byId("emailNoValido");
   let emailNoValido2 = dom.byId("emailNoValido2");
   let emailValido = false;
   let emailsCoinciden = false;

   let spinner = dom.byId("spinner");
   let check = dom.byId("check");
   let mensajeRegistro = dom.byId("mensajeRegistro");

   // Togglers
   let togglerLegajo = new Toggler({
      node: formLegajo,
      showDuration: 1000,
   });
  // togglerLegajo.hide();

   let togglerSpinner = new Toggler({
      node: spinner,
      showDuration: 2000,
   });

   let togglerCheck = new Toggler({
      node: check,
      showDuration: 2000,
   });
//   togglerCheck.hide();

   // --- Ready ---
   ready(function () {
      // Botones
      botonRegistro = new Button(
         {
            class: "my-2",
            onClick: function () {
               mostrarDialogRegistro();
            },
         },
         "botonRegistro"
      );

      botonSiguiente = new Button(
         {
            disabled: true,
            type: "submit",
         },
         "botonSiguiente"
      );

      botonRegistrarse = new Button(
         {
            disabled: true,
            type: "submit",
         },
         "botonRegistrarse"
      );

      // Props de dialogs
      // DIALOG REGISTRO FUNCTIONS
      dialogRegistro.set("style", "width: 500px");
      dialogPassword.set("style", "width: 500px");
      dialogRegistroGuardando.set("style", "width: 500px");
      dialogRegistroGuardando.set("style", "height: 170px");
      dialogRegistroExitoso.set("style", "width: 500px");
      dialogRegistroExitoso.set("style", "height: 170px");

      dialogRegistro.habilitarSiguiente = function () {
         habilitarSiguiente();
      };

      dialogRegistro.validarNombre = function () {
         validarNombre();
      };

      dialogRegistro.validarUsername = function () {
         validarUsername();
      };

      dialogRegistro.validarNumLegajo = function () {
         validarNumLegajo();
      };

      dialogRegistro.validarRol = function () {
         validarRol();
      };

      dialogRegistro.validarEmail = function () {
         validarEmail();
      };

      dialogRegistro.validarEmailsIguales = function () {
         validarEmailsIguales();
      };

      dialogRegistro.guardarUsuario = function (userForm) {
         guardarUsuario(userForm);
         dialogPassword.show();
      };

      dialogRegistro.cerrarFormulario = function () {
         vaciarCamposRegistro();
         vaciarInvalidsFeedback();
         this.reset();
         this.hide();
      };

      // DIALOG PASSWORD FUNCTIONS
      dialogPassword.habilitarRegistro = function () {
         habilitarRegistro();
      };

      dialogPassword.validarPassword = function () {
         validarPassword();
      };

      dialogPassword.validarPasswordsIguales = function () {
         validarPasswordsIguales();
      };

      dialogPassword.volver = function () {
         this.hide();
         dialogRegistro.show();
      };

      dialogPassword.guardarUsuarioFull = function (passwordForm) {
         dialogRegistroGuardando.guardarUsuarioStore();
         guardarUsuarioFull(passwordForm);
      };

      dialogPassword.cerrarFormulario = function () {
         vaciarCamposRegistro();
         vaciarInvalidsFeedback();
         dialogRegistro.reset();
         this.reset();
         this.hide();
      };

      // DIALOG REGISTRO GUARDANDO
      dialogRegistroGuardando.guardarUsuarioStore = function () {
         this.show();
         guardarUsuarioStore();
         setTimeout(() => {
            dialogRegistroGuardando.hide();
            dialogRegistroExitoso.show();
            mensajeRegistro.innerHTML = `${userObject.nombre}, ya registramos tus datos en nuestra página, podes iniciar sesión.`;
            setTimeout(() => {
               togglerCheck.show();
            }, 1000);
         }, 4000);
      };
   });

   // Funciones
   const mostrarDialogRegistro = () => {
      dojo.style(formLegajo, { display: "none" });
      dialogRegistro.show();
   };

   const habilitarSiguiente = () => {
      if (nombreValido && userValido && legajoValido && emailValido && emailsCoinciden) {
         botonSiguiente.set("disabled", false);
      } else {
         botonSiguiente.set("disabled", true);
      }
   };

   const habilitarRegistro = () => {
      if (passValida && passCoinciden) {
         botonRegistrarse.set("disabled", false);
      } else {
         botonRegistrarse.set("disabled", true);
      }
   };

   const validarNombre = () => {
      nombre = dom.byId("nombre").value;
      dom.byId("nombre").value = nombre;

      if (nombre.length < 5) {
         nombreNoValido.innerHTML = "El nombre debe tener mas de 5 caracteres";
         nombreValido = false;
         dojo.style(nombreNoValido, { display: "block" });
      } else {
         dojo.style(nombreNoValido, { display: "none" });
         nombreValido = true;
      }

      if (nombre.length > 30 && nombre.length > 5) {
         nombreNoValido.innerHTML = "Disculpa, solo podemos guardar menos de 30 caracteres";
         dojo.style(nombreNoValido, { display: "block" });
         nombreValido = false;
      }
   };

   const validarUsername = () => {
      let listaUsernamesTomados = store.data.map((user) => user.username);
      usuario = dom.byId("username").value.trim();
      usuario = usuario.trim();
      dom.byId("username").value = usuario;

      if (usuario.length < 5) {
         usernameNoValido.innerHTML = "El nombre de usuario debe tener mas de 5 caracteres";
         userValido = false;
         dojo.style(usernameNoValido, { display: "block" });
      } else {
         dojo.style(usernameNoValido, { display: "none" });
         userValido = true;
      }

      if (usuario.length > 15 && usuario.length > 5) {
         usernameNoValido.innerHTML = "El nombre de usuario debe tener menos de 15 caracteres";
         dojo.style(usernameNoValido, { display: "block" });
         userValido = false;
      }

      if (listaUsernamesTomados.find((username) => username === usuario) === usuario) {
         usernameNoValido.innerHTML = "El nombre de usuario ya está registrado, prueba con otro";
         dojo.style(usernameNoValido, { display: "block" });
         userValido = false;
      }
   };

   const validarPassword = () => {
      password = dom.byId("password").value.trim();
      password = password.trim();
      dom.byId("password").value = password;

      if (password.length < 3) {
         passwordNoValida.innerHTML = "La contraseña debe tener mas de 3 caracteres";
         dojo.style(passwordNoValida, { display: "block" });
         passValida = false;
      } else {
         dojo.style(passwordNoValida, { display: "none" });
         passValida = true;
      }

      if (password.length > 10 && password.length > 3) {
         passwordNoValida.innerHTML = "La contraseña debe tener menos de 10 caracteres";
         dojo.style(passwordNoValida, { display: "block" });
         passValida = false;
      }
   };

   const validarPasswordsIguales = () => {
      if (password != dom.byId("password2").value) {
         passwordNoValida2.innerHTML = "Las contraseñas no coinciden";
         dojo.style(passwordNoValida2, { display: "block" });
         passCoinciden = false;
      } else {
         dojo.style(passwordNoValida2, { display: "none" });
         passCoinciden = true;
      }
   };

   const validarRol = () => {
      if (dom.byId("rolHR").checked) {
         dojo.style(formLegajo, { display: "block" });
         togglerLegajo.show();
         legajoValido = false;
         rol = "hr";
      } else if (dom.byId("rolIT").checked) {
         togglerLegajo.hide();
         setTimeout(function () {
            dojo.style(formLegajo, { display: "none" });
         }, 500);

         legajoValido = true;
         rol = "it";
      }
   };

   const validarNumLegajo = () => {
      if (dom.byId("numLegajo").value.length != 4) {
         legajoNoValido.innerHTML = "Recuerda que el legajo solo tiene 4 números";
         dojo.style(legajoNoValido, { display: "block" });
         legajoValido = false;
      } else {
         dojo.style(legajoNoValido, { display: "none" });
         legajoValido = true;
      }
   };

   const validarEmail = () => {
      let listaEmailsTomados = store.data.map((user) => user.email);
      email = dom.byId("email").value;

      if (!dojox.validate.isEmailAddress(email)) {
         emailNoValido.innerHTML = "El correo electronico ingresado no es válido";
         dojo.style(emailNoValido, { display: "block" });
         emailValido = false;
      } else if (listaEmailsTomados.find((email) => email === email) === email) {
         emailNoValido.innerHTML = "El correo electronico ingresado ya está en uso";
         dojo.style(emailNoValido, { display: "block" });
         emailValido = false;
      } else if (email.split("@")[1] != "capgemini.com") {
         emailNoValido.innerHTML = "El dominio del correo electronico debe ser de Capgemini";
         dojo.style(emailNoValido, { display: "block" });
         emailValido = false;
      } else {
         dojo.style(emailNoValido, { display: "none" });
         emailValido = true;
      }

      if (dom.byId("email2").value != "") {
         validarEmailsIguales();
      }
   };

   const validarEmailsIguales = () => {
      dojo.style(emailNoValido2, { display: "none" });

      if (email != dom.byId("email2").value) {
         emailNoValido2.innerHTML = "Los correos electrónicos no coinciden";
         dojo.style(emailNoValido2, { display: "block" });
         emailsCoinciden = false;
      } else {
         dojo.style(emailNoValido2, { display: "none" });
         emailsCoinciden = true;
      }
   };

   const guardarUsuario = (userForm) => {
      userForm.rol = rol;
      userForm.id = store.data[store.data.length - 1].id + 1;
      userObject = userForm;
   };

   const guardarUsuarioFull = (passwordForm) => {
      userObject.password = passwordForm.password;
   };

   const guardarUsuarioStore = () => {
      setTimeout(() => {
         store.data.push(userObject);
         togglerSpinner.hide();
      }, 4000);
   };

   const vaciarCamposRegistro = () => {
      domAttr.set(dom.byId("nombre"), "value", "");
      domAttr.set(dom.byId("username"), "value", "");
      domAttr.set(dom.byId("password"), "value", "");
      domAttr.set(dom.byId("password2"), "value", "");
      domAttr.set(dom.byId("rolHR"), "checked", false);
      domAttr.set(dom.byId("rolIT"), "checked", false);
      domAttr.set(dom.byId("numLegajo"), "value", "");
      domAttr.set(dom.byId("email"), "value", "");
      domAttr.set(dom.byId("email2"), "value", "");
   };

   const vaciarInvalidsFeedback = () => {
      nombreNoValido.innerHTML = "";
      usernameNoValido.innerHTML = "";
      passwordNoValida.innerHTML = "";
      passwordNoValida2.innerHTML = "";
      emailNoValido.innerHTML = "";
   };
});
