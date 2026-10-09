# Calendários Senac — implantação restrita
Este repositório é público: **não envie planilhas originais, nomes de colaboradores, documentos internos, arquivos .env ou credenciais**.

## Firebase
1. Crie projeto Firebase separado do Painel de Salas.
2. Ative Authentication > Google (ou Microsoft/OIDC conforme a TI do Senac).
3. Crie Firestore e Storage. Publique as regras de `firestore.rules` e `storage.rules` no projeto correto.
4. Crie manualmente `members/{UID}` com `active: true` e `role: "admin"` para o primeiro administrador. Não abra cadastro público.
5. Copie `firebase-config.example.js` para sua configuração do frontend; as chaves web do Firebase não substituem regras de segurança.
6. Faça importação dos documentos somente após revisar os arquivos e ativar controle de acesso.

**Importante:** as regras são um esqueleto inicial; ações críticas de auditoria/reprogramação exigem backend confiável (Cloud Functions) com transações e validação de conflitos. Não conceda escrita pública nem coloque arquivos no diretório estático do site.

O protótipo index.html ainda não tem autenticação Firebase ligada e não mostra os documentos do acervo.