// import mongoose, {Schema} from "mongoose";

import { getISTDate } from "../utils/getDate.js";

// const artistSchema = new Schema(
//     {
//         id: {
//             type: Number,
//             required: true,
//         },
//         name: {
//             type:String,
//             required:true
//         },
//         images:[
//             {type:String},
//         ],
//         url:{
//             type:String,
//             required: true
//         }
//     },
//     {
//         timestamps: true
//     }
// )




// export const Artist = mongoose.model('Artist', artistSchema)


class Artist {
  constructor({ id, name, image = "", url = "" }) {
    if (!id || !name) {
      throw new Error("Missing required fields: id, name");
    }

    const istDate = getISTDate();

    this.id = id;
    this.name = name;
    this.image = image;
    this.url = url;
    this.createdAt = istDate;
    this.updatedAt = istDate;
  }

  update(fields) {
    Object.assign(this, fields);
    this.updatedAt = getISTDate();
  }
}





export { Artist }


