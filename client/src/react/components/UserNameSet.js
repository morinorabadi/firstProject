import React, { useState } from "react";
import { socketEmit } from '../../connection/Socket'

export default function Form() {
  const [text, setText] = useState("");

  function submit(e){
    e.preventDefault()
    socketEmit('set-username', text)
    setText('')
  }

  return (
    <form onSubmit={(e) => submit(e) } className="form">
      <p>pick username</p>
      <input 
      type="text" 
      placeholder="enter username"
      onChange={e => setText(e.target.value) }
      value={text}
      />
      <button> submit </button>
    </form>
  );
}
