import { FileChecksum } from "./file_checksum"
import { BlobRecord } from "./blob_record"
import { BlobUpload } from "./blob_upload"
import { Key } from "./key";

let id = 0

export class DirectUpload {
  constructor(file, url, ipfsUrl,delegate) {
    this.id = ++id
    this.file = file
    this.url = url
    this.ipfsUrl = ipfsUrl + '/api/v0/add?only-hash=true';
    this.delegate = delegate
  }

  create(callback) {
    FileChecksum.create(this.file, (error, checksum) => {
      if (error) {
        callback(error)
        return
      }

      Key.create(this.file, this.ipfsUrl, (error, key) => {
        if (error) {
          callback(error);
          return
        }

        const blob = new BlobRecord(this.file, checksum, this.url, key)
        notify(this.delegate, "directUploadWillCreateBlobWithXHR", blob.xhr)
  
        blob.create(error => {
          if (error) {
            callback(error)
          } else {
            const upload = new BlobUpload(blob)
            notify(this.delegate, "directUploadWillStoreFileWithXHR", upload.xhr)
            upload.create(error => {
              if (error) {
                callback(error)
              } else {
                callback(null, blob.toJSON())
              }
            })
          }
        })
      })
    })
  }
}

function notify(object, methodName, ...messages) {
  if (object && typeof object[methodName] == "function") {
    return object[methodName](...messages)
  }
}