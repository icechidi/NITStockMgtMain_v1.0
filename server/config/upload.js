const path = require("path")
const fs = require("fs")
const multer = require("multer")
const crypto = require("crypto")

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, "../uploads/profiles")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir)
  },
  filename: (req, file, cb) => {
    // Generate a unique filename with original extension
    const uniqueSuffix = crypto.randomBytes(16).toString("hex")
    const ext = path.extname(file.originalname)
    cb(null, `profile-${uniqueSuffix}${ext}`)
  },
})

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true)
  } else {
    cb(new Error("Only image files are allowed!"), false)
  }
}

// Create the multer upload instance
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max file size
  },
  fileFilter: fileFilter,
})

module.exports = upload
