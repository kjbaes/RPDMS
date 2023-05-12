import React, { useState } from "react";
import { app } from "../../config/firebase";
import { ChevronLeft } from "react-feather";
import { Link } from "react-router-dom";
import { Sheet, Textfield } from "../../components";
import { Spin } from "antd";
import swal from "sweetalert";

const information = {
  imageUrl: "",
  firstname: "",
  lastname: "",
  role: "",
  gender: "",
  date: "",
  contact: 0,
  barangay: "",
  municipality: "",
  province: "Iloilo",
  email: "",
  password: "",
  confirmPassword: "",
};

const Register = () => {
  const [
    {
      imageUrl,
      firstname,
      lastname,
      role,
      gender,
      date,
      contact,
      barangay,
      municipality,
      province,
      email,
      password,
      confirmPassword,
    },
    setState,
  ] = useState(information);
  const [loading, setLoading] = useState(false);

  const onChange = (event) => {
    event.preventDefault();
    const { name, value } = event.target;
    setState((prevState) => ({ ...prevState, [name]: value }));
  };

  //clear state
  const clearState = () => {
    setState({ ...information });
  };

  function getAge(dateString) {
    var today = new Date();
    var birthDate = new Date(dateString);
    var age = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  const Loading = () => setLoading(true);

  const onSubmit = (event) => {
    event.preventDefault();

    Loading();

    const age = getAge(date);

    const userEmail = email.toLowerCase();

    //console.log(gender);

    if (password === confirmPassword) {
      app
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then((cred) =>
          (async () => {
            const document = app
              .firestore()
              .collection("user")
              .doc(cred.user.uid);

            document
              .set({
                imageUrl,
                firstname,
                lastname,
                role: role === "" ? "NFA" : role,
                gender,
                dateOfBirth: date,
                age,
                contact,
                barangay,
                municipality,
                province,
                email: userEmail,
                password,
                monthlyIncome: 0
              })
              .then(() => {
                clearState();
                setLoading(false);
                swal({
                  title: "Successfully",
                  text: "successfully registered",
                  icon: "success",
                  button: "proceed",
                }).then(() => {
                  clearState();
                });
              });
          })()
        )
        .catch((error) => {
          swal({
            title: "Warning",
            text: `${error.message}`,
            icon: "warning",
            button: "Ok",
          });
        });
    } else {
      swal({
        title: "Warning",
        text: `Password doesnt match, please try again`,
        icon: "warning",
        button: "Ok",
      });
    }
  };

  return (
    <Spin spinning={loading}>
      <img
        src="/image/background.png"
        className="absolute right-0 top-0 w-full h-full"
        alt="Background"
      />
      <Sheet className="max-w-4xl z-50">
        <Link to="/" className="flex justify-between mb-4">
          <div className="flex">
            <ChevronLeft className="text-gray-700" />
            <span className="ml-1 font-bold text-gray-700 ">Back</span>
          </div>
          <h1 className="text-3xl text-center font-bold">Sign up</h1>
        </Link>
        <form>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 flex items-center">
            <Textfield
              onChange={(event) => onChange(event)}
              value={firstname}
              label="First name"
              type="text"
              placeholder="firstname"
              name="firstname"
            />
            <Textfield
              onChange={(event) => onChange(event)}
              value={lastname}
              label="Last name"
              type="text"
              placeholder="lastname"
              name="lastname"
            />
            <div className="mt-2">
              <label
                className="block text-sm font-semibold text-gray-700"
                for="role"
              >
                Role
              </label>
              <select
                id="role"
                name="role"
                autoComplete="role"
                vlaue={role}
                onChange={(event) => onChange(event)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value=""></option>
                <option value="Farmer">Farmer</option>
                <option value="Trader">Trader</option>
                {/* <option value="NFA">NFA</option> */}
              </select>
            </div>
          </div>
          <div className="flex items-center grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* <Textfield
              onChange={(event) => onChange(event)}
              value={gender}
              label="Gender"
              type="text"
              placeholder="Gender"
              name="gender"
            /> */}
            <div className="mt-2">
              <label
                className="block text-sm font-semibold text-gray-700"
                for="gender"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                autoComplete="gender"
                vlaue={gender}
                onChange={(event) => onChange(event)}
                className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value=""></option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>
            <Textfield
              onChange={(event) => onChange(event)}
              value={date}
              label="Date of Birth"
              type="date"
              placeholder="date"
              name="date"
            />
            <Textfield
              onChange={(event) => onChange(event)}
              value={contact}
              label="Contact Number"
              type="number"
              placeholder="Contact Number"
              name="contact"
            />
          </div>
          <div className="grid grid-cols-1  sm:grid-cols-3 gap-4">
            <Textfield
              onChange={(event) => onChange(event)}
              value={barangay}
              label="Barangay"
              type="text"
              placeholder="Barangay"
              name="barangay"
            />
            <Textfield
              onChange={(event) => onChange(event)}
              value={municipality}
              label="Municipality"
              type="text"
              placeholder="Municipality"
              name="municipality"
            />
            <Textfield
              onChange={(event) => onChange(event)}
              value={province}
              label="Province"
              type="text"
              placeholder="Province"
              name="province"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Textfield
              onChange={(event) => onChange(event)}
              value={email}
              label="email"
              type="text"
              placeholder="Email"
              name="email"
            />
            <Textfield
              onChange={(event) => onChange(event)}
              value={password}
              label="Password"
              type="password"
              placeholder="Password"
              name="password"
            />
            <Textfield
              onChange={(event) => onChange(event)}
              value={confirmPassword}
              label="Confirm Password"
              type="password"
              placeholder="Confirm Password"
              name="confirmPassword"
            />
          </div>
          <div>
            <div className="w-52 mt-4 mb-2 float-right">
              <button
                onClick={(event) => onSubmit(event)}
                type="submit"
                className="w-full bg-primary hover:bg-primary-slight text-white text-sm py-2 px-4 font-semibold rounded-sm focus:outline-none focus:shadow-outline h-10"
              >
                Sign Up
              </button>
            </div>
          </div>
        </form>
      </Sheet>
    </Spin>
  );
};

export default Register;
