const Sequelize = require('sequelize');
const connection = require('./database');

//gerando tabela com model
const Pergunta = connection.define('pergunta', {
    titulo:{
        type: Sequelize.STRING, //tipo de texto curto
        allowNull: false //impede do campo ficar vazio
    },
    descricao:{
        type: Sequelize.TEXT, //tipo para texto Longo
        allowNull: false
    }
});

Pergunta.sync({force: false}).then(() => {});
//define a sincronização com o banco de dados. force: false = não força a criação da tabela
module.exports = Pergunta;//exportando a variavel pergunta
