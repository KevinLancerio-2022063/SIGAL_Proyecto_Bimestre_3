# SIGAL - Sistema de Gestión Académica y Laboral

## Descripción del Proyecto

**SIGAL** (Sistema de Gestión Académica y Laboral) es una plataforma integral diseñada para gestionar y conciliar la vida académica y laboral de los estudiantes universitarios.
El sistema conecta a estudiantes, profesores, universidades y empleadores en un ecosistema digital que facilita la gestión de horarios, la detección de conflictos, la postulación a oportunidades laborales y el seguimiento académico.

##  Objetivo

### Objetivo General
Desarrollar un sistema que optimice la conciliación entre la vida académica y laboral del estudiante universitario, reduciendo la deserción escolar por motivos laborales y facilitando el acceso a oportunidades de empleo y pasantías.

### Objetivos Específicos
- Centralizar la gestión de horarios académicos y laborales de los estudiantes.
- Automatizar la detección de superposiciones y carga excesiva de horarios.
- Digitalizar el flujo de aprobación de permisos y ajustes académicos.
- Vincular a los estudiantes con oportunidades laborales y académicas afines a su carrera.
- Proporcionar herramientas de seguimiento del rendimiento académico durante la vida laboral.

## ️ Tecnologías Utilizadas

### Backend
- **Node.js** (v16 o superior) - Entorno de ejecución JavaScript del lado del servidor
- **TypeScript** - Superset tipado de JavaScript para mayor seguridad y mantenibilidad
- **HTTP Nativo** - Servidor HTTP sin frameworks externos (sin Express, sin Fastify)

### Base de Datos
- **MySQL 8.0** - Sistema de gestión de bases de datos relacional
- **Procedimientos Almacenados** - Lógica de negocio encapsulada en la base de datos
- **mysql2** - Driver de Node.js para MySQL con soporte de promesas

### Gestión de Paquetes
- **pnpm** - Gestor de paquetes rápido y eficiente

### Arquitectura
- **Clean Architecture** - Separación de responsabilidades en capas
- **API RESTful** - Diseño de endpoints siguiendo estándares REST

##  Entidades del Sistema

El sistema gestiona **15 entidades** principales:

| # | Entidad | Descripción |
|---|---------|-------------|
| 1 | **Usuario** | Gestión de usuarios del sistema (estudiantes, profesores, empleadores, admin) |
| 2 | **Universidad** | Información de instituciones educativas |
| 3 | **Estudiante** | Datos académicos y matrícula de estudiantes |
| 4 | **Profesor** | Información docente y asignación académica |
| 5 | **Empleador** | Empresas y organizaciones que ofrecen oportunidades |
| 6 | **Curso** | Oferta académica y materias disponibles |
| 7 | **Horario Académico** | Horarios de clases de los estudiantes |
| 8 | **Horario Laboral** | Horarios de trabajo de los estudiantes |
| 9 | **Conflicto Horario** | Detección y gestión de choques de horarios |
| 10 | **Solicitud de Ajuste** | Peticiones de cambio de horario o permisos |
| 11 | **Oportunidad** | Becas, pasantías y empleos disponibles |
| 12 | **Evaluación** | Instrumentos de evaluación académica |
| 13 | **Calificación** | Registro de notas y retroalimentación |
| 14 | **Postulación** | Aplicaciones de estudiantes a oportunidades |
| 15 | **Auditoría** | Registro de acciones y eventos del sistema |

##  Rutas Generales de la API

http://localhost:3000/api

### Endpoints Disponibles

#### Usuarios
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/usuarios` | Listar todos los usuarios |
| GET | `/api/usuarios/:id` | Obtener usuario por ID |
| POST | `/api/usuarios` | Crear nuevo usuario |
| PUT | `/api/usuarios/:id` | Actualizar usuario |
| DELETE | `/api/usuarios/:id` | Eliminar usuario |

#### Universidades
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/universidades` | Listar todas las universidades |
| GET | `/api/universidades/:id` | Obtener universidad por ID |
| POST | `/api/universidades` | Crear nueva universidad |
| PUT | `/api/universidades/:id` | Actualizar universidad |
| DELETE | `/api/universidades/:id` | Eliminar universidad |

#### Estudiantes
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/estudiantes` | Listar todos los estudiantes |
| GET | `/api/estudiantes/:id` | Obtener estudiante por ID |
| POST | `/api/estudiantes` | Crear nuevo estudiante |
| PUT | `/api/estudiantes/:id` | Actualizar estudiante |
| DELETE | `/api/estudiantes/:id` | Eliminar estudiante |

#### Profesores
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/profesores` | Listar todos los profesores |
| GET | `/api/profesores/:id` | Obtener profesor por ID |
| POST | `/api/profesores` | Crear nuevo profesor |
| PUT | `/api/profesores/:id` | Actualizar profesor |
| DELETE | `/api/profesores/:id` | Eliminar profesor |

#### Empleadores
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/empleadores` | Listar todos los empleadores |
| GET | `/api/empleadores/:id` | Obtener empleador por ID |
| POST | `/api/empleadores` | Crear nuevo empleador |
| PUT | `/api/empleadores/:id` | Actualizar empleador |
| DELETE | `/api/empleadores/:id` | Eliminar empleador |

#### Cursos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/cursos` | Listar todos los cursos |
| GET | `/api/cursos/:id` | Obtener curso por ID |
| POST | `/api/cursos` | Crear nuevo curso |
| PUT | `/api/cursos/:id` | Actualizar curso |
| DELETE | `/api/cursos/:id` | Eliminar curso |

#### Horarios Académicos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/horarios-academicos?id_estudiante=X` | Listar horarios por estudiante |
| GET | `/api/horarios-academicos/:id` | Obtener horario por ID |
| POST | `/api/horarios-academicos` | Crear nuevo horario académico |
| DELETE | `/api/horarios-academicos/:id` | Eliminar horario académico |

#### Horarios Laborales
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/horarios-laborales?id_estudiante=X` | Listar horarios por estudiante |
| GET | `/api/horarios-laborales/:id` | Obtener horario por ID |
| POST | `/api/horarios-laborales` | Crear nuevo horario laboral |
| PUT | `/api/horarios-laborales/:id` | Actualizar horario laboral |
| DELETE | `/api/horarios-laborales/:id` | Eliminar horario laboral |

#### Conflictos Horario
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/conflictos-horario?id_estudiante=X` | Listar conflictos por estudiante |
| GET | `/api/conflictos-horario/:id` | Obtener conflicto por ID |
| POST | `/api/conflictos-horario` | Registrar nuevo conflicto |
| PUT | `/api/conflictos-horario/:id` | Resolver conflicto |

####  Solicitudes de Ajuste
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/solicitudes-ajuste?id_estudiante=X` | Listar solicitudes por estudiante |
| GET | `/api/solicitudes-ajuste/:id` | Obtener solicitud por ID |
| POST | `/api/solicitudes-ajuste` | Crear nueva solicitud |
| PUT | `/api/solicitudes-ajuste/:id` | Resolver solicitud |

#### Oportunidades
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/oportunidades` | Listar todas las oportunidades |
| GET | `/api/oportunidades/:id` | Obtener oportunidad por ID |
| POST | `/api/oportunidades` | Crear nueva oportunidad |
| PUT | `/api/oportunidades/:id` | Actualizar oportunidad |
| DELETE | `/api/oportunidades/:id` | Eliminar oportunidad |

#### Evaluaciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/evaluaciones?id_curso=X` | Listar evaluaciones por curso |
| GET | `/api/evaluaciones/:id` | Obtener evaluación por ID |
| POST | `/api/evaluaciones` | Crear nueva evaluación |
| DELETE | `/api/evaluaciones/:id` | Eliminar evaluación |

#### Calificaciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/calificaciones?id_estudiante=X` | Listar calificaciones por estudiante |
| GET | `/api/calificaciones/:id` | Obtener calificación por ID |
| POST | `/api/calificaciones` | Crear nueva calificación |
| PUT | `/api/calificaciones/:id` | Actualizar calificación |

#### Postulaciones
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/postulaciones?id_estudiante=X` | Listar postulaciones por estudiante |
| GET | `/api/postulaciones/:id` | Obtener postulación por ID |
| POST | `/api/postulaciones` | Crear nueva postulación |
| PUT | `/api/postulaciones/:id` | Actualizar estado de postulación |

#### Auditoría
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/auditoria` | Listar todos los registros |
| POST | `/api/auditoria` | Registrar nuevo evento |

## Estructura del Proyecto

src/
├── api/
│ ├── router.ts # Enrutador principal
│ └── server.ts # Configuración del servidor HTTP
├── data/
│ ├── database.ts # Conexión a MySQL
│ └── Repository.ts # Repositorios de cada entidad
├── menu/
│ ├── menuPrincipal.ts # Menú principal interactivo
│ └── menu.ts # Menús de cada entidad
├── model/
│ ── *.ts # Interfaces y DTOs de cada entidad
├── routes/
│ └── *.routes.ts # Rutas HTTP de cada entidad
├── service/
│ ── *Service.ts # Lógica de negocio de cada entidad
├── utils/
│ ├── errors.ts # Manejo de errores personalizados
│ ├── readline.ts # Utilidad para entrada de consola
│ └── validators.ts # Funciones de validación
└── index.ts # Punto de entrada de la aplicación