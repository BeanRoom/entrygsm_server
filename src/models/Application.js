export const Application = (sequelize, DataTypes) => {
    return sequelize.define('application', {
        user_id : {
            type : DataTypes.INTEGER,
            primaryKey : true,
            allowNull : false
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
        phone : {
            type : DataTypes.STRING(11)
        },
        graduation_date : {
            type : DataTypes.DATEONLY
        },
        graduation_option : {
            type : DataTypes.ENUM("졸업예정", "졸업", "검정고시"),
            defultValue : "졸업예정"
        },
        protector_name : {
            type : DataTypes.STRING(20)
        },
        relation : {
            type : DataTypes.STRING
        },
        protector_home_phone : {
            type : DataTypes.STRING
        },
        protector_phone : {
            type : DataTypes.STRING(11)
        },
        teacher_name : {
            type: DataTypes.STRING(50)
        },
        teacher_phone : {
            type : DataTypes.STRING(11)
        },
        school_number : {
            type : DataTypes.STRING()
        },
        type : {
            type : DataTypes.ENUM("일반", "마이스터인재", "기회균등", "사회다양성", "정원외"),
            defaultValue : "일반"
        },
    });
};