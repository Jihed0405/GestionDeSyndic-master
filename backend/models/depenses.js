module.exports = (sequelize,DataTypes)=>{
    const depense =sequelize.define("depense",{
        iddepense:{
        type:DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },montantdep:{
        type:DataTypes.FLOAT,
        allowNull: false
    },datedep:{
        type:DataTypes.DATE,
        allowNull: false
    },description:{
        type:DataTypes.STRING,
        allowNull: false,
    }
    }
    );
    return {name:'depense',schema: depense}  
    }