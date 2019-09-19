export const Applicant = (sequelize, DataTypes) => {
    return sequelize.define('applicant', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNull : false
        },
        name : {
            type : DataTypes.STRING(50)
        },
        image_url : {
            type : DataTypes.STRING
        },
        sex : {
            type : DataTypes.ENUM("남성", "여성")
        },
        birthday : {
            type : DataTypes.DATEONLY
        },
        address : {
            type : DataTypes.STRING
        },
        home_phone : {
            type : DataTypes.STRING
        },
        celluar_phone : {
            type : DataTypes.STRING(11)
        }
    });
};