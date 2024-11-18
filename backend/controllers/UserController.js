import bcrypt from "bcryptjs";

// Registe a user
const signup = async (req, res) => {
  const { username, mobilenumber, email, password } = req.body;

  // Check all the fields are entered
  if (!username || !mobilenumber || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check the email struct
  const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

  if (!emailRegex.test(email)) {
    return res
      .status(400)
      .json({ message: "Invalid email format. Please enter a valid email." });
  }

  // Check the mobilenumber
  const mobileRegex = /^(?:(?:\+|0{0,2})91(\s*[\-]\s*)?|[0]?)?[789]\d{9}$/;

  if (!mobileRegex.test(mobilenumber)) {
    return res.status(400).json({
      message: "Invalid mobile number. Please enter a valid 10-digit number.",
    });
  }

  // Password check
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;

  if (!passwordRegex.test(password)) {
    return res
      .status(400)
      .json({
        message:
          "Password must be at least 8 characters long and contain at least one letter and one number.",
      });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 8);

};

export { signup };
