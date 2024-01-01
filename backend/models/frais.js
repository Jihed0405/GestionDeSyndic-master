module.exports = (sequelize,DataTypes)=>{
    const frais =sequelize.define("frais",{
        Nom:{
        type:DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    }
    ,description:{
        type:DataTypes.STRING,
        allowNull: false
    },montant:{
        type:DataTypes.FLOAT,
        allowNull: false,
    }
    }
    );
    return {name:'frais',schema: frais}  
    }