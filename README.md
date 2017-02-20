# thumbnails_API

## Install
`$ npm install express`<br/>
`$ npm install screenshot-stream`<br/>

<br/><br/>

## Usage
`$ node router.js`<br/>

### Basing usage
`localhost/thumbnails/?url=URL_TO_CAPTURE`<br/>

### Params
| Query | Options | Result | 
| ---- | ---- | ---- |
| `url`<br/> require | Encoded or Not Encoded URL  |  |
| mod | `png`<br/> `base64`<br/> | return png image <br/> return base64 code <br/> default : png |
| width | number | crop width <br/> default : 1024 |
| height | number | crop height <br/> default : 468 |

### Example
`localhost/thumbnails/?url=https://google.com&mod=base64&width=700&height=300`
