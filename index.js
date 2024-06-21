import express from 'express';
import Jimp from 'jimp';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// Obtener el directorio actual
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurar middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Ruta raíz que devuelve el formulario HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Ruta para procesar la imagen
app.get('/procesar', async (req, res) => {
    const { imageUrl } = req.query;

    try {
        const image = await Jimp.read(imageUrl);

        // Procesar la imagen: escala de grises y redimensionar
        image
            .greyscale()
            .resize(350, Jimp.AUTO);

        // Generar un nombre único para la imagen
        const imageName = `blancoynegro-${uuidv4()}.jpg`;

        // Guardar la imagen procesada en la carpeta public
        await image.writeAsync(path.join(__dirname, 'public', imageName));

        // Enviar la respuesta con la URL de la imagen procesada
        res.send(`<img src="${imageName}" alt="Imagen en blanco y negro">`);
    } catch (error) {
        console.error('Error al procesar la imagen:', error);
        res.status(500).send('Error al procesar la imagen.');
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor iniciado en http://localhost:${PORT}`);
});
