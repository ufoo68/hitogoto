import { POST as APIRoute } from 'next-s3-upload/route'
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  console.log('env', process.env.S3_UPLOAD_KEY)
  console.log('env', process.env.S3_UPLOAD_SECRET)
  console.log('env', process.env.S3_UPLOAD_BUCKET)
  console.log('env', process.env.S3_UPLOAD_REGION)
  console.log('env', process.env.S3_UPLOAD_ENDPOINT)
  return APIRoute.configure({
    accessKeyId: process.env.S3_UPLOAD_KEY,
    secretAccessKey: process.env.S3_UPLOAD_SECRET,
    bucket: process.env.S3_UPLOAD_BUCKET,
    region: process.env.S3_UPLOAD_REGION,
    endpoint: process.env.S3_UPLOAD_ENDPOINT,
    forcePathStyle: true,
  })(req)
}
