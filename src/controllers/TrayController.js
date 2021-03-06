/* eslint-disable camelcase */
import path from 'path';
import { Op } from 'sequelize';
import Company from '../database/models/Companies';
import User from '../database/models/Users';
import getAccessToken from '../utils/AccessToken';

const html = async (req, res) => {
  try {
    return res.sendFile(path.join(__dirname, '../script/popup.html'));
  } catch (err) {
    return res.status(409).json({ msg: err.errors.map((e) => e.message) });
  }
};

const init = async (req, res) => {
  try {
    return res.sendFile(path.join(__dirname, '../script/init.js'));
  } catch (err) {
    return res.status(409).json({ msg: err.errors.map((e) => e.message) });
  }
};

const css = async (req, res) => {
  try {
    return res.sendFile(path.join(__dirname, '../script/css.css'));
  } catch (err) {
    return res.status(409).json({ msg: err.errors.map((e) => e.message) });
  }
};

const getStore = async (req, res) => {
  const { store_id } = req.params;

  const findStore = await Company.findOne({
    where: {
      store_id,
      deleted_at: { [Op.is]: null },
    },
  });

  if (!findStore) {
    return res.status(400).json({
      error: 'Store not found',
    });
  }

  return res.json(findStore);
};

const create = async (req, res) => {
  const {
    username,
    email,
    name,
    password,
    cpfcnpj,
    street,
    number,
    city,
    state,
    cep,
    phone,
    site,
    api_address,
    code,
    store_id,
  } = req.body;

  const companyExist = await Company.findOne({
    where: {
      cpfcnpj,
      deleted_at: { [Op.is]: null },
    },
  });

  if (companyExist) {
    return res.status(400).json({
      error: 'This company is already registered',
    });
  }

  const newCompany = await Company.create({
    name,
    number,
    street,
    phone,
    site,
    email,
    city,
    state,
    cep,
    code,
    api_address,
    cpfcnpj,
    store_id,
    role: 'company',
  });

  const userExist = await User.findOne({
    where: {
      email,
      deleted_at: { [Op.is]: null },
    },
  });

  if (userExist) {
    return res.status(400).json({
      error: 'This client is already registered',
    });
  }

  await User.create({
    name: username,
    email,
    password,
    role: 'user',
    company_id: newCompany.id,
  });

  await getAccessToken(newCompany);

  return res.status(200).json({ message: 'OK' });
};

const webhook = async (req, res) => {
  const {
    seller_id,
    scope_id,
    scope_name,
    act,
    app_code,
    url_notification,
  } = req.params;

  console.log('\n\n', 'WEBHOOK',
    seller_id,
    scope_id,
    scope_name,
    act,
    app_code,
    url_notification, '\n\n');

  return res.status(200).json({ message: 'OK' });
};

export default {
  init, css, html, create, getStore, webhook,
};
