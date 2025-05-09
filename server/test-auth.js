const axios = require("axios")

async function testAuth() {
  try {
    console.log("Testing registration...")
    const registerResponse = await axios.post("http://localhost:5000/api/auth/register", {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
    })
    console.log("Registration successful:", registerResponse.data)

    console.log("\nTesting login...")
    const loginResponse = await axios.post("http://localhost:5000/api/auth/login", {
      username: "testuser",
      password: "password123",
    })
    console.log("Login successful:", loginResponse.data)

    console.log("\nTesting get current user...")
    const meResponse = await axios.get("http://localhost:5000/api/auth/me", {
      headers: {
        "x-auth-token": loginResponse.data.token,
      },
    })
    console.log("Get current user successful:", meResponse.data)
  } catch (error) {
    console.error("Error:", error.response ? error.response.data : error.message)
  }
}

testAuth()
