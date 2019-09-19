export const Question = (sequelize, DataTypes) => {
    return sequelize.define('question', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNull : false
        },
        kind : {
            type : DataTypes.ENUM("학교", "기숙사", "원서지원"),
            allowNull : false
        },
        title : {
            type : DataTypes.STRING,
            allowNull : false
        },
        content : {
            type : DataTypes.TEXT,
            allowNull : false
        },
        created_at : {
            type : DataTypes.DATE,
            defaultValue : DataTypes.NOW
        }
    });
};