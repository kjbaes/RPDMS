var MyDate = new Date();

MyDate.setMonth(MyDate.getMonth() + 1);

const MyDateString =
  MyDate.getFullYear() +
  "-" +
  ("0" + MyDate.getMonth()).slice(-2) +
  "-" +
  ("0" + MyDate.getDate()).slice(-2);

//*New arrival
const Months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const colors = {
  "Police": "#65DCDC",
  "Market": "#FFD671",
  "Relief Operation": "#50B9FF",
};

const backgroundColor = [
  "rgba(255, 99, 132, 0.7)",
  "rgba(54, 162, 235, 0.7)",
  "rgba(255, 206, 86, 0.7)",
  "rgba(75, 192, 192, 0.7)",
  "rgba(153, 102, 255, 0.7)",
  "rgba(255, 159, 64, 0.7)",
];

const borderColor = [
  "rgba(255, 99, 132, 1)",
  "rgba(54, 162, 235, 1)",
  "rgba(255, 206, 86, 1)",
  "rgba(75, 192, 192, 1)",
  "rgba(153, 102, 255, 1)",
  "rgba(255, 159, 64, 1)",
];

export {
  Months,
  colors,
  backgroundColor,
  borderColor,
  MyDateString,
};
