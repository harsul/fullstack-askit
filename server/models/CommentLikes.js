module.exports = (sequelize, DataTypes) => {
    const CommentLikes = sequelize.define("CommentLikes");
  
    return CommentLikes;
  };