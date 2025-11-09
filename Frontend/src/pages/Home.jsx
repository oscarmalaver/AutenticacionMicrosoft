import React from 'react';

const Home = () => {
  const handleLogin = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/microsoft`;
  };

  return (
    <div style={{
      backgroundColor: "#e3f2fd", 
      color: "#0d47a1", 
      minHeight: "100vh", 
      width: "100vw", 
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      margin: 0,
      padding: 0,
      boxSizing: "border-box",
    }}>
      <div
        style={{
          backgroundColor: "white", // cuadro ads claro
          padding: "40px",
          borderRadius: "12px", 
          width:"90%",
          maxWidth: "400px", // ancho máximo
          textAlign: "center",
          boxShadow: "0 0 15px rgba(0, 45, 91, 0.1)", // sombra ligera
        }}
      >
        <div style={{ fontSize: "24px", marginBottom: "10px" }}>
          Autenticación con Microsoft {/* Título */}
        </div>
        <div style={{ marginBottom: "20px" }}>
          Inicia sesión para continuar {/* Instrucción */}
        </div>
        <button
          onClick={handleLogin} // acción al hacer click
          style={{
            backgroundColor: "#0078d7", // azul Microsoft
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer", // puntero al pasar sobre el botón
            fontSize: "16px",
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)", // sombra del botón
          }}
        >
          Iniciar sesión con Microsoft {/* texto del botón */}
        </button>
      </div>
    </div>
  );
};

export default Home;