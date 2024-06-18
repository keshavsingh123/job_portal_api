import jobModel from "../model/job.model.js"
import mongoose from "mongoose"
import moment from "moment"
export const createJobController = async(req,res,next)=>{
    try{
        const{company,position}=req.body
        if(!company ||!position){
            next('Please check company and position')
        }
        req.body.createdBy = req.user.userId
        const job = await jobModel.create(req.body)
        res.status(200).json({job}) 
    }catch(err){
        next(err)
    }
}

export const getAllJobs = async(req,res,next)=>{
    try{
        const {status,workType,search,sort} = req.query
        //searching filters
        const queryObj = {
            createdBy:req.user.userId
        }
        //Logic for filter
        if(workType && workType !== 'all'){
            queryObj.workType = workType
        }
        if(status && status !== 'all'){
            queryObj.status = status
        }
        if(search){
            queryObj.position = {$regex: search,$options:"i"}
        }
        let queryRes = jobModel.find(queryObj)

        //Sort
        if(sort === 'latest'){
            queryRes = queryRes.sort('-createdAt')
        }
        if(sort === 'oldest'){
            queryRes = queryRes.sort('createdAt')
        }
        if(sort === 'a-z'){
            queryRes = queryRes.sort('position')
        }
        if(sort === 'z-a'){
            queryRes = queryRes.sort('-position')
        }
        //Pagination
        const page = Number(req.query.page) || 1
        const limit = Number(req.query.limit) || 10
        const skip = (page-1)*limit

        queryRes = queryRes.skip(skip).limit(limit)
        //jobs Count
        const totalJobs = await jobModel.countDocuments(queryRes)
        const numOfPage = Math.ceil(totalJobs/limit)

        const jobs = await queryRes

        // const jobs = await jobModel.find()
        res.status(200).json({totalJobs,jobs,numOfPage})
    }catch(err){
        next(err)
    }
}

export const updateJob = async(req,res,next)=>{
    try{
        const {id} = req.params
        const {company,position} = req.body;
        if(!company || !position){
            next("Provide all field here")
        }
        const job  = await jobModel.findOne({_id:id})
        if(!job){
            next(`no jons found with this id ${id}`)
        }
        // validation security from other users (no one can update using id only)
        if(!req.user.userId === job.createdBy.toString()){
            next("you are not authorize to update  job")
            return;

        }
        const updateJob = await jobModel.findOneAndUpdate({_id:id}, req.body,{
            new:true,
            runValidators:true
        })
        res.status(200).send({updateJob})
        }catch(err){
        next(err)
    }
}
export const deleteJob = async(req,res,next)=>{
    try{
        const {id} = req.params
        const job = await jobModel.findOne({_id:id})
        if(!job){
            next(`unable to delete with this ${id}`)
        }
        // validation security from other users (no one can update using id only)
        if(!req.user.userId === job.createdBy.toString()){
            next("you are not authorize to delete  job")
            return;

        }
        await job.deleteOne()
        res.status(200).send({message:"Successfully deleted"})

    }catch(err){
        next(err)
    }
}

/// jobs stats and filter controller

export const jobStatsController = async(req,res,next)=>{
    try{
        const stats = await jobModel.aggregate([
            {
                // search by user job
                $match:{
                    createdBy:new mongoose.Types.ObjectId(req.user.userId)
                }
            },
            {
                $group:{
                    _id: '$status',
                    count:{$sum:1}
                }
            }
        ]);
        //default stats
        const defaultStats = {
            pending:stats.pending || 0,
            failed:stats.failed || 0,
            interview:stats.interview || 0
        }
        // monthly yearly stats
        let monthlyApplications = await jobModel.aggregate([
            {
                $match:{
                    createdBy : new mongoose.Types.ObjectId(req.user.userId)
                }
            },

            {
                $group:{
                    _id:{
                        year:{$year:'$createdAt'},
                        month:{$month:'$createdAt'}
                        
                    },
                    count:{
                        $sum:1
                    }
                }
            }
        ])
        monthlyApplications = monthlyApplications.map((item)=>{
            const {count} = item;
            const date = moment(item).format('MMM Y');
            return {date,count};
        })
        .reverse();
        res.status(200).json({totalJobs:stats.length,stats,defaultStats,monthlyApplications})
    }catch(err){
        next(err)
    }
}
