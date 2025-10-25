document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("contact-form");
    const statusDiv = document.getElementById("form-status");
    const submitButton = document.getElementById("submit-button");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // 1. Mostrar estado de carga
        submitButton.disabled = true;
        submitButton.innerText = "Enviando...";
        statusDiv.innerText = "";

        // 2. Obtener los datos del formulario
        const formData = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
        };

        try {
            // 3. Enviar datos a nuestra Netlify Function
            const response = await fetch("/.netlify/functions/sendMessage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                // 4. Éxito
                form.reset();
                statusDiv.innerText = "¡Mensaje enviado con éxito! Te responderé pronto.";
                statusDiv.style.color = "#f7d794"; // Dorado
            } else {
                // 5. Error del servidor
                throw new Error("Error al enviar el mensaje. Intenta de nuevo.");
            }

        } catch (error) {
            // 6. Error de red o del servidor
            statusDiv.innerText = error.message;
            statusDiv.style.color = "#ff8a8a"; // Rojo
        } finally {
            // 7. Restaurar el botón
            submitButton.disabled = false;
            submitButton.innerText = "Enviar Mensaje";
        }
    });
});