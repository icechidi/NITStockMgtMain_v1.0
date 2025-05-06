// This is a simple script to test if the server is running correctly
// Run this with: node test-server.js

const http = require("http")

const options = {
  hostname: "localhost",
  port: 5000,
  path: "/api/auth/login",
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
}

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`)
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`)

  let data = ""

  res.on("data", (chunk) => {
    data += chunk
  })

  res.on("end", () => {
    console.log("Response body:")
    try {
      // Try to parse as JSON
      const jsonData = JSON.parse(data)
      console.log(JSON.stringify(jsonData, null, 2))
    } catch (e) {
      // If not JSON, show as text
      console.log("Not JSON response:")
      console.log(data)
    }
  })
})

req.on("error", (e) => {
  console.error(`Problem with request: ${e.message}`)
})

// Write test data
const testData = JSON.stringify({
  username: "testuser",
  password: "testpassword",
})

req.write(testData)
req.end()

console.log("Test request sent to server. If the server is not running, you will see a connection error.")
