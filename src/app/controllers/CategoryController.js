import * as Yup from "yup"
import Category from "../models/Category"
import User from "../models/User"

class CategoryController {
  async store(request, response) {
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required(),
      })

      try {
        await schema.validateSync(request.body, { abortEarly: false })
      } catch (error) {
        return response.status(400).json({ error: error.errors })
      }

      const { admin: userIsAdmin } = await User.findByPk(request.userId)

      if(!userIsAdmin){
        return response.status(400).json({message: "User is not admin"})
      }

      const { name } = request.body

      const categoryExist = await Category.findOne({
        where: { name },
      })

      if (categoryExist) {
        return response
          .status(401)
          .json({ error: "This category already exists" })
      }

      const { id } = await Category.create({ name })

      return response.json({ id, name })
    } catch (err) {
      console.log(err)
    }
  }

  async index(request, response) {
    const category = await Category.findAll()

    return response.json(category)
  }
}

export default new CategoryController()
