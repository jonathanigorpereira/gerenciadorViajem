import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import dotenv from "dotenv";

dotenv.config();

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Gerenciamento de Viagens API",
      description:
        "API para gerenciamento de viagens com suporte a OAuth Google e JWT",
      version: "1.0.0",
    },
    servers: [
      {
        url: process.env.BASE_URL + "/api/v1",
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
        BearerAuth: [],
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use(
    "/api-documentacao",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec, {
      customSiteTitle: "Gerenciamento de Viagens API Docs",
      swaggerOptions: {
        operationsSorter: (a, b) => {
          const order = ["get", "post", "put", "delete"];
          return (
            order.indexOf(a.get("method")) - order.indexOf(b.get("method"))
          );
        },
      },
    })
  );

  app.get("/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
};

export default swaggerDocs;
