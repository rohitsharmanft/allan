import { Types } from "mongoose";
import path from "path";
import { pipeline } from "stream";

export const adminHandleMemberListWithProfileCount = async (
  models: any,
  offset: number,
  limit: number,
  type?: string,
  membership?: string
) => {
  try {
    let matchFilter: any = { _id: { $ne: null } };
    if (type) {
      matchFilter.adminApproval = type;
    }
    if (membership) {
      matchFilter.membership = membership;
    }
    const response = await models.aggregate([
      { $match: matchFilter },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "memberId",
          as: "profileData",
          pipeline: [
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
                as: "skillData",
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
          fullName: 1,
          adminApproval: 1,

          email: 1,
          membership: 1,
          password: 1,
          phoneNumber: 1,
          gender: 1,
          state: 1,
          businessTradingName: 1,
          locality: 1,
          country: 1,
          idProof: 1,
          selfie: 1,
          image: 1,
          categoryTitle: "$profileData.category.title",
          skillsTitle: "$profileData.skillData.title",
          // memberProfileData:1,
          createdAt: 1,
        },
      },
      {
        $facet: {
          data: [
            { $sort: { createdAt: -1 } },
            { $skip: offset },
            { $limit: limit },
          ],
          totalCount: [{ $count: "count" }],
        },
      },
    ]);
    return response;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const adminHandleMemberDetailWithProfile = async (
  models: any,
  memberId
) => {
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
          as: "profileData",
        },
      },
      {
        $unwind: {
          path: "$profileData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $lookup: {
          from: "clientratings",
          localField: "_id",
          foreignField: "memberId",
          as: "ratingData",
        },
      },
      {
        $project: {
          fullName: 1,
          email: 1,
          membership: 1,
          memberCategory: 1,
          phoneNumber: 1,
          gender: 1,
          address: 1,
          profileData: 1,
          ratingData: 1,
          image: 1,
          // profileCount: { $size: "$profileData" },
          // profileCount: { $size: { $ifNull: ["$profileData", []] } },
        },
      },
    ]);
    return response;
  } catch (error) {
    return error;
  }
};

export const adminMemberProfileListWithReview = async (
  models: any,
  type: String,
  country,
  categoryId:any
) => {
  try {
    const ratingFilter = type ? { status: type } : { _id: { $ne: null } };
    const response = await models.aggregate([
      ...(categoryId
        ? [
            {
              $match: {
                categoryId: new Types.ObjectId(categoryId),
              },
            },
          ]
        : []),
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
      ...(country
        ? [
            {
              $match: {
                "memberData.country": country,
              },
            },
          ]
        : []),
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
          from: "clientratings",
          localField: "_id",
          foreignField: "memberProfileId",
          pipeline: [
            {
              $match: ratingFilter,
            },
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
                status: 1,

                clientName: "$clientData.fullName",
              },
            },
          ],
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
          experience: 1,
          // socialLinks: 1,

          affiliation: 1,
          hourlyCharged: 1,
          photoGallery: 1,
          fullName: "$memberData.fullName",
          gender: "$memberData.gender",
          email: "$memberData.email",
          country: "$memberData.country",
          image: "$memberData.image",
          skillsData: 1,
          ratingData: 1,
          profileAvgRating: 1,
          clientCount: 1,
        },
      },
    ]);
    return response;
  } catch (error) {
    return error;
  }
};

export const adminHandleAdvisoryList = async (
  models: any,
  // categoryId,
  type: String,
  offset: Number,
  limit: Number
) => {
  try {
    const response = await models.aggregate([
      ...(type
        ? [
            {
              $match: {
                type: type,
              },
            },
          ]
        : []),
      // {
      //   $match: {
      //     type: type,
      //     // categoryId: new Types.ObjectId(categoryId),
      //   },
      // },
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
          _id: 1,
          title: 1,
          description: 1,
          image: 1,
          type: 1,
          categoryId: 1,
          categoryTitle: "$category.title",
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
