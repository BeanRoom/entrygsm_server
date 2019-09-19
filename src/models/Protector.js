export const Protector = (sequelize, DataTypes) => {
    return sequelize.define('protector', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNull : false
        },
        name : {
            type : DataTypes.STRING(50)
        },
        relation : {
            type : DataTypes.STRING
        },
        celluar_phone : {
            type : DataTypes.STRING(11)
        }
    });
};