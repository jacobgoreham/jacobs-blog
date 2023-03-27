const { Model, DataTypes } = require("sequilize");
const sequilize = require("../config/connection");

class Post extends Model {}

Post.init({
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [1],
    },
  },
  content: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      len: [1],
    },
  },
  user_id: {
    type: DataTypes.INTEGER,
    references: {
      model: "user",
      key: "id",
    },
  },
  sequilize,
  freezeTablename: true,
  underscored: true,
  modelName: "post",
});

module.exports = Post;
