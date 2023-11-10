# Octo and Saver
Octokit Wrapping by Octo
```
import {Octo} from "https://hashsan.github.io/Octo/Octo.js";
```
```js
import {Octo} from "https://hashsan.github.io/Octo/Octo.js";

  const url = '//hashsan.github.io/outputs/test2.txt'
  const token = 'ghp_*******************************'
  const api = new Octo(url,token)

```
## api the less

## await api.auth()

## await api.load()

## await api.save(textdata)

## more usage
```js
//<div><button id="api">don</button></div>
import {Octo} from "https://hashsan.github.io/Octo/Octo.js";


document.getElementById('api').onclick = main


async function main(){


  const url = '//hashsan.github.io/outputs/test2.txt'
  const token = localStorage.ghp
  const api = new Octo(url,token)


  await api.auth().then(d=>{
    const img = new Image()
    img.src = d
    document.body.append(img)
  })


  await api.load().then(d=>{
    const el = document.createElement('div')
    el.innerText = d
    document.body.append(el)
  })


  const data = 'これはテストよ。' + new Date().toString() 
  await api.save(data).then(d=>{
    const el = document.createElement('div')
    el.innerText = !!d
    document.body.append(el)  

    console.log(d)    
  })


}

```

## 
- https://codepen.io/pinkromeo/pen/xxMqNqE?editors=1010
- https://qiita.com/i15fujimura1s/items/6fa5d16b1e53f04f3b06


## Saver and Saver_local(file) Saver_github(file,token) //file is url in repo
```
import {Octo,Saver_local,Saver_github} from "https://hashsan.github.io/Octo/Octo.js";

var saver = new Saver_github(file,localStorage.ghp)
ed.setData(await saver.load())
```

## labo
## jpg
```
{
  "name": "hogehoge.jpg",
  "path": "hogehoge.jpg",
  "sha": "aecb0b5b110b216f84b95a7a5d72c5213ced8c6a",
  "size": 146004,
  "url": "https://api.github.com/repos/hashsan/Octo/contents/hogehoge.jpg?ref=main",
  "html_url": "https://github.com/hashsan/Octo/blob/main/hogehoge.jpg",
  "git_url": "https://api.github.com/repos/hashsan/Octo/git/blobs/aecb0b5b110b216f84b95a7a5d72c5213ced8c6a",
  "download_url": "https://raw.githubusercontent.com/hashsan/Octo/main/hogehoge.jpg",
  "type": "file", <--------------------------------------- jpg is type file
  "content": "/9j/4AAQSkZJRgABAQEASA...",
  "encoding": "base64",
  "_links": {
    "self": "https://api.github.com/repos/hashsan/Octo/contents/hogehoge.jpg?ref=main",
    "git": "https://api.github.com/repos/hashsan/Octo/git/blobs/aecb0b5b110b216f84b95a7a5d72c5213ced8c6a",
    "html": "https://github.com/hashsan/Octo/blob/main/hogehoge.jpg"
  }
}
```
## txt
```
{
  "name": "test2.txt",
  "path": "test2.txt",
  "sha": "2387003c55e6232ca0329bcf7ae896ab2d53501e",
  "size": 75,
  "url": "https://api.github.com/repos/hashsan/outputs/contents/test2.txt?ref=main",
  "html_url": "https://github.com/hashsan/outputs/blob/main/test2.txt",
  "git_url": "https://api.github.com/repos/hashsan/outputs/git/blobs/2387003c55e6232ca0329bcf7ae896ab2d53501e",
  "download_url": "https://raw.githubusercontent.com/hashsan/outputs/main/test2.txt",
  "type": "file", <--------------------------------------- txt is type file
  "content": "44GT44KM44Gv44OG44K544OI44KI44CCVGh1IE5vdiAwOSAyMDIzIDE4OjIy\nOjE1IEdNVCswOTAwICjml6XmnKzmqJnmupbmmYIp\n",
  "encoding": "base64",
  "_links": {
    "self": "https://api.github.com/repos/hashsan/outputs/contents/test2.txt?ref=main",
    "git": "https://api.github.com/repos/hashsan/outputs/git/blobs/2387003c55e6232ca0329bcf7ae896ab2d53501e",
    "html": "https://github.com/hashsan/outputs/blob/main/test2.txt"
  }
}
```
