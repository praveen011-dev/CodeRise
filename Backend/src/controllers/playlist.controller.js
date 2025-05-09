import { db } from "../libs/db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/api.error.js";
import {ApiResponse} from "../utils/api.response.js";  

const getAllListDetails=asyncHandler(async(req,res,next)=>{

    const playlist=await db.playlist.findMany({
        where:{
            userId:req.user.id
        },
        include:{
            problems:{
                include:{
                    problem :true
                }
            }
        }
    })

    if(!playlist || playlist.length==0){
        return next(new ApiError(404,"No Playlist found"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"Playlist Found"));
})

const createPlaylist=asyncHandler(async(req,res,next)=>{   

    const {name,description}=req.body;

    const userId=req.user.id

    const playlist=await db.playlist.create({
        data:{
            name,
            description,
            userId
        }
    })
    if(!playlist){
        return next(new ApiError(404,"Error while creating playlist"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"Playlist created Successfully"));
})

const getPlaylistDetails=asyncHandler(async(req,res,next)=>{
    const {playlistId}=req.params;

    const playlist=await db.playlist.findUnique({
        where:{
            id:playlistId,
            userId:req.user.id
        },
        include:{
            problems:{
                include:{
                    problem :true
                }
            }
        }
    })
    if(!playlist){
        return next(new ApiError(404,"Playlist not found"));
    }   

    return res
    .status(200)
    .json(new ApiResponse(200,playlist,"Playlist Found SuccessFully"));
})

const addProblemToPlaylist=asyncHandler(async(req,res,next)=>{
    
    const {playlistId}=req.params
    const {problemIds}=req.body

    if(!Array.isArray(problemIds) || problemIds.length===0){
        return next(new ApiError(400,"Please provide valid problem ids"));
    }

    //create Records 

    const problemsinPlaylist=await db.problemInPlaylist.createMany({
        data:problemIds.map((problemId)=>({
            playListId:playlistId,
            problemId
        }))
    })

    if(!problemsinPlaylist){
        return next(new ApiError(404,"Error while adding problems to playlist"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,problemsinPlaylist,"Problems Added to playlist Successfully"));

})

const updatePlaylist=asyncHandler(async(req,res,next)=>{
    const {name,description}=req.body;
    const {playlistId}=req.params

    const updatedPlaylist=await db.playlist.update({
        where:{
            id:playlistId
        },
        data:{
            name,
            description
        }
    })

    if(!updatePlaylist){
        return next(new ApiError(404,"Error while updating playlist"));
    }

    return res
    .status(200)
    .json(new ApiResponse(200,updatedPlaylist,"Playlist Updated Successfully"));
})

const deletePlaylist=asyncHandler(async(req,res,next)=>{
    const {playlistId}=req.params

    const deletedPlaylist=await db.playlist.delete({
        where:{
            id:playlistId
        }
    })

    if(!deletedPlaylist){
        return next(new ApiError(404,"Error while deleting playlist"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,deletedPlaylist,"Playlist Deleted Successfully"));
})

const removeProblemFromPlaylist=asyncHandler(async(req,res,next)=>{

    const {playlistId}=req.params
    const {problemIds}=req.body

    if(!Array.isArray(problemIds) || problemIds.length===0){
        return next(new ApiError(400,"Please provide valid problem ids"));
    }

    const deleteProblemfromPlaylist=await db.problemInPlaylist.deleteMany({
        where:{
            playListId:playlistId,
            problemId:{
                in:problemIds
            }
        }
    })

    if(!deleteProblemfromPlaylist){
        return next(new ApiError(404,"Error while removing problems from playlist"));
    }
    return res
    .status(200)
    .json(new ApiResponse(200,deleteProblemfromPlaylist,"Problems removed from playlist Successfully"));
})


export {
    getAllListDetails,
    getPlaylistDetails,
    createPlaylist,
    addProblemToPlaylist,
    deletePlaylist,
    removeProblemFromPlaylist,
    updatePlaylist
}