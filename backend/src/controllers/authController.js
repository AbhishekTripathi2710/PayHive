const authService = require("../services/authService");

module.exports = {
    register: async (req,res) => {
        try{
            const {user, token} = await authService.register(req.body);
            res.json({user, token});
        }catch(err){
            res.status(400).json({message: err.message});
        }
    },

    login: async (req, res) => {
        try{
            const { user, token} = await authService.login(req.body);
            res.json({user,token});
        }catch(err){
            res.status(400).json({message: err.message})
        }
    }
}