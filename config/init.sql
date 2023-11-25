DROP TABLE IF EXISTS doctor_illness;
DROP TABLE IF EXISTS doctor;
DROP TABLE IF EXISTS hospital;
DROP TABLE IF EXISTS "user";
DROP TABLE IF EXISTS illness_symptom;
DROP TABLE IF EXISTS illness;
DROP TABLE IF EXISTS symptom;


CREATE TABLE IF NOT EXISTS hospital (
	id serial PRIMARY KEY,
	name varchar(255) NOT NULL,
	long float NOT NULL,
	lat float NOT NULL,
	hour_start time,
	hour_end time,
	profile_image varchar(255),
	address varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS "user" (
	id serial PRIMARY KEY,
	firstname varchar(255) NOT NULL,
	lastname varchar(255) NOT NULL,
	date_of_birth date NOT NULL
);

CREATE TABLE IF NOT EXISTS illness (
	id serial PRIMARY KEY,
	name varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS symptom (
	id serial PRIMARY KEY,
	name varchar(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS illness_symptom (
	illness_id INT NOT NULL,
	symptom_id INT NOT NULL,
	PRIMARY KEY (illness_id, symptom_id),
	FOREIGN KEY (illness_id) REFERENCES illness (id),
	FOREIGN KEY (symptom_id) REFERENCES symptom (id)
);

CREATE TABLE IF NOT EXISTS doctor (
	id serial PRIMARY KEY,
	firstname varchar(255) NOT NULL,
	lastname varchar(255) NOT NULL,
	english bool default TRUE,
	hospital_id INT,
	FOREIGN KEY (hospital_id) REFERENCES hospital (id)
);

CREATE TABLE IF NOT EXISTS doctor_illness (
	doctor_id INT NOT NULL,
	illness_id INT NOT NULL,
	PRIMARY KEY (doctor_id, illness_id),
	FOREIGN KEY (doctor_id) REFERENCES doctor (id),
	FOREIGN KEY (illness_id) REFERENCES illness (id)
);
