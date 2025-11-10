const { Sequelize } = require('sequelize');
const path = require('path');

// SQLite 데이터베이스 사용 (별도 설치 불필요)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: path.join(__dirname, '../../database.sqlite'),
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

module.exports = { sequelize };
