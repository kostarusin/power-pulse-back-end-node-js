import { HttpError } from "../helpers/index.js";

const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\-(0[1-9]|1[0-2])\-\d{4}$/;

const isDateValid = (req, res, next) => {
  const { createdAt } = req.user;
  const { date } = req.params;
  const dateParts = date.split("-");

  const day = parseInt(dateParts[0], 10);
  const month = parseInt(dateParts[1], 10) - 1;
  const year = parseInt(dateParts[2], 10);

  const requestDate = new Date(year, month, day);
  const registrationDate = new Date(createdAt);
  const today = new Date();

  if (dateParts.length !== 3 || !dateRegex.test(date)) {
    return next(HttpError(400, "Invalid date format"));
  }
  if (isNaN(requestDate.getTime())) {
    return next(HttpError(400, "Invalid date format"));
  }
  if (
    requestDate <
      new Date(
        registrationDate.getFullYear(),
        registrationDate.getMonth(),
        registrationDate.getDate()
      ) ||
    requestDate >
      new Date(today.getFullYear(), today.getMonth(), today.getDate())
  ) {
    throw HttpError(400, "Date should be between registration date and today");
  }

  next();
};

export default isDateValid;
