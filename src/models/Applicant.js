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
        },
        due_date : {
            type : DataTypes.DATEONLY
        },
        type : {
            type : DataTypes.ENUM("일반", "마이스터인재", "사회통합", "정원외"),
            defaultValue : "일반"
        }
    });
};