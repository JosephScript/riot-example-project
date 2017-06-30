<greeting>
  <h1 class='greeting'>Hello, {this.name}!</h1>
  <label for='name'>
    Type a new name:
  </label>
  <input
    type='textbox'
    name='name'
    ref='name'
    id='name'
    oninput={handleChange}></input>

  <!-- The script tag around this is optional -->
  <script>
    this.name = this.opts.name

    this.handleChange = (e) => {
      if (this.refs.name.value) {
        this.name = this.refs.name.value
      } else {
        this.name = this.opts.name
      }
    }
  </script>

</greeting>
