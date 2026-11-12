# 🎮 EVL VideoSystem

🌐 [English](README.md) · [Português](LEIA-ME.md) · **Español**

Mira y escucha tu capturadora (USB o HDMI) en ventana o pantalla completa, **sin estirar la imagen**. 📺
Sin instalar, sin cuenta: solo abre el `.exe` y juega. Funciona sin conexión.

> 🔓 **Código abierto y auditable.** Licencia propia: gratis para uso personal y pequeñas empresas.
>
> 🔒 Sin telemetría. La única petición de red es una comprobación de actualizaciones opcional, una vez al día (ver [Actualizaciones](#-actualizaciones)).

---

## ✨ Destacados

- 🔌 **Plug and play:** la capturadora aparece sola en el menú
- 🔊 **Audio emparejado automáticamente** con la capturadora correcta, sonando en tus altavoces o auriculares
- 🖼️ **Proporción correcta,** en ventana o pantalla completa
- 🌍 **Español, English y Português:** sigue el idioma de Windows, o elígelo en **Ajustes → Idioma**
- 🪶 **Portátil:** un solo `.exe`, nada que instalar

## 🚀 Cómo usarlo

1. 🔌 Conecta la capturadora. Aparece en el menú
2. 👆 Haz clic en el canal de la capturadora
3. 🔊 El audio de la capturadora suena automáticamente

## ⌨️ Atajos (en la vista)

| Tecla | Acción |
|---|---|
| `F` / `F11` / doble clic | ⛶ Pantalla completa |
| `Esc` | Salir de pantalla completa |
| `M` | 🔇 Silenciar |
| `↑` / `↓` | 🔉 Volumen |
| `Retroceso` | ↩️ Volver al menú |

## 🎥 Para hacer directo con OBS

Solo un programa puede usar la capturadora a la vez. Deja que EVL VideoSystem abra la capturadora y que OBS capture la ventana de EVL.

**Vídeo**

- ❌ **No** agregues la capturadora en OBS como "Dispositivo de captura de vídeo" al mismo tiempo (la imagen se rompe)
- 🪟 Agrega **Captura de ventana** → "EVL VideoSystem" (método: Windows 10 1903 o superior, "Capturar cursor" desactivado)

**Audio**

- 🎧 Usa **Captura de audio de aplicación** → EVL VideoSystem (o Audio del escritorio, pero no los dos)

**Consejos**

- ⛶ Pulsa `F` en EVL para pantalla completa
- 🚫 No la minimices (OBS congela las ventanas minimizadas)
- 🖱️ Los controles se ocultan al hacer clic en otro programa

## 🛠️ Problemas comunes

**Imagen**

- ⚫ **Pantalla negra en PS3/PS4/PS5:** desactiva el HDCP en la consola. Es un bloqueo de la consola y pasa en cualquier programa
- 🩶 **Imagen gris a la mitad o rota:** otro programa (normalmente OBS) también está usando la capturadora. Ciérrala allí
- 🔒 **"En uso por otro programa":** cierra OBS, Discord o el navegador que esté usando la capturadora
- 👻 **No aparece nada:** Configuración de Windows → Privacidad → Cámara → activa "Permitir que las aplicaciones de escritorio accedan a la cámara"

**Audio**

- 🔇 **Sin audio:** en **Ajustes**, elige manualmente el audio de la capturadora
- 🔁 **Sonido duplicado:** desactiva "Escuchar este dispositivo" de la capturadora en el panel de sonido de Windows

**Windows**

- 🛡️ **"Windows protegió tu PC":** haz clic en "Más información" → "Ejecutar de todas formas" (la app no tiene firma digital de pago)

**Requisitos:** Windows 10 u 11, 64 bits.

## 🔄 Actualizaciones

- 📅 Una vez al día, la app pregunta a GitHub cuál es la última versión y muestra un aviso si hay una nueva
- 🔒 No se envían datos, y **nada se descarga ni se instala solo**: el aviso abre la página de descarga en [evlcorp.lol](https://evlcorp.lol)
- ⚙️ Desactívalo en **Ajustes → Avisar de nuevas versiones**

## 👩‍💻 Ejecutar desde el código

```powershell
npm install
npm start      # abre la app
npm test       # pruebas de emparejamiento de dispositivos
npm run dist   # genera el exe portátil en dist\
```

Si falta `node_modules\electron\dist` después de `npm install`, ejecuta una vez `node node_modules\electron\install.js`.

## 🤝 Contribuir

¡Los pull requests son bienvenidos! Correcciones, traducciones y mejoras se agradecen.

Al enviar una contribución, aceptas los términos de contribución de la sección 4 de la [licencia](LICENSE): concedes a EvlCorp una licencia para usarla en el Software.

## 📄 Licencia

[EVL Software License 1.0](LICENSE): gratis para uso personal y pequeñas empresas (hasta 100 personas).

Terceros: Electron (MIT) y fuente Nunito (OFL-1.1).

💼 **Grandes empresas y white label:** solicita una licencia comercial en support@evlcorp.lol.
