import AWS from "aws-sdk";
import dotenv from 'dotenv'

dotenv.config()

const ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID
const SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY
const S3_BUCKET = process.env.S3_BUCKET
const REGION = process.env.S3_REGION


export const uploadPicture = async (image) => {
    let fileName = Date.now().toString() + image.name
    AWS.config.update({
        accessKeyId: ACCESS_KEY_ID,
        secretAccessKey: SECRET_ACCESS_KEY,
    })
    const s3Bucket = new AWS.S3({params: {Bucket: S3_BUCKET}});
    const data = {
        Key: fileName,
        Body: image.data,
        ContentEncoding: image.encoding,
        ContentType: image.mimetype,
        Bucket: S3_BUCKET
    }
    const s3_response = await s3Bucket.upload(data).promise()
    return s3_response.Location
}

export const DeletePicture = async (fileName) => {
    console.log(fileName)
    AWS.config.update({
        credentials: {
            accessKeyId: ACCESS_KEY_ID,
            secretAccessKey: SECRET_ACCESS_KEY
        },
        region: REGION
    })
    const s3Bucket = new AWS.S3({params: {Bucket: S3_BUCKET}});
    const data = {
        Key: fileName,
        Bucket: S3_BUCKET
    }
    await s3Bucket.deleteObject(data, function (err) {
        if (err) console.log(err, err.stack);  // error
        else console.log();                 // deleted
    }).promise()
}