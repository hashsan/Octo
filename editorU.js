function clearurl(url){  
 const {origin,pathname} = new URL(url)
 return origin + pathname  
}
function getGhp(){
  var d = "ghp_"
  /**/
  + "9ah8c3yojjO"
  + "EsWBOP6CSiMAMj"
  + "mcDcF1UGrhv"    
  return d;
}
function isGithub(url){
  return /\.github\.io/.test(url)
}
function getUrl(){
  const def ='https://hashsan.github.io/outputs/cache.html'
  var u = clearurl(location.href)
  u = isGithub(u)?u:def 
  u=u.replace(/.html$/,'.txt')
  return u
}


async function editorU(){
  const ed = document.querySelector('[contenteditable]')
  if(!ed){    
    return console.log('contenteditable not found') 
  }
  
  const url = getUrl()    
  const ghp = getGhp()  
  const {Octo} = await import('https://hashsan.github.io/Octo/Octo.js');
  const api = new Octo(url,ghp)
  const img = await api.auth()
  if(!img){
    console.log(url,ghp)
    throw new Error('Octo error')
  }
  
  console.log('boot editorU',ed,url)
  ed.innerText = await api.load()
  
  const {Bar} = await import('https://hashsan.github.io/Bar/Bar.js?v=2')
  var bar = new Bar()
  ed.addEventListener('keydown',async(e)=>{
    if(e.ctrlKey && e.which===83){
      e.preventDefault()
      bar.go(30)     
      await api.save(ed.innerText)
      bar.go(100)
    }
    bar.go(10)
  })
}

editorU() ///////////////////////////////////////////////////////////////
