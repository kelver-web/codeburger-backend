import {v4} from "uuid"
import User from "../models/User"

import * as Yup from "yup"

class UserController {
    async store(request, response){
        const schema = Yup.object().shape({
            name: Yup.string().required(),
            email: Yup.string().email().required(),
            password_hash: Yup.string().required().min(6),
            admin: Yup.boolean()
        })

    try {
        await schema.validateSync(request.body, { abortEarly: false })
    } catch (error) {
        return response.status(400).json({error: error.errors})
    }

    const { name, email, password_hash, admin } = request.body

    const userExists = User.findOne({
        where: { email }
    })

    if(userExists){
        return response.status(400).json({message: "This user alredy exists"})
    }

    const user = await User.create({
        id: v4(),
        name,
        email,
        password_hash,
        admin
    })

    return response.status(201).json({id: user.id, name, email, admin})
    }
}

export default new UserController()
