document.querySelector(".close").onclick = () => {
  document.querySelector(".close").style.display = "none";
  document.querySelector(".open").style.display = "inline-block";
  document.getElementById("password").type = "text";
};

document.querySelector(".open").onclick = () => {
  document.querySelector(".open").style.display = "none";
  document.querySelector(".close").style.display = "inline-block";
  document.getElementById("password").type = "password";
};

const validateForm = () => {
  let email = document.getElementById("email").value;
  let password = document.getElementById("password").value;

  if (email == "") {
    alert("Email is Required");
    return false;
  }
  if (password == "") {
    alert("Password is Required");
    return false;
  }
  return true;
};

const login = async () => {
  try {
    if (validateForm() == true) {
      let email = document.getElementById("email").value;
      let password = document.getElementById("password").value;

      let response = await axios.post("http://localhost:5000/user/login", {
        email: email,
        password: password,
      });
      console.log(response);
      document.getElementById("email").value = "";
      document.getElementById("password").value = "";
      alert(response.data.message);
      localStorage.setItem("token", response.data.token);
      location.href = "dashboard.html";
    }
  } catch (error) {
    alert(error.response.data.error);
    document.getElementById("email").value = "";
    document.getElementById("password").value = "";
  }
};