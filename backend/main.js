const express = require('express');
const bodyParser = require('body-parser');
const babel = require('@babel/core');
const cors = require('cors'); // Import the cors package
const babelPresetReact = require('@babel/preset-react')
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Enable CORS for all routes
app.use(cors());

// API endpoint to transform React class components to functional components
app.post('/transform', (req, res) => {
    const inputCode = req.body.code;
    if (!inputCode) {
        return res.status(400).json({ error: 'Code is required in the request body.' });
    }

    try {
        const transpiledCode = babel.transform(inputCode, {
            plugins: ["babel-plugin-transform-react-class-to-function", "@babel/plugin-transform-react-jsx", 'babel-plugin-transform-jsx-to-htm']
        });

        // Transform JSX to React.createElement
        // const htmlParsed = babel.transform(transpiledCode.code, {
        //     plugins: ['babel-plugin-transform-jsx-to-htm']
        // });

        const jsxTransformedCode = babel.transform(transpiledCode.code, {
            presets: [babelPresetReact],
        });

        console.log(jsxTransformedCode)

        res.json({ success: jsxTransformedCode.code });
    } catch (error) {
        console.error('Error transforming code:', error);
        res.status(500).json({ error: 'Internal server error.' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
