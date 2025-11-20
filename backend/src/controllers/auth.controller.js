const UserModel = require('../models/user.model');
const foodPartnerModel = require('../models/foodpartner.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


async function registerUser(req, res) {
    
        const { fullName, email, password } = req.body;

        const isUserAlreadyExists = await UserModel.findOne({ email: email });
        if (isUserAlreadyExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await UserModel.create({
            fullName,
            email,
            password: hashedPassword,
        })

        const token = jwt.sign({
            id: user._id,
        }, process.env.JWT_SECRET)

        res.cookie("token", token)
        res.status(201).json({ message: 'User registered successfully',
            user: {
                id: user._id,
                fullName: user.fullName,
                email: user.email,
            },
         });

    }

async function loginUser(req, res) {
    // Login logic here
    const { email, password } = req.body;

    const user = await UserModel.findOne({ email: email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({
        id: user._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)
    res.status(200).json({ message: 'Login successful' ,
        user: {
            id: user._id,
            fullName: user.fullName,
            email: user.email,
        }
    })
}

async function logoutUser(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: 'Logout successful' });
}


async function registerFoodPartner(req, res) {
    // Registration logic for food partners here
    const { name, email, password } = req.body;

    const isPartnerAlreadyExists = await foodPartnerModel.findOne({ email: email });
    if (isPartnerAlreadyExists) {
        return res.status(400).json({ message: 'Food Partner already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const foodPartner = await foodPartnerModel.create({
        name,
        email,
        password: hashedPassword,
    })
    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)

    res.cookie("token", token)
    res.status(201).json({ message: 'Food Partner registered successfully',
        foodPartner: {
            id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email,
        },
     });
}


async function loginFoodPartner(req, res) {
    // Login logic for food partners here
    const { email, password } = req.body;
    const foodPartner = await foodPartnerModel.findOne({ email: email });
    if (!foodPartner) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, foodPartner.password);
    if (!isPasswordValid) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign({
        id: foodPartner._id,
    }, process.env.JWT_SECRET)
    res.cookie("token", token)
    res.status(200).json({ message: 'Login successful' ,
        foodPartner: {
            id: foodPartner._id,
            name: foodPartner.name,
            email: foodPartner.email,
        }
    })
}

function logoutFoodPartner(req, res) {
    res.clearCookie("token");
    res.status(200).json({ message: 'Logout successful' });
}


module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    registerFoodPartner,
    loginFoodPartner,
    logoutFoodPartner
};