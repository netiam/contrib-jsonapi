import Sequelize from 'sequelize'
import {db} from '../utils/db'
import Project from './project'

const User = db.define('User', {
  id: {
    type: Sequelize.UUID,
    primaryKey: true,
    isUUID: 4,
    defaultValue: Sequelize.UUIDV4()
  },
  email: {
    type: Sequelize.STRING,
    unique: true
  },
  username: {
    type: Sequelize.STRING,
    unique: true
  },
  birthday: Sequelize.DATE
})

Project.belongsToMany(User, {
  through: {
    model: 'UserProject',
    unique: true
  },
  as: 'users'
})
User.belongsToMany(Project, {
  through: {
    model: 'UserProject',
    unique: true
  },
  as: 'projects'
})

export default User
