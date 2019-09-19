export const Teacher = (sequelize, DataTypes) => {
    return sequelize.define('teacher', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNull : false
        },
        name : {
            type : DataTypes.STRING(50)
        },
        celluar_phone : {
            type : DataTypes.STRING(11)
        }
    });
};