import jwt from 'jsonwebtoken';


export const genTokenAndSetCookie = async(userId,res)=>{
  const token = jwt.sign( {userId} , process.env.JWT_SECRET, { expiresIn: '1d' });
  res.cookie('date', token, {maxAge: 1 * 24 * 60 * 60 *3600, httpOnly: true });
  
}