export const Question = (sequelize, DataTypes) => {
    return sequelize.define('question', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNull : false
        },
        kind : {
            type : DataTypes.ENUM("학교생활", "기숙사", "지원과정", "공부", "취업"),
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
        },
        is_answered : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        }
    });
};