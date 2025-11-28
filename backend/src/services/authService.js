const bcrypt = require("bcryptjs");
const prisma = require("../prisma/client");
const {generateToken} = require("../utils/jwt");

module.exports = {
    register: async ({name, email, password}) => {
        const existing = await prisma.user.findUnique({where: {email}});
        if(existing) throw new Error("Email Already Registered");

        const hashed = await bcrypt.hash(password,10);

        const account = await prisma.account.create({
            data: {
                name: `${name} 's Account`
            }
        });

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashed,
                role: "admin",
                accountId: account.id
            }
        });

        const token = generateToken(user);

        return {user, token};
    },

    login: async ({email,password}) => {
        const user = await prisma.user.findUnique({where: {email}});
        if(!user) throw new Error("Invalid Credentials");

        const ok = await bcrypt.compare(password,user.password);
        if(!ok) throw new Error("Invalid credentials");

        const token = generateToken(user);
        return {user, token};
    }
}