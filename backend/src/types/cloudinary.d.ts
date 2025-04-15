declare namespace Express {
  namespace Multer {
    interface File {
      path: string;
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      destination: string;
      filename: string;
      buffer: Buffer;
    }
  }
  
  // Add MulterS3 definition
  namespace MulterS3 {
    interface File {
      fieldname: string;
      originalname: string;
      encoding: string;
      mimetype: string;
      size: number;
      bucket: string;
      key: string;
      acl: string;
      contentType: string;
      contentDisposition: string;
      contentEncoding: string;
      storageClass: string;
      serverSideEncryption: string;
      metadata: any;
      location: string;
      etag: string;
      path: string;
    }
  }
} 