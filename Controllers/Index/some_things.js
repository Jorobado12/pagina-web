$(document).ready(function() {
    // Limpieza inicial de los campos de entrada al cargar la página
    clearInputs("#loginFormContainer");
    clearInputs("#registrationFormContainer");

    // Mostrar el contenedor de bienvenida inicialmente
    $("#welcomeContainer").show().addClass('show');

    // Cambio de formularios al hacer clic en los enlaces
    $("#registerLink").on("click", function (e) {
        e.preventDefault();
        saveAndSwitchForms("#welcomeContainer, #loginFormContainer", "#registrationFormContainer");
        clearInputs("#loginFormContainer");
    });

    $("#loginLink").on("click", function (e) {
        e.preventDefault();
        saveAndSwitchForms("#welcomeContainer, #registrationFormContainer", "#loginFormContainer");
        clearInputs("#registrationFormContainer");
    });

    // Cambio de formularios desde la sección de bienvenida
    $("#registerLinkWelcome").on("click", function (e) {
        e.preventDefault();
        saveAndSwitchForms("#welcomeContainer", "#registrationFormContainer");
        clearInputs("#loginFormContainer");
    });

    $("#loginLinkWelcome").on("click", function (e) {
        e.preventDefault();
        saveAndSwitchForms("#welcomeContainer", "#loginFormContainer");
        clearInputs("#registrationFormContainer");
    });

    // Manejar el enlace de Home
    $("#homeLink").on("click", function (e) {
        e.preventDefault();
        saveAndSwitchForms("#loginFormContainer, #registrationFormContainer", "#welcomeContainer");
    });

    // Función para guardar y cambiar formularios
    function saveAndSwitchForms(hideSelector, showSelector) {
        var inputsToSave = $(hideSelector + " input");
        var inputValues = {};

        // Guardar los valores de los inputs que queremos conservar
        inputsToSave.each(function() {
            var input = $(this);
            inputValues[input.attr("name")] = input.val();
        });

        // Ocultar el formulario actual y mostrar el nuevo formulario
        $(hideSelector).removeClass('show').hide();
        $(showSelector).show().addClass('show');

        // Restaurar los valores de los inputs en el nuevo formulario
        for (var name in inputValues) {
            $(showSelector + ' input[name="' + name + '"]').val(inputValues[name]);
        }
    }

    // Función para limpiar los inputs de un formulario
    function clearInputs(formSelector) {
        $(formSelector + " input").val("");
    }

    // JavaScript para mostrar/ocultar la contraseña
    var showPasswordCheckbox = document.getElementById('showPassword');
    if (showPasswordCheckbox) {
        showPasswordCheckbox.addEventListener('change', function() {
            var passwordField = document.getElementById('edtpassword');
            if (passwordField) {
                if (this.checked) {
                    passwordField.type = 'text';
                } else {
                    passwordField.type = 'password';
                }
            }
        });
    }

    // Verificar la coincidencia de las contraseñas al cargar la página
    checkPasswordMatch();

    // Verificar la coincidencia de las contraseñas cuando se ingresan
    $("#Rpassword, #RconfirmPassword").on("keyup", function() {
        checkPasswordMatch();
    });

    function checkPasswordMatch() {
        var password = $("#Rpassword").val();
        var confirmPassword = $("#RconfirmPassword").val();
        var passwordMismatchElement = $("#passwordMismatch");

        if (password === '' && confirmPassword === '') {
            passwordMismatchElement.hide();
        } else if (password !== confirmPassword) {
            passwordMismatchElement.show();
        } else {
            passwordMismatchElement.hide();
        }
    }
});