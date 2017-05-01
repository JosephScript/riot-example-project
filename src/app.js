import './styles.css'
import './components/greeting.tag'
import 'riot-hot-reload'

// mount the custom tag on the page
riot.mount('greeting', { name: 'World' })
