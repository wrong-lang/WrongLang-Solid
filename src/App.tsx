import type {Component} from 'solid-js';
import {createEffect, createSignal} from "solid-js";
import {createStore, SetStoreFunction, Store} from "solid-js/store"
import { Modal } from "./components/Modal";

function createLocalStore<T>(initState: T): [Store<T>, SetStoreFunction<T>] {
  const [state, setState] = createStore(initState);
  if (localStorage["wrong-lang-settings"]) setState(JSON.parse(localStorage["wrong-lang-settings"]));
  createEffect(() => (localStorage["wrong-lang-settings"] = JSON.stringify(state)));
  return [state, setState];
}

const App: Component = () => {
  // Local Storage store
  const [state, setState] = createLocalStore({
    mode: "To Thai",
    layout: {
      thai: "Kedmanee",
      eng: "Qwerty"
    },
    modal: false,
    darkTheme: false
  })
  // User input text
  const [text, setText] = createSignal("");
  // Converted text
  const [convertedText, setConvertedText] = createSignal("");

  // Available keyboard layout
  const layout = {
    // Thai keyboard layout
    thai: {
      Kedmanee: {
        normal: "_ๅ/-ภถุึคตจขชๆไำพะัีรนยบลฃฟหกดเ้่าสวงผปแอิืทมใฝ".split(""),
        shift: "%+๑๒๓๔ู฿๕๖๗๘๙๐\"ฎฑธํ๊ณฯญฐ,ฅฤฆฏโฌ็๋ษศซ.()ฉฮฺ์?ฒฬฦ".split("")
      },
      Pattachotee: {
        normal: "_=๒๓๔๕ู๗๘๙๐๑๖็ตยอร่ดมวแใฌ้ทงกัีานเไขบปลหิคสะจพ".split(""),
        shift: "฿+\"/,?ุ_.()-%๊ฤๆญษึฝซถฒฯฦํ๋ธำณ์ืผชโฆฑฎฏฐภัศฮฟฉฬ".split(""),
      },
      Manoonchai: {
        normal: "`1234567890-=ใตหลสปักิบ็ฬฯงเรนมอา่้วืุไทยจคีดะู".split(""),
        shift: "~!@#$%^&*()_+ฒฏซญฟฉึธฐฎฆฑฌษถแชพผำขโภ\"ฤฝๆณ๊๋์ศฮ?".split("")
      },
    },
    // English keyboard layout
    eng: {
      Qwerty: {
        normal: "`1234567890-=qwertyuiop[]\\asdfghjkl;'zxcvbnm,.".split(""),
        shift: "~!@#$%^&*()_+QWERTYUIOP{}|ASDFGHJKL:\"ZXCVBNM<>?".split("")
      },
      Dvorak: {
        normal: "1234567890[]',.pyfgcrl/=\\aoeuidhtns-;qjkxbmwvz".split(""),
        shift: "!@#$%^&*(){}\"<>PYFGCRL?+|AOEUIDHTNS_:QJKXBMWVZ".split("")
      },
      Colemak: {
        normal: "1234567890-=qwfpgjluy;[]\\arstdhneio'zxcvbkm,./".split(""),
        shift: "!@#$%^&*()_+QWFGPJLUY:{}|ARSTDHNEIO\"ZXCVBKM<>?".split("")
      },
    },
  }
  // Available modes
  const modes = ["To Thai", "To English", "Unshift"]

  createEffect(() => {
    if (state.mode === "To Thai") {
      setConvertedText(text().split("").map(char => {
        return layout.thai[state.layout.thai].shift.concat(layout.thai[state.layout.thai].normal)[layout.eng[state.layout.eng].shift.concat(layout.eng[state.layout.eng].normal).indexOf(char)] || char;
      }).join(""));
    }

    if (state.mode === "To English") {
      setConvertedText(text().split("").map(char => {
        return layout.eng[state.layout.eng].shift.concat(layout.eng[state.layout.eng].normal)[layout.thai[state.layout.thai].shift.concat(layout.thai[state.layout.thai].normal).indexOf(char)] || char;
      }).join(""));
    }

    if (state.mode === "Unshift") {
      setConvertedText(text().split("").map(char => {
        return layout.thai[state.layout.thai].shift[layout.thai[state.layout.thai].normal.indexOf(char)] || layout.thai[state.layout.thai].normal[layout.thai[state.layout.thai].shift.indexOf(char)] || char;
      }).join(""));
    }
  });

  return (
    <main class={`${ state.darkTheme && "dark" }`}>
      <div class="main-container">
        <div class="page-container">

          {/* Modal */}
          <Show
            when={state.modal}
          >
            <Modal onClose={() => setState({ ...state, modal: false })} />
          </Show>

          {/* Web Title */}
          <div class="title-container">
            <img src="/web.png" alt="W" class="title-img" />
            <span class="title-text">rongLang</span>
          </div>

          {/* Top Bar Elements */}
          <div class="flex flex-row top-0">
            <div class="absolute top-2 right-2">
              <button onClick={() => setState({ ...state, modal: true })}>
                <i class="fa-solid fa-circle-question text-2xl" />
              </button>
            </div>
            <div class="absolute top-2 left-2">
              <button onClick={() => setState({...state, darkTheme: !state.darkTheme })}>
                <Show
                  when={state.darkTheme}
                  fallback={<i class="fa-solid fa-moon text-2xl" />}
                  >
                  <i class={`text-2xl fa-solid fa-sun`} />
                </Show>
              </button>
            </div>
          </div>

          {/* Bottom Bar Elements */}
          <div class="flex flex-row w-full justify-center absolute bottom-4">
            <div>
              <button onClick={() => location.href = 'https://www.tin-sci.me/'}>
                Made with <i class="fa-solid fa-heart"/> by <span class="underline">Tinnaphat "Tin" Somsang</span>
              </button>
            </div>
          </div>
          <div class="absolute bottom-4 right-4">
            <div class="flex flex-row gap-2">
              <a href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.wrong-lang.click%2F&quote=สำหรับใครที่ชอบลืมเปลี่ยนภาษาเวลาพิมพ์%20ใช้นี่สิ!">
                <i class="fa-brands fa-facebook text-2xl"></i>
              </a>
              <a href="https://twitter.com/intent/tweet/?text=สำหรับใครที่ชอบลืมเปลี่ยนภาษาเวลาพิมพ์%20ใช้นี่สิ!&hashtags=wronglang&via=tinarskii&related=&url=https://www.wrong-lang.click/">
                <i class="fa-brands fa-twitter text-2xl"></i>
              </a>
            </div>
          </div>

          {/* Input Box */}
          <div class="input-container">
            <input type="text" class="input-box" placeholder={"ใส่ข้อความที่ต้องการที่นี่..."} value={text()} onInput={e => setText(e.target.value)} />
            <input type="text" class="input-box" placeholder={"ข้อความที่แปลงแล้วจะปรากฎ..."} value={convertedText()} />
          </div>

          {/* Buttons */}
          <div class="buttons-container">
            <h1 class="buttons-label">
              Thai Layout
            </h1>
            <h1 class="buttons-label">
              English Layout
            </h1>
            <h1 class="buttons-label">
              Translation Mode
            </h1>
            {/* Thai Keyboard Layout */}
            <div class="buttons-group">
              <For each={Object.keys(layout.thai)}>{(layout) =>
                <button class={`px-4 py-2 text-white rounded-lg basis-full duration-200 ${state.layout.thai === layout ? 'bg-green-500' : 'bg-blue-500'}`} onClick={() => setState({ ...state, layout: { ...state.layout, thai: layout } })}>
                  {layout}
                </button>
              }</For>
            </div>

            {/* English Keyboard Layout */}
            <div class="buttons-group">
              <For each={Object.keys(layout.eng)}>{(layout) =>
                <button class={`px-4 py-2 text-white rounded-lg basis-full duration-200 ${state.layout.eng === layout ? 'bg-green-500' : 'bg-blue-500'}`} onClick={() => setState({ ...state, layout: { ...state.layout, eng: layout } })}>
                  {layout}
                </button>
              }</For>
            </div>

            {/* Translation Mode */}
            <div class="buttons-group">
              <For each={modes}>{(mode) =>
                <button class={`px-4 py-2 text-white rounded-lg basis-full duration-200 ${state.mode === mode ? 'bg-green-500' : 'bg-blue-500'}`} onClick={() => setState({ ...state, mode })}>
                  {mode}
                </button>
              }</For>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default App;
