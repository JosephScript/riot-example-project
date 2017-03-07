<greeting>
  <h1 class='greeting'>Hello, {name.value || opts.name}!</h1>
  <label for='name'>
    Type a new name:
  </label>
  <input
    type='textbox'
    name='name'
    id='name'
    oninput={handleChange}></input>

  <!-- The script tag around this is optional -->
  <script>
    this.handleChange = (e) => {
      return true
    }
  </script>

</greeting>
