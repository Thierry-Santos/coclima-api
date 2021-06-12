import { Model, DataTypes } from 'sequelize';

export default class Receipts extends Model {
  static init(sequelize) {
    super.init({
      date: {
        type: DataTypes.DATE,
        validate: {
          notEmpty: {
            msg: 'Receipt date can not be empty!',
          },
          isDate: true,
        },
      },
      value: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: 'Receipt value can not be empty!',
          },
        },
      },
      company_id: {
        type: DataTypes.INTEGER,
        validate: {
          notEmpty: {
            msg: 'Company association can not be empty!',
          },
          isInt: true,
        },
      },
      deleted_at: {
        type: DataTypes.DATE,
        validate: {
          isDate: true,
        },
      },
    }, {
      sequelize,
    });
  }

  static associate(models) {
    this.belongsTo(models.Companies, { foreignKey: 'company_id', as: 'companies' });
  }
}