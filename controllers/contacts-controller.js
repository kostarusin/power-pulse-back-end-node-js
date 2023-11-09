import Contact from "../models/Contact.js";
import { HttpError } from "../helpers/index.js";
import { ctrlWrapper } from "../decorators/index.js";

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  const { page = 1, limit = 10, favorite } = req.query;
  const skip = (page - 1) * limit;
  const query = { owner };

  if (favorite === "true") {
    query.favorite = true;
  } else if (favorite === "false") {
    query.favorite = false;
  }

  const contactsList = await Contact.find(query, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "username email");
  res.json(contactsList);
};

const getById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const contactById = await Contact.findOne({ _id: id, owner });
  if (!contactById) {
    throw HttpError(404, `Not found`);
  }
  res.json(contactById);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const newContact = await Contact.create({ ...req.body, owner });
  res.status(201).json(newContact);
};

const updateById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    req.body
  );
  if (!updatedContact) {
    throw HttpError(404, `Not found`);
  }
  res.status(200).json(updatedContact);
};

const updateStatusContact = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const updatedContact = await Contact.findOneAndUpdate(
    { _id: id, owner },
    req.body
  );
  if (!updatedContact) {
    throw HttpError(404, `Not found`);
  }
  res.status(200).json(updatedContact);
};

const deleteById = async (req, res) => {
  const { _id: owner } = req.user;
  const { id } = req.params;
  const deletedContact = await Contact.findOneAndDelete(
    { _id: id, owner },
    req.body
  );
  if (!deletedContact) {
    throw HttpError(404, `Not found`);
  }
  res.status(200).json({ message: "contact deleted" });
};

export default {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  updateStatusContact: ctrlWrapper(updateStatusContact),
  deleteById: ctrlWrapper(deleteById),
};
