import express from "express";
import axios from "axios";
import dotenv from "dotenv";
import cookieSession from "cookie-session";
import cors from "cors";

dotenv.config();
const app = express();

// --- Configuración general ---
app.set("trust proxy", 1); // Necesario en Codespaces

// --- CORS ---
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

// --- Session ---
app.use(cookieSession({
  name: "session",
  keys: ["clave_secreta"],
  maxAge: 24 * 60 * 60 * 1000, // 24h
  sameSite: 'none',
  secure: true,
}));

// --- Login Microsoft ---
app.get("/auth/microsoft", (req, res) => {
  const params = new URLSearchParams({
    client_id: process.env.CLIENT_ID,
    response_type: "code",
    redirect_uri: process.env.REDIRECT_URL,
    response_mode: "query",
    scope: "openid profile email offline_access User.Read",
  });
  res.redirect(`https://login.microsoftonline.com/common/oauth2/v2.0/authorize?${params}`);
});

// --- Callback Microsoft ---
app.get("/auth/microsoft/callback", async (req, res) => {
  const code = req.query.code;
  if (!code) return res.redirect(`${process.env.FRONTEND_URL}?error=auth_failed`);

  try {
    // Obtener token
    const tokenRes = await axios.post(
      `https://login.microsoftonline.com/common/oauth2/v2.0/token`,
      new URLSearchParams({
        client_id: process.env.CLIENT_ID,
        scope: "openid profile email offline_access User.Read",
        code: code,
        redirect_uri: process.env.REDIRECT_URL,
        grant_type: "authorization_code",
        client_secret: process.env.CLIENT_SECRET,
      })
    );

    const access_token = tokenRes.data.access_token;

    // Obtener datos del usuario
    const userRes = await axios.get("https://graph.microsoft.com/v1.0/me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });

    const userData = userRes.data;
    console.log("Datos del usuario Microsoft:", userData);

    const cleanMail = 
    userData.mail?.split("#EXT#")[0] ||
    userData.userPrincipalName?.SPLIT("#EXT#")[0]||
    "SIN CORREO";

    // Guardar en sesión
    req.session.user = {
      id: userData.id,
      displayName: userData.displayName,
      mail: cleanMail,
    };

    // Redireccionar con delay para Codespaces
    const redirectUrl = `${process.env.FRONTEND_URL}/dashboard`;
    const delay = 10000;
    console.log(`Redirigiendo a frontend en ${delay}ms...`);
    setTimeout(() => res.redirect(redirectUrl), delay);

  } catch (error) {
    console.error("Error autenticando con Microsoft:", error.message);
    res.status(500).send("Error autenticando con Microsoft");
  }
});

// --- Obtener sesión ---
app.get("/user", (req, res) => {
  if (req.session.user) return res.json(req.session.user);
  else res.status(401).send("No autenticado");
});

// --- Logout ---
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect(`${process.env.FRONTEND_URL}`);
});

// --- Raíz ---
app.get("/", (req, res) => res.send("Backend Microsoft Auth funcionando"));

// --- Iniciar servidor ---
app.listen(5000, () => console.log("Servidor corriendo en puerto 5000"));