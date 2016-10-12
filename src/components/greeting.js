<greeting>
  <h1 class='greeting'>Hello, {name.value || opts.name}!</h1>
  <label for='name'>
    Type a new name:
  </label>
  <input
    type='textbox'
    name='name'
    id='name'
    oninput={change}></input>
  <span>{name.value}</span>

  this.change = (e) => {
    return true
  }

</greeting>
