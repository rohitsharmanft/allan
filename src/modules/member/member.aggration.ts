import { Types } from "mongoose";
import path from "path";
import { pipeline } from "stream";

export const handleProfileListWithLocation = async (
  models: any,
  limit: Number,
  offset: Number,
  longitude: Number,
  latitude: Number,
  distance: any,
  skillId,
) => {
  try {
    const geoNearStage = {
      $geoNear: {
        near: {
          type: "Point",
          coordinates: [Number(longitude), Number(latitude)] as [
            number,
            number,
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
          $and: [
            {
              skillIds: {
                $in: [new Types.ObjectId(skillId)],
              },
            },
            { isApproval: "accepted" },
          ],
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
          profileAvgRating: 1,
          clientCount: 1,
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

export const handleProfileListWithReview = async (models: any, memberId) => {
  try {
    const response = await models.aggregate([
      {
        $match: { _id: memberId },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "memberId",
          as: "profileData",
          pipeline: [
            {
              $lookup: {
                from: "skills",
                localField: "skillIds",
                foreignField: "_id",
                as: "skills",
              },
            },
            {
              $lookup: {
                from: "clientratings",
                localField: "_id",
                foreignField: "memberProfileId",
                as: "ratingData",
                pipeline: [
                  {
                    $lookup: {
                      from: "users",
                      localField: "clientId",
                      foreignField: "_id",
                      as: "clientData",
                    },
                  },
                  {
                    $unwind: {
                      path: "$clientData",
                      preserveNullAndEmptyArrays: true,
                    },
                  },
                  {
                    $project: {
                      _id: 1,
                      rating: 1,
                      review: 1,
                      createdAt: 1,
                      clientName: "$clientData.fullName",
                    },
                  },
                ],
              },
            },
            {
              $addFields: {
                avgRating: {
                  $cond: [
                    { $gt: [{ $size: "$ratingData" }, 0] },
                    { $avg: "$ratingData.rating" },
                    null,
                  ],
                },
              },
            },
            {
              $project: {
                _id: 1,
                workDescription: 1,
                overview: 1,
                workLocation: 1,
                socialLinks: 1,
                skills: 1,
                // skillId: "$skills.id",
                // skillTitle: "$skills.title",
                ratingData: 1,
                avgRating: 1,
              },
            },
          ],
        },
      },
      {
        $unwind: {
          path: "$profileData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          fullName: 1,
          email: 1,
          image: 1,
          gender: 1,
          country: 1,
          businessTradingName: 1,
          phoneNumber: 1,
          profileData: 1,
          // profileId: "$profileData._id",
        },
      },
    ]);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const handleMemberListWithProfileCount = async (
  models: any,
  limit: Number,
  offset: Number,
  type: String,
) => {
  try {
    const matchStage = type
      ? { $match: { adminApproval: type } }
      : { $match: {} };
    const response = await models.aggregate([
      matchStage,
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "memberId",
          as: "memberProfileData",
        },
      },
      // {
      //   $unwind: {
      //     path: "$memberProfileData",
      //     preserveNullAndEmptyArrays:true
      //   },
      // },
      {
        $project: {
          fullName: 1,
          email: 1,
          membership: 1,
          // memberCategory: 1,
          phoneNumber: 1,
          gender: 1,
          address: 1,
          // memberProfileData:1,
          profileCount: { $size: "$memberProfileData" },
        },
      },
    ]);
    return response;
  } catch (error) {
    console.log(error);
    return error;
  }
};

export const handleMemberDetails = async (models: any, memberId: any) => {
  try {
    const response = await models.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(memberId),
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "memberId",
          as: "memberProfileData",
        },
      },
      {
        $unwind: {
          path: "$memberProfileData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "skills",
          localField: "skillIds",
          foreignField: "_id",
          as: "skill",
        },
      },
      {
        $lookup: {
          from: "subscriptions",
          localField: "_id",
          foreignField: "memberId",
          pipeline: [
            {
              $match: {
                status: "active",
                start_date: { $lte: new Date() },
                end_date: { $gte: new Date() },
              },
            },
            {
              $lookup: {
                from: "plans",
                localField: "planId",
                foreignField: "_id",
                as: "plan",
              },
            },
            {
              $unwind: {
                path: "$plan",
                preserveNullAndEmptyArrays: true,
              },
            },
            {
              $project: {
                planName: "$plan.name",
                status: 1,
                start_date: 1,
                end_date: 1,
              },
            },
          ],
          as: "subscriptionsData",
        },
      },
      {
        $unwind: {
          path: "$subscriptionsData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          membership: 1,
          isProfile: 1,
          image: 1,
          memberCategory: 1,
          phoneNumber: 1,
          whatsappNumber: 1,
          gender: 1,
          address: 1,
          memberProfileData: 1,
          categoryTitle: "$category.title",
          skillTitle: "$skill.title",
          subscriptionsData: 1,
          country: 1,
          state: 1,
          businessTradingName: 1,

          longitude: 1,
          latitude: 1,
        },
      },
    ]);
    return response;
  } catch (error) {
    throw error;
  }
};

export const handleJobList = async (
  models: any,
  limit: Number,
  offset: Number,
  type: String,
) => {
  try {
    const response = await models.aggregate([
      {
        $match: {
          ...(type == "project" || type == "job" ? { type } : {}),
          isDeleted: false,
        },
      },
      {
        $lookup: {
          from: "skills",
          localField: "skillIds",
          foreignField: "_id",
          as: "skillData",
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryId",
          foreignField: "_id",
          as: "category",
        },
      },
      {
        $unwind: {
          path: "$category",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          __v: 0,
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
    return error;
  }
};

export const profileWithReview = async (models: any, profileId: any) => {
  try {
    const response = await models.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(profileId),
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
      { $unwind: "$memberData" },
      {
        $lookup: {
          from: "skills",
          localField: "skillIds",
          foreignField: "_id",
          as: "skills",
        },
      },
      {
        $lookup: {
          from: "clientratings",
          let: { profileId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$memberProfileId", "$$profileId"] },
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "clientId",
                foreignField: "_id",
                as: "clientData",
              },
            },
            { $unwind: "$clientData" },
            {
              $project: {
                _id: 1,
                rating: 1,
                review: 1,
                createdAt: 1,
                clientName: "$clientData.fullName",
                clientEmail: "$clientData.email",
              },
            },
          ],
          as: "ratingList",
        },
      },
      {
        $addFields: {
          avgRating: {
            $cond: [
              { $gt: [{ $size: "$ratingList" }, 0] },
              { $avg: "$ratingList.rating" },
              null,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          skillIds: 1,
          skills: 1,
          workDescription: 1,
          categoryId: 1,
          overview: 1,
          businessTradingName: 1,
          workLocation: 1,
          memberName: "$memberData.fullName",
          image: "$memberData.image",
          memberEmail: "$memberData.email",
          phoneNumber: "$memberData.phoneNumber",
          gender: "$memberData.gender",
          memberWorkingLocation: "$memberData.workingLocation",
          country: "$memberData.country",
          photoGallery: 1,
          ratingList: 1,
          avgRating: 1,
          createdAt: 1,
          updatedAt: 1,
          socialLinks: 1,
        },
      },
    ]);
    return response;
  } catch (error) {
    return error;
  }
};

export const handleAdvisoryList = async (
  models: any,
  categoryId,
  type: String,
  offset: Number,
  limit: Number,
) => {
  try {
    const response = await models.aggregate([
      {
        $match: {
          type: type,
          categoryId: new Types.ObjectId(categoryId),
        },
      },
      {
        $project: {
          _id: 1,
          title: 1,
          description: 1,
          image: 1,
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
    return error;
  }
};
