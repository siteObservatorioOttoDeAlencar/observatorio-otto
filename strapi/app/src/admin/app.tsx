import menuLogo from './extensions/logo-uece.png';

export default {
  config: {
    menu: {
      logo: menuLogo,
    },
    locales: [
      // 'ar',
      // 'fr',
      // 'cs',
      // 'de',
      // 'dk',
      // 'es',
      // 'he',
      // 'id',
      // 'it',
      // 'ja',
      // 'ko',
      // 'ms',
      // 'nl',
      // 'no',
      // 'pl',
       'pt-BR',
      // 'pt',
      // 'ru',
      // 'sk',
      // 'sv',
      // 'th',
      // 'tr',
      // 'uk',
      // 'vi',
      // 'zh-Hans',
      // 'zh',
    ],
    translations: {
      'pt-BR': {
        'app.components.LeftMenu.navbrand.title': 'Observatório Otto de Alencar',
        'app.components.LeftMenu.navbrand.workplace': 'Painel de Conteúdo',
      },
    },
  },
  bootstrap(app) {
    console.log(app);
  },
};
