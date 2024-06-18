
export const errorMiddleware = (err,req,res,next)=>{
    console.log(err);
    const defaultError = {
        statuscode: 500,
        message:err
    }
    // res.status(500).send({
    //     success:false,
    //     message:"something went wrong",
    //     err
    // })
    if(err.name === "ValidationError"){
        defaultError.statuscode = 400;
        defaultError.message = Object.values(err.errors).map((item)=>item.message).join(',')
    }
    //duplicate error
    if(err.code && err.code === 11000){
        defaultError.statuscode = 400;
        defaultError.message = `${Object.keys(err.keyValue)} field has to be unique`
    }
    res.status(defaultError.statuscode).json({message:defaultError.message})
}