module.exports = (sequelize,DataTypes)=>{
const User =sequelize.define("User",{
    CIN:{
    type:DataTypes.STRING,
    primaryKey: true,
    allowNull: false
},nom:{
    type:DataTypes.STRING,
    allowNull: false
},prenom:{
    type:DataTypes.STRING,
    allowNull: false
},mail:{
    type:DataTypes.STRING,
    allowNull: false,
    unique: true,
},password:{
    type:DataTypes.STRING,
    allowNull: false,
 
}
,role: {
    type: DataTypes.ENUM('syndic', 'resident'),
    allowNull: false,
    defaultValue: 'resident',
  },
numbloc:{
    type:DataTypes.INTEGER,
    
},numhabitat:{
    type:DataTypes.INTEGER,
   
},numTel:{
    type:DataTypes.INTEGER,
   
}});
User.prototype.toJSON = function() {
    const user = this;
    const userObject = user.get(); 
    delete userObject.password;
    delete userObject.__v;
    return userObject;
  };
return {name:'User',schema: User}  
}