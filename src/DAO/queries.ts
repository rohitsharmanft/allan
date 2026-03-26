const saveData = async (model: any, data: any) => {
  try {
    let save_info = await model.create(data);
    const { password, otp,reset_token,reset_token_expiry, ...userResponse } = save_info.toObject();
    // return save_info;
    return { ...userResponse, otp };
  } catch (err) {
    throw err;
  }
};

// const getData = (model: any, query: any, projection: any, options: any) => {
//   return new Promise((resolve, reject) => {
//     try {
//       let fetch_data = model
//         .find(query, projection, options);
//       return resolve(fetch_data);
//     } catch (err) {
//       return reject(err);
//     }
//   });
// };

const getData = (model: any, query: any, projection: any, options: any) => {
  return new Promise(async (resolve, reject) => {
    try {
      const fetch_data = await model.find(query, projection, options);
      resolve(fetch_data);
    } catch (err) {
      reject(err);
    }
  });
};

const getSingleData = (
  model: any,
  query: any,
  projection: any,
  options: any
) => {
  return new Promise((resolve, reject) => {
    try {
      let fetch_data = model.findOne(query, projection, options);
      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const getUniqueData = (
  model: any,
  key_name: string,
  query: any,
  options: any
) => {
  return new Promise((resolve, reject) => {
    try {
      let fetch_data = model.distinct(key_name, query, options);
      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const findAndUpdate = (model: any, query: any, update: any, options: any) => {
  return new Promise((resolve, reject) => {
    try {
      let update_data = model.findOneAndUpdate(query, update, options);
      return resolve(update_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const updateMany = (model: any, query: any, update: any) => {
  return new Promise((resolve, reject) => {
    try {
      let update_data = model.updateMany(query, update);
      return resolve(update_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const removeData = (model: any, query: any) => {
  return new Promise((resolve, reject) => {
    try {
      let delete_data = model.deleteOne(query);
      return resolve(delete_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const removeMany = (model: any, query: any) => {
  return new Promise((resolve, reject) => {
    try {
      let delete_data = model.deleteMany(query);
      return resolve(delete_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const populateData = (
  model: any,
  query: any,
  projection: any,
  options: any,
  collection_options: any
) => {
  return new Promise((resolve, reject) => {
    try {
      let fetch_data = model
        .find(query, projection, options)
        .populate(collection_options)
        .exec();
      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const deepPopulateData = async (
  model: any,
  query: any,
  projection: any,
  options: any,
  coll_options: any,
  pop_options: any
) => {
  try {
    let fetch_data = await model
      .find(query, projection, options)
      .populate(coll_options)
      .exec();
    let populateData = await model.populate(fetch_data, pop_options);
    return populateData;
  } catch (err) {
    return err;
  }
};

const countData = (model: any, query: any) => {
  return model.countDocuments(query).exec();
};

const aggregateData = (model: any, group: any, options: any) => {
  return new Promise((resolve, reject) => {
    try {
      let fetch_data: any;
      if (options !== undefined) {
        fetch_data = model.aggregate(group).option(options);
      } else {
        fetch_data = model.aggregate(group);
      }

      return resolve(fetch_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const aggregateWthPopulateData = async (
  model: any,
  group: any,
  options: any,
  populate_options: any
) => {
  try {
    let fetch_data: any;
    if (options !== undefined) {
      fetch_data = await model.aggregate(group).option(options);
    } else {
      fetch_data = await model.aggregate(group);
    }

    let populateData = await model.populate(fetch_data, populate_options);
    return populateData;
  } catch (err) {
    return err;
  }
};

const insertData = (model: any, data: any, options: any) => {
  return new Promise((resolve, reject) => {
    try {
      let saveData = model.collection.insert(data, options);
      return resolve(saveData);
    } catch (err) {
      return reject(err);
    }
  });
};

const insertMany = (model: any, data: any, options: any) => {
  return new Promise((resolve, reject) => {
    try {
      let saveData = model.collection.insertMany(data, options);
      return resolve(saveData);
    } catch (err) {
      return reject(err);
    }
  });
};

const bulkFindAndUpdateOne = (
  bulk: any,
  query: any,
  update: any,
  options: any
) => {
  return new Promise((resolve, reject) => {
    try {
      let update_data = bulk.find(query).upsert().update(update, options);
      return resolve(update_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const bulkFindAndUpdate = (
  bulk: any,
  query: any,
  update: any,
  options: any
) => {
  return new Promise((resolve, reject) => {
    try {
      let update_data = bulk.find(query).upsert().updateOne(update, options);
      return resolve(update_data);
    } catch (err) {
      return reject(err);
    }
  });
};

const saveCountry = async (model: any, data: any) => {
  try {
    let save_info = await model.create(data);
    return save_info;
  } catch (err) {
    throw err;
  }
};

// const getPaginationData = (model: any, query: any, projection: any, options: any) => {
//   return new Promise((resolve, reject) => {
//     try {
//       let fetch_data = model.find(query, projection, options);
//       return resolve(fetch_data);
//     } catch (err) {
//       return reject(err);
//     }
//   });
// };

export {
  saveData,
  getData,
  getSingleData,
  getUniqueData,
  findAndUpdate,
  updateMany,
  removeData,
  removeMany,
  populateData,
  deepPopulateData,
  countData,
  aggregateData,
  aggregateWthPopulateData,
  insertData,
  insertMany,
  bulkFindAndUpdateOne,
  bulkFindAndUpdate,
  saveCountry,
};
