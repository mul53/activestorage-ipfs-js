export class Key {
  static create(file, url, callback) {
    const instance = new Key(file, url);
    instance.create(callback);
  }

  constructor(file, url) {
    this.file = file;

    this.xhr = new XMLHttpRequest;
    this.xhr.open("POST", url, true);
    this.xhr.responseType = "json";
    this.xhr.addEventListener("load", (event) => this.requestDidLoad(event));
    this.xhr.addEventListener("error", (event) => this.requestDidError(event));
  }

  create(callback) {
    this.callback = callback;
   
    const form = new FormData
    form.append('file', this.file.slice())
    
    this.xhr.send(form);
  }

  requestDidLoad(event) {
    const { status, response } = this.xhr;
    if (status >= 200 && status < 300) {
      console.log(response)
      this.callback(null, response.Hash)
    } else {
      this.requestDidError(event)
    }
  }

  requestDidError(event) {
    this.callback(
      `Error storing "${this.file.name}". Status: ${this.xhr.status}`
    );
  }
}
