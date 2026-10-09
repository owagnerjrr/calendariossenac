import { timingSafeEqual } from 'node:crypto';
const OWNER='owagnerjrr', REPO='calendarios-senac-arquivos';
const base='https://api.github.com/repos/'+OWNER+'/'+REPO;
function respond(res,status,obj){res.setHeader('Cache-Control','no-store');return res.status(status).json(obj)}
function allowed(req){const secret=process.env.ACERVO_ACCESS_KEY||'';const got=String(req.headers['x-acervo-key']||'');if(!secret||!got)return false;const a=Buffer.from(secret),b=Buffer.from(got);return a.length===b.length&&timingSafeEqual(a,b)}
async function github(path,accept='application/vnd.github+json'){const token=process.env.ACERVO_GITHUB_TOKEN;if(!token)throw Error('CONFIG');return fetch(base+path,{headers:{Authorization:'Bearer '+token,Accept:accept,'X-GitHub-Api-Version':'2022-11-28'},cache:'no-store'})}
export default async function handler(req,res){
 if(req.method!=='GET')return respond(res,405,{error:'Método não permitido'});
 if(!allowed(req))return respond(res,401,{error:'Acesso não autorizado ou chave não configurada'});
 try{
  const action=String(req.query.action||'list');
  if(action==='list'){
   const r=await github('/git/trees/main?recursive=1');
   if(!r.ok)throw Error('GitHub '+r.status);
   const data=await r.json();
   if(data.truncated)throw Error('Listagem incompleta');
   const files=data.tree.filter(x=>x.type==='blob'&&x.path.startsWith('arquivos/')).map(x=>({path:x.path.slice(9),size:x.size,sha:x.sha}));
   return respond(res,200,{count:files.length,files});
  }
  if(action==='file'){
   const path=String(req.query.path||'');
   if(!path||path.startsWith('/')||path.includes('\\')||path.split('/').some(p=>p==='..'||p==='')||!path.startsWith('arquivos/'))return respond(res,400,{error:'Caminho inválido'});
   const encoded=path.split('/').map(encodeURIComponent).join('/');
   const r=await github('/contents/'+encoded+'?ref=main','application/vnd.github.raw+json');
   if(!r.ok)return respond(res,r.status===404?404:502,{error:'Arquivo indisponível'});
   const buffer=Buffer.from(await r.arrayBuffer());
   const filename=path.split('/').pop();
   res.setHeader('Cache-Control','no-store');
   res.setHeader('Content-Type','application/octet-stream');
   res.setHeader('Content-Disposition',"attachment; filename*=UTF-8''"+encodeURIComponent(filename));
   return res.status(200).send(buffer);
  }
  return respond(res,400,{error:'Ação inválida'});
 }catch(e){console.error('Acervo privado:',e.message);return respond(res,e.message==='CONFIG'?503:502,{error:e.message==='CONFIG'?'Integração ainda não configurada':'Falha ao consultar acervo'});}
}