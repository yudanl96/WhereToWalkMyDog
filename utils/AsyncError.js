module.exports = fx => {
    return (req,res,next)=>{
        fx(req,res,next).catch(next);
    }
}
