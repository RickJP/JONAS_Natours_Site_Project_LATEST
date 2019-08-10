const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
const app = require('./app');
//console.log(app.get('env'));

const db = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PW);



mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex:true,
    useFindAndModify: false
}).then(() => console.log('db Connection successful!'));

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

process.on('unhandledRejection', err => {
  console.log(err.name, err.message);
  console.log('UNHANDLED REJECTION! 😔');
  server.close(() => {
    process.exit(1);
  });
});