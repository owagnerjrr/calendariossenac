import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
function send(res,status,data){res.setHeader('Cache-Control','no-store');return res.status(status).json(data)}
export default async function handler(req,res){
 const collections=new Set(['categorias','cursos','turmas','aulas']);
 const collection=String(req.query.collection||'categorias');
 if(req.method!=='GET')return send(res,405,{error:'Somente leitura disponível nesta etapa'});
 if(!collections.has(collection))return send(res,400,{error:'Coleção inválida'});
 const raw=process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
 if(!raw)return send(res,503,{error:'Credenciais Firebase ainda não configuradas na Vercel'});
 try{
  if(!getApps().length){
   const credentials=JSON.parse(raw);
   if(credentials.project_id!=='calendarios-senac-tc')throw Error('Projeto Firebase incorreto');
   initializeApp({credential:cert(credentials)});
  }
  const snapshot=await getFirestore().collection(collection).limit(300).get();
  return send(res,200,{collection,items:snapshot.docs.map(d=>({id:d.id,...d.data()}))});
 }catch(e){console.error('Falha na API Firestore',e);return send(res,500,{error:'Falha ao consultar o banco'});}
}
