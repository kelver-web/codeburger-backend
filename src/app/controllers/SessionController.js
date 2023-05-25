import * as Yup from "yup"
import User from "../models/User"

class SessionController {
  async store(request, response) {
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    const userPasswordOrEmailIncorrect = () => {
      return response
        .status(401)
        .json({ message: "Make sure your password ou email are correct" })
    }

    if (!(await schema.isValid(request.body))) userPasswordOrEmailIncorrect()

    const { email, password } = request.body

    const user = await User.findOne({
      where: { email },
    })

    if (!user) userPasswordOrEmailIncorrect()

    if (!(await user.checkPassword(password))) userPasswordOrEmailIncorrect()
    
    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
    })
  }
}

export default new SessionController()
