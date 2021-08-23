## Providing TMDb API Bearer token 
This app supports authentication with TMDb Api through valid Bearer token.  
You can provide your own TMDb API token in two ways:
* Place it in environment.ts under `tmdbApiKey`
* Create Secrets.ts file in `src/environments` directory with the following content:
  
  `export const Secrets = {
    tmdbApiKey: 'your API key here'
  }`
