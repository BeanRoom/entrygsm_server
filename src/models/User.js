export const User = (sequelize, DataTypes) => {
    return sequelize.define('user', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNull : false,
            autoIncrement : true
        },
        id : {
            type : DataTypes.STRING(50),
            allowNull : false,
            unique : true
        },
        password : {
            type : DataTypes.STRING,
            allowNull : false
        },
        name : {
            type : DataTypes.STRING(20),
            allowNull : false
        },
        school_name : {
            type : DataTypes.STRING,
            allowNull : false
        },
        school_seq : {
            type : DataTypes.STRING,
            allowNull : false
        },
        email : {
            type : DataTypes.STRING,
            allowNull : false
        },
        validation : {
            type : DataTypes.BOOLEAN,
            defaultValue : false
        },
        key_for_verify : {
            type : DataTypes.STRING,
            allowNull : false
        }
    });
};