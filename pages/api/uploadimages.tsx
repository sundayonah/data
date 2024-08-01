// import fs from 'fs';
// import path from 'path';
// import { IncomingForm, Fields, Files } from 'formidable';
// import { NextApiRequest, NextApiResponse } from 'next';

// export const config = {
//    api: {
//       bodyParser: false,
//    },
// };

// export default async function post(req: NextApiRequest, res: NextApiResponse) {
//    if (req.method !== 'POST') {
//       return res.status(405).json({ message: 'Method Not Allowed' });
//    }

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

//             const imageUploads = Array.isArray(files.imageUploads)
//                ? files.imageUploads
//                : [files.imageUploads].filter(Boolean);

//             const publicUploadsDir = path.join(
//                process.cwd(),
//                'public/uploadimages'
//             );
//             if (!fs.existsSync(publicUploadsDir)) {
//                fs.mkdirSync(publicUploadsDir, { recursive: true });
//             }

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
//                   filePath: `/uploadimages/${file.originalFilename}`,
//                };
//             });
//             res.status(200).send('Form data submitted successfully');
//          }
//       );
//    } catch (error) {
//       console.error('Error inserting data:', error);
//       res.status(500).json({ message: 'Internal Server Error' });
//    } finally {
//       console.log('finally');
//    }
// }



import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { NextApiRequest, NextApiResponse } from 'next';

const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      const publicUploadsDir = path.join(process.cwd(), 'public/uploadimages');
      if (!fs.existsSync(publicUploadsDir)) {
         fs.mkdirSync(publicUploadsDir, { recursive: true });
      }
      cb(null, publicUploadsDir);
   },
   filename: (req, file, cb) => {
      cb(null, file.originalname);
   },
});

const upload = multer({ storage });

export const config = {
   api: {
      bodyParser: false,
   },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
   if (req.method !== 'POST') {
      return res.status(405).json({ message: 'Method Not Allowed' });
   }

   upload.array('imageUploads')(req as any, res as any, (err: any) => {
      if (err) {
         console.error('Error uploading files:', err);
         return res.status(500).json({ message: 'Internal Server Error' });
      }

      try {
         const files = (req as any).files;
         const savedImages = files.map((file: any) => ({
            fileName: file.originalname,
            filePath: `/uploadimages/${file.originalname}`,
         }));

         res.status(200).json({ message: 'Form data submitted successfully', savedImages });
      } catch (error) {
         console.error('Error processing files:', error);
         res.status(500).json({ message: 'Internal Server Error' });
      }
   });
}
