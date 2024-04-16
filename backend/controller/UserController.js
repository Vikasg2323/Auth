const User = require("../models/UserModel")
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const secretkey = "sudhakar"

const register =  async(req,res)=>{
    const {username,email,password} = req.body

    if(!username || !email || !password){
        res.status(401)
        res.json({"msg":"fill all fields"})
    }
    const hashPassword = await bcrypt.hash(password,10)
    const user = User.create({
        username,
        email,
        password: hashPassword
    })
    if(user){
        res.status(201)
        res.json({success:true})
    }
    else{
        res.status(400)
        res.json({success:false})
        throw new Error("user data not valid")
    }

}

const login = async(req,res) =>{
    const {username,password} = req.body
    const user = await User.findOne({username})
    if(user && (await bcrypt.compare(password, user.password))){
        const data = {
            userdata:{
                id:user.id
            }
        }
        const authToken = jwt.sign(data,secretkey)
        res.json({success:true,authToken:authToken})
    }
    else{
        res.status(401).json({msg : "email or password is worng"})
    }
}


module.exports = {register,login}