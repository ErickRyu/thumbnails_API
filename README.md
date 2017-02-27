# thumbnails_API

## Install
`$ npm install`<br/>
`$ sudo apt-get install phantomjs`<br/>
<br/><br/>

## Usage
`$ npm start`<br/>

### Params
| Parameter | Options | Result | 
| ---- | ---- | ---- |
| `url`<br/> (require) | Encoded or Not Encoded URL  |  |
| mod | `png`<br/> `base64`<br/> | return png image <br/> return base64 code <br/> default : png |
| width | number | crop width <br/> default : 1024 |
| height | number | crop height <br/> default : 720 |

### Example
`localhost/thumbnails/?url=https://google.com&mod=base64&width=700&height=300`
