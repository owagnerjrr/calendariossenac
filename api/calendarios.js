import { db, response } from './_firebase.js';
const collections = new Set(['categorias','cursos','turmas','aulas']);
export default async function handler(req,res) {
  if (!['GET','POST','PATCH'].includes(req.method)) return response(res,405,{error:'Método não permitido'});
  const collection = String(req.query.collection || 'categorias');
  if (!collections.has(collection)) return response(res,400,{error:'Coleção inválida'});
  if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) return response(res,503,{error:'Integração Firebase pendente: configurar credenciais na Vercel'});
  // Acesso sem login não significa escrita administrativa aberta: gravação permanece desligada até proteção adequada.
  if (req.method !== 'GET') return response(res,403,{error:'Edição desativada até implantação de controle de gravação'});
  try {
    const snapshot = await db().collection(collection).limit(300).get();
    return response(res,200,{items:snapshot.docs.map(doc=>({id:doc.id,...doc.data()})),collection});
  } catch(e) {
    console.error('Erro Firestore',e);
    return response(res,500,{error:'Não foi possível consultar os calendários'});
  }
}
