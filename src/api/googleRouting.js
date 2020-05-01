const txt2speechRouter = async (req, res) => {
    // console.log(req.params.)
    try {
      const getResult = await get(req.params.id);
      res.status(200).json({ success: true, account: getResult })
    }
    catch (error) {
      res.status(500).json({ success: false, err: error })
    }
  }
  
  module.exports = { txt2speechRouter}
  