import express from 'express'
import { userAuth } from '../middleware/auth.middleware.js';
import { createJobController, deleteJob, getAllJobs, jobStatsController, updateJob } from '../controller/job.controller.js';

export const jobrouter = express.Router();


jobrouter.post('/create',userAuth,createJobController)
jobrouter.get('/get-job',userAuth,getAllJobs)
jobrouter.patch('/update-job/:id',userAuth,updateJob)
jobrouter.delete('/delete-job/:id',userAuth,deleteJob)

/// jobs tats and filter 
jobrouter.get('/job-stats',userAuth,jobStatsController)

