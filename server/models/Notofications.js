module.exports = (sequelize, DataTypes) => {
    const Notifications = sequelize.define("Notifications", {
      postId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      commentUserId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      commentUsername: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      postUserId: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      read: {
        type: DataTypes.STRING,
        allowNull: true,
        default:"0"
      }
    });
  
    return Notifications;
  };