import {CloudinaryStorage} from 'multer-storage-cloudinary';
import multer from 'multer';
import cloudinary from '../utils/cloudinary.js';

const storage= new CloudinaryStorage({
    cloudinary:cloudinary,
    params:{
        folder:'photoGenic',
        allowed_formats:['jpg','jpeg','png']
    }
})

const upload=multer({storage});

// const upload=multer({storage,
//     limits: { fileSize: 5 * 1024 * 1024 }, 
//     fileFilter: (req, file, cb) => {
//         if (!file.mimetype.startsWith('image/')) {
//             return cb(new Error('Only image files are allowed'), false);
//         }
//         cb(null, true);
//     },
// });

export default upload;