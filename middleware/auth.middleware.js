import jwt from 'jsonwebtoken'

export const userAuth = async(req,res,next)=>{
    try{
        const authHeader = req.headers.authorization
        if(!authHeader || !authHeader.startsWith('Bearer')){
            next("Auth Failed")
        }
        const token = authHeader.split(' ')[1]
        try{
            const payload = jwt.verify(token,process.env.JWT_SECRET)
            req.user={userId:payload.userId}
            next()
        }catch(err){
            next("Auth Problem")
        }
    }catch(err){
        next(err)
    }
}