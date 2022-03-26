const express = require('express'); //importando o módulo
const app = express(); //iniciando o express
const bodyParser = require('body-parser'); //importando o Módulo
const connection = require('./database/database');
const Pergunta = require('./database/Perguntas');
const Resposta = require('./database/Resposta');

//database
connection
    .authenticate()//metodo para conectar no banco de dados
    .then(() => {
        console.log('conexão com o banco de dados realizada!');
    })
    .catch((msgErro) => {
        console.log(msgErro)
    });

app.set('view engine', 'ejs'); //estou dizendo para o express usar o ejs como motor view engine
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));//responsavel por decodificar os dados enviados pelo formulário
app.use(bodyParser.json());

//rotas
app.get('/', (req, res) => {
    Pergunta.findAll({
        raw: true, order: [
            ['id', 'DESC']//ASC = crescente || DESC = decrescente : define a ordem a ser apresentada na pagina(id é referente a coluna no banco de dados)
        ]
    }).then(perguntas => {
        //console.log(perguntas);
        res.render('index', {
            perguntas: perguntas
        });
    });
});
app.get('/perguntar', (req, res) => {
    res.render('perguntar');
});

app.post('/salvarpergunta', (req, res) => {

    var titulo = req.body.titulo;//aqui o body parser é usado (objeto body)
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo,
        descricao: descricao
    }).then(() => {
        res.redirect('/');
    });
});

app.get('/pergunta/:id', (req, res) => {
    var id = req.params.id;
    Pergunta.findOne({//findOne() - metodo que busca no bando de dados um dado com uma condição.
        where: { //aberto um JSON
            id: id //aqui esta buscando no banco de dados o valor que a variavel id contém
        }
    }).then(pergunta => {//quando a operação de busca for concluida,  o then é executado;
        if (pergunta != undefined) {// se for diferente, significa que a pergunta foi encontrada

            Resposta.findAll({//busca todas as respostas da pergunta
                where: { id: pergunta.id },
                order: [ 
                    ['id', 'DESC'] 
                ]
            }).then(respostas => {
                res.render('pergunta', {
                    pergunta: pergunta,
                    respostas: respostas
                });
            });

        } else {//não encontrada
            res.redirect('/');
        }
    });
});

app.post('/responder', (req, res) => {
    var corpo = req.body.corpo;
    var perguntaId = req.body.pergunta;

    Resposta.create({
        corpo: corpo,
        perguntaId: perguntaId
    }).then(() => {
        res.redirect('/pergunta/' + perguntaId); //res.redirect('/pergunta/2);
    })
})

app.listen(8080, () => {
    console.log("app Rodando!");
});
