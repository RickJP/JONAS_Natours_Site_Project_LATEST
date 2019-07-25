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
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});

