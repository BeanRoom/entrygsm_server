import Sequelize from 'sequelize';
import path from 'path';

import { User } from './User';
import { Application } from './Application';
import { Question, Answer } from './QNA';

const config = require(path.join(__dirname, '..', 'config', 'config.json'))['ipse'];

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config  
)

const user = User(sequelize, Sequelize);
const application = Application(sequelize, Sequelize);
const question = Question(sequelize, Sequelize);
const answer = Answer(sequelize, Sequelize);

export { sequelize, Sequelize, user, application, question, answer };  