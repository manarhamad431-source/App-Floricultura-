# FloraAura

Aplicação web progressiva para organizar plantas, cuidados, tarefas e o calendário do jardim. A interface está em português de Portugal e funciona sem dependências externas.

## Publicar no GitHub Pages

1. Envia para a raiz do repositório `index.html`, `app.js`, `styles.css`, `sw.js`, `manifest.json` e `floraaura.svg`.
2. Envia também as pastas `icons` (apenas os três ícones PNG diretamente dentro dela) e `assets/plants`.
3. Não é necessário enviar `icons/assets/plants`: é uma cópia redundante das imagens. O site usa `assets/plants`.
4. No GitHub, abre **Settings → Pages**.
5. Em **Build and deployment**, escolhe **Deploy from a branch**, a branch `main` e a pasta `/(root)`, e guarda.
6. Aguarda a conclusão da publicação. Para o repositório `App-FloraAura-Gest-o-de-Plantas-Manar-Hamad`, o endereço esperado é:
   `https://manarhamad431-source.github.io/App-FloraAura-Gest-o-de-Plantas-Manar-Hamad/`

O ficheiro `index.html` tem de ficar na raiz do repositório para o endereço principal abrir a aplicação.

## Executar localmente

Abre a pasta através de um servidor local, como a extensão Live Server do VS Code. O service worker, responsável pela utilização offline, requer HTTPS ou `localhost`; abrir a página diretamente por `file://` não ativa esse recurso.

## Dados e privacidade

As contas, plantas, tarefas, registos de cuidados e fotografias de perfil são guardados no `localStorage` do navegador. Não existe servidor nem sincronização entre dispositivos. A autenticação local é demonstrativa e não deve ser usada para proteger dados reais ou palavras-passe importantes.
