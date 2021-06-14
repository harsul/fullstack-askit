module.exports = (sequelize, DataTypes) => {
    const Comments = sequelize.define("Comments", {
      commentBody: {
        type: DataTypes.STRING,
        allowNull: false,
      }, 
      username: {
        type: DataTypes.STRING,
        allowNull: false,
      }, 
    });

    Comments.associate = (models) => {
      Comments.hasMany(models.CommentLikes, {
        onDelete: "cascade",
      });
    };
  
    return Comments;
  };