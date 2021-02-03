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
      validate: {
        notEmpty: true,
      },
    },
    displayName: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    eligiblePopulation: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
      },
    },
    included: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
      },
    },
    percentage: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: true,
      },
    },
    rating: {
      type: DataTypes.NUMERIC(2, 1),
      allowNull: false,
      validate: {
        isDecimal: true,
      },
    },
  });
  

  return Measure;
};
module.exports = measure;
