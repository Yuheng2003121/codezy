import express  from 'express';

const router = express.Router();

router.get("/", (req, res) => {
  const {user_code} = req.query;
  res.redirect(`http://localhost:3000/device?user_code=${user_code}`)
});



export default router;