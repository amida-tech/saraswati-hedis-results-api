const measure = (sequelize, DataTypes) => {
  const Measure = sequelize.define('Measure', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    displayName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    eligiblePopulation: {
      type: DataTypes.INTEGER,
    },
    included: {
      type: DataTypes.INTEGER,
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rating: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Measure;
};
module.exports = measure;
