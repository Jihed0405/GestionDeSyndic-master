module.exports = (sequelize,DataTypes)=>{
    const Categorie =sequelize.define("Categorie",{
        
        NomCat:{
        type:DataTypes.STRING,
        primaryKey: true,
        allowNull: false
    },description:{
        type:DataTypes.STRING,
        allowNull: false
    }
}
    );
    return {name:'Categorie',schema: Categorie}  
    }