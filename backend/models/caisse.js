module.exports = (sequelize, DataTypes) => {
    const Caisse = sequelize.define("Caisse", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        }, date: {
            type: DataTypes.DATE,
            allowNull: false
        }, montant: {
            type: DataTypes.FLOAT,
            allowNull: false
        }

    }
    );
    return { name: 'Caisse', schema: Caisse }
}