import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import Home from './components/home/index.js'
import {fixTpl} from './utils/util.js'

const renderApp = async () => {
  const App = {
    components: {
      Home: await fixTpl(Home, './components/home'),
    }
  };

  const app = createApp(App);
  app.use(ElementPlus);
  app.mount('#app');
}

renderApp()


