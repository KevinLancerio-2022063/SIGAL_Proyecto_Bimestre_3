drop database if exists sigal_in5cm;
create database sigal_in5cm;
use sigal_in5cm;

-- 1. Usuario
create table Usuario (
    id_usuario int primary key auto_increment not null,
    nombre varchar (150) not null,
    email varchar (100) unique not null,
    contrasena varchar (100) not null,
    tipo_usuario enum("ESTUDIANTE", "PROFESOR", "EMPLEADOR", "ADMIN"),
    activo tinyint(1) default 1 not null,
    fecha_registro datetime default current_timestamp not null,
    ultimo_acceso datetime null, -- Colocamos null porque no existe al registrarse
    foto datetime null -- Colocamos null porque no existe al registrarse por primera vez
);

-- 2. Universidad
create table Universidad (
    id_universidad int primary key auto_increment not null,
    nombre varchar (100) not null,
    sigla varchar (20) not null,
    ubicacion varchar (150) not null,
    ciudad varchar (100) not null,
    pais varchar (100) default "Guatemala" not null,
    telefono varchar (25) not null,
    email varchar (100) not null,
    sitio_web varchar (200) not null,
    rectora varchar (100) not null,
    codigo_institucional varchar (50) unique not null,
    estado enum("ACTIVA","INACTIVA") default "ACTIVA" not null,
    fecha_registro datetime default current_timestamp,
    imagen_logo varchar (255) not null,
    acreditacion varchar (150) not null,
    tipos_programa varchar (255) not null
);

-- 3. Estudiante
create table Estudiante (
    id_estudiante int primary key auto_increment not null,
    matricula varchar (50) unique not null,
    carrera varchar (150) not null,
    semestre int not null default 1,
    promedio decimal (4,2) default 0.00,
    promedio_general decimal (4,2) default 0.00,
    estado enum("ACTIVO", "INACTIVO", "GRADUADO", "SUSPENDIDO") default "ACTIVO" not null,
    codigo_interno varchar (50) not null,
    fk_tutor_academico_id int null, -- Colocamos null porque no todo estudiante tiene tutor desde el inicio
    ultima_actualizacion_promedio datetime null, -- Colocamos null porque no hay promedio al registrarse, se llenará luego
    fk_id_usuario int not null unique,
    fk_id_universidad int not null,
    foreign key (fk_id_usuario) references Usuario(id_usuario) on delete cascade,
    foreign key (fk_id_universidad) references Universidad(id_universidad) on delete cascade
);

-- 4. Profesor
create table Profesor (
    id_profesor int primary key auto_increment not null,
    numero_empleado varchar (50) unique not null,
    departamento varchar (70) not null,
    especialidad varchar (150) not null,
    oficina varchar (100) not null,
    telefono_oficina varchar (30) not null,
    horas_tutoria varchar (30) not null,
    activo tinyint (1) default 1 not null,
    fk_id_usuario int unique not null,
    fk_id_universidad int unique not null,
    foreign key (fk_id_usuario) references Usuario(id_usuario) on delete cascade,
    foreign key (fk_id_universidad) references Universidad(id_universidad) on delete cascade
);

alter table Estudiante
    add constraint fk_tutor_academico
    foreign key (fk_tutor_academico_id) references Profesor(id_profesor) on delete set null;

-- 5. Empleador
create table Empleador (
    id_empleador int primary key auto_increment not null,
    nombre_empresa varchar (100) not null,
    nit varchar (50) unique not null,
    sector varchar (100) not null,
    ubicacion varchar (100) not null,
    telefono_empresa varchar (30) not null,
    sitio_web varchar (200) not null,
    numero_empleados int not null,
    representante_legal varchar (150) not null,
    fk_id_usuario int not null unique,
    foreign key (fk_id_usuario) references Usuario(id_usuario) on delete cascade
);

-- 6. Curso
create table Curso (
    id_curso int primary key auto_increment not null,
    codigo_curso varchar (30) unique not null,
    nombre varchar (100) not null,
    descripcion text not null,
    creditos int default 3,
    horas int default 3,
    capacidad_maxima int default 30,
    modalidad enum("PRESENCIAL", "VIRTUAL", "HIBRIDO") default "PRESENCIAL",
    semestre varchar (20) not null,
    fk_id_profesor int not null,
    fk_id_universidad int not null,
    foreign key (fk_id_profesor) references Profesor(id_profesor) on delete cascade,
    foreign key (fk_id_universidad) references Universidad(id_universidad) on delete cascade
);

-- 7. Horario Académico
create table Horario_Academico (
    id_horario_academico int primary key auto_increment not null,
    dia_semana enum("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO") not null,
    hora_inicio time not null, -- Usamos el time para almacenar valores de tiempo que representan horas, minutos y segundos
    hora_fin time not null,
    aula varchar (50) not null,
    semestre varchar (30) not null,
    anio year not null, -- usamos la palabra clave "year" para guardar solo el año sin mes ni día
    fk_id_estudiante int not null,
    fk_id_curso int not null,
    foreign key (fk_id_estudiante) references Estudiante(id_estudiante) on delete cascade,
    foreign key (fk_id_curso) references Curso(id_curso) on delete cascade
);

-- 8. Horario Laboral
create table Horario_Laboral (
    id_horario_laboral int primary key auto_increment not null,
    puesto varchar (50) not null,
    departamento varchar (100) not null,
    supervisor varchar (100) not null,
    dia_semana enum("LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO", "DOMINGO") not null,
    hora_inicio time not null, -- Usamos el time para almacenar valores de tiempo que representan horas, minutos y segundos
    hora_fin time not null,
    salario decimal (10,2) not null,
    estado enum("ACTIVO", "INACTIVO", "SUSPENDIDO") default "ACTIVO",
    fk_id_estudiante int not null,
    fk_id_empleador int not null,
    foreign key (fk_id_estudiante) references Estudiante(id_estudiante) on delete cascade,
    foreign key (fk_id_empleador) references Empleador(id_empleador) on delete cascade
);

-- 9. Conflicto Horario
create table Conflicto_Horario (
    id_conflicto int primary key auto_increment not null,
    tipo_conflicto enum("SUPERPOSICION", "CARGA_EXCESIVA", "VIAJE_LARGO") not null,
    fecha_detectada datetime default current_timestamp,
    estado enum ("PENDIENTE", "EN_PROCESO", "RESUELTO", "IGNORADO") default "PENDIENTE",
    solucion_propuesta text not null,
    fk_id_estudiante int not null,
    fk_id_horario_academico int null, -- Usamos null porque carga_excesiva no tiene horario específico
    fk_id_horario_laboral int null, -- Usamos null porque carga_excesiva no tiene horario específico
    foreign key (fk_id_estudiante) references Estudiante(id_estudiante) on delete cascade,
    foreign key (fk_id_horario_academico) references Horario_Academico(id_horario_academico) on delete cascade,
    foreign key (fk_id_horario_laboral) references Horario_Laboral(id_horario_laboral) on delete cascade
);

-- 10. Solicitud de Ajuste
create table Solicitud_Ajuste (
    id_solicitud int primary key auto_increment not null,
    tipo enum("CAMBIO_HORARIO", "PERMISO_LABORAL", "EXTENSION_ENTREGA", "OTRO") not null,
    descripcion text not null,
    fecha_solicitud datetime default current_timestamp not null,
    estado enum("PENDIENTE", "APROBADA", "RECHAZADA", "EN_REVISION") default "PENDIENTE" not null,
    requiere_aprobacion tinyint(1) default 1 not null,
    fecha_resolucion datetime null, -- Colocamos null porque no existe hasta que alguien resuelva la solicitud
    justificacion text not null,
    fk_id_estudiante int not null,
    fk_id_profesor int null, -- Colocamos null porque la solicitud va a uno u otro, no ambos obligatorio, solo se llena si va dirigida a un profesor
    fk_id_empleador int null, -- Colocamos null porque la solicitud va a uno u otro, no ambos obligatorio, solo se llena si va dirigida a un empleador
    foreign key (fk_id_estudiante) references Estudiante(id_estudiante) on delete cascade,
    foreign key (fk_id_profesor) references Profesor(id_profesor) on delete cascade,
    foreign key (fk_id_empleador) references Empleador(id_empleador) on delete cascade
);

-- 11. Oportunidad
create table Oportunidad (
    id_oportunidad int primary key auto_increment not null,
    titulo varchar (50) not null,
    descripcion text not null,
    tipo enum("BECA", "PASANTIA", "EMPLEO", "PROGRAMA_INTERCAMBIO") not null,
    publicado_por enum("EMPLEADOR", "UNIVERSIDAD", "ADMIN") not null,
    requisitos_principales text not null,
    salario decimal (10,2) not null,
    duracion varchar (50) not null,
    fecha_publicacion datetime default current_timestamp,
    fecha_vencimiento datetime not null,
    estado enum("ACTIVA", "CERRADA", "PAUSADA", "VENCIDA") default "ACTIVA" not null,
    fk_id_empleador int not null,
    fk_id_universidad int not null,
    foreign key (fk_id_empleador) references Empleador(id_empleador) on delete cascade,
    foreign key (fk_id_universidad) references Universidad(id_universidad) on delete cascade
);

-- 12. Evaluacion
create table Evaluacion (
    id_evaluacion int primary key auto_increment not null,
    tipo enum ("TAREA", "PARTICIPACION", "QUIZ", "EXAMEN_PARCIAL", "EXAMEN_FINAL", "PROYECTO") not null,
    nombre varchar (100) not null,
    descripcion text not null,
    puntaje_maximo decimal (6,2) not null default 100,
    porcentaje decimal (5,2) not null,
    fecha_programada datetime not null,
    fecha_entrega datetime not null,
    estado enum("PROGRAMADA", "ACTIVA", "CERRADA", "CANCELADA") default "PROGRAMADA",
    fk_id_curso int not null,
    fk_id_profesor int not null,
    foreign key (fk_id_curso) references Curso(id_curso) on delete cascade,
    foreign key (fk_id_profesor) references Profesor(id_profesor) on delete cascade
);

-- 13. Calificacion
create table Calificacion (
    id_calificacion int primary key auto_increment not null,
    puntaje_obtenido decimal (4,2) not null,
    observaciones text not null,
    retroalimentacion text not null,
    fecha_calificacion datetime default current_timestamp,
    estado enum("CALIFICADA", "REVISANDO", "IMPUGNADA") default "CALIFICADA" not null,
    fk_id_evaluacion int not null,
    fk_id_estudiante int not null,
    fk_id_profesor int not null,
    unique key uq_eval_estudiante (fk_id_evaluacion, fk_id_estudiante),
    foreign key (fk_id_evaluacion) references Evaluacion(id_evaluacion) on delete cascade,
    foreign key (fk_id_estudiante) references Estudiante(id_estudiante) on delete cascade,
    foreign key (fk_id_profesor) references Profesor(id_profesor) on delete cascade
);

-- 14. Postulacion
create table Postulacion (
    id_postulacion int primary key auto_increment not null,
    fecha_postulacion datetime default current_timestamp,
    estado enum("PENDIENTE", "EN_REVISION", "PRESELECCIONADO", "ENTREVISTA", "ACEPTADO", "RECHAZADO", "RETIRADO") default "PENDIENTE",
    carta_motivacion text not null,
    curriculum_url varchar (255) not null,
    porcentaje_compatibilidad decimal (5,2) not null,
    comentarios_revisor text null, -- Colocamos null porque no hay comentarios hasta que alguien revise
    fecha_respuesta datetime null, -- Colocamos null porque no hay respuesta al momento de postularse
    creado_en datetime default current_timestamp not null,
    actualizado_en datetime default current_timestamp on update current_timestamp not null,
    fk_id_estudiante int not null,
    fk_id_oportunidad int not null,
    unique key uq_estudiante_oportunidad (fk_id_estudiante, fk_id_oportunidad),
    foreign key (fk_id_estudiante) references Estudiante(id_estudiante) on delete cascade,
    foreign key (fk_id_oportunidad) references Oportunidad(id_oportunidad) on delete cascade
);

-- 15. Auditoria
create table Auditoria (
    id_auditoria int primary key auto_increment not null,
    tabla_afectada varchar (100) not null,
    accion enum("INSERT", "UPDATE", "DELETE", "LOGIN", "LOGOUT") not null,
    fk_id_usuario int not null,
    descripcion text not null,
    dato_anterior text null, -- Colocamos null porque en el INSERT no hay un dato previo
    dato_nuevo text null, -- Colocamos null porque en el DELETE no hay un dato nuevo
    ip_origen varchar (45) not null,
    fecha datetime default current_timestamp not null,
    foreign key (fk_id_usuario) references Usuario(id_usuario) on delete cascade
);

-- ---------- Procedimientos Almacenados ---------- --

-- ------------------------
-- Usuario
-- ------------------------

-- Listar Usuarios
delimiter $$
create procedure sp_listarUsuarios()
begin
	select id_usuario, nombre, email, tipo_usuario, activo, fecha_registro, ultimo_acceso
		from Usuario order by id_usuario;
end $$
delimiter ;

-- Agregar Usuario
delimiter $$
create procedure sp_agregarUsuario(
    in p_nombre varchar (150),
    in p_email varchar (100),
    in p_contrasena varchar (100),
    in p_tipo_usuario enum("ESTUDIANTE","PROFESOR","EMPLEADOR","ADMIN"),
    out p_id int
	)
	begin
		insert into Usuario (nombre, email, contrasena, tipo_usuario)
		values (p_nombre, p_email, p_contrasena, p_tipo_usuario);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Editar Usuario
delimiter $$
create procedure sp_editarUsuario(
	in p_id_usuario int,
	in p_nombre varchar (150),
	in p_email varchar (100),
	in p_tipo_usuario enum("ESTUDIANTE","PROFESOR","EMPLEADOR","ADMIN"),
	in p_activo tinyint(1)
	)
	begin
		update Usuario u
			set
			u.nombre = p_nombre,
			u.email = p_email,
			u.tipo_usuario = p_tipo_usuario,
			u.activo = p_activo
			where u.id_usuario = p_id_usuario;
		end $$
delimiter ;

-- Eliminar Usuario
delimiter $$
create procedure sp_eliminarUsuario(in p_id_usuario int)
begin
	delete from Usuario where id_usuario = p_id_usuario;
end $$
delimiter ;

-- ------------------------
-- Universidad
-- ------------------------

-- Listar Universidades
delimiter $$
create procedure sp_listarUniversidades()
begin
	select * from Universidad order by id_universidad;
end $$
delimiter ;

-- Agregar Universidad
delimiter $$
create procedure sp_agregarUniversidad(
    in p_nombre varchar (200),
    in p_sigla varchar (20),
    in p_ubicacion varchar (255),
    in p_ciudad varchar (100),
    in p_pais varchar (100),
    in p_telefono varchar (20),
    in p_email varchar (100),
    in p_sitio_web varchar (255),
    in p_rectora varchar (150),
    in p_codigo_institucional varchar (50),
    in p_imagen_logo varchar (255),
    in p_acreditacion varchar (150),
    in p_tipos_programa varchar (255),
    out p_id int
	)
	begin
		insert into Universidad (nombre, sigla, ubicacion, ciudad, pais, telefono, email, sitio_web,
			rectora, codigo_institucional, imagen_logo, acreditacion, tipos_programa)
		values (p_nombre, p_sigla, p_ubicacion, p_ciudad, p_pais, p_telefono, p_email, p_sitio_web,
			p_rectora, p_codigo_institucional, p_imagen_logo, p_acreditacion, p_tipos_programa);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Editar Universidad
delimiter $$
create procedure sp_editarUniversidad(
	in p_id_universidad int,
	in p_nombre varchar (200),
	in p_sigla varchar (20),
	in p_ciudad varchar (100),
	in p_estado enum("ACTIVA","INACTIVA")
	)
	begin
		update Universidad un
			set
			un.nombre = p_nombre,
			un.sigla = p_sigla,
			un.ciudad = p_ciudad,
			un.estado = p_estado
			where un.id_universidad = p_id_universidad;
	end $$
delimiter ;

-- Eliminar Universidad
delimiter $$
create procedure sp_eliminarUniversidad(in p_id_universidad int)
begin
	delete from Universidad where id_universidad = p_id_universidad;
end $$
delimiter ;

-- ------------------------
-- Profesor
-- ------------------------

-- Listar Profesores
delimiter $$
create procedure sp_listarProfesores()
begin
	select p.*, u.nombre, u.email, un.nombre as universidad
		from Profesor p
		join Usuario u on p.fk_id_usuario = u.id_usuario
		join Universidad un on p.fk_id_universidad = un.id_universidad
		order by p.id_profesor;
end $$
delimiter ;

-- Agregar Profesor
delimiter $$
create procedure sp_agregarProfesor(
    in p_fk_id_usuario int,
    in p_fk_id_universidad int,
    in p_numero_empleado varchar (50),
    in p_departamento varchar (150),
    in p_especialidad varchar (150),
    in p_oficina varchar (100),
    in p_telefono_oficina varchar (20),
    in p_horas_tutoria varchar (100),
    out p_id int
	)
	begin
		insert into Profesor (fk_id_usuario, fk_id_universidad, numero_empleado, departamento,
			especialidad, oficina, telefono_oficina, horas_tutoria)
		values (p_fk_id_usuario, p_fk_id_universidad, p_numero_empleado, p_departamento,
			p_especialidad, p_oficina, p_telefono_oficina, p_horas_tutoria);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Editar Profesor
delimiter $$
create procedure sp_editarProfesor(
	in p_id_profesor int,
	in p_departamento varchar (150),
	in p_especialidad varchar (150),
	in p_activo tinyint(1)
	)
	begin
		update Profesor p
			set
			p.departamento = p_departamento,
			p.especialidad = p_especialidad,
			p.activo = p_activo
			where p.id_profesor = p_id_profesor;
	end $$
delimiter ;

-- Eliminar Profesor
delimiter $$
create procedure sp_eliminarProfesor(in p_id_profesor int)
begin
	delete from Profesor where id_profesor = p_id_profesor;
end $$
delimiter ;

-- ------------------------
-- Estudiante 
-- -----------------------

-- Listar Estudiantes
delimiter $$
create procedure sp_listarEstudiantes()
begin
	select e.*, u.nombre, u.email, un.nombre as universidad
		from Estudiante e
		join Usuario u on e.fk_id_usuario = u.id_usuario
		join Universidad un on e.fk_id_universidad = un.id_universidad
		order by e.id_estudiante;
end $$
delimiter ;

-- Agregar Estudiante
delimiter $$
create procedure sp_agregarEstudiante(
    in p_fk_id_usuario int,
    in p_fk_id_universidad int,
    in p_matricula varchar (50),
    in p_carrera varchar (150),
    in p_semestre int,
    in p_codigo_interno varchar (50),
    out p_id int
	)
	begin
		insert into Estudiante (fk_id_usuario, fk_id_universidad, matricula, carrera, semestre, codigo_interno)
		values (p_fk_id_usuario, p_fk_id_universidad, p_matricula, p_carrera, p_semestre, p_codigo_interno);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Editar Estudiante
delimiter $$
create procedure sp_editarEstudiante(
	in p_id_estudiante int,
	in p_carrera varchar (150),
	in p_semestre int,
	in p_estado enum("ACTIVO","INACTIVO","GRADUADO","SUSPENDIDO")
	)
	begin
		update Estudiante e
			set
			e.carrera = p_carrera,
			e.semestre = p_semestre,
			e.estado = p_estado
			where e.id_estudiante = p_id_estudiante;
	end $$
delimiter ;

-- Eliminar Estudiante
delimiter $$
create procedure sp_eliminarEstudiante(in p_id_estudiante int)
begin
	delete from Estudiante where id_estudiante = p_id_estudiante;
end $$
delimiter ;

-- ------------------------
-- Empleador 
-- ------------------------

-- Listar Empleadores
delimiter $$
create procedure sp_listarEmpleadores()
begin
	select emp.*, u.nombre, u.email
		from Empleador emp
		join Usuario u on emp.fk_id_usuario = u.id_usuario
		order by emp.id_empleador;
end $$
delimiter ;

-- Agregar Empleador
delimiter $$
create procedure sp_agregarEmpleador(
    in p_fk_id_usuario int,
    in p_nombre_empresa varchar (200),
    in p_nit varchar (50),
    in p_sector varchar (100),
    in p_ubicacion varchar (255),
    in p_telefono_empresa varchar (20),
    in p_sitio_web varchar (255),
    in p_numero_empleados int,
    in p_representante_legal varchar (150),
    out p_id int
	)
	begin
		insert into Empleador (fk_id_usuario, nombre_empresa, nit, sector, ubicacion,
			telefono_empresa, sitio_web, numero_empleados, representante_legal)
		values (p_fk_id_usuario, p_nombre_empresa, p_nit, p_sector, p_ubicacion,
			p_telefono_empresa, p_sitio_web, p_numero_empleados, p_representante_legal);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Editar Empleador
delimiter $$
create procedure sp_editarEmpleador(
	in p_id_empleador int,
	in p_nombre_empresa varchar (200),
	in p_sector varchar (100),
	in p_ubicacion varchar (255)
	)
	begin
		update Empleador emp
			set
			emp.nombre_empresa = p_nombre_empresa,
			emp.sector = p_sector,
			emp.ubicacion = p_ubicacion
			where emp.id_empleador = p_id_empleador;
	end $$
delimiter ;

-- Eliminar Empleador
delimiter $$
create procedure sp_eliminarEmpleador(in p_id_empleador int)
begin
	delete from Empleador where id_empleador = p_id_empleador;
end $$
delimiter ;

-- ------------------------
-- Curso
-- ------------------------

-- Listar Cursos
delimiter $$
create procedure sp_listarCursos()
begin
	select c.*, u2.nombre as nombre_profesor, un.nombre as universidad
		from Curso c
		join Profesor p on c.fk_id_profesor = p.id_profesor
		join Usuario u2 on p.fk_id_usuario = u2.id_usuario
		join Universidad un on c.fk_id_universidad = un.id_universidad
		order by c.id_curso;
end $$
delimiter ;

-- Agregar Curso
delimiter $$
create procedure sp_agregarCurso(
    in p_codigo_curso varchar (20),
    in p_nombre varchar (150),
    in p_descripcion text,
    in p_creditos int,
    in p_horas int,
    in p_fk_id_profesor int,
    in p_fk_id_universidad int,
    in p_modalidad enum("PRESENCIAL","VIRTUAL","HIBRIDO"),
    in p_semestre varchar (20),
    out p_id int
	)
	begin
		insert into Curso (codigo_curso, nombre, descripcion, creditos, horas,
			fk_id_profesor, fk_id_universidad, modalidad, semestre)
		values (p_codigo_curso, p_nombre, p_descripcion, p_creditos, p_horas,
			p_fk_id_profesor, p_fk_id_universidad, p_modalidad, p_semestre);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Editar Curso
delimiter $$
create procedure sp_editarCurso(
	in p_id_curso int,
	in p_nombre varchar (150),
	in p_creditos int,
	in p_modalidad enum("PRESENCIAL","VIRTUAL","HIBRIDO")
	)
	begin
		update Curso c
			set
			c.nombre = p_nombre,
			c.creditos = p_creditos,
			c.modalidad = p_modalidad
			where c.id_curso = p_id_curso;
	end $$
delimiter ;

-- Eliminar Curso
delimiter $$
create procedure sp_eliminarCurso(in p_id_curso int)
begin
	delete from Curso where id_curso = p_id_curso;
end $$
delimiter ;

-- ------------------------
-- Horario Academico 
-- ------------------------

-- Listar Horarios Academicos
delimiter $$
create procedure sp_listarHorariosAcademicos(in p_id_estudiante int)
begin
	select ha.*, c.nombre as curso, c.codigo_curso
		from Horario_Academico ha
		join Curso c on ha.fk_id_curso = c.id_curso
		where ha.fk_id_estudiante = p_id_estudiante
		order by field(ha.dia_semana,"LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"), ha.hora_inicio;
end $$
delimiter ;

-- Agregar Horario Academico
delimiter $$
create procedure sp_agregarHorarioAcademico(
    in p_fk_id_estudiante int,
    in p_fk_id_curso int,
    in p_dia_semana enum("LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"),
    in p_hora_inicio time,
    in p_hora_fin time,
    in p_aula varchar (50),
    in p_semestre varchar (20),
    in p_anio year,
    out p_id int
	)
	begin
		insert into Horario_Academico (fk_id_estudiante, fk_id_curso, dia_semana, hora_inicio,
			hora_fin, aula, semestre, anio)
		values (p_fk_id_estudiante, p_fk_id_curso, p_dia_semana, p_hora_inicio,
			p_hora_fin, p_aula, p_semestre, p_anio);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Eliminar Horario Academico
delimiter $$
create procedure sp_eliminarHorarioAcademico(in p_id_horario_academico int)
begin
	delete from Horario_Academico where id_horario_academico = p_id_horario_academico;
end $$
delimiter ;

-- ------------------------
-- Horario Laboral 
-- ------------------------

-- Listar Horarios Laborales
delimiter $$
create procedure sp_listarHorariosLaborales(in p_id_estudiante int)
begin
	select hl.*, emp.nombre_empresa
		from Horario_Laboral hl
		join Empleador emp on hl.fk_id_empleador = emp.id_empleador
		where hl.fk_id_estudiante = p_id_estudiante
		order by field(hl.dia_semana,"LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"), hl.hora_inicio;
end $$
delimiter ;

-- Agregar Horario Laboral
delimiter $$
create procedure sp_agregarHorarioLaboral(
    in p_fk_id_estudiante int,
    in p_fk_id_empleador int,
    in p_puesto varchar (150),
    in p_departamento varchar (150),
    in p_supervisor varchar (150),
    in p_dia_semana enum("LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"),
    in p_hora_inicio time,
    in p_hora_fin time,
    in p_salario decimal (10,2),
    out p_id int
	)
	begin
		insert into Horario_Laboral (fk_id_estudiante, fk_id_empleador, puesto, departamento, supervisor,
			dia_semana, hora_inicio, hora_fin, salario)
		values (p_fk_id_estudiante, p_fk_id_empleador, p_puesto, p_departamento, p_supervisor,
			p_dia_semana, p_hora_inicio, p_hora_fin, p_salario);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Editar Horario Laboral
delimiter $$
create procedure sp_editarHorarioLaboral(
	in p_id_horario_laboral int,
	in p_dia_semana enum("LUNES","MARTES","MIERCOLES","JUEVES","VIERNES","SABADO","DOMINGO"),
	in p_hora_inicio time,
	in p_hora_fin time,
	in p_estado enum("ACTIVO","INACTIVO","SUSPENDIDO")
	)
	begin
		update Horario_Laboral hl
			set
			hl.dia_semana = p_dia_semana,
			hl.hora_inicio = p_hora_inicio,
			hl.hora_fin = p_hora_fin,
			hl.estado = p_estado
			where hl.id_horario_laboral = p_id_horario_laboral;
	end $$
delimiter ;

-- Eliminar Horario Laboral
delimiter $$
create procedure sp_eliminarHorarioLaboral(in p_id_horario_laboral int)
begin
	delete from Horario_Laboral where id_horario_laboral = p_id_horario_laboral;
end $$
delimiter ;

-- ------------------------
-- Conflicto Horario 
-- ------------------------

-- Listar Conflictos
delimiter $$
create procedure sp_listarConflictos(in p_id_estudiante int)
begin
	select * from Conflicto_Horario
		where fk_id_estudiante = p_id_estudiante
		order by fecha_detectada desc;
end $$
delimiter ;

-- Registrar Conflicto
delimiter $$
create procedure sp_registrarConflicto(
    in p_fk_id_estudiante int,
    in p_fk_id_horario_academico int,
    in p_fk_id_horario_laboral int,
    in p_tipo_conflicto enum("SUPERPOSICION","CARGA_EXCESIVA","VIAJE_LARGO"),
    in p_solucion_propuesta text,
    out p_id int
	)
	begin
		insert into Conflicto_Horario (fk_id_estudiante, fk_id_horario_academico,
			fk_id_horario_laboral, tipo_conflicto, solucion_propuesta)
		values (p_fk_id_estudiante, p_fk_id_horario_academico,
			p_fk_id_horario_laboral, p_tipo_conflicto, p_solucion_propuesta);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Resolver Conflicto
delimiter $$
create procedure sp_resolverConflicto(
	in p_id_conflicto int,
	in p_estado enum("PENDIENTE","EN_PROCESO","RESUELTO","IGNORADO"),
	in p_solucion_propuesta text
	)
	begin
		update Conflicto_Horario ch
			set
			ch.estado = p_estado,
			ch.solucion_propuesta = p_solucion_propuesta
			where ch.id_conflicto = p_id_conflicto;
	end $$
delimiter ;

-- ------------------------
-- Solicitud Ajuste 
-- ------------------------

-- Listar Solicitudes
delimiter $$
create procedure sp_listarSolicitudes(in p_id_estudiante int)
begin
	select * from Solicitud_Ajuste
		where fk_id_estudiante = p_id_estudiante
		order by fecha_solicitud desc;
end $$
delimiter ;

-- Agregar Solicitud
delimiter $$
create procedure sp_agregarSolicitud(
    in p_fk_id_estudiante int,
    in p_tipo enum("CAMBIO_HORARIO","PERMISO_LABORAL","EXTENSION_ENTREGA","OTRO"),
    in p_descripcion text,
    in p_justificacion text,
    in p_fk_id_profesor int,
    in p_fk_id_empleador int,
    out p_id int
	)
	begin
		insert into Solicitud_Ajuste (fk_id_estudiante, tipo, descripcion, justificacion,
			fk_id_profesor, fk_id_empleador)
		values (p_fk_id_estudiante, p_tipo, p_descripcion, p_justificacion,
			p_fk_id_profesor, p_fk_id_empleador);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Resolver Solicitud
delimiter $$
create procedure sp_resolverSolicitud(
	in p_id_solicitud int,
	in p_estado enum("PENDIENTE","APROBADA","RECHAZADA","EN_REVISION"),
	in p_justificacion text
	)
	begin
		update Solicitud_Ajuste sa
			set
			sa.estado = p_estado,
			sa.justificacion = p_justificacion,
			sa.fecha_resolucion = now()
			where sa.id_solicitud = p_id_solicitud;
	end $$
delimiter ;

-- ------------------------
-- Oportunidad 
-- ------------------------

-- Listar Oportunidades
delimiter $$
create procedure sp_listarOportunidades()
begin
	select o.*, emp.nombre_empresa, un.nombre as universidad
		from Oportunidad o
		left join Empleador emp on o.fk_id_empleador = emp.id_empleador
		left join Universidad un on o.fk_id_universidad = un.id_universidad
		where o.estado = "ACTIVA"
		order by o.fecha_publicacion desc;
end $$
delimiter ;

-- Agregar Oportunidad
delimiter $$
create procedure sp_agregarOportunidad(
    in p_titulo varchar (200),
    in p_descripcion text,
    in p_tipo enum("BECA","PASANTIA","EMPLEO","PROGRAMA_INTERCAMBIO"),
    in p_fk_id_empleador int,
    in p_fk_id_universidad int,
    in p_publicado_por enum("EMPLEADOR","UNIVERSIDAD","ADMIN"),
    in p_requisitos text,
    in p_salario decimal (10,2),
    in p_duracion varchar (100),
    in p_fecha_vencimiento datetime,
    out p_id int
	)
	begin
		insert into Oportunidad (titulo, descripcion, tipo, fk_id_empleador, fk_id_universidad,
			publicado_por, requisitos_principales, salario, duracion, fecha_vencimiento)
		values (p_titulo, p_descripcion, p_tipo, p_fk_id_empleador, p_fk_id_universidad,
			p_publicado_por, p_requisitos, p_salario, p_duracion, p_fecha_vencimiento);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Editar Oportunidad
delimiter $$
create procedure sp_editarOportunidad(
	in p_id_oportunidad int,
	in p_titulo varchar (200),
	in p_estado enum("ACTIVA","CERRADA","PAUSADA","VENCIDA")
	)
	begin
		update Oportunidad o
			set
			o.titulo = p_titulo,
			o.estado = p_estado
			where o.id_oportunidad = p_id_oportunidad;
	end $$
delimiter ;

-- Eliminar Oportunidad
delimiter $$
create procedure sp_eliminarOportunidad(in p_id_oportunidad int)
begin
	delete from Oportunidad where id_oportunidad = p_id_oportunidad;
end $$
delimiter ;

-- ------------------------
-- Evaluacion 
-- ------------------------

-- Listar Evaluaciones
delimiter $$
create procedure sp_listarEvaluaciones(in p_id_curso int)
begin
	select * from Evaluacion where fk_id_curso = p_id_curso order by fecha_programada;
end $$
delimiter ;

-- Agregar Evaluacion
delimiter $$
create procedure sp_agregarEvaluacion(
    in p_fk_id_curso int,
    in p_fk_id_profesor int,
    in p_tipo enum("TAREA","PARTICIPACION","QUIZ","EXAMEN_PARCIAL","EXAMEN_FINAL","PROYECTO"),
    in p_nombre varchar (150),
    in p_descripcion text,
    in p_puntaje_maximo decimal (6,2),
    in p_porcentaje decimal (5,2),
    in p_fecha_programada datetime,
    in p_fecha_entrega datetime,
    out p_id int
	)
	begin
		insert into Evaluacion (fk_id_curso, fk_id_profesor, tipo, nombre, descripcion,
			puntaje_maximo, porcentaje, fecha_programada, fecha_entrega)
		values (p_fk_id_curso, p_fk_id_profesor, p_tipo, p_nombre, p_descripcion,
			p_puntaje_maximo, p_porcentaje, p_fecha_programada, p_fecha_entrega);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Eliminar Evaluacion
delimiter $$
create procedure sp_eliminarEvaluacion(in p_id_evaluacion int)
begin
	delete from Evaluacion where id_evaluacion = p_id_evaluacion;
end $$
delimiter ;

-- ------------------------
-- Calificacion 
-- ------------------------

-- Listar Calificaciones por Estudiante
delimiter $$
create procedure sp_listarCalificacionesPorEstudiante(in p_id_estudiante int)
begin
	select cal.*, ev.nombre as evaluacion, ev.tipo, ev.porcentaje, c.nombre as curso
		from Calificacion cal
		join Evaluacion ev on cal.fk_id_evaluacion = ev.id_evaluacion
		join Curso c on ev.fk_id_curso = c.id_curso
		where cal.fk_id_estudiante = p_id_estudiante
		order by cal.fecha_calificacion desc;
end $$
delimiter ;

-- Agregar Calificacion
delimiter $$
create procedure sp_agregarCalificacion(
    in p_fk_id_evaluacion int,
    in p_fk_id_estudiante int,
    in p_puntaje_obtenido decimal (6,2),
    in p_observaciones text,
    in p_retroalimentacion text,
    in p_fk_id_profesor int,
    out p_id int
	)
	begin
		insert into Calificacion (fk_id_evaluacion, fk_id_estudiante, puntaje_obtenido,
			observaciones, retroalimentacion, fk_id_profesor)
		values (p_fk_id_evaluacion, p_fk_id_estudiante, p_puntaje_obtenido,
			p_observaciones, p_retroalimentacion, p_fk_id_profesor);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Editar Calificacion
delimiter $$
create procedure sp_editarCalificacion(
	in p_id_calificacion int,
	in p_puntaje_obtenido decimal (6,2),
	in p_retroalimentacion text,
	in p_estado enum("CALIFICADA","REVISANDO","IMPUGNADA")
	)
	begin
		update Calificacion cal
			set
			cal.puntaje_obtenido = p_puntaje_obtenido,
			cal.retroalimentacion = p_retroalimentacion,
			cal.estado = p_estado
			where cal.id_calificacion = p_id_calificacion;
	end $$
delimiter ;

-- ------------------------
-- Postulacion 
-- ------------------------

-- Listar Postulaciones
delimiter $$
create procedure sp_listarPostulaciones(in p_id_estudiante int)
begin
	select pos.*, op.titulo, op.tipo as tipo_oportunidad
		from Postulacion pos
		join Oportunidad op on pos.fk_id_oportunidad = op.id_oportunidad
		where pos.fk_id_estudiante = p_id_estudiante
		order by pos.fecha_postulacion desc;
end $$
delimiter ;

-- Agregar Postulacion
delimiter $$
create procedure sp_agregarPostulacion(
    in p_fk_id_estudiante int,
    in p_fk_id_oportunidad int,
    in p_carta_motivacion text,
    in p_curriculum_url varchar (255),
    in p_porcentaje_compatibilidad decimal (5,2),
    out p_id int
	)
	begin
		if exists (
			select 1 from Postulacion
				where fk_id_estudiante = p_fk_id_estudiante
				and fk_id_oportunidad = p_fk_id_oportunidad
		) then
			signal sqlstate "45000" set message_text = "El estudiante ya se postuló a esta oportunidad.";
		else
			insert into Postulacion (fk_id_estudiante, fk_id_oportunidad, carta_motivacion,
				curriculum_url, porcentaje_compatibilidad)
			values (p_fk_id_estudiante, p_fk_id_oportunidad, p_carta_motivacion,
				p_curriculum_url, p_porcentaje_compatibilidad);
			
			set p_id = last_insert_id();
		end if;
	end $$
delimiter ;

-- Actualizar Estado Postulacion
delimiter $$
create procedure sp_actualizarEstadoPostulacion(
	in p_id_postulacion int,
	in p_estado enum("PENDIENTE","EN_REVISION","PRESELECCIONADO","ENTREVISTA","ACEPTADO","RECHAZADO","RETIRADO"),
	in p_comentarios_revisor text
	)
	begin
		update Postulacion pos
			set
			pos.estado = p_estado,
			pos.comentarios_revisor = p_comentarios_revisor,
			pos.fecha_respuesta = now()
			where pos.id_postulacion = p_id_postulacion;
	end $$
delimiter ;

-- ------------------------
-- Auditoria
-- ------------------------

-- Registrar Auditoria
delimiter $$
create procedure sp_registrarAuditoria(
    in p_tabla_afectada varchar (100),
    in p_accion enum("INSERT","UPDATE","DELETE","LOGIN","LOGOUT"),
    in p_fk_id_usuario int,
    in p_descripcion text,
    in p_ip_origen varchar (45),
    out p_id int
	)
	begin
		insert into Auditoria (tabla_afectada, accion, fk_id_usuario, descripcion, ip_origen)
		values (p_tabla_afectada, p_accion, p_fk_id_usuario, p_descripcion, p_ip_origen);
		
		set p_id = last_insert_id();
	end $$
delimiter ;

-- Listar Auditoria
delimiter $$
create procedure sp_listarAuditoria()
begin
	select a.*, u.nombre as usuario, u.email
		from Auditoria a
		left join Usuario u on a.fk_id_usuario = u.id_usuario
		order by a.fecha desc;
end $$
delimiter ;

-- ------------------------
-- Datos de Prueba    
-- ------------------------

-- Usuarios (10 usuarios: 1 admin, 5 estudiantes, 2 profesores, 2 empleadores)
call sp_agregarUsuario("Admin Sistema", "admin@sigal.gt", "$2b$10$hashAdmin123", "ADMIN", @id);
call sp_agregarUsuario("Carlos Mendoza", "carlos@sigal.gt", "$2b$10$hashEst001", "ESTUDIANTE", @id);
call sp_agregarUsuario("Andrea López", "andrea@sigal.gt", "$2b$10$hashEst002", "ESTUDIANTE", @id);
call sp_agregarUsuario("María García", "maria@sigal.gt", "$2b$10$hashEst003", "ESTUDIANTE", @id);
call sp_agregarUsuario("José Hernández", "jose@sigal.gt", "$2b$10$hashEst004", "ESTUDIANTE", @id);
call sp_agregarUsuario("Luisa Ramírez", "luisa@sigal.gt", "$2b$10$hashEst005", "ESTUDIANTE", @id);
call sp_agregarUsuario("Dr. Roberto Fuentes", "rfuentes@sigal.gt", "$2b$10$hashProf001", "PROFESOR", @id);
call sp_agregarUsuario("Lic. Ana Castillo", "acastillo@sigal.gt", "$2b$10$hashProf002", "PROFESOR", @id);
call sp_agregarUsuario("Tech Solutions S.A.", "rrhh@techsolutions.gt", "$2b$10$hashEmp001", "EMPLEADOR", @id);
call sp_agregarUsuario("Banco Progreso", "rrhh@bancoprogreso.gt", "$2b$10$hashEmp002", "EMPLEADOR", @id);

-- Universidades (3 universidades con todos sus campos NOT NULL)
call sp_agregarUniversidad("Universidad de San Carlos de Guatemala", "USAC", "Ciudad Universitaria, Zona 12", "Guatemala", "Guatemala", "2418-8000", "info@usac.edu.gt", "https://www.usac.edu.gt", "Dr. Walter Mazariegos", "USAC-001", "logo_usac.png", "Acreditada CSUCA", "PRESENCIAL,VIRTUAL", @id);
call sp_agregarUniversidad("Universidad Rafael Landívar", "URL", "Vista Hermosa III, Zona 16", "Guatemala", "Guatemala", "2426-2626", "info@url.edu.gt", "https://www.url.edu.gt", "Dr. Eduardo Valdés", "URL-001", "logo_url.png", "Acreditada ACAAI", "PRESENCIAL,HIBRIDO", @id);
call sp_agregarUniversidad("Universidad Mariano Gálvez", "UMG", "3a Avenida 9-00, Zona 2", "Guatemala", "Guatemala", "2411-8000", "info@umg.edu.gt", "https://www.umg.edu.gt", "Dr. Luis Ruano", "UMG-001", "logo_umg.png", "Acreditada ACAP", "PRESENCIAL,VIRTUAL,HIBRIDO", @id);

-- Profesores (vinculados a usuarios 7 y 8)
call sp_agregarProfesor(7, 1, "PROF-001", "Ingeniería en Sistemas", "Bases de Datos", "Edificio T-3, Oficina 205", "2418-8100", "Lunes y Miércoles 10:00-12:00", @id);
call sp_agregarProfesor(8, 2, "PROF-002", "Ciencias de la Computación", "Programación Web", "Edificio T-3, Oficina 210", "2418-8101", "Martes y Jueves 14:00-16:00", @id);

-- Estudiantes (vinculados a usuarios 2-6, sin tutor asignado aún → null)
call sp_agregarEstudiante(2, 1, "EST-2025-001", "Ingeniería en Sistemas", 4, "COD-001", @id);
call sp_agregarEstudiante(3, 1, "EST-2025-002", "Administración de Empresas", 3, "COD-002", @id);
call sp_agregarEstudiante(4, 2, "EST-2025-003", "Ingeniería en Sistemas", 5, "COD-003", @id);
call sp_agregarEstudiante(5, 2, "EST-2025-004", "Psicología", 2, "COD-004", @id);
call sp_agregarEstudiante(6, 3, "EST-2025-005", "Derecho", 6, "COD-005", @id);

-- Asignar tutor al estudiante 1 y 3 (ahora que ya existen los profesores)
update Estudiante set fk_tutor_academico_id = 1 where id_estudiante = 1;
update Estudiante set fk_tutor_academico_id = 2 where id_estudiante = 3;

-- Empleadores (vinculados a usuarios 9 y 10)
call sp_agregarEmpleador(9, "Tech Solutions S.A.", "NIT-123456-7", "Tecnología", "Zona 10, Guatemala", "2360-1000", "https://techsolutions.gt", 150, "Pedro Solano", @id);
call sp_agregarEmpleador(10, "Banco Progreso", "NIT-987654-3", "Financiero", "Zona 9, Guatemala", "2338-5000", "https://bancoprogreso.gt", 800, "Rosa Velarde", @id);

-- Cursos
call sp_agregarCurso("CC-101", "Programación I", "Fundamentos de programación estructurada en C++", 3, 3, 1, 1, "PRESENCIAL", "2025-1", @id);
call sp_agregarCurso("CC-202", "Base de Datos I", "Diseño y administración de bases de datos relacionales", 3, 3, 1, 1, "PRESENCIAL", "2025-1", @id);
call sp_agregarCurso("CC-303", "Desarrollo Web", "Tecnologías frontend y backend para desarrollo web moderno", 3, 3, 2, 1, "VIRTUAL", "2025-1", @id);
call sp_agregarCurso("AD-101", "Contabilidad General", "Principios básicos de contabilidad empresarial", 3, 3, 2, 1, "PRESENCIAL", "2025-1", @id);

-- Horarios Académicos
call sp_agregarHorarioAcademico(1, 1, "LUNES", "07:00:00", "09:00:00", "S-101", "2025-1", 2025, @id);
call sp_agregarHorarioAcademico(1, 2, "MIERCOLES", "07:00:00", "09:00:00", "S-202", "2025-1", 2025, @id);
call sp_agregarHorarioAcademico(2, 3, "MARTES", "14:00:00", "16:00:00", "LAB-1", "2025-1", 2025, @id);
call sp_agregarHorarioAcademico(3, 1, "JUEVES", "09:00:00", "11:00:00", "S-301", "2025-1", 2025, @id);
call sp_agregarHorarioAcademico(4, 4, "VIERNES", "10:00:00", "12:00:00", "S-105", "2025-1", 2025, @id);
call sp_agregarHorarioAcademico(5, 2, "LUNES", "13:00:00", "15:00:00", "S-202", "2025-1", 2025, @id);

-- Horarios Laborales
call sp_agregarHorarioLaboral(1, 1, "Desarrollador Junior", "IT", "Ing. Marco Díaz", "LUNES", "14:00:00", "18:00:00", 3500.00, @id);
call sp_agregarHorarioLaboral(1, 1, "Desarrollador Junior", "IT", "Ing. Marco Díaz", "MIERCOLES", "14:00:00", "18:00:00", 3500.00, @id);
call sp_agregarHorarioLaboral(2, 2, "Cajero", "Cajas", "Lic. Sandra Rivas", "MARTES", "07:00:00", "15:00:00", 2800.00, @id);
call sp_agregarHorarioLaboral(2, 2, "Cajero", "Cajas", "Lic. Sandra Rivas", "JUEVES", "07:00:00", "15:00:00", 2800.00, @id);
call sp_agregarHorarioLaboral(3, 1, "Analista de Datos", "IT", "Ing. Marco Díaz", "LUNES", "13:00:00", "17:00:00", 4000.00, @id);

-- Conflictos Horarios
-- Superposición: estudiante 2, martes clase 14:00-16:00 vs trabajo 07:00-15:00
call sp_registrarConflicto(2, 3, 3, "SUPERPOSICION", "El horario laboral del martes (07:00-15:00) se superpone con la clase de Desarrollo Web (14:00-16:00). Se recomienda solicitar cambio de turno laboral.", @id);

-- Carga excesiva: estudiante 1 (no apunta a horario específico, por eso null en los ids)
call sp_registrarConflicto(1, null, null, "CARGA_EXCESIVA", "El estudiante supera 50 horas semanales entre clases y trabajo. Se recomienda reducir carga académica o laboral.", @id);

-- Oportunidades
call sp_agregarOportunidad("Pasantía en Desarrollo de Software", "Pasantía de 3 meses en el área de TI trabajando con tecnologías modernas como Node.js y Angular.", "PASANTIA", 1, 1, "EMPLEADOR", "Estudiante de Ingeniería en Sistemas, mínimo 4to semestre, conocimientos en programación web.", 1500.00, "3 meses", "2025-08-31 23:59:59", @id);
call sp_agregarOportunidad("Beca de Excelencia Académica 2025", "Beca completa para estudiantes con alto rendimiento académico que cubra colegiatura del segundo semestre.", "BECA", 1, 1, "UNIVERSIDAD", "Promedio mayor a 80 puntos, sin materias reprobadas, estudiante activo de la USAC.", 0.00, "1 semestre", "2025-07-15 23:59:59", @id);
call sp_agregarOportunidad("Empleo Part-Time Atención al Cliente", "Puesto de medio tiempo en sucursal bancaria, horario flexible adaptado a estudiantes universitarios.", "EMPLEO", 2, 1, "EMPLEADOR", "Estudiante universitario activo, buena presentación, disponibilidad fines de semana.", 2500.00, "Indefinido", "2025-09-30 23:59:59", @id);

-- Evaluaciones
call sp_agregarEvaluacion(1, 1, "EXAMEN_PARCIAL", "Primer Parcial", "Evaluación de los primeros 4 temas del curso: variables, ciclos, funciones y arreglos.", 100, 25.00, "2025-03-15 08:00:00", "2025-03-15 10:00:00", @id);
call sp_agregarEvaluacion(1, 1, "PROYECTO", "Proyecto Final", "Desarrollo de una aplicación de consola que resuelva un problema real usando POO.", 100, 40.00, "2025-05-20 08:00:00", "2025-05-20 23:59:59", @id);
call sp_agregarEvaluacion(2, 1, "EXAMEN_PARCIAL", "Primer Parcial BD", "Evaluación de modelo entidad-relación, normalización y consultas SQL básicas.", 100, 30.00, "2025-03-18 08:00:00", "2025-03-18 10:00:00", @id);
call sp_agregarEvaluacion(3, 2, "TAREA", "Maquetado HTML y CSS", "Crear una página web responsiva usando HTML5 semántico y CSS3 con Flexbox.", 100, 15.00, "2025-03-10 08:00:00", "2025-03-12 23:59:59", @id);

-- Calificaciones
call sp_agregarCalificacion(1, 1, 85.00, "Buen dominio de ciclos y funciones, debe mejorar en arreglos.", "Revisar el tema de arreglos bidimensionales para el siguiente parcial.", 1, @id);
call sp_agregarCalificacion(3, 1, 90.00, "Excelente dominio del modelo ER y normalización.", "Continúa así, los temas avanzados de SQL requieren esta base sólida.", 1, @id);
call sp_agregarCalificacion(4, 2, 72.00, "Puede mejorar, el CSS responsivo presentó errores en móvil.", "Practicar más media queries y el uso de Flexbox con contenedores anidados.", 2, @id);

-- Postulaciones
call sp_agregarPostulacion(1, 1, "Estoy cursando 4to semestre de Ingeniería en Sistemas con promedio de 85. He desarrollado proyectos personales en Node.js y Angular que refuerzan mi interés en esta pasantía.", "cv_carlos_mendoza.pdf", 88.50, @id);
call sp_agregarPostulacion(2, 2, "Mi promedio actual es 88 puntos y no tengo materias reprobadas. Considero que esta beca me permitirá enfocarme completamente en mis estudios.", "cv_andrea_lopez.pdf", 92.00, @id);
call sp_agregarPostulacion(3, 1, "Tengo experiencia previa en desarrollo web y actualmente curso el 5to semestre. Me interesa aplicar mis conocimientos en un entorno profesional real.", "cv_maria_garcia.pdf", 80.00, @id);
call sp_agregarPostulacion(1, 3, "Busco un empleo de medio tiempo que me permita sostener mis estudios. Tengo disponibilidad los fines de semana y buenas habilidades de comunicación.", "cv_carlos_v2.pdf", 75.00, @id);

-- Solicitudes de Ajuste
-- Va dirigida a un profesor (empleador en null)
call sp_agregarSolicitud(1, "CAMBIO_HORARIO", "Solicito cambio de horario de la clase del lunes de 07:00 a 09:00 por traslape con mi horario de trabajo.", "Trabajo en Tech Solutions de lunes a viernes de 07:00 a 13:00 y el horario actual me genera conflicto.", 1, null, @id);

-- Va dirigida a un empleador (profesor en null)
call sp_agregarSolicitud(2, "PERMISO_LABORAL", "Solicito permiso para ausentarme del trabajo el martes 18 de marzo de 14:00 a 16:00 por examen parcial.", "El examen de Base de Datos es obligatorio y tiene fecha fija establecida por la universidad.", null, 2, @id);

-- Va dirigida a un profesor (empleador en null)
call sp_agregarSolicitud(3, "EXTENSION_ENTREGA", "Solicito una extensión de 48 horas para la entrega del proyecto de Desarrollo Web.", "Mi jornada laboral del fin de semana me impidió completar el proyecto en el tiempo establecido.", 2, null, @id);

-- Auditoría
call sp_registrarAuditoria("Usuario", "LOGIN", 1, "Administrador inició sesión en el sistema.", "192.168.1.1", @id);
call sp_registrarAuditoria("Usuario", "LOGIN", 2, "Estudiante Carlos Mendoza inició sesión.", "192.168.1.15", @id);
call sp_registrarAuditoria("Oportunidad", "INSERT", 9, "Empleador Tech Solutions publicó nueva pasantía.", "10.0.0.5", @id);
call sp_registrarAuditoria("Postulacion", "INSERT", 2, "Carlos Mendoza se postuló a pasantía de software.", "10.0.0.12", @id);
call sp_registrarAuditoria("Calificacion", "INSERT", 7, "Profesor Fuentes registró calificación del parcial.", "192.168.1.20", @id);
