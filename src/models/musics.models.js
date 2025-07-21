import mongoose, {Schema} from "mongoose";

const musicSchema = new Schema(
    {
        name: {
            type:String,
            required: true,
        },
        yaer: {
            type:number,
        },
        duration: {
            type:number,
            required: true,
        },
        url: {
            type:String,
            required: true,
        },
        images:[
            {
            type:String,
            required: true,
            }
        ],
        downloadUrl:[
            {
            type:String,
            }
        ]
    },
    {
        timestamps: true
    }
)


export const Music = mongoose.model('Music', musicSchema);