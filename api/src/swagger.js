import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

// Definindo as opções do Swagger
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gerenciamento de Viagens API",
      description:
        "API para gerenciamento de viagens com suporte a OAuth Google e JWT",
      version: "1.0.0", // Versão da API
    },
    servers: [
      {
        url: "http://localhost:3333/api/v1", // Atualize conforme necessário
      },
    ],
    components: {
      securitySchemes: {
        googleOAuth: {
          type: "oauth2",
          flows: {
            authorizationCode: {
              authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
              tokenUrl: "https://oauth2.googleapis.com/token",
              scopes: {
                profile: "Acesso ao perfil do usuário",
                email: "Acesso ao email do usuário",
              },
            },
          },
        },
        BearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description: "Autenticação via token JWT. Exemplo: 'Bearer {token}'",
        },
      },
    },
    security: [
      {
        googleOAuth: [],
      },
      {
        BearerAuth: [], // Definindo segurança global para JWT
      },
    ],
  },
  apis: ["./src/routes/*.js"], // Caminho para os arquivos de documentação das rotas
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  // Serve a documentação do Swagger na rota /api-documentacao
  app.use(
    "/api-documentacao",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "Gerenciamento de Viagens API Docs",
      swaggerOptions: {
        operationsSorter: "alpha", // Ordena as operações alfabeticamente
      },
    })
  );

  // Disponibiliza a documentação em formato JSON
  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

export default swaggerDocs;
