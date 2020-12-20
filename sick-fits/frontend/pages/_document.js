// The whole purpose of this file is to SSR our styles. This document
// recursively renders the styles in the component tree for a given page, and puts the styles in the SSR'd document that is then
// sent to the client. By default it would allow the CSS to be
// fetched and then applied after the first paint, and since the
// SSR'd document would arrive without styles, it flickers if we
// don't do this.
import Document, { Head, Main, NextScript } from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static getInitialProps({ renderPage }) {
    const sheet = new ServerStyleSheet();
    const page = renderPage(App => props => sheet.collectStyles(<App {...props} />));
    const styleTags = sheet.getStyleElement();
    return { ...page, styleTags };
  }

  render() {
    return (
      <html>
        <Head>{this.props.styleTags}</Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </html>
    );
  }
}
