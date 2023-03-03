const fs = require('fs');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const uplaodToS3 = async (path, originalname, mimetype)=> {
    const client = new S3Client({
        credentials: {
            accessKeyId: process.env.ACCESS_KEY,
            secretAccessKey: process.env.SECRET_ACCESS_KEY
        },
        region: process.env.BUCKET_REGION ,
    })
    const parts = originalname.split('.');
    const ext = parts[parts.length - 1];
    const newFilename = Date.now() + '.' + ext;
    const data = await client.send(new PutObjectCommand({
        Bucket: process.env.BUCKET_NAME,
        Body: fs.readFileSync(path),
        Key: newFilename,
        ContentType: mimetype,
    }))
    
    return `https://${process.env.BUCKET_NAME}.s3.${process.env.BUCKET_REGION}.amazonaws.com/${newFilename}`;
}

module.exports = {
    uplaodToS3
}