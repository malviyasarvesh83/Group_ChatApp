document.querySelector(".close").onclick = () => {
  document.querySelector(".close").style.display = "none";
  document.querySelector(".open").style.display = "inline-block";
  document.getElementById("signUppassword").type = "text";
};

document.querySelector(".open").onclick = () => {
  document.querySelector(".open").style.display = "none";
  document.querySelector(".close").style.display = "inline-block";
  document.getElementById("signUppassword").type = "password";
};

const validateForm = () => {
  let name = document.getElementById("signUpname").value;
  let email = document.getElementById("signUpemail").value;
  let phone = document.getElementById("signUpphone").value;
  let password = document.getElementById("signUppassword").value;

  if (name == "") {
    alert("Name is Required");
    return false;
  }
  if (email == "") {
    alert("Email is Required");
    return false;
  }
  if (phone == "") {
    alert("Phone Number is Required");
    return false;
  }
  if (password == "") {
    alert("Password is Required");
    return false;
  }
  return true;
};

const signUp = async () => {
  try {
    if (validateForm() == true) {
      let name = document.getElementById("signUpname").value;
      let email = document.getElementById("signUpemail").value;
      let phone = document.getElementById("signUpphone").value;
      let password = document.getElementById("signUppassword").value;

      let response = await axios.post("http://localhost:5000/user/signup", {
        name: name,
        email: email,
        phone: phone,
        password: password,
      });
      alert(response.data.message);
      document.getElementById("signUpname").value = "";
      document.getElementById("signUpemail").value = "";
      document.getElementById("signUpphone").value = "";
      document.getElementById("signUppassword").value = "";
      location.href = "login.html";
    }
  } catch (error) {
    alert(error.response.data.error);
    document.getElementById("signUpname").value = "";
    document.getElementById("signUpemail").value = "";
    document.getElementById("signUppassword").value = "";
  }
};