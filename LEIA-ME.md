# 🎮 EVL VideoSystem

🌐 [English](README.md) · **Português** · [Español](LEAME.md)

Veja e ouça sua placa de captura (USB ou HDMI) em janela ou tela cheia, **sem esticar a imagem**. 📺
Sem instalar, sem internet, sem conta: é só abrir o `.exe` e jogar.

> 🔓 **Código aberto e auditável.** Licença própria: grátis para uso pessoal e pequenas empresas. Sem telemetria e sem chamadas de rede.

## ✨ Destaques
- 🔌 **Plug and play**: a placa aparece sozinha no menu.
- 🔊 **Áudio pareado automaticamente** com a placa certa, tocando nas suas caixas ou no fone.
- 🖼️ **Proporção correta**, em janela ou tela cheia.
- 🌍 **Português, English e Español**. Segue o idioma do Windows, ou escolha em **Ajustes → Idioma**.
- 🪶 **Portátil**: um único `.exe`, nada para instalar.

## 🚀 Como usar
1. 🔌 Conecte a placa de captura. Ela aparece no menu.
2. 👆 Clique no canal da placa.
3. 🔊 O áudio da placa toca automaticamente.

## ⌨️ Atalhos (na visualização)
| Tecla | Ação |
|---|---|
| `F` / `F11` / clique duplo | ⛶ Tela cheia |
| `Esc` | Sair da tela cheia |
| `M` | 🔇 Mudo |
| `↑` / `↓` | 🔉 Volume |
| `Backspace` | ↩️ Voltar ao menu |

## 🎥 Para fazer live (OBS)
Só um programa por vez pode usar a placa. Deixe o EVL VideoSystem abrir a placa e o OBS capturar a janela do EVL:
- ❌ **Não** adicione a placa no OBS como "Dispositivo de captura de vídeo" ao mesmo tempo (a imagem quebra).
- 🪟 Adicione **Captura de janela** → "EVL VideoSystem" (método: Windows 10 1903 e mais recente, "Capturar cursor" desmarcado).
- 🎧 Som: **Captura de áudio de aplicativo** → EVL VideoSystem (ou Áudio da área de trabalho, mas não os dois).
- ⛶ Aperte `F` no EVL para tela cheia. Não minimize (o OBS congela janelas minimizadas). Os controles somem quando você clica em outro programa.

## 🛠️ Problemas comuns
- ⚫ **Tela preta no PS3/PS4/PS5:** desligue o HDCP no console. É bloqueio do console, acontece em qualquer programa.
- 🩶 **Imagem cinza pela metade ou quebrada:** outro programa (geralmente o OBS) também está usando a placa. Feche lá.
- 🔒 **"Em uso por outro programa":** feche o OBS, o Discord ou o navegador que estiver usando a placa.
- 🔇 **Sem áudio:** em **Ajustes**, escolha manualmente o áudio da placa.
- 🔁 **Som duplicado:** desative "Escutar este dispositivo" da placa no painel de som do Windows.
- 👻 **Nada aparece:** Configurações do Windows → Privacidade → Câmera → ative "Permitir que aplicativos da área de trabalho acessem a câmera".
- 🛡️ **"O Windows protegeu o computador":** clique em "Mais informações" → "Executar assim mesmo" (o app não tem assinatura digital paga).

**Requisitos:** Windows 10 ou 11, 64 bits.

## 👩‍💻 Rodar a partir do código
```powershell
npm install
npm start      # abre o app
npm test       # testes de pareamento de dispositivos
npm run dist   # gera o exe portátil em dist\
```
Se faltar `node_modules\electron\dist` depois do `npm install`, rode uma vez `node node_modules\electron\install.js`.

## 📄 Licença
[EVL Software License 1.0](LICENSE): grátis para uso pessoal e pequenas empresas (até 100 pessoas). Terceiros: Electron (MIT) e fonte Nunito (OFL-1.1).

💼 **Grandes empresas e white label:** peça uma licença comercial em support@evlcorp.lol.
