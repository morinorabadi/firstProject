import React, { useState } from "react";

export default function Form() {
  const [text, setText] = useState("");

  function submit(e){
    e.preventDefault()
    socket.emit('set-username', text)
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
