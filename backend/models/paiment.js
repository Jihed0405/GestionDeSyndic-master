module.exports = (sequelize,DataTypes)=>{
    const paiment =sequelize.define("paiment",{
        idpaiment:{
        type:DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },status:{
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
    },datepaiment:{
        type:DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
       
    }
    }
    );
    return {name:'paiment',schema: paiment}  
    }