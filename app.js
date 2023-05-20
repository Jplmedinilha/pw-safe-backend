const bodyParser = require('body-parser');
const cors = require('cors')
const express = require("express");
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
require("dotenv").config();

//############ CORS ############

var corsOptions = {
  //origin: "http://localhost:"+port
};

app.use(cors(corsOptions));
app.use(express.json({
  limit: '50mb'
}));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

//############ ROUTERS ############

const local_router = require('./services/routers/routers')

app.use('/api', local_router); //chama o arquivo de rotas

process.on('beforeExit', code => {
  setTimeout(() => {
    console.log(`process will exit with code: ${code}`)
    process.exit(code)
  }, 100)
})

process.on('exit', code => {
  console.log(`process exited with code: ${code}`)
  process.exit()
})

process.on('uncaughtException', err => {
  console.log('Uncaught exception! Call a better programmer :o');
  console.log(err)
  process.exit()
});

process.on('unhandledRejection', (reason, promise) => {
  console.log('Unhandled Rejection at', promise, `reason: ${reason}`);
  process.exit()
});


process.on('SIGTERM', () => {
  console.log('SIGTERM received ');
  process.exit()
});
 
process.on('SIGINT', () => {
  console.log('SIGINT received');
  process.exit()
});

app.listen(process.env.SV_PORT, () =>{
    console.log("listening on port " + process.env.SV_PORT);
});

