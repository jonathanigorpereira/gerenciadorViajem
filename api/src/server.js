import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import session from "express-session";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import swaggerDocs from "./swagger.js";
import connectDB from "./config/db.js";
import cargoRoutes from "./routes/cargoRoute.js";
import empregadoRoutes from "./routes/empregadoRoute.js";
import unidadeFederativaRoutes from "./routes/unidadeFederativaRoute.js";
import municipioRoutes from "./routes/municipioRoute.js";
import authRoutes from "./routes/authRoute.js";
import viagemRoutes from "./routes/viagemRoute.js";
import Empregado from "./models/Empregado.js";

// Configuração do ambiente
dotenv.config();

// Inicializa o express
const app = express();

// Verifica se o Google OAuth está corretamente configurado
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error("Faltando configurações do Google OAuth. Verifique o .env.");
}

// Configuração de CORS
app.use(
  cors({
    origin: [process.env.BASE_FRONT_URL],
    credentials: true,
  })
);

// Conecta ao banco de dados
connectDB();

// Faz o parse de dados no formato JSON enviados no corpo das requisições HTTP
app.use(express.json());

// Configuração de sessão para o Passport
app.use(
  session({
    secret: process.env.SESSION_SECRET || "pQ8&Z2!vF%K9@dL$wUqXy#3oH7tN4rT",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 dia
      sameSite: "lax",
    },
    store: new session.MemoryStore(),
  })
);

// Inicializa o Passport
app.use(passport.initialize());
app.use(passport.session());

// Configura o Passport com a estratégia de autenticação do Google
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.GOOGLE_CALLBACK_URL ||
        process.env.BASE_URL + "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await Empregado.findOne({ googleId: profile.id });

        if (!user) {
          user = new Empregado({
            googleId: profile.id,
            nomeEmpregado:
              profile.displayName ||
              `${profile.name.givenName} ${profile.name.familyName}`,
            email: profile.emails[0].value,
            idCargo: 2,
            ativo: true,
          });
          await user.save();
        }
        return done(null, user);
      } catch (err) {
        console.error("Erro durante a autenticação:", err);
        return done(err, null);
      }
    }
  )
);

// Serializa o usuário na sessão
passport.serializeUser((user, done) => done(null, user.id)); // Serializa o _id ou idEmpregado

// Deserializa o usuário da sessão
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Empregado.findById(id); // Busca o usuário pelo _id do MongoDB

    if (user) {
      done(null, user); // Se o usuário for encontrado, passa para a função done
    } else {
      done(null, false); // Se o usuário não for encontrado, retorna false
    }
  } catch (err) {
    done(err, null); // Em caso de erro, retorna o erro
  }
});

// Usando as rotas
app.use("/api/v1/cargos", cargoRoutes);
app.use("/api/v1/empregados", empregadoRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/unidades-federativas", unidadeFederativaRoutes);
app.use("/api/v1/municipios", municipioRoutes);
app.use("/api/v1/viagens", viagemRoutes);

// Define a porta usando a variável de ambiente ou 3333
const PORT = process.env.PORT || 3333;
// Define o host como "0.0.0.0"
const HOST = process.env.PATH_HOST || "0.0.0.0";

// Inicia o servidor e exibe uma mensagem no console
app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
});

swaggerDocs(app, PORT);
