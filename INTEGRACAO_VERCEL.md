# Integração Firestore / Vercel

## O que foi preparado
- API GET `/api/calendarios?collection=categorias|cursos|turmas|aulas`.
- Usa Firebase Admin somente no servidor, com Firestore bloqueado ao navegador.
- Retorna 503 enquanto a variável não for configurada.
- Escrita desativada até existir proteção apropriada. **Sem login não há identificação de quem editou**.

## Configuração manual na Vercel
1. No Firebase: Configurações do projeto > Contas de serviço > Gerar nova chave privada.
2. Na Vercel: projeto calendariossenac > Settings > Environment Variables.
3. Criar variável sensível `FIREBASE_SERVICE_ACCOUNT_JSON` com o conteúdo integral do JSON da conta de serviço, apenas em ambiente Server/Production; não usar prefixo `NEXT_PUBLIC_`.
4. Nunca enviar esse JSON por chat, GitHub, ou salvar em `public/`.
5. Fazer novo deploy; testar `/api/calendarios?collection=categorias` (esperado `{"items":[],"collection":"categorias"}` antes da importação).
6. O Firebase Admin ignora regras do Firestore, portanto a API deve controlar permissões. Sem autenticação, **qualquer pessoa que tenha a URL pode ler os dados retornados**. Não importar documentos internos até definir o que pode ser exibido.
7. Firestore permanece com `allow read, write: if false;` para clientes web.
8. Importação das planilhas e gravação de aulas ainda não foram implementadas.

## Próximas entregas
- Importador de planilhas com revisão de campos e detecção de conflitos.
- Interface real alimentada pela API.
- Operações de reagendamento com transações e histórico.
- Camada de autorização apropriada para documentos restritos.
