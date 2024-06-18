import express from 'express'
import { updateUserController } from '../controller/user.controller.js'
import { userAuth } from '../middleware/auth.middleware.js'

export const userRouter = express.Router()

userRouter.put('/update-user',userAuth, updateUserController)