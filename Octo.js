/*
Octo and Saver
*/

import { Octokit } from "https://esm.sh/@octokit/core";

export class Octo{

  constructor(url,token){
    this.api=new Octokit({auth:token})
    const {baseurl,file}=this.parseUrl(url)
    if(!file){
      throw new Error('file nothing?')
      //console.log('file nothing ?',file)
    }
    this.file = file
    this.baseurl = baseurl
  }

  save=async(data)=>{
    const {api,baseurl,file,oneline,encode,sha} = this 
    const o={
      sha:await sha(),
      message:oneline(data),
      content:encode(data), //await encode(data),
    }
    const res =await api.request('PUT '+baseurl+file,o)
    .catch(e=>void 0)
    if(!res)return
    return res.data;
  }

  load=async()=>{

    const {_res,decode,isImg,file} = this
    const res = await _res()
    if(!res)return void 0;
    if(isImg(file)){
      return res.data.download_url;
      //const url = res.data.download_url;
      //console.log(url)      
    }
    //return fetch(url,{cache:'no-cache'}).then(d=>d.text())
    return decode(res.data.content)
  }
  auth=async()=>{
    const {api} = this
    const res = await api.request("/user")
    .catch(e=>void 0)
    if(!res) return
    return res.data.avatar_url
  }

  //////
  _res =async()=>{
    const {api,baseurl,file} = this
    const res = await api.request('GET '+baseurl+file)
    .catch(e=>void 0);
    //console.log(res)
    return res;
  }  

  sha=async()=>{
    const {_res} = this
    const res = await _res()
    if(res) return res.data.sha
    return void 0;
  }

  /////
  urlEnv(url){
    /*
var url="https://hashsan.github.io/use/use.js"
var url1="https://hashsan.github.io/use/"
var url2="https://hashsan.github.io/use/sample/use.js"  
  */
    const _url = url.replace("/tree/main","")
    .split("//").at(1)
    .replace("github.com/","")
    .replace(".github.io","")
    //console.log(url)
    const ary = _url.split('/')
    const owner = ary.splice(0,1).join('')
    const repo = ary.splice(0,1).join('')
    const path = ary.join('/')
    /*
    if(path && !(path.at(-1)==="/") ){
      path +="/"
    }*/
    return {url,owner,repo,path}
  }

  parseUrl(url){
    const {owner,repo,path} = this.urlEnv(url)

    const baseurl=`/repos/${owner}/${repo}/contents/`
    const file =`${path}`

    return {baseurl,file}
  }

  isImg(d){
    const re=/.(jpg|jpeg|png|gif|bmp|svg|webp)$/i
    return re.test(d)
  }
  
  isText(d){
    return /\.txt$/.test(d)
  }
  oneline=(data)=>{
    const {file,isText} = this   
    var message = 'image to'+file;
    if(isText(file)) message = data.slice(0,50).replace('\n',' ');
    return message
  }
  /*
  encode(...parts){
    return new Promise(resolve => {
      const reader = new FileReader();
      reader.onload = () => {
        const offset = reader.result.indexOf(",") + 1;
        resolve(reader.result.slice(offset));
      };
      reader.readAsDataURL(new Blob(parts));
    });
  }
  */
  /////
  encode=function base64EncodeUtf8(str) {
    return btoa([...new TextEncoder().encode(str)].map((b) => String.fromCharCode(b)).join(""));
  }

  decode=function base64DecodeUtf8(str) {
    return new TextDecoder().decode(Uint8Array.from(atob(str), (c) => c.charCodeAt(0)));
  }

  /////
}



export class Saver{
  constructor(file){
    if(!file){
      throw new Error('need file name');
    }
    this.file = file
  }
  save(){
    
  }
  load(){
    
  }  
}
///
export class Saver_local extends Saver{
  constructor(file){
    super(file)    
  }
  save(data){
    const key = this.file
    localStorage[key]=data
  }
  load(){
    const key = this.file    
    return localStorage[key]
  }
}
//
export class Saver_github extends Saver{
  constructor(file,token){
    super(file)
    //console.log('file mean url')
    if(!token){
      throw new Error('need token')
    }
    this.api = new Octo(file,token)
    this.api.auth().then(d=>{      
      if(!d){
       throw new Error('token limit? or url unmatch') 
      }      
    })
  }
  async save(data){
    await this.api.save(data)
  }
  async load(){
    return await this.api.load()
  }    
}


