# thumbnails_API

## Usage
```$ npm install phantomjs```<br/>
```$ npm install express```<br/>
```$ node router.js```<br/>
<br/><br/>

### Make thumbnails
localhost/thumbnails/?url=ENCODED_URI<br/>

### Get thumbnails as .png
localhost/thumbnails/images/?url=ENCODED_URI<br/>
or<br/>
localhost/thumbnails/images/?url=ENCODED_URI&mod=0<br/>

### Get thumbnails as base64
localhost/thumbnails/images/?url=ENCODED_URI&mod=1<br/>
