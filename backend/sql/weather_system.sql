CREATE DATABASE weather_system;
USE weather_system;

-- =====================================================
-- TABELA DE UTILIZADORES
-- =====================================================

CREATE TABLE utilizadores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    idioma VARCHAR(10) DEFAULT 'pt',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =====================================================
-- TABELA DE CIDADES FAVORITAS
-- =====================================================

CREATE TABLE cidades_favoritas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id INT NOT NULL,
    cidade VARCHAR(100) NOT NULL,

    FOREIGN KEY (utilizador_id)
    REFERENCES utilizadores(id)
    ON DELETE CASCADE
);

-- =====================================================
-- HISTÓRICO DE CONSULTAS
-- =====================================================

CREATE TABLE historico_consultas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilizador_id INT,
    cidade VARCHAR(100),
    temperatura FLOAT,
    descricao_clima VARCHAR(150),
    data_consulta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (utilizador_id)
    REFERENCES utilizadores(id)
    ON DELETE CASCADE
);