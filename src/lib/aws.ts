import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { TextractClient, DetectDocumentTextCommand } from "@aws-sdk/client-textract";

const region = process.env.AWS_REGION || "ap-south-1";

export const textractClient = new TextractClient({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const s3Client = new S3Client({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const sesClient = new SESClient({
  region,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function uploadToS3(file: Buffer, fileName: string, contentType: string) {
  const bucket = process.env.AWS_S3_BUCKET_NAME!;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: `resumes/${Date.now()}-${fileName}`,
    Body: file,
    ContentType: contentType,
  });
  return await s3Client.send(command);
}

export async function sendInterviewInvite(to: string, candidateName: string, role: string, jitsiLink: string) {
  const sender = process.env.SES_SENDER_EMAIL || "hr@aurahr.com";
  const command = new SendEmailCommand({
    Destination: { ToAddresses: [to] },
    Message: {
      Body: {
        Html: {
          Charset: "UTF-8",
          Data: `
            <div style="font-family: serif; background: #faf8f3; p: 40px; border-radius: 20px;">
              <h1 style="color: #c8a84b;">AuraHR Interview Invitation</h1>
              <p>Dear ${candidateName},</p>
              <p>We are impressed by your profile for the <b>${role}</b> position.</p>
              <p>Your AI-proctored interview is scheduled. Please join via the link below:</p>
              <a href="${jitsiLink}" style="background: #c8a84b; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Launch NexusHR Interview Console</a>
              <p style="margin-top: 20px; color: #666; font-size: 12px;">This session will be recorded and proctored for integrity analysis.</p>
            </div>
          `,
        },
      },
      Subject: { Charset: "UTF-8", Data: `Interview Invitation: ${role} at AuraHR` },
    },
    Source: sender,
  });
  return await sesClient.send(command);
}

export async function parseResumeWithTextract(fileBuffer: Buffer) {
  const command = new DetectDocumentTextCommand({
    Document: { Bytes: fileBuffer },
  });
  const response = await textractClient.send(command);
  
  // Concatenate blocks into a single text blob
  return response.Blocks
    ?.filter(block => block.BlockType === 'LINE')
    .map(block => block.Text)
    .join('\n') || '';
}
