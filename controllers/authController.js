import JWT from 'jsonwebtoken';
import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";

// POST Register
const registerController = async (req, res) => {
    try {
        const { name, email, password, phone, address, question, role } = req.body;

        // validation
        if (!name) {
            return res.send({ message: 'Name is required' });
        }
        if (!email) {
            return res.send({ message: 'Email is required' });
        }
        if (!password) {
            return res.send({ message: 'Password is required' });
        }
        if (!phone) {
            return res.send({ message: 'Phone is required' });
        }
        if (!address) {
            return res.send({ message: 'Address is required' });
        }
        if (!question) {
            return res.send({ message: 'Question is required' });
        }

        // checking user
        const existingUser = await userModel.findOne({ email });

        // checking existing user
        if (existingUser) {
            return res.status(200).send({
                success: false,
                message: 'Already register please login',
            })
        }

        // register user
        const hashedPassword = await hashPassword(password);

        // save
        const user = await new userModel({ name, email, phone, address, question, password: hashedPassword }).save();
        res.status(201).send({
            success: true,
            message: 'Register successfully',
            user
        })
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in register',
            error
        })
    }
}

// POST Login
const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(404).send({
                success: false,
                message: 'Invalid email or password'
            })
        }

        // check user
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({
                success: false,
                message: 'Email is not register',
            })
        }

        const matchPassword = await comparePassword(password, user.password);
        if (!matchPassword) {
            return res.status(200).send({
                success: false,
                message: 'Invalid Password',
            })
        }

        // token creation
        const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {
            expiresIn: '7d',
        });

        res.status(201).send({
            success: true,
            message: 'Login successfully',
            user: {
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login',
            error
        })
    }
}

// forgot password controller
const forgotPasswordController = async (req, res) => {
    try {
        const { email, question, newPassword } = req.body;

        // validation checking
        if(!email) {
            res.status(400).send({ message: 'Email is required'});
        }
        if(!question) {
            res.status(400).send({ message: 'Question is required'});
        }
        if(!newPassword) {
            res.status(400).send({ message: 'New Password is required'});
        }

        // checking
        const user = await userModel.findOne({ email, question });

        // validation
        if(!user) {
            return res.status(404).send({
                success: false,
                message: 'Wrong Email or Question'
            })
        }

        const hashed = await hashPassword(newPassword);
        await userModel.findByIdAndUpdate(user._id, {password: hashed});
        res.status(200).send({
            success: true,
            message: 'Password Reset Successfully',
        })
    } 
    catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Something went wrong !',
            error
        })
    }
}

//test controller
const testController = (req, res) => {
    try {
        res.send("Protected Routes");
    } catch (error) {
        console.log(error);
        res.send({ error });
    }
};

export { loginController, registerController, forgotPasswordController, testController };