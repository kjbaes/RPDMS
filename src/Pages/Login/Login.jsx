import React, { useState, useContext } from "react";
import { Spin } from "antd";
import { app } from "../../config/firebase";
import { Link, withRouter, Redirect } from "react-router-dom";
import { AuthContext } from "../../Context/auth";
//import { Sheet } from "../../components";
import swal from "sweetalert";

const Login = () => {
  // const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState({ status: false, errorMessage: "" });

  const context = useContext(AuthContext);

  // const isToggle = (event) => {
  //     event.preventDefault();
  //     if (!toggle) {
  //         setToggle(true);
  //     } else {
  //         setToggle(false);
  //     }
  // }

  const Loading = () => setLoading(true);

  const onSubmit = (event) => {
    event.preventDefault();

    Loading();

    app
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        swal({
          title: "Successfully",
          text: "successfully registered",
          icon: "success",
          button: "proceed",
        }).then(() => {
          setLoading(false);
          setEmail("");
          setPassword("");
          setError({ status: false, errorMessage: "" });
          <Redirect to="/marketplace" />;
        });
      })
      .catch((error) => {
        setError({ status: true, errorMessage: error.message });
        setLoading(false)
      });
  };

  if (context) {
    return <Redirect to="/marketplace" />;
  }

  return (
    <>
      <Spin spinning={loading}>

        <div class="p-20 h-screen w-screen flex flex-col-reverse md:flex-row items-center justify-center bg-gray-200">
          <img
            src="/image/background.png"
            className="absolute right-0 top-0 w-full h-full z-10"
            alt="Background"
          />
          <div class="content text-3xl text-center md:text-left leading-5">
            <h1 class="text-5xl text-blue-500 font-bold">Rice Procurement and Distribution Management System</h1>
            <div className="leading-9">
              <p className="my-4">A convenient way to sell palay in Iloilo province</p>
            </div>
          </div>
          <div class="container mx-auto flex flex-col items-center z-50">
            <section className=" bg-white rounded-lg w-8/12 p-8">
              <h1 className="text-xl md:text-2xl font-bold leading-tight mt-12">
                Log in to your account
              </h1>
              <form className="mt-6" onSubmit={onSubmit}>
                <div>
                  <label className="block text-gray-700">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="Enter Email Address"
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500 focus:bg-white focus:outline-none"
                    required
                  />
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="Enter Password"
                    className="w-full px-4 py-3 rounded-lg bg-gray-200 mt-2 border focus:border-blue-500
        focus: bg-white focus: outline-none"
                    required
                  />
                </div>

                {/* <div className="text-right mt-2">
                  <button className="text-sm text-primary hover:opacity-50">
                    Forgot Password?
                  </button>
                </div> */}
                {error.status && (
                  <div className="border-l-2 py-2 my-5 border-red-500 bg-red-300 text-white text-center">
                    {error.errorMessage}
                  </div>
                )}
                <button
                  type="submit"
                  className="w-full block bg-primary hover:opacity-80 text-white font-semibold rounded-lg
        px-4 py-3 mt-6"
                >
                  Log In
                </button>
              </form>
              <div className="my-6 border-gray-300 w-full" />
              <p className="mt-8">
                Need an account?{" "}
                <Link
                  to="/register"
                  className="text-primary hover:opacity-50 font-semibold"
                >
                  Create an account
                </Link>
              </p>
            </section>
          </div>
        </div>
      </Spin>
    </>
  );
};

export default withRouter(Login);
