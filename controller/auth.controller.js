import userModel from "../model/user.model.js"

export const Register = async (req,res,next)=>{
    try{
        const {name,email,password} = req.body
        //validate
        if(!name){
            next("name is required");
        }
        if(!email){
            next("email is required");
        }
        if(!password){
            next("password is required & greater than 3 character");
        }
        const existing = await userModel.findOne({email})
        if(existing){
            next("you are already registered with that email");
        }
        const user = await userModel.create({name,email,password})
        //jwt
        const token = user.createJWT()
        res.status(400).send({
            message:"user created successfully",
            success:false,
            user:{
                name:user.name,
                lastName:user.lastName,
                email:user.email,
                location:user.location
            },
            token
        })
    }catch(error){
        next(error);
    }
}

export const loginController = async(req,res,next)=>{
    try{
        const{email,password} = req.body
        if(!email || !password){
            next("Please provide all field")
        }
        const user = await userModel.findOne({email}).select("+password") //hide pwd in postman
        if(!user){
            next("Invalid user")
        }
        const isMatch = await user.comparePwd(password)
        if(!isMatch){
            next("Invalid username or password")
        }
        user.password = undefined  //for security reason we can't see pwd in postman
        const token = user.createJWT();
        res.status(400).send({
            message:"login successfully",
            success:true,
            user,
            token
        })

    }catch(err){
        next(err)
    }
}