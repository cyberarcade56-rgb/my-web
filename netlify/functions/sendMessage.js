// Importamos 'axios' (lo instalaremos en el siguiente paso)
const axios = require('axios');

// Esta es la función principal que Netlify ejecutará
exports.handler = async (event) => {
    
    // 1. Validar que la petición sea un POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            body: JSON.stringify({ message: "Método no permitido" }),
        };
    }

    // 2. Obtener los secretos (Token y Chat ID) desde las variables de entorno de Netlify
    // (Los configuraremos en Netlify al final, aquí no se escribe nada)
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
        console.error("Variables de entorno de Telegram no configuradas.");
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error de configuración del servidor." }),
        };
    }

    // 3. Parsear los datos que vienen del formulario (del script.js)
    let data;
    try {
        data = JSON.parse(event.body);
    } catch (error) {
        return { statusCode: 400, body: JSON.stringify({ message: "Cuerpo de la petición inválido." }) };
    }

    // 4. Formatear el mensaje que llegará a Telegram
    // (Esta es la parte que estaba incompleta)
    const text = `
🔮 **Nueva Consulta de Tarot Web** 🔮

👤 **Nombre:**
${data.name}

📬 **Contacto (Email/WP):**
${data.email}

💬 **Mensaje:**
${data.message}
`; // <--- ¡Faltaba este cierre!

    // 5. Construir la URL de la API de Telegram
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

    try {
        // 6. Enviar el mensaje a Telegram
        await axios.post(url, {
            chat_id: CHAT_ID,
            text: text,
            parse_mode: 'Markdown', // Para que reconozca las negritas (**)
        });

        // 7. Devolver una respuesta de éxito al front-end
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Mensaje enviado exitosamente" }),
        };

    } catch (error) {
        // 8. Manejar errores si Telegram falla
        console.error("Error enviando a Telegram:", error.response ? error.response.data : error.message);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error interno al contactar con Telegram." }),
        };
    }
};