# Octo
Octokit Wrapping by Octo

```js
import {Octo} from "..."
let url ='https://***.github.io/xyz/test.txt'
let token = 'ghp_***************************'
const api = new Octo(url,token)
```
## api the less

## await api.auth()

## await api.load()

## await api.save(textdata)

## more usage
```js
//<div><button id="api">don</button></div>
document.getElementById('api')
  .onclick = main

async function main(){

  const url ='//hashsan.github.io/outputs/test2.txt'
  const token =localStorage.ghp
  const api = new Octo(url,token)


  api.auth().then(d=>{
    const img = new Image()
    img.src = d
    document.body.append(img)
  })


  api.load().then(d=>{
    const el = document.createElement('div')
    el.innerText = d
    document.body.append(el)
  })


  const data = 'これはテストよ。' + new Date().toString() 
  api.save(data).then(d=>{
    const el = document.createElement('div')
    el.innerText = !!d
    console.log(d)
    document.body.append(el)  
  })

}

```

## 
https://qiita.com/i15fujimura1s/items/6fa5d16b1e53f04f3b06

