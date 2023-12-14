import fs from 'fs';
import path from 'path';

export interface IDiskStorageOptions {
  dest: string;
}

export class DiskStorage {
  private readonly defaults: IDiskStorageOptions;
  constructor(opts = {} as IDiskStorageOptions) {
    this.defaults = opts;
    if (!fs.existsSync(opts.dest)) fs.mkdirSync(opts.dest);
  }

  public saveFile(file: Express.Multer.File, bucket: string): Promise<string> {
    // base case
    const bucketPath = path.join(this.defaults.dest, bucket);
    const validator = this.validateBucketPath(bucketPath);
    if (!validator) throw new Error('ERR_BUCKET_PATH');
    if (!fs.existsSync(bucketPath)) fs.mkdirSync(bucketPath);

    const stream = fs.createWriteStream(path.join(bucketPath, file.originalname!));
    return new Promise((resolve, reject) => {
      stream.write(file.buffer, (error) => {
        if (error) reject(new Error('ERR_SAVE_FILE'));
        stream.end();
        const diskPath = `${this.defaults.dest}/${bucket}/${file.originalname}`;
        resolve(diskPath);
      });
    });
  }

  private validateBucketPath(bucketPath: string) {
    return !path.relative(process.cwd(), bucketPath).startsWith('..');
  }
}
