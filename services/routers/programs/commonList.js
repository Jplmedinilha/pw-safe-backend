const commonQueries = require('../../../controllers/common/commonQueries')

const getTest = async (req, res, next) => {
  
    try {
    
     
      let list = await commonQueries.getTest();

      return res.status(200).json({ STATUS: "200", CODE: "S", MSG: "common.success", RETURN: list });


    } catch (err) {
      let msg
      if (err.message) {
        msg = err.message
      } else {
        msg = err
      }

      if (err.message == "Error: ErrorMountList") {
        return res.status(200).json({ STATUS: "401", CODE: "E", MSG: "common.error", RETURN: null });
      }

      return res.status(200).json({ STATUS: "401", CODE: "E", MSG: msg, RETURN: err });

    }

  }
  module.exports.getTest = getTest