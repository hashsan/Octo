import {Octokit} from "https://esm.sh/@octokit/core"


export class GitPass{
  def_url
  url
  api
  raw
  download_url //ok
  load_url //ok
  save_url //ok
  summary_url //ok
  repo_url //ok
  auth_url //ok
  repos_url //ok

  constructor(obj){
    this.def_url ="https://hashsan.github.io/outputs/cache.txt"    
    if(!obj){
      console.log('set def_url',def_url)
      const u = def_url
      return new GitPass(this.urlparse(def_url))
    }
    if(this.isString(obj)){
      const u = this.isGithub(obj)?obj:def_url;
      return new GitPass(this.urlparse(obj))
    }

    const {owner,repo,path} = obj;
    this.owner = owner
    this.repo = repo
    this.path = path
    const {subpath,name} = this.getsub(path)
    this.subpath = subpath
    this.name = name
    this.isimg = this.isImg(name)

    this.api = 'https://api.github.com'
    this.raw = 'https://raw.githubusercontent.com'
    this.url = `https://${owner}.github.io/${repo}/${path}`

    this.load_url = this.api +  `/repos/${owner}/${repo}/contents/${path}`
    this.save_url = this.load_url
    this.repo_url = this.api +  `/repos/${owner}/${repo}/contents/${subpath}`
    this.repos_url= this.api +  `/users/${owner}/repos`    
    //https://api.github.com/users/hashsan/repos
    this.auth_url = this.api + '/user'
    //console.log('xxxxxx',x)
    this.summary_url = this.api +`/repos/${owner}/${repo}/commits?path=${path}&page=1&per_page=1`;
    this.download_url = this.raw + `/${owner}/${repo}/main/${path}`
  }

  urlparse=(url)=>{
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
    const path = this.tailcut( ary.join('/') )

    //console.log(owner,repo,path)
    return {owner,repo,path}
  }

  getsub=(path)=>{
    var subpath=''
    var name = path.split('/').pop()
    if(path===name){
      return {subpath,name}
    }
    subpath = path.replace(name,'')
    subpath = this.tailcut(subpath)
    return {subpath,name}   
  }

  tailcut=(url)=>{
    if(!(url.at(-1) === '/') ){
      return url
    }
    return url.slice(0,-1)
  }

  isImg(d){
    const re=/.(jpg|jpeg|png|gif|bmp|svg|webp)$/i
    return re.test(d)
  }

  isString(d){
    return typeof d === 'string'
  }

  isGithub(d){
    return /github\.com/.test(d) || /\.github\.io/.test(d)
  }

}




/*
/////

var owner='hashsan'
var repo='outputs'
var path='cache.txt'
var ghp=localStorage.ghp
//var pass =new GitPass({owner,repo,path})
var pass =new GitPass('https://hashsan.github.io/outputs/img/hogehoge.jpg')
*/
/*
import("https://esm.sh/@octokit/core").then(mod=>{
  const { Octokit } = mod
  const octokit = new Octokit({ auth: ghp })
  octokit.request('GET '+ pass.load_url, {
  })
  .then(res => show(res.data))  
  })

function show(o){
  fn.q('.pre').innerHTML = JSON.stringify(o,null,' ')
}
*/

var fn={}
fn.tailchange = function tailchange(url,file){  
  var tail = url.split('/').pop()
  var newurl = url.replace(tail,file)
  return newurl    
}
fn.makeday=function makeDay(){
  const diff = 9*60*60*1000
  const now = new Date(Date.now()+diff).toISOString()
  .split('T').at(0).split('-').join('')
  return now
}
fn.rhash=()=>{return Math.random().toString(36).slice(-8)}

function base64Decode(text, charset) {
  charset=charset||'utf-8';
  return fetch(`data:text/plain;charset=${charset};base64,` + text)
    .then(response => response.text());
}

function base64Encode(...parts) {
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onload = () => {
      const offset = reader.result.indexOf(",") + 1;
      resolve(reader.result.slice(offset));
    };
    reader.readAsDataURL(new Blob(parts));
  });
}  


/*
v1 bugfix [] is empty
*/

export class Octo{
  owner
  repo
  path
  //
  pass
  octokit
  img
  login
  //
  constructor(url,ghp){
    this.pass = new GitPass(url)
    this.owner = this.pass.owner
    this.repo =  this.pass.repo
    this.path =  this.pass.path
    this.octokit = new Octokit({ auth: ghp })
  }

  save=async(data)=>{
    const res =await this.octokit
    .request('PUT ' + this.pass.save_url,{
      message : this.oneline(data),
      content : await this.encode(data),
      sha : await this.sha()
    })
    .catch(d=>void 0)
    ;
    if(!res){
      return 
    }
    return res.data
  }

  upimage=async(data,name)=>{
    name = name || this.newname(data.type)
    const {owner,repo} = this
    const path = fn.tailchange(this.path,name);    
    const pass = new GitPass({owner,repo,path})
    //console.log(name,path,pass.save_url)
    //    
    const res =await this.octokit
    .request('PUT ' + pass.save_url,{
      message : this.oneline(data),
      content : await this.encode(data),
      sha : await this.sha()
    })
    .catch(d=>void 0)
    ;
    if(!res){
      return 
    }
    return res.data.content.download_url    
  }


  load=async()=>{    
    const res =await this.octokit
    .request('GET ' + this.pass.load_url)
    .catch(d=>void 0)
    ;
    if(!res){
      return 
    }
    if(this.pass.isimg){
      //download_url      
      return res.data.download_url
    }
    return await this.decode(res.data.content)
  }

  auth=async()=>{
    const res =await this.octokit
    .request('GET ' + this.pass.auth_url)
    .catch(d=>void 0)
    ;
    if(!res){
      return 
    }    
    const {avatar_url,login} = res.data
    this.login = login
    this.img = avatar_url
    return avatar_url
  }

  sha=async()=>{
    const res =await this.octokit
    .request('GET ' + this.pass.summary_url)
    .catch(d=>void 0)
    ;
    if(!res){
      return 
    }
    //v1 return []
    if(!res.data[0]){
      return 
    }
    return res.data[0].sha
  }

  summary=async()=>{
    const res =await this.octokit
    .request('GET ' + this.pass.summary_url)
    .catch(d=>void 0)
    ;
    if(!res){
      return console.log('summary null!')
    }
    const data = res.data.at(0)
    if(!data){
      return console.log('summary null!')      
    }
    //console.log(data)
    const {sha} = data
    const {date} = data.commit.committer
    const {message} =data.commit
    const order = ~~( new Date(date).getTime()/(60*1000) )

    return {sha,date,message,path,order}
  }
  //

  oneline=(data)=>{
    if(this.pass.isimg){
      return 'image to'+this.pass.name
    }
    return data.slice(0,50).replace('\n',' ');
  }

  newname=(type)=>{
    const typemap = {
      "image/png" :'.png', 
      "image/jpeg":'.jpg', 
      "image/gif" :'.gif',
      "image/webp":'.webp',
      "image/tiff":'.tiff',
      "image/avif":'.avif',
      "text/plain":'.txt',
      "text/html":'.html'
    }
    const ka = typemap[type||'image/jpeg'];
    return 'i'+fn.makeday()+'_'+fn.rhash()+ka
  }

  encode=base64Encode
  decode=base64Decode
}
