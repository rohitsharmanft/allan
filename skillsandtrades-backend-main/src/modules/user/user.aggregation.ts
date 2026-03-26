
import { Types } from "mongoose";


export const handleProfileListWithLocation = async (
  models: any,
  limit: Number,
  offset: Number,
  longitude: Number,
  latitude: Number,
  distance: any,
  skillId
) => {
  try {
    const geoNearStage = {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)] as [
            number,
            number
          ],
        },
        distanceField: "distance",
        maxDistance: distance ? Number(distance) * 1000 : 10000,
        spherical: true,
        key: "location",
      },
    };
    const response = await models.aggregate([
      ...(longitude && latitude ? [geoNearStage] : []),
      {
        $match: {
          skillIds: {
            $in: [new Types.ObjectId(skillId)],
          },
        },
      },
      {
        $lookup: {
          from: "members",
          localField: "memberId",
          foreignField: "_id",
          as: "memberData",
        },
      },
      {
        $unwind: {
          path: "$memberData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "skills",
          localField: "skillIds",
          foreignField: "_id",
          as: "skillsData",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "categoryData",
        },
      },
      {
        $unwind: {
          path: "$categoryData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clientratings",
          localField: "_id",
          foreignField: "memberProfileId",
          as: "ratingData",
        },
      },
      {
        $addFields: {
          profileAvgRating: {
            $cond: [
              { $gt: [{ $size: "$ratingData" }, 0] },
              { $avg: "$ratingData.rating" },
              null,
            ],
          },
          clientCount: { $size: "$ratingData" },
        },
      },
      {
        $project: {
          _id: 1,
          businessTradingName: 1,
          workLocation: 1,
          socialLinks: 1,
          //  memberData: 1,
        
          image:"$memberData.image",
          profileAvgRating: 1,
          clientCount: 1,
          // skillsData: 1,
          skills: "$skillsData.title",
        },
      },
      {
        $facet: {
          data: [{ $skip: offset }, { $limit: limit }],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};