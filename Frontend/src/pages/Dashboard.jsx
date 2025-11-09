import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Configurar estilos del body
        document.body.style.margin = "0";
        document.body.style.padding = "0";
        document.body.style.backgroundColor = '#e3f2fd';
        document.body.style.overflow = 'hidden';

        // Obtener datos del usuario
        api
        .get("/user")
            .then((res) => setUser(res.data))
            .catch(error => {
                window.location.href = '/';
            });

        // Limpieza al desmontar
        return () => {
            document.body.style.overflow = 'auto';
            document.body.style.backgroundColor = ''; // Restaurar color original
        };
    }, []);

    if (!user) {
        return (
            <div style={{
                backgroundColor: '#e3f2fd', // Mismo color que el body
                color: "#002b5b",
                height: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                <div>Cargando datos...</div>
            </div>
        );
    }

    // Separar nombre y apellido del displayName
    const nameParts = user.displayName ? user.displayName.split(' ') : [];
    const firstName = nameParts[0] || '';
    const lastName = nameParts.slice(1).join(' ') || '';

    return (
        <div style={{
            backgroundColor: '#e3f2fd', // Mismo color azul claro que el Home
            color: "#002b5b",
            width: '100vw',
            minHeight: '100vh',
            display: 'flex',
            flexDirection: "column",
            justifyContent: 'center',
            alignItems: 'center',
            margin: 0,
            padding: '20px',
            boxSizing: 'border-box'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                width: "90%",
                boxShadow: '0 0 15px rgba(0, 45, 91, 0.1)', // Color corregido
                maxWidth: '600px',
                textAlign: "center",
            }}>
                <h1 style={{ color: '#002b5b', marginBottom: '30px' }}>Bienvenido</h1>

                <div style={{ marginBottom: '1rem', fontSize: '18px' }}>
                    <strong>Nombre:</strong> {firstName}
                </div>

                <div style={{ marginBottom: '1rem', fontSize: '18px' }}>
                    <strong>Apellido:</strong> {lastName}
                </div>

                <div style={{ marginBottom: '2rem', fontSize: '18px' }}>
                    <strong>Correo:</strong> {user.mail}
                </div>

                <button
                    onClick={() => (window.location.href = `${import.meta.env.VITE_BACKEND_URL}/logout`)}
                    style={{
                        backgroundColor: '#0078d7',
                        color: 'white',
                        border: 'none',
                        padding: '12px 24px',
                        marginTop: "20px",
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: "16px",
                        boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                        fontWeight: 'bold'
                    }}
                >
                    Cerrar sesión
                </button>
            </div>
        </div>
    );
};

export default Dashboard;