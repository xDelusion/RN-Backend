require("dotenv").config();


const config =  {
  PORT: process.env.PORT,
  MONGO_DB_URL: process.env.MONGO_DB_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXP: process.env.JWT_EXP,
}

const checkConfig = ()=>{

  for (const key in config){
    if (!config[key]){
      console.log(`Missing ${key} key in .env file`)
      return process.exit(1)
    }
  }
}
checkConfig()

module.exports = config


