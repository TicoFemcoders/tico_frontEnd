const UsersPage = () => {
    return (
        <div>
            <h1>Gestión de Usuarios</h1>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Email</th>
                        <th>Rol</th>
                        <th>Estado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Usuario de prueba</td>
                        <td>usuario@email.com</td>
                        <td>ADMIN</td>
                        <td>Activo</td>
                        <td>Editar | Eliminar</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UsersPage;