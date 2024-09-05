# Baby Tracker App

## Descripción
Esta aplicación móvil está diseñada para ayudar a los padres a realizar un seguimiento de las rutinas de sus bebés. Permite registrar eventos importantes como cambios de pañal, alimentación y más, facilitando la gestión diaria del cuidado del bebé. La app interactúa con una API REST para almacenar y consultar los eventos, proporcionando un informe detallado de las actividades del bebé.

## Funcionalidades
La aplicación permite realizar las siguientes acciones:

1. **Registro de usuario**:
   - Se requiere ingresar usuario, contraseña, departamento y ciudad.
   - Auto-login tras el registro exitoso y persistencia de la sesión mediante `localStorage`.
   - En caso de error, se mostrará el mensaje correspondiente en la interfaz.

2. **Inicio de sesión**:
   - El usuario puede iniciar sesión con usuario y contraseña.
   - Al iniciar sesión con éxito, se obtiene un token único para cada sesión.
   - Se muestra un mensaje de error en la interfaz si las credenciales son incorrectas.

3. **Cerrar sesión**:
   - Los usuarios pueden cerrar sesión para permitir que otro usuario acceda a la app.

4. **Registrar eventos**:
   - Registrar eventos relacionados con el bebé, como cambios de pañal, alimentación, etc.
   - Campos obligatorios: categoría (id) y fecha/hora (opcional; por defecto, la fecha y hora actual).
   - Opción de agregar detalles adicionales (opcional).

5. **Listado de eventos**:
   - Se listan todos los eventos del día y días anteriores.
   - Cada evento muestra un ícono según la categoría.
   - Botón para eliminar eventos individualmente.

6. **Informe de eventos**:
   - Resumen de biberones ingeridos y pañales cambiados en el día.
   - Se muestra el tiempo transcurrido desde el último evento relevante.

7. **Mapa de ubicaciones**:
   - Muestra la ubicación actual del usuario y las plazas cercanas, indicando si son accesibles y si permiten mascotas.

## Tecnologías utilizadas
- **Framework**: [Ionic Framework](https://ionicframework.com/)
- **Lenguaje**: JavaScript
- **API REST**: Interacción con API para almacenamiento y consulta de eventos.
- **Almacenamiento local**: Uso de `localStorage` para persistencia de sesiones.

