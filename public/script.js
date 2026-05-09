document.getElementById('loginForm').addEventListener('submit', async (e) => {
    // 1. Evitamos que el formulario recargue la página
    e.preventDefault(); 

    // 2. Capturamos los valores de los inputs
    // Nota: Usamos los IDs definidos en tu HTML (nombre, correo, password)
    const data = {
        Nombre: document.getElementById('nombre').value,
        Correo: document.getElementById('correo').value,
        Contrasena: document.getElementById('contrasena').value 
    };

    try {
        // 3. Enviamos los datos al servidor mediante una petición POST
        const response = await fetch('http://localhost:3000/api/register', {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(data)
        });

        // 4. Procesamos la respuesta del servidor
        const result = await response.json();

        if (response.ok) {
            // Si el servidor responde con un estatus 200-299
            alert("¡Registro exitoso! El usuario ha sido guardado.");
            
            // Opcional: Limpiar el formulario tras el éxito
            document.getElementById('loginForm').reset();
            
            // Si deseas redirigir al usuario después de registrarse:
            // window.location.href = "admin.html"; 
        } else {
            // Si el servidor devuelve un error (ej. 401, 500)
            alert("Error al registrar: " + (result.message || "Credenciales inválidas"));
        }

    } catch (error) {
        // En caso de que el servidor esté apagado o haya un error de red
        console.error("Error de conexión con el servidor:", error);
        alert("No se pudo conectar con el servidor. Asegúrate de que Node.js esté corriendo.");
    }
});